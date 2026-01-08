
import os
import asyncio
from supabase import create_client, Client
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

# Use local Supabase credentials from .env or default to local docker
SUPABASE_URL = os.getenv("SUPABASE_URL", "http://localhost:8000")
# NOTE: Using anon key for client-side operations, but to bypass RLS we might need service role
# However, since we are interacting with OUR API in a real app, we should use the API...
# BUT for seeding, it is easier to use Supabase Service Role Key to insert directly into DB tables
# bypassing auth complications of signing up via API.
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not found in environment.")
    # Try finding in .env file manually if load_dotenv failed or vars are different
    # For now, let's assume valid env.
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def seed():
    print("🌱 Seeding Demo Data...")

    # 1. Create Driver
    driver_email = "driver@demo.com"
    driver_password = "password123"
    
    # Try to sign up (if not exists)
    try:
        # Check if user exists in public.User first? No, auth.users is separate.
        # We can use admin api if using service role, but supabase-py client is simpler.
        auth_res = supabase.auth.admin.create_user({
            "email": driver_email,
            "password": driver_password,
            "email_confirm": True,
            "user_metadata": {"full_name": "Don Conductor"}
        })
        driver_id = auth_res.user.id
        print(f"✅ Created Driver: {driver_email}")
    except Exception as e:
        print(f"Driver might exist: {e}")
        try:
             users = supabase.auth.admin.list_users()
             found = next((u for u in users if u.email == driver_email), None)
             if found:
                 driver_id = found.id
                 # Ensure exists in public.User
                 res = supabase.table("User").select("id").eq("id", driver_id).execute()
                 if not res.data:
                     print(f"Syncing Driver to public.User: {driver_id}")
                     supabase.table("User").insert({
                         "id": driver_id,
                         "email": driver_email,
                         "name": "Don Conductor",
                         "phone": "+584125550001"
                     }).execute()
             else:
                 print("❌ User exists but could not be found in list.")
                 return
        except Exception as inner_e:
             print(f"❌ Error finding/syncing driver: {inner_e}")
             return

    # Update Driver Profile (Just in case it existed but phone didn't)
    try:
        supabase.table("User").update({"phone": "+584125550001", "name": "Don Conductor"}).eq("id", driver_id).execute()
    except Exception as e:
        print(f"Error updating driver profile: {e}")

    # 2. Create Passenger
    passenger_email = "passenger@demo.com"
    passenger_password = "password123"
    
    try:
        auth_res = supabase.auth.admin.create_user({
            "email": passenger_email,
            "password": passenger_password,
            "email_confirm": True,
            "user_metadata": {"full_name": "Ana Pasajera"}
        })
        passenger_id = auth_res.user.id
        print(f"✅ Created Passenger: {passenger_email}")
    except Exception as e:
        print(f"Passenger might exist: {e}")
        try:
             users = supabase.auth.admin.list_users()
             found = next((u for u in users if u.email == passenger_email), None)
             if found:
                 passenger_id = found.id
                 # Ensure exists in public.User
                 res = supabase.table("User").select("id").eq("id", passenger_id).execute()
                 if not res.data:
                     print(f"Syncing Passenger to public.User: {passenger_id}")
                     supabase.table("User").insert({
                         "id": passenger_id,
                         "email": passenger_email,
                         "name": "Ana Pasajera",
                         "phone": "+584149990002"
                     }).execute()
             else:
                 print("❌ Passenger exists but could not be found.")
                 return
        except Exception as inner_e:
             print(f"❌ Error finding passenger: {inner_e}")
             return
            
    # Update Passenger Profile
    try:
        supabase.table("User").update({"phone": "+584149990002", "name": "Ana Pasajera"}).eq("id", passenger_id).execute()
    except:
        pass


    # 3. Create Rides (For Tomorrow)
    tomorrow = datetime.now() + timedelta(days=1)
    tomorrow = tomorrow.replace(hour=8, minute=0, second=0, microsecond=0)
    
    ride_data = {
        "driver_id": driver_id,
        "from_city": "Caracas",
        "to_city": "Valencia",
        "from_lat": 10.4806,
        "from_lon": -66.9036,
        "to_lat": 10.1620,
        "to_lon": -68.0028,
        "date_time": tomorrow.isoformat(),
        "seats_total": 4,
        "seats_available": 3, # 1 booked
        "price": 15.0,
        "notes": "Salgo de Plaza Venezuela. No fumo."
    }
    
    ride_res = supabase.table("Ride").insert(ride_data).execute()
    if ride_res.data:
        ride_id = ride_res.data[0]['id']
        print(f"✅ Created Ride: Caracas -> Valencia ({tomorrow.strftime('%Y-%m-%d %H:%M')})")
    else:
        print("❌ Failed to create ride")
        return


    # 4. Create Booking (Confirmed)
    booking_data = {
        "ride_id": ride_id,
        "rider_id": passenger_id,
        "status": "confirmed"
    }
    
    # Check if booking exists
    existing = supabase.table("Booking").select("*").eq("ride_id", ride_id).eq("rider_id", passenger_id).execute()
    if not existing.data:
        supabase.table("Booking").insert(booking_data).execute()
        print(f"✅ Created Confirmed Booking for Ana Pasajera")
    else:
        print("ℹ️ Booking already exists")

    print("\n🎉 Seeding Complete!")
    print(f"Driver Login: {driver_email} / {driver_password}")
    print(f"Passenger Login: {passenger_email} / {passenger_password}")

if __name__ == "__main__":
    import asyncio
    asyncio.run(seed())
