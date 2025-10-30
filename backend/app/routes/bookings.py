"""
Rutas de API para gestión de reservas (bookings).
"""
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from typing import List
from app.models.schemas import BookingCreate, BookingResponse, TokenPayload
from app.middleware.auth import get_current_user
from app.utils.database import get_db

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=BookingResponse, status_code=201)
async def create_booking(
    booking: BookingCreate,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Crea una nueva reserva para un viaje.
    
    **Requiere autenticación.**
    
    Al crear una reserva, se decrementa automáticamente `seats_available` del viaje.
    El estado inicial de la reserva es "pending".
    """
    try:
        # Verificar que el viaje existe
        ride_response = db.table("Ride").select("*").eq("id", str(booking.ride_id)).execute()
        
        if not ride_response.data or len(ride_response.data) == 0:
            raise HTTPException(status_code=404, detail="Viaje no encontrado")
        
        ride = ride_response.data[0]
        
        # Verificar que no sea el propio conductor
        if ride["driver_id"] == current_user.sub:
            raise HTTPException(
                status_code=400,
                detail="No puedes reservar tu propio viaje"
            )
        
        # Verificar que hay plazas disponibles
        if ride["seats_available"] <= 0:
            raise HTTPException(
                status_code=400,
                detail="No hay plazas disponibles en este viaje"
            )
        
        # Verificar que el usuario no tenga ya una reserva para este viaje
        existing_booking = db.table("Booking").select("*").eq(
            "ride_id", str(booking.ride_id)
        ).eq("rider_id", current_user.sub).execute()
        
        if existing_booking.data and len(existing_booking.data) > 0:
            raise HTTPException(
                status_code=400,
                detail="Ya tienes una reserva para este viaje"
            )
        
        # Crear la reserva
        booking_data = {
            "ride_id": str(booking.ride_id),
            "rider_id": current_user.sub,
            "status": "pending"
        }
        
        booking_response = db.table("Booking").insert(booking_data).execute()
        
        if not booking_response.data or len(booking_response.data) == 0:
            raise HTTPException(status_code=500, detail="Error al crear reserva")
        
        created_booking = booking_response.data[0]
        
        # Decrementar plazas disponibles
        new_seats = ride["seats_available"] - 1
        db.table("Ride").update({"seats_available": new_seats}).eq(
            "id", str(booking.ride_id)
        ).execute()
        
        # Obtener reserva con información del viaje y usuario
        booking_with_details = db.table("Booking").select(
            "*, ride:Ride(*, driver:User(*)), rider:User(*)"
        ).eq("id", created_booking["id"]).execute()
        
        if booking_with_details.data and len(booking_with_details.data) > 0:
            return BookingResponse(**booking_with_details.data[0])
        
        return BookingResponse(**created_booking)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear reserva: {str(e)}")


@router.get("", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Obtiene todas las reservas del usuario autenticado.
    
    **Requiere autenticación.**
    """
    try:
        response = db.table("Booking").select(
            "*, ride:Ride(*, driver:User(*)), rider:User(*)"
        ).eq("rider_id", current_user.sub).order("created_at", desc=True).execute()
        
        bookings = [BookingResponse(**booking) for booking in response.data]
        return bookings
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener reservas: {str(e)}")


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking_by_id(
    booking_id: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Obtiene los detalles de una reserva por su ID.
    
    **Requiere autenticación.**
    Solo el usuario que hizo la reserva o el conductor del viaje pueden verla.
    """
    try:
        response = db.table("Booking").select(
            "*, ride:Ride(*, driver:User(*)), rider:User(*)"
        ).eq("id", booking_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        booking = response.data[0]
        
        # Verificar permisos
        is_rider = booking["rider_id"] == current_user.sub
        is_driver = booking["ride"]["driver_id"] == current_user.sub
        
        if not (is_rider or is_driver):
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para ver esta reserva"
            )
        
        return BookingResponse(**booking)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener reserva: {str(e)}")


@router.delete("/{booking_id}", status_code=204)
async def cancel_booking(
    booking_id: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Cancela una reserva.
    
    **Requiere autenticación.**
    
    Solo el usuario que hizo la reserva o el conductor del viaje pueden cancelarla.
    Al cancelar, se incrementa automáticamente `seats_available` del viaje.
    """
    try:
        # Obtener la reserva
        booking_response = db.table("Booking").select(
            "*, ride:Ride(*)"
        ).eq("id", booking_id).execute()
        
        if not booking_response.data or len(booking_response.data) == 0:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        booking = booking_response.data[0]
        
        # Verificar permisos
        is_rider = booking["rider_id"] == current_user.sub
        is_driver = booking["ride"]["driver_id"] == current_user.sub
        
        if not (is_rider or is_driver):
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para cancelar esta reserva"
            )
        
        # Verificar que no esté ya cancelada
        if booking["status"] == "cancelled":
            raise HTTPException(
                status_code=400,
                detail="Esta reserva ya está cancelada"
            )
        
        # Marcar como cancelada (no eliminar para mantener historial)
        db.table("Booking").update({"status": "cancelled"}).eq("id", booking_id).execute()
        
        # Incrementar plazas disponibles
        ride = booking["ride"]
        new_seats = ride["seats_available"] + 1
        
        # No exceder el total de plazas
        if new_seats > ride["seats_total"]:
            new_seats = ride["seats_total"]
        
        db.table("Ride").update({"seats_available": new_seats}).eq(
            "id", ride["id"]
        ).execute()
        
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cancelar reserva: {str(e)}")


@router.patch("/{booking_id}/confirm", response_model=BookingResponse)
async def confirm_booking(
    booking_id: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Confirma una reserva (solo el conductor puede hacerlo).
    
    **Requiere autenticación y ser el conductor del viaje.**
    """
    try:
        # Obtener la reserva
        booking_response = db.table("Booking").select(
            "*, ride:Ride(*)"
        ).eq("id", booking_id).execute()
        
        if not booking_response.data or len(booking_response.data) == 0:
            raise HTTPException(status_code=404, detail="Reserva no encontrada")
        
        booking = booking_response.data[0]
        
        # Verificar que sea el conductor
        if booking["ride"]["driver_id"] != current_user.sub:
            raise HTTPException(
                status_code=403,
                detail="Solo el conductor puede confirmar reservas"
            )
        
        # Verificar que esté en estado pending
        if booking["status"] != "pending":
            raise HTTPException(
                status_code=400,
                detail=f"No se puede confirmar una reserva con estado '{booking['status']}'"
            )
        
        # Actualizar a confirmed
        update_response = db.table("Booking").update(
            {"status": "confirmed"}
        ).eq("id", booking_id).execute()
        
        if not update_response.data or len(update_response.data) == 0:
            raise HTTPException(status_code=500, detail="Error al confirmar reserva")
        
        # Obtener reserva actualizada con detalles
        booking_with_details = db.table("Booking").select(
            "*, ride:Ride(*, driver:User(*)), rider:User(*)"
        ).eq("id", booking_id).execute()
        
        if booking_with_details.data and len(booking_with_details.data) > 0:
            return BookingResponse(**booking_with_details.data[0])
        
        return BookingResponse(**update_response.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al confirmar reserva: {str(e)}")
