import os
from dotenv import load_dotenv

load_dotenv()

print(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')}")
key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
print(f"SUPABASE_SERVICE_ROLE_KEY: {'*' * 10 if key and key != 'placeholder' and key != 'your_service_role_key' else key}")
secret = os.getenv('SUPABASE_JWT_SECRET')
print(f"SUPABASE_JWT_SECRET: {'*' * 10 if secret and secret != 'placeholder' and secret != 'your_jwt_secret' else secret}")
