from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()
from supabase import create_client, Client
import uvicorn
from datetime import datetime
from jose import jwt as jose_jwt
from jose.exceptions import JWTError
from typing import cast

# Configuración
app = FastAPI(title="Dale API", description="API para la aplicación de rides Dale")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3002", "http://127.0.0.1:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar Supabase
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Optional[Client]
if supabase_url and supabase_key:
    print("Supabase configured successfully")
    supabase = create_client(supabase_url, supabase_key)
else:
    print("Supabase NOT configured")
    supabase = None


def get_supabase_client() -> Client:
    """Return the configured Supabase client or raise an HTTP error."""
    client = cast(Optional[Client], globals().get("supabase"))
    if client is None:
        raise HTTPException(status_code=500, detail="Supabase client is not configured")
    return client

# Configuración JWT
JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET") or supabase_key or "test-secret"
JWT_ALGORITHM = "HS256"

# Modelos de datos
class UserProfile(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None

class RideCreate(BaseModel):
    from_city: str
    from_lat: float
    from_lon: float
    to_city: str
    to_lat: float
    to_lon: float
    date_time: str
    seats_total: int
    price: float
    notes: Optional[str] = None

class BookingCreate(BaseModel):
    ride_id: str
    seats_booked: int

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None

# Dependencia para obtener usuario actual
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        # Verificar JWT con Supabase
        payload = jose_jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Obtener usuario de Supabase
        client = get_supabase_client()
        user_response = client.table("users").select("*").eq("id", user_id).execute()
        
        if not user_response.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        return user_response.data[0]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")

# Endpoints de salud
@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.get("/")
async def root():
    return {"message": "Dale API - Rides Platform", "version": "1.0.0"}

# Endpoints de usuarios
@app.get("/api/users/{user_id}")
async def get_user_profile(user_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Verificar que el usuario solo acceda a su propio perfil
        if user_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        client = get_supabase_client()
        response = client.table("users").select("*").eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/users/{user_id}")
async def update_user_profile(
    user_id: str, 
    updates: UserUpdate, 
    current_user: dict = Depends(get_current_user)
):
    try:
        # Verificar autorización
        if user_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # Actualizar en Supabase
        update_data = {k: v for k, v in updates.dict(exclude_unset=True).items() if v is not None}
        client = get_supabase_client()
        response = client.table("users").update(update_data).eq("id", user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de rides
@app.post("/api/rides")
async def create_ride(
    ride_data: RideCreate, 
    current_user: dict = Depends(get_current_user)
):
    try:
        # Crear ride en Supabase
        ride_payload = {
            "driver_id": current_user["id"],
            "from_city": ride_data.from_city,
            "from_lat": ride_data.from_lat,
            "from_lon": ride_data.from_lon,
            "to_city": ride_data.to_city,
            "to_lat": ride_data.to_lat,
            "to_lon": ride_data.to_lon,
            "date_time": ride_data.date_time,
            "seats_total": ride_data.seats_total,
            "seats_available": ride_data.seats_total,
            "price": ride_data.price,
            "notes": ride_data.notes,
            "status": "active"
        }
        
        client = get_supabase_client()
        response = client.table("rides").insert(ride_payload).execute()
        
        if not response.data:
            raise HTTPException(status_code=400, detail="Failed to create ride")
            
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rides")
async def search_rides(
    from_city: Optional[str] = None,
    to_city: Optional[str] = None,
    date: Optional[str] = None,
    max_price: Optional[float] = None
):
    try:
        client = get_supabase_client()
        query = client.table("rides").select("*").eq("status", "active")
        
        # Aplicar filtros
        if from_city:
            query = query.ilike("from_city", f"%{from_city}%")
        if to_city:
            query = query.ilike("to_city", f"%{to_city}%")
        if date:
            query = query.gte("date_time", f"{date}T00:00:00")
            query = query.lt("date_time", f"{date}T23:59:59")
        if max_price:
            query = query.lte("price", max_price)
            
        # Ordenar por fecha
        query = query.order("date_time", desc=False)
        
        response = query.execute()
        
        return {"success": True, "data": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/rides/{ride_id}")
async def get_ride(ride_id: str):
    try:
        client = get_supabase_client()
        response = client.table("rides").select("*").eq("id", ride_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Ride not found")
            
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/rides/{ride_id}/cancel")
async def cancel_ride(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Verificar que el usuario es el conductor
        client = get_supabase_client()
        ride_response = client.table("rides").select("*").eq("id", ride_id).execute()
        
        if not ride_response.data:
            raise HTTPException(status_code=404, detail="Ride not found")
            
        ride = ride_response.data[0]
        if ride["driver_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
            
        # Cancelar ride
        client = get_supabase_client()
        response = client.table("rides").update({"status": "cancelled"}).eq("id", ride_id).execute()
        
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints de bookings
@app.post("/api/bookings")
async def create_booking(
    booking_data: BookingCreate,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Verificar que el ride existe y tiene asientos disponibles
        client = get_supabase_client()
        ride_response = client.table("rides").select("*").eq("id", booking_data.ride_id).eq("status", "active").execute()
        
        if not ride_response.data:
            raise HTTPException(status_code=404, detail="Ride not found or not available")
            
        ride = ride_response.data[0]
        
        if ride["seats_available"] < booking_data.seats_booked:
            raise HTTPException(status_code=400, detail="Not enough seats available")
            
        # Crear booking
        booking_payload = {
            "ride_id": booking_data.ride_id,
            "rider_id": current_user["id"],
            "seats_booked": booking_data.seats_booked,
            "total_price": ride["price"] * booking_data.seats_booked,
            "status": "pending"
        }
        
        booking_response = client.table("bookings").insert(booking_payload).execute()
        
        if not booking_response.data:
            raise HTTPException(status_code=400, detail="Failed to create booking")
            
        # Actualizar asientos disponibles
        new_seats_available = ride["seats_available"] - booking_data.seats_booked
        new_status = "full" if new_seats_available == 0 else "active"
        
        client.table("rides").update({
            "seats_available": new_seats_available,
            "status": new_status
        }).eq("id", booking_data.ride_id).execute()
        
        return {"success": True, "data": booking_response.data[0]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/users/{user_id}/bookings")
async def get_user_bookings(user_id: str, current_user: dict = Depends(get_current_user)):
    try:
        # Verificar autorización
        if user_id != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
            
        # Obtener bookings con información del ride
        client = get_supabase_client()
        response = client.table("bookings").select("*, rides(*, users!rides_driver_id_fkey(name))").eq("rider_id", user_id).order("created_at", desc=True).execute()
        
        return {"success": True, "data": response.data or []}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/bookings/{booking_id}/cancel")
async def cancel_booking(
    booking_id: str,
    current_user: dict = Depends(get_current_user)
):
    try:
        # Obtener booking
        client = get_supabase_client()
        booking_response = client.table("bookings").select("*").eq("id", booking_id).execute()
        
        if not booking_response.data:
            raise HTTPException(status_code=404, detail="Booking not found")
            
        booking = booking_response.data[0]
        
        # Verificar que el usuario puede cancelar (solo el pasajero)
        if booking["rider_id"] != current_user["id"]:
            raise HTTPException(status_code=403, detail="Unauthorized")
            
        # Solo se puede cancelar si no está ya cancelada
        if booking["status"] == "cancelled":
            raise HTTPException(status_code=400, detail="Booking already cancelled")
            
        # Cancelar booking
        client.table("bookings").update({"status": "cancelled"}).eq("id", booking_id).execute()
        
        # Liberar asientos en el ride
        ride_response = client.table("rides").select("*").eq("id", booking["ride_id"]).execute()
        if ride_response.data:
            ride = ride_response.data[0]
            new_seats_available = ride["seats_available"] + booking["seats_booked"]
            new_status = "active" if ride["status"] == "full" else ride["status"]
            
            client.table("rides").update({
                "seats_available": new_seats_available,
                "status": new_status
            }).eq("id", booking["ride_id"]).execute()
        
        return {"success": True, "data": {"message": "Booking cancelled successfully"}}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
