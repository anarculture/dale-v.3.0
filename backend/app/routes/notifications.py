"""
API routes for notifications management.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from supabase import Client
from app.models.schemas import (
    NotificationResponse,
    PaginatedNotificationsResponse,
    UnreadCountResponse,
    TokenPayload
)
from app.middleware.auth import get_current_user
from app.utils.database import get_db

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=PaginatedNotificationsResponse)
async def get_notifications(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Get paginated list of notifications for the authenticated user.
    
    **Requiere autenticación.**
    
    Returns notifications ordered by creation date (newest first).
    """
    try:
        # Calculate offset
        offset = (page - 1) * page_size
        
        # Get total count
        count_response = db.table("notifications").select(
            "*", count="exact"
        ).eq("user_id", current_user.sub).execute()
        
        total = count_response.count or 0
        
        # Get paginated notifications
        response = db.table("notifications").select("*").eq(
            "user_id", current_user.sub
        ).order("created_at", desc=True).range(offset, offset + page_size - 1).execute()
        
        notifications = [NotificationResponse(**n) for n in response.data]
        has_more = (offset + len(notifications)) < total
        
        return PaginatedNotificationsResponse(
            notifications=notifications,
            total=total,
            page=page,
            page_size=page_size,
            has_more=has_more
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener notificaciones: {str(e)}"
        )


@router.get("/unread-count", response_model=UnreadCountResponse)
async def get_unread_count(
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Get the count of unread notifications for the authenticated user.
    
    **Requiere autenticación.**
    """
    try:
        response = db.table("notifications").select(
            "*", count="exact"
        ).eq("user_id", current_user.sub).eq("is_read", False).execute()
        
        return UnreadCountResponse(count=response.count or 0)
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al obtener conteo de notificaciones: {str(e)}"
        )


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Mark a specific notification as read.
    
    **Requiere autenticación.**
    
    Only the owner of the notification can mark it as read.
    """
    try:
        # Verify notification exists and belongs to user
        existing = db.table("notifications").select("*").eq(
            "id", notification_id
        ).eq("user_id", current_user.sub).execute()
        
        if not existing.data or len(existing.data) == 0:
            raise HTTPException(
                status_code=404, 
                detail="Notificación no encontrada"
            )
        
        # Update to read
        response = db.table("notifications").update(
            {"is_read": True}
        ).eq("id", notification_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=500, 
                detail="Error al marcar notificación como leída"
            )
        
        return NotificationResponse(**response.data[0])
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al actualizar notificación: {str(e)}"
        )


@router.patch("/read-all")
async def mark_all_notifications_read(
    current_user: TokenPayload = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Mark all notifications as read for the authenticated user.
    
    **Requiere autenticación.**
    
    Returns the count of notifications that were marked as read.
    """
    try:
        # Get count of unread notifications first
        count_response = db.table("notifications").select(
            "*", count="exact"
        ).eq("user_id", current_user.sub).eq("is_read", False).execute()
        
        unread_count = count_response.count or 0
        
        if unread_count == 0:
            return {"message": "No hay notificaciones sin leer", "updated_count": 0}
        
        # Update all unread notifications
        db.table("notifications").update(
            {"is_read": True}
        ).eq("user_id", current_user.sub).eq("is_read", False).execute()
        
        return {
            "message": f"{unread_count} notificaciones marcadas como leídas",
            "updated_count": unread_count
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error al marcar notificaciones como leídas: {str(e)}"
        )
