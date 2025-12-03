import os
import sys
from pathlib import Path
from supabase import create_client, Client

# Add root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Config
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://sydhgjtsgqyglqulxfvh.supabase.co")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

if not SUPABASE_SERVICE_KEY:
    print("Error: SUPABASE_SERVICE_ROLE_KEY not found in environment")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def create_test_user():
    email = "cruciallime@comfythings.com"
    password = "password123"
    
    print(f"Creating user {email}...")
    
    try:
        # Try to sign up
        res = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "name": "Test Driver",
                    "role": "driver"
                }
            }
        })
        
        if res.user:
            print("\n✅ User created successfully!")
            print(f"Email: {email}")
            print(f"Password: {password}")
            print(f"ID: {res.user.id}")
        else:
            print("\n⚠️  User might already exist or confirmation required.")
            
    except Exception as e:
        print(f"\n❌ Error creating user: {e}")

if __name__ == "__main__":
    create_test_user()
