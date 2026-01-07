# 007 - Notification System Specification

## 1. Overview

The Notification System guarantees that users receive timely updates about their
rides, bookings, and account activity. It supports multiple channels (Email,
Push, In-App) to ensure deliverability.

## 2. Notification Channels

| Channel                  | Provider                   | Priority | Use Cases                                            |
| :----------------------- | :------------------------- | :------- | :--------------------------------------------------- |
| **Transactional Email**  | Resend / SendGrid          | High     | Booking confirmations, Password resets, Receipts     |
| **Push Notifications**   | Firebase (FCM) / OneSignal | High     | Real-time updates (Driver arriving, Booking request) |
| **In-App Notifications** | Supabase Realtime          | Medium   | Activity feed, Chat messages, Status updates         |
| **SMS / WhatsApp**       | Twilio (Optional)          | Low      | Urgent overrides (Ride cancelled < 1h before)        |

## 3. Triggers & Templates

### 3.1 Booking Flow

| Event                   | Recipient    | Channel      | Template                                          |
| :---------------------- | :----------- | :----------- | :------------------------------------------------ |
| **New Booking Request** | Driver       | Push + Email | "User X requested to join your ride to [City]"    |
| **Booking Confirmed**   | Rider        | Push + Email | "Your ride to [City] is confirmed! View details." |
| **Booking Rejected**    | Rider        | Push + Email | "Your booking request for [City] was declined."   |
| **Booking Cancelled**   | Counterparty | Push + Email | "Booking for [City] was cancelled by [User]."     |

### 3.2 Ride Updates

| Event              | Recipient      | Channel            | Template                                      |
| :----------------- | :------------- | :----------------- | :-------------------------------------------- |
| **Ride Cancelled** | All Passengers | Push + Email + SMS | "URGENT: Ride to [City] cancelled by driver." |
| **Ride Modified**  | All Passengers | Push               | "Update: Departure time changed to [Time]."   |

## 4. Architecture

### 4.1 Backend Implementation (FastAPI)

- **Producer**: API endpoints produce events (signals) when state changes (e.g.,
  `booking.status` changes to `confirmed`).
- **Consumer**: Background tasks (using `fastapi.BackgroundTasks` or `Celery`)
  process these events.
- **Service Layer**: A `NotificationService` handles logic for selecting
  channels and dispatching messages.

```python
# specific/services/notifications.py
class NotificationService:
    async def send_booking_confirmation(self, user: User, ride: Ride):
        # 1. Send Email
        await email_provider.send(
            to=user.email,
            subject="Booking Confirmed",
            template="booking_confirmed",
            context={"ride": ride}
        )
        # 2. Send Push
        if user.fcm_token:
            await push_provider.send(token=user.fcm_token, message="...")
```

### 4.2 Database Schema

A `notifications` table to track history and read status.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- 'booking_update', 'system_alert', etc.
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 5. Security & Privacy

- **Opt-out**: Users must be able to unsubscribe from non-essential
  notifications (Marketing). Transactional notifications (booking updates) are
  mandatory.
- **Data Minimization**: Do not include PII in push payloads. Send only an ID
  and fetch details in-app.

## 6. Future Expansion

- **Chat System**: Integration with Supabase Realtime for direct driver-rider
  messaging.
- **Batching**: Group non-urgent notifications (e.g., "5 people viewed your
  ride") into daily summaries.
