"""
Modelos Pydantic para validación de datos de la API.
"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID
import re


# ============= USER MODELS =============

class UserBase(BaseModel):
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    name: str = Field(..., min_length=2, max_length=100)
    avatar_url: Optional[str] = None
    phone: Optional[str] = Field(None, pattern=r"^\+?[1-9]\d{1,14}$", description="International format phone number")


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(UserBase):
    id: UUID
    created_at: datetime
    average_rating: Optional[float] = None
    rating_count: int = 0

    class Config:
        from_attributes = True


# ============= RIDE MODELS =============

class RideBase(BaseModel):
    from_city: str = Field(..., min_length=2, max_length=100)
    from_lat: float = Field(..., ge=-90, le=90)
    from_lon: float = Field(..., ge=-180, le=180)
    to_city: str = Field(..., min_length=2, max_length=100)
    to_lat: float = Field(..., ge=-90, le=90)
    to_lon: float = Field(..., ge=-180, le=180)
    date_time: datetime
    seats_total: int = Field(..., ge=1, le=8)
    price: Optional[float] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=500)

    @field_validator('date_time')
    @classmethod
    def validate_future_date(cls, v):
        # Make comparison timezone-naive to avoid UTC vs local issues
        # Only reject if date is more than 1 day in the past
        from datetime import timedelta
        if v.replace(tzinfo=None) < (datetime.now() - timedelta(days=1)):
            raise ValueError('La fecha del viaje debe ser futura')
        return v


class RideCreate(RideBase):
    pass


class RideResponse(RideBase):
    id: UUID
    driver_id: UUID
    seats_available: int
    created_at: datetime
    driver: Optional[UserResponse] = None

    class Config:
        from_attributes = True


class RideSearchParams(BaseModel):
    from_city: Optional[str] = None
    to_city: Optional[str] = None
    date: Optional[str] = None  # Format: YYYY-MM-DD
    min_seats: Optional[int] = Field(None, ge=1)
    max_price: Optional[float] = Field(None, ge=0)


# ============= BOOKING MODELS =============

class BookingBase(BaseModel):
    ride_id: UUID


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    id: UUID
    rider_id: UUID
    status: Literal["pending", "confirmed", "cancelled"]
    created_at: datetime
    ride: Optional[RideResponse] = None
    rider: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ============= ERROR MODELS =============

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None


# ============= AUTH MODELS =============

class TokenPayload(BaseModel):
    sub: str  # User ID
    email: str
    exp: int
    iat: int
    role: Optional[str] = None


# ============= REVIEW/RATING MODELS =============

class ReviewCreate(BaseModel):
    booking_id: UUID
    subject_id: UUID
    score: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=500)
    role: Literal["rider", "driver"]


class ReviewResponse(BaseModel):
    id: UUID
    booking_id: UUID
    author_id: UUID
    subject_id: UUID
    score: int
    comment: Optional[str] = None
    role: Literal["rider", "driver"]
    created_at: datetime
    author: Optional[UserResponse] = None

    class Config:
        from_attributes = True


# ============= NOTIFICATION MODELS =============

class NotificationCreate(BaseModel):
    """Schema for creating a notification (internal use)."""
    user_id: UUID
    title: str = Field(..., min_length=1, max_length=200)
    body: str = Field(..., min_length=1, max_length=1000)
    type: str = Field(..., min_length=1, max_length=50)
    metadata: Optional[dict] = None


class NotificationResponse(BaseModel):
    """Schema for notification API response."""
    id: UUID
    user_id: UUID
    title: str
    body: str
    type: str
    is_read: bool
    metadata: Optional[dict] = None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedNotificationsResponse(BaseModel):
    """Schema for paginated notifications list."""
    notifications: list[NotificationResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class UnreadCountResponse(BaseModel):
    """Schema for unread notifications count."""
    count: int
