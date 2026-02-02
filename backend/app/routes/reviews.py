"""
Rutas de API para gestión de reseñas (reviews/ratings).
"""
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.schemas import ReviewCreate, ReviewResponse, TokenPayload
from app.middleware.auth import get_current_user
from app.utils.database import get_db

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("", response_model=ReviewResponse, status_code=201)
async def create_review(
    review: ReviewCreate,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Crea una nueva reseña para un usuario después de un viaje completado.
    
    **Requiere autenticación.**
    
    Validaciones:
    - La reserva debe existir y pertenecer al usuario autenticado.
    - La reserva debe estar confirmada.
    - El viaje debe haber ocurrido (fecha pasada).
    - El usuario no puede haberse reseñado a sí mismo.
    - Solo se permite una reseña por reserva por autor.
    """
    try:
        # Obtener la reserva con información del viaje
        booking_response = db.table("Booking").select(
            "*, ride:Ride(*)"
        ).eq("id", str(review.booking_id)).execute()
        
        if not booking_response.data or len(booking_response.data) == 0:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        booking = booking_response.data[0]
        ride = booking["ride"]
        
        # Verificar que el usuario es parte de esta reserva
        is_rider = booking["rider_id"] == current_user.sub
        is_driver = ride["driver_id"] == current_user.sub
        
        if not (is_rider or is_driver):
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para reseñar esta reserva"
            )
        
        # Verificar que la reserva esté confirmada
        if booking["status"] != "confirmed":
            raise HTTPException(
                status_code=400,
                detail="Solo puedes reseñar reservas confirmadas"
            )
        
        # Verificar que el viaje ya ocurrió
        ride_date = datetime.fromisoformat(ride["date_time"].replace("Z", "+00:00"))
        now = datetime.now(ride_date.tzinfo)
        if ride_date > now:
            raise HTTPException(
                status_code=400,
                detail="El viaje aún no ha ocurrido"
            )
        
        # Verificar ventana de 14 días para enviar reseñas
        days_since_ride = (now - ride_date).days
        if days_since_ride > 14:
            raise HTTPException(
                status_code=400,
                detail="El período para dejar reseñas ha expirado (14 días)"
            )
        
        # Verificar que no se reseñe a sí mismo
        if str(review.subject_id) == current_user.sub:
            raise HTTPException(
                status_code=400,
                detail="No puedes reseñarte a ti mismo"
            )
        
        # Verificar que el subject sea parte del viaje
        subject_is_rider = str(review.subject_id) == booking["rider_id"]
        subject_is_driver = str(review.subject_id) == ride["driver_id"]
        
        if not (subject_is_rider or subject_is_driver):
            raise HTTPException(
                status_code=400,
                detail="El usuario a reseñar no es parte de esta reserva"
            )
        
        # Verificar que no exista ya una reseña del mismo autor para esta reserva
        existing_review = db.table("ratings").select("*").eq(
            "booking_id", str(review.booking_id)
        ).eq("author_id", current_user.sub).execute()
        
        if existing_review.data and len(existing_review.data) > 0:
            raise HTTPException(
                status_code=400,
                detail="Ya has dejado una reseña para esta reserva"
            )
        
        # Crear la reseña
        review_data = {
            "booking_id": str(review.booking_id),
            "author_id": current_user.sub,
            "subject_id": str(review.subject_id),
            "score": review.score,
            "comment": review.comment,
            "role": review.role
        }
        
        review_response = db.table("ratings").insert(review_data).execute()
        
        if not review_response.data or len(review_response.data) == 0:
            raise HTTPException(status_code=500, detail="Error al crear reseña")
        
        created_review = review_response.data[0]
        
        # Actualizar promedio de rating del usuario reseñado
        await _update_user_rating(db, str(review.subject_id))
        
        # Obtener reseña con información del autor
        review_with_author = db.table("ratings").select(
            '*, author:User!ratings_author_id_fkey(*)'
        ).eq("id", created_review["id"]).execute()
        
        if review_with_author.data and len(review_with_author.data) > 0:
            return ReviewResponse(**review_with_author.data[0])
        
        return ReviewResponse(**created_review)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear reseña: {str(e)}")


@router.get("/user/{user_id}", response_model=List[ReviewResponse])
async def get_user_reviews(
    user_id: str,
    db: Client = Depends(get_db)
):
    """
    Obtiene las reseñas públicas de un usuario.
    
    **No requiere autenticación.**
    
    Aplica la regla de "Mutual Blindness":
    - Una reseña solo es visible si la contraparte también dejó una reseña
    - O si han pasado 14 días desde el viaje
    """
    try:
        # Obtener reseñas con información del autor
        response = db.table("ratings").select(
            '*, author:User!ratings_author_id_fkey(*)'
        ).eq("subject_id", user_id).order("created_at", desc=True).execute()
        
        visible_reviews = []
        for review_data in response.data:
            # Check visibility using simplified logic
            if _check_review_visibility_simple(db, review_data):
                visible_reviews.append(ReviewResponse(**review_data))
        
        return visible_reviews
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener reseñas: {str(e)}")


def _check_review_visibility_simple(db: Client, review: dict) -> bool:
    """
    Determina si una reseña debe ser visible según las reglas de "Mutual Blindness".
    
    Una reseña es visible si:
    1. La contraparte también dejó una reseña para la misma reserva
    2. O han pasado 14 días desde el viaje
    
    Esta versión simplificada obtiene datos del booking/ride por separado para
    evitar problemas con nombres de tablas case-sensitive en Supabase.
    """
    booking_id = review.get("booking_id")
    author_id = review.get("author_id")
    
    if not booking_id:
        return True  # Si no hay booking_id, mostrar por defecto
    
    try:
        # Obtener el booking y su ride asociado
        booking_response = db.table("Booking").select(
            "*, ride:Ride(*)"
        ).eq("id", booking_id).execute()
        
        if not booking_response.data:
            return True  # Si no encontramos el booking, mostrar por defecto
        
        booking = booking_response.data[0]
        ride = booking.get("ride")
        
        if not ride:
            return True  # Si no hay ride, mostrar por defecto
        
        # Calcular si pasaron 14 días desde el viaje
        ride_date = datetime.fromisoformat(ride["date_time"].replace("Z", "+00:00"))
        days_since_ride = (datetime.now(ride_date.tzinfo) - ride_date).days
        if days_since_ride >= 14:
            return True
        
        # Verificar si existe reseña recíproca (de otro autor para el mismo booking)
        reciprocal = db.table("ratings").select("id").eq(
            "booking_id", booking_id
        ).neq("author_id", author_id).execute()
        
        return bool(reciprocal.data)
        
    except Exception as e:
        # Si hay error, mostrar la reseña por seguridad
        print(f"Error checking review visibility: {e}")
        return True


def _check_review_visibility(db: Client, review: dict, ride: dict) -> bool:
    """
    Determina si una reseña debe ser visible según las reglas de "Mutual Blindness".
    
    Una reseña es visible si:
    1. La contraparte también dejó una reseña para la misma reserva
    2. O han pasado 14 días desde el viaje
    """
    booking_id = review["booking_id"]
    author_id = review["author_id"]
    
    # Calcular si pasaron 14 días desde el viaje
    try:
        ride_date = datetime.fromisoformat(ride["date_time"].replace("Z", "+00:00"))
        days_since_ride = (datetime.now(ride_date.tzinfo) - ride_date).days
        if days_since_ride >= 14:
            return True
    except (KeyError, ValueError):
        # Si no podemos parsear la fecha, mostrar la reseña por seguridad
        return True
    
    # Verificar si existe reseña recíproca (de otro autor para el mismo booking)
    reciprocal = db.table("ratings").select("id").eq(
        "booking_id", booking_id
    ).neq("author_id", author_id).execute()
    
    return bool(reciprocal.data)


async def _update_user_rating(db: Client, user_id: str):
    """
    Actualiza el promedio de rating y conteo de un usuario.
    """
    try:
        # Obtener todas las reseñas del usuario
        reviews_response = db.table("ratings").select("score").eq(
            "subject_id", user_id
        ).execute()
        
        if reviews_response.data:
            scores = [r["score"] for r in reviews_response.data]
            avg_rating = sum(scores) / len(scores)
            rating_count = len(scores)
            
            # Actualizar usuario
            db.table("User").update({
                "average_rating": round(avg_rating, 2),
                "rating_count": rating_count
            }).eq("id", user_id).execute()
            
    except Exception as e:
        # Log pero no fallar
        print(f"Error updating user rating: {e}")
