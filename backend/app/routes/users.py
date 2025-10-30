"""
Rutas de API para gestión de usuarios y perfiles.
"""
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.models.schemas import UserResponse, UserUpdate, TokenPayload
from app.middleware.auth import get_current_user
from app.utils.database import get_db

router = APIRouter(prefix="/api", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_my_profile(
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Obtiene el perfil del usuario autenticado.
    
    **Requiere autenticación.**
    """
    try:
        # Buscar usuario por ID
        response = db.table("User").select("*").eq("id", current_user.sub).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        user = response.data[0]
        return UserResponse(**user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener perfil: {str(e)}")


@router.patch("/me", response_model=UserResponse)
async def update_my_profile(
    user_update: UserUpdate,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Actualiza el perfil del usuario autenticado.
    
    **Requiere autenticación.**
    
    Campos actualizables:
    - name: Nombre del usuario
    - avatar_url: URL del avatar
    - role: Rol (rider/driver)
    """
    try:
        # Preparar datos a actualizar (solo campos presentes)
        update_data = user_update.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No hay campos para actualizar")
        
        # Actualizar usuario
        response = db.table("User").update(update_data).eq("id", current_user.sub).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        updated_user = response.data[0]
        return UserResponse(**updated_user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar perfil: {str(e)}")


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: str,
    db: Client = Depends(get_db)
):
    """
    Obtiene el perfil público de un usuario por su ID.
    
    **No requiere autenticación.**
    """
    try:
        response = db.table("User").select("*").eq("id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
        user = response.data[0]
        return UserResponse(**user)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener usuario: {str(e)}")
