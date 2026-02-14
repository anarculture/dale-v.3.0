"""
Middleware de autenticación JWT con Supabase.
Valida tokens JWT y extrae información del usuario.
"""
import os
import jwt
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
from app.models.schemas import TokenPayload

# Configuración
SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
if not SUPABASE_JWT_SECRET:
    raise RuntimeError("SUPABASE_JWT_SECRET environment variable is required")
JWT_ALGORITHM = "HS256"
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "authenticated")

security = HTTPBearer()


def decode_token(token: str) -> TokenPayload:
    """
    Decodifica y valida un token JWT de Supabase.
    
    Args:
        token: Token JWT a validar
        
    Returns:
        TokenPayload con información del usuario
        
    Raises:
        HTTPException: Si el token es inválido o ha expirado
    """
    try:
        # Decodificar token
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
            audience=JWT_AUDIENCE,
            options={"verify_signature": True}
        )
        
        return TokenPayload(**payload)
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="El token ha expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=401,
            detail=f"Token inválido: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Error al validar token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security)
) -> TokenPayload:
    """
    Dependency para obtener el usuario actual desde el token JWT.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: TokenPayload = Depends(get_current_user)):
            return {"user_id": user.sub}
    """
    token = credentials.credentials
    return decode_token(token)


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> Optional[TokenPayload]:
    """
    Dependency para rutas que aceptan autenticación opcional.
    Retorna None si no hay token presente.
    """
    if credentials is None:
        return None
    
    token = credentials.credentials
    return decode_token(token)


def require_role(required_role: str):
    """
    Dependency factory para requerir un rol específico.
    
    Usage:
        @app.post("/rides")
        async def create_ride(
            user: TokenPayload = Depends(require_role("driver"))
        ):
            ...
    """
    async def role_checker(user: TokenPayload = Depends(get_current_user)) -> TokenPayload:
        user_role = user.role or "rider"
        if user_role != required_role:
            raise HTTPException(
                status_code=403,
                detail=f"Se requiere rol '{required_role}' para esta acción"
            )
        return user
    
    return role_checker
