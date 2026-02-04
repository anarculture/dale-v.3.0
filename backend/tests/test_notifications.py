"""
Tests for the Notification Service and API endpoints.
"""
import pytest
from unittest.mock import Mock, AsyncMock, patch
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


class TestNotificationService:
    """Unit tests for NotificationService class."""
    
    def test_notification_service_init(self):
        """Test NotificationService can be instantiated."""
        from app.services.notifications import NotificationService
        
        mock_db = Mock()
        service = NotificationService(mock_db)
        
        assert service.db == mock_db
    
    @pytest.mark.asyncio
    async def test_create_notification_success(self):
        """Test create_notification inserts into database."""
        from app.services.notifications import NotificationService
        
        # Create mock db client
        mock_db = Mock()
        mock_response = Mock()
        mock_response.data = [{
            "id": "test-notification-id",
            "user_id": "test-user-id",
            "title": "Test Title",
            "body": "Test Body",
            "type": "test_type",
            "is_read": False,
            "metadata": {},
            "created_at": "2026-02-04T12:00:00Z"
        }]
        
        mock_db.table.return_value.insert.return_value.execute.return_value = mock_response
        
        service = NotificationService(mock_db)
        result = await service.create_notification(
            user_id="test-user-id",
            title="Test Title",
            body="Test Body",
            notification_type="test_type"
        )
        
        # Verify insert was called
        mock_db.table.assert_called_with("notifications")
        
        # Verify result
        assert result["id"] == "test-notification-id"
        assert result["title"] == "Test Title"
    
    @pytest.mark.asyncio
    async def test_notify_booking_request(self):
        """Test notify_booking_request creates correct notification."""
        from app.services.notifications import NotificationService
        
        mock_db = Mock()
        mock_response = Mock()
        mock_response.data = [{
            "id": "notif-123",
            "user_id": "driver-id",
            "title": "Nueva solicitud de reserva",
            "body": "Juan quiere unirse a tu viaje a Valencia",
            "type": "booking_request",
            "metadata": {"booking_id": "booking-123", "ride_id": "ride-456"}
        }]
        mock_db.table.return_value.insert.return_value.execute.return_value = mock_response
        
        service = NotificationService(mock_db)
        result = await service.notify_booking_request(
            driver_id="driver-id",
            rider_name="Juan",
            destination_city="Valencia",
            booking_id="booking-123",
            ride_id="ride-456"
        )
        
        assert result["type"] == "booking_request"
        assert "booking_id" in result["metadata"]
    
    @pytest.mark.asyncio
    async def test_notify_booking_confirmed(self):
        """Test notify_booking_confirmed creates correct notification."""
        from app.services.notifications import NotificationService
        
        mock_db = Mock()
        mock_response = Mock()
        mock_response.data = [{
            "id": "notif-123",
            "type": "booking_confirmed",
            "title": "¡Reserva confirmada!"
        }]
        mock_db.table.return_value.insert.return_value.execute.return_value = mock_response
        
        service = NotificationService(mock_db)
        result = await service.notify_booking_confirmed(
            rider_id="rider-id",
            destination_city="Caracas",
            booking_id="booking-123",
            ride_id="ride-456"
        )
        
        assert result["type"] == "booking_confirmed"
    
    @pytest.mark.asyncio
    async def test_notify_ride_cancelled(self):
        """Test notify_ride_cancelled creates correct notification."""
        from app.services.notifications import NotificationService
        
        mock_db = Mock()
        mock_response = Mock()
        mock_response.data = [{
            "id": "notif-123",
            "type": "ride_cancelled",
            "title": "⚠️ URGENTE: Viaje cancelado"
        }]
        mock_db.table.return_value.insert.return_value.execute.return_value = mock_response
        
        service = NotificationService(mock_db)
        result = await service.notify_ride_cancelled(
            rider_id="rider-id",
            destination_city="Maracaibo",
            ride_id="ride-456"
        )
        
        assert result["type"] == "ride_cancelled"


class TestNotificationSchemas:
    """Test Pydantic schemas for notifications."""
    
    def test_notification_response_schema(self):
        """Test NotificationResponse schema validation."""
        from app.models.schemas import NotificationResponse
        from datetime import datetime
        from uuid import uuid4
        
        notification = NotificationResponse(
            id=uuid4(),
            user_id=uuid4(),
            title="Test Notification",
            body="This is a test notification body",
            type="test_type",
            is_read=False,
            metadata={"key": "value"},
            created_at=datetime.now()
        )
        
        assert notification.title == "Test Notification"
        assert notification.is_read == False
        assert notification.metadata == {"key": "value"}
    
    def test_paginated_notifications_response_schema(self):
        """Test PaginatedNotificationsResponse schema."""
        from app.models.schemas import PaginatedNotificationsResponse, NotificationResponse
        from datetime import datetime
        from uuid import uuid4
        
        notification = NotificationResponse(
            id=uuid4(),
            user_id=uuid4(),
            title="Test",
            body="Body",
            type="test",
            is_read=False,
            created_at=datetime.now()
        )
        
        paginated = PaginatedNotificationsResponse(
            notifications=[notification],
            total=1,
            page=1,
            page_size=20,
            has_more=False
        )
        
        assert paginated.total == 1
        assert len(paginated.notifications) == 1
        assert paginated.has_more == False
    
    def test_unread_count_response_schema(self):
        """Test UnreadCountResponse schema."""
        from app.models.schemas import UnreadCountResponse
        
        response = UnreadCountResponse(count=5)
        assert response.count == 5


class TestNotificationRouteImports:
    """Test that notification routes and dependencies import correctly."""
    
    def test_notifications_router_import(self):
        """Test notification router can be imported."""
        from app.routes.notifications import router
        assert router is not None
        assert router.prefix == "/api/notifications"
    
    def test_notification_service_import(self):
        """Test NotificationService can be imported."""
        from app.services.notifications import NotificationService
        assert NotificationService is not None
    
    def test_main_includes_notifications(self):
        """Test main.py includes notifications router."""
        from app.main import app
        
        routes = [route.path for route in app.routes]
        notification_routes = [r for r in routes if "notification" in r.lower()]
        
        assert len(notification_routes) > 0, "Notification routes should be registered"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
