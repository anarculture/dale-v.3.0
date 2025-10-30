"""
Rutas de API para gestión de viajes (rides).
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from typing import List, Optional
from datetime import datetime, timedelta
from app.models.schemas import RideCreate, RideResponse, TokenPayload
from app.middleware.auth import get_current_user, require_role
from app.utils.database import get_db

router = APIRouter(prefix="/api/rides", tags=["rides"])


@router.post("", response_model=RideResponse, status_code=201)
async def create_ride(
    ride: RideCreate,
    current_user: TokenPayload = Depends(require_role("driver")),
    db: Client = Depends(get_db)
):
    """
    Crea un nuevo viaje.
    
    **Requiere autenticación y rol de conductor (driver).**
    
    El campo `seats_available` se inicializa automáticamente con el valor de `seats_total`.
    """
    try:
        # Validar que la fecha sea futura
        if ride.date_time < datetime.now():
            raise HTTPException(
                status_code=400,
                detail="La fecha del viaje debe ser futura"
            )
        
        # Preparar datos del viaje
        ride_data = ride.model_dump()
        ride_data["driver_id"] = current_user.sub
        ride_data["seats_available"] = ride.seats_total
        
        # Insertar viaje
        response = db.table("Ride").insert(ride_data).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=500, detail="Error al crear viaje")
        
        created_ride = response.data[0]
        
        # Obtener viaje con información del conductor
        ride_with_driver = db.table("Ride").select(
            "*, driver:User(*)"
        ).eq("id", created_ride["id"]).execute()
        
        if ride_with_driver.data and len(ride_with_driver.data) > 0:
            return RideResponse(**ride_with_driver.data[0])
        
        return RideResponse(**created_ride)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear viaje: {str(e)}")


@router.get("", response_model=List[RideResponse])
async def search_rides(
    from_city: Optional[str] = Query(None, description="Ciudad de origen"),
    to_city: Optional[str] = Query(None, description="Ciudad de destino"),
    date: Optional[str] = Query(None, description="Fecha del viaje (YYYY-MM-DD)"),
    min_seats: Optional[int] = Query(None, ge=1, description="Mínimo de plazas disponibles"),
    max_price: Optional[float] = Query(None, ge=0, description="Precio máximo"),
    db: Client = Depends(get_db)
):
    """
    Busca viajes con filtros opcionales.
    
    **No requiere autenticación.**
    
    Parámetros de búsqueda:
    - `from_city`: Filtra por ciudad de origen (case-insensitive)
    - `to_city`: Filtra por ciudad de destino (case-insensitive)
    - `date`: Filtra por fecha (YYYY-MM-DD, busca viajes ese día)
    - `min_seats`: Filtra por mínimo de plazas disponibles
    - `max_price`: Filtra por precio máximo
    
    Por defecto, solo muestra viajes futuros con plazas disponibles.
    """
    try:
        # Iniciar query
        query = db.table("Ride").select("*, driver:User(*)")
        
        # Filtrar solo viajes futuros
        query = query.gte("date_time", datetime.now().isoformat())
        
        # Filtrar solo viajes con plazas disponibles
        query = query.gt("seats_available", 0)
        
        # Aplicar filtros opcionales
        if from_city:
            query = query.ilike("from_city", f"%{from_city}%")
        
        if to_city:
            query = query.ilike("to_city", f"%{to_city}%")
        
        if date:
            # Buscar viajes en ese día específico
            try:
                target_date = datetime.fromisoformat(date)
                next_day = target_date + timedelta(days=1)
                query = query.gte("date_time", target_date.isoformat())
                query = query.lt("date_time", next_day.isoformat())
            except ValueError:
                raise HTTPException(status_code=400, detail="Formato de fecha inválido. Use YYYY-MM-DD")
        
        if min_seats is not None:
            query = query.gte("seats_available", min_seats)
        
        if max_price is not None:
            query = query.lte("price", max_price)
        
        # Ordenar por fecha
        query = query.order("date_time", desc=False)
        
        # Ejecutar query
        response = query.execute()
        
        # Convertir a modelos Pydantic
        rides = [RideResponse(**ride) for ride in response.data]
        return rides
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar viajes: {str(e)}")


@router.get("/{ride_id}", response_model=RideResponse)
async def get_ride_by_id(
    ride_id: str,
    db: Client = Depends(get_db)
):
    """
    Obtiene los detalles de un viaje por su ID.
    
    **No requiere autenticación.**
    """
    try:
        response = db.table("Ride").select(
            "*, driver:User(*)"
        ).eq("id", ride_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Viaje no encontrado")
        
        ride = response.data[0]
        return RideResponse(**ride)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener viaje: {str(e)}")


@router.get("/my/rides", response_model=List[RideResponse])
async def get_my_rides(
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Obtiene todos los viajes creados por el usuario autenticado.
    
    **Requiere autenticación.**
    """
    try:
        response = db.table("Ride").select(
            "*, driver:User(*)"
        ).eq("driver_id", current_user.sub).order("date_time", desc=False).execute()
        
        rides = [RideResponse(**ride) for ride in response.data]
        return rides
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener viajes: {str(e)}")


@router.delete("/{ride_id}", status_code=204)
async def delete_ride(
    ride_id: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Elimina un viaje creado por el usuario autenticado.
    
    **Requiere autenticación.**
    Solo el conductor que creó el viaje puede eliminarlo.
    """
    try:
        # Verificar que el viaje existe y pertenece al usuario
        ride_response = db.table("Ride").select("*").eq("id", ride_id).execute()
        
        if not ride_response.data or len(ride_response.data) == 0:
            raise HTTPException(status_code=404, detail="Viaje no encontrado")
        
        ride = ride_response.data[0]
        
        if ride["driver_id"] != current_user.sub:
            raise HTTPException(
                status_code=403,
                detail="No tienes permiso para eliminar este viaje"
            )
        
        # Eliminar viaje (las reservas se eliminarán en cascada)
        db.table("Ride").delete().eq("id", ride_id).execute()
        
        return None
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar viaje: {str(e)}")
