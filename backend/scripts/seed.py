"""
Script de seeding para la base de datos de Dale.
Crea usuarios, viajes y reservas de ejemplo para desarrollo.
"""
import asyncio
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Agregar el directorio raíz al path
sys.path.insert(0, str(Path(__file__).parent.parent))

from supabase import create_client, Client

# Configurar Supabase
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://sydhgjtsgqyglqulxfvh.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def clear_tables():
    """Limpia todas las tablas antes de hacer seed."""
    print("🧹 Limpiando tablas existentes...")
    
    # Orden importante: primero las tablas con foreign keys
    supabase.table("Booking").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("Ride").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    supabase.table("User").delete().neq("id", "00000000-0000-0000-0000-000000000000").execute()
    
    print("✅ Tablas limpiadas")


def seed_users():
    """Crea usuarios de ejemplo."""
    print("\n👥 Creando usuarios...")
    
    users = [
        {
            "email": "maria.garcia@example.com",
            "name": "María García",
            "avatar_url": "https://i.pravatar.cc/150?img=1",
            "role": "driver"
        },
        {
            "email": "juan.rodriguez@example.com",
            "name": "Juan Rodríguez",
            "avatar_url": "https://i.pravatar.cc/150?img=12",
            "role": "driver"
        },
        {
            "email": "ana.martinez@example.com",
            "name": "Ana Martínez",
            "avatar_url": "https://i.pravatar.cc/150?img=5",
            "role": "rider"
        },
        {
            "email": "carlos.lopez@example.com",
            "name": "Carlos López",
            "avatar_url": "https://i.pravatar.cc/150?img=15",
            "role": "rider"
        },
        {
            "email": "laura.sanchez@example.com",
            "name": "Laura Sánchez",
            "avatar_url": "https://i.pravatar.cc/150?img=9",
            "role": "driver"
        }
    ]
    
    result = supabase.table("User").insert(users).execute()
    print(f"✅ {len(result.data)} usuarios creados")
    return result.data


def seed_rides(users):
    """Crea viajes de ejemplo."""
    print("\n🚗 Creando viajes...")
    
    # Obtener drivers
    drivers = [u for u in users if u["role"] == "driver"]
    
    # Fechas futuras para los viajes
    tomorrow = datetime.now() + timedelta(days=1)
    in_2_days = datetime.now() + timedelta(days=2)
    in_3_days = datetime.now() + timedelta(days=3)
    in_5_days = datetime.now() + timedelta(days=5)
    
    rides = [
        {
            "driver_id": drivers[0]["id"],
            "from_city": "Madrid",
            "from_lat": 40.4168,
            "from_lon": -3.7038,
            "to_city": "Barcelona",
            "to_lat": 41.3851,
            "to_lon": 2.1734,
            "date_time": tomorrow.isoformat(),
            "seats_total": 3,
            "seats_available": 3,
            "price": 25.00,
            "notes": "Salida desde Atocha. Acepto mascotas pequeñas."
        },
        {
            "driver_id": drivers[1]["id"],
            "from_city": "Barcelona",
            "from_lat": 41.3851,
            "from_lon": 2.1734,
            "to_city": "Valencia",
            "to_lat": 39.4699,
            "to_lon": -0.3763,
            "date_time": in_2_days.isoformat(),
            "seats_total": 4,
            "seats_available": 2,
            "price": 18.50,
            "notes": "Parada en Tarragona si hace falta."
        },
        {
            "driver_id": drivers[0]["id"],
            "from_city": "Madrid",
            "from_lat": 40.4168,
            "from_lon": -3.7038,
            "to_city": "Sevilla",
            "to_lat": 37.3891,
            "to_lon": -5.9845,
            "date_time": in_3_days.isoformat(),
            "seats_total": 2,
            "seats_available": 2,
            "price": 30.00,
            "notes": "Viaje directo sin paradas."
        },
        {
            "driver_id": drivers[2]["id"],
            "from_city": "Valencia",
            "from_lat": 39.4699,
            "from_lon": -0.3763,
            "to_city": "Madrid",
            "to_lat": 40.4168,
            "to_lon": -3.7038,
            "date_time": in_5_days.isoformat(),
            "seats_total": 3,
            "seats_available": 3,
            "price": 22.00,
            "notes": "Coche espacioso, ideal para equipaje grande."
        },
        {
            "driver_id": drivers[1]["id"],
            "from_city": "Barcelona",
            "from_lat": 41.3851,
            "from_lon": 2.1734,
            "to_city": "Madrid",
            "to_lat": 40.4168,
            "to_lon": -3.7038,
            "date_time": tomorrow.isoformat(),
            "seats_total": 4,
            "seats_available": 1,
            "price": 28.00,
            "notes": "Salida temprano (7:00 AM). Música permitida."
        }
    ]
    
    result = supabase.table("Ride").insert(rides).execute()
    print(f"✅ {len(result.data)} viajes creados")
    return result.data


def seed_bookings(rides, users):
    """Crea reservas de ejemplo."""
    print("\n📝 Creando reservas...")
    
    # Obtener riders
    riders = [u for u in users if u["role"] == "rider"]
    
    # Crear algunas reservas
    bookings = [
        {
            "ride_id": rides[1]["id"],  # Barcelona -> Valencia
            "rider_id": riders[0]["id"],
            "status": "confirmed"
        },
        {
            "ride_id": rides[1]["id"],  # Barcelona -> Valencia
            "rider_id": riders[1]["id"],
            "status": "confirmed"
        },
        {
            "ride_id": rides[4]["id"],  # Barcelona -> Madrid
            "rider_id": riders[0]["id"],
            "status": "pending"
        },
        {
            "ride_id": rides[4]["id"],  # Barcelona -> Madrid
            "rider_id": riders[1]["id"],
            "status": "confirmed"
        }
    ]
    
    result = supabase.table("Booking").insert(bookings).execute()
    print(f"✅ {len(result.data)} reservas creadas")
    return result.data


def main():
    """Ejecuta el seeding completo."""
    print("🌱 Iniciando seeding de la base de datos Dale...")
    print("=" * 50)
    
    try:
        # Limpiar tablas existentes
        clear_tables()
        
        # Crear datos de ejemplo
        users = seed_users()
        rides = seed_rides(users)
        bookings = seed_bookings(rides, users)
        
        print("\n" + "=" * 50)
        print("✅ Seeding completado exitosamente!")
        print(f"📊 Resumen:")
        print(f"   - {len(users)} usuarios")
        print(f"   - {len(rides)} viajes")
        print(f"   - {len(bookings)} reservas")
        print("=" * 50)
        
    except Exception as e:
        print(f"\n❌ Error durante el seeding: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
