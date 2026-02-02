"""
Notification Service for handling notification creation and delivery.
"""
from typing import Optional, Dict, Any
from uuid import UUID
from supabase import Client


class NotificationService:
    """
    Service class for managing notifications.
    
    Handles:
    - Creating notifications in the database
    - Future: Email delivery via Resend
    - Future: Push notifications via FCM
    """
    
    def __init__(self, db: Client):
        """
        Initialize the notification service.
        
        Args:
            db: Supabase client instance
        """
        self.db = db
    
    async def create_notification(
        self,
        user_id: str,
        title: str,
        body: str,
        notification_type: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> dict:
        """
        Create a new notification for a user.
        
        Args:
            user_id: UUID of the user to notify
            title: Notification title
            body: Notification body/message
            notification_type: Type of notification (e.g., 'booking_confirmed', 'ride_cancelled')
            metadata: Optional JSON metadata (e.g., ride_id, booking_id)
            
        Returns:
            The created notification record
        """
        notification_data = {
            "user_id": str(user_id),
            "title": title,
            "body": body,
            "type": notification_type,
            "metadata": metadata or {}
        }
        
        response = self.db.table("notifications").insert(notification_data).execute()
        
        if not response.data or len(response.data) == 0:
            raise Exception("Failed to create notification")
        
        created_notification = response.data[0]
        
        # TODO: Send email via Resend for transactional notifications
        # await self._send_email(user_id, title, body, notification_type)
        
        # TODO: Send push notification via FCM if user has FCM token
        # await self._send_push(user_id, title, body)
        
        return created_notification
    
    async def _send_email(
        self,
        user_id: str,
        title: str,
        body: str,
        notification_type: str
    ) -> None:
        """
        Send email notification via Resend.
        
        TODO: Implement email sending logic
        - Fetch user email from users table
        - Use Resend API to send templated email
        - Handle transactional vs marketing email preferences
        """
        # TODO: Implement with Resend
        # Example:
        # user = self.db.table("users").select("email").eq("id", user_id).execute()
        # if user.data:
        #     await resend.send(
        #         to=user.data[0]["email"],
        #         subject=title,
        #         template=f"notification_{notification_type}",
        #         context={"body": body}
        #     )
        pass
    
    async def _send_push(
        self,
        user_id: str,
        title: str,
        body: str
    ) -> None:
        """
        Send push notification via Firebase Cloud Messaging (FCM).
        
        TODO: Implement push notification logic
        - Fetch user FCM token from users table
        - Use FCM/OneSignal API to send push notification
        - Handle notification preferences
        """
        # TODO: Implement with FCM/OneSignal
        # Example:
        # user = self.db.table("users").select("fcm_token").eq("id", user_id).execute()
        # if user.data and user.data[0].get("fcm_token"):
        #     await fcm.send(
        #         token=user.data[0]["fcm_token"],
        #         title=title,
        #         body=body
        #     )
        pass
    
    # === Convenience methods for common notification types ===
    
    async def notify_booking_request(
        self,
        driver_id: str,
        rider_name: str,
        destination_city: str,
        booking_id: str,
        ride_id: str
    ) -> dict:
        """Notify driver of a new booking request."""
        return await self.create_notification(
            user_id=driver_id,
            title="Nueva solicitud de reserva",
            body=f"{rider_name} quiere unirse a tu viaje a {destination_city}",
            notification_type="booking_request",
            metadata={"booking_id": booking_id, "ride_id": ride_id}
        )
    
    async def notify_booking_confirmed(
        self,
        rider_id: str,
        destination_city: str,
        booking_id: str,
        ride_id: str
    ) -> dict:
        """Notify rider that their booking was confirmed."""
        return await self.create_notification(
            user_id=rider_id,
            title="¡Reserva confirmada!",
            body=f"Tu viaje a {destination_city} está confirmado. Ver detalles.",
            notification_type="booking_confirmed",
            metadata={"booking_id": booking_id, "ride_id": ride_id}
        )
    
    async def notify_booking_rejected(
        self,
        rider_id: str,
        destination_city: str,
        booking_id: str,
        ride_id: str
    ) -> dict:
        """Notify rider that their booking was declined."""
        return await self.create_notification(
            user_id=rider_id,
            title="Solicitud rechazada",
            body=f"Tu solicitud para el viaje a {destination_city} fue rechazada.",
            notification_type="booking_rejected",
            metadata={"booking_id": booking_id, "ride_id": ride_id}
        )
    
    async def notify_booking_cancelled(
        self,
        user_id: str,
        cancelled_by_name: str,
        destination_city: str,
        booking_id: str,
        ride_id: str
    ) -> dict:
        """Notify user that a booking was cancelled."""
        return await self.create_notification(
            user_id=user_id,
            title="Reserva cancelada",
            body=f"La reserva para {destination_city} fue cancelada por {cancelled_by_name}.",
            notification_type="booking_cancelled",
            metadata={"booking_id": booking_id, "ride_id": ride_id}
        )
    
    async def notify_ride_cancelled(
        self,
        rider_id: str,
        destination_city: str,
        ride_id: str
    ) -> dict:
        """Notify rider that a ride was cancelled (urgent)."""
        return await self.create_notification(
            user_id=rider_id,
            title="⚠️ URGENTE: Viaje cancelado",
            body=f"El viaje a {destination_city} fue cancelado por el conductor.",
            notification_type="ride_cancelled",
            metadata={"ride_id": ride_id}
        )
