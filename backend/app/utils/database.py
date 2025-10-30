"""
Utilidades para interactuar con la base de datos Supabase.
"""
import os
from supabase import create_client, Client
from typing import Optional

# Cliente Supabase singleton
_supabase_client: Optional[Client] = None


def get_supabase_client() -> Client:
    """
    Obtiene el cliente de Supabase (singleton).
    
    Returns:
        Cliente configurado de Supabase
    """
    global _supabase_client
    
    if _supabase_client is None:
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        
        if not supabase_url or not supabase_key:
            raise ValueError(
                "Faltan variables de entorno: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY"
            )
        
        _supabase_client = create_client(supabase_url, supabase_key)
    
    return _supabase_client


async def get_db():
    """
    Dependency para obtener el cliente de base de datos.
    
    Usage:
        @app.get("/data")
        async def get_data(db: Client = Depends(get_db)):
            return db.table("User").select("*").execute()
    """
    return get_supabase_client()
