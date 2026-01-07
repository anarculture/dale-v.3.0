# 010 - Reputation System Specification

## 1. Overview

The Reputation System establishes trust between strangers by allowing drivers
and riders to rate and review each other after a completed trip.

## 2. Core Mechanics

### 2.1 Rating Scale

- **Stars**: 1 to 5 stars (integer).
- **Review**: Optional text comment (max 500 chars).
- **Tags**: Optional pre-defined tags (e.g., "Good driver", "Punctual", "Clean
  car", "Great conversation").

### 2.2 Eligibility

- **Who can rate?** Only users with a `confirmed` booking for a specific ride.
- **When?**
  - **Start**: After the ride's scheduled arrival time (Ride Date + Approx
    Duration).
  - **End**: 14 days after the ride date.
- **Mutual Blindness**: Users cannot see the other person's review until they
  have submitted their own OR until the 14-day window closes. This prevents
  retaliatory negative reviews.

## 3. Database Schema

```sql
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  author_id UUID NOT NULL REFERENCES users(id),    -- Who wrote the review
  subject_id UUID NOT NULL REFERENCES users(id),   -- Who is being reviewed
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
  comment TEXT,
  role TEXT NOT NULL, -- 'rider' (reviewing a driver) or 'driver' (reviewing a rider)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, author_id) -- Only one review per booking per person
);
```

**Aggregations (Cached on User Profile):**

- `average_rating`: Float (e.g., 4.8).
- `rating_count`: Integer (e.g., 42).

## 4. API Endpoints

| Method | Endpoint                  | Auth | Description                    |
| :----- | :------------------------ | :--- | :----------------------------- |
| `POST` | `/api/users/{id}/reviews` | ✅   | Submit a review for a user.    |
| `GET`  | `/api/users/{id}/reviews` | ❌   | Get public reviews for a user. |

## 5. Trust & Safety

- **Moderation**: Users can report a review if it violates content policy (Hate
  speech, spam).
- **Exclusion**: Reviews from "No Show" bookings might be handled differently
  (e.g., allowed but labeled).

## 6. Frontend Components

- **StarRating**: Interactive component for input / Static for display.
- **ReviewCard**: Shows Avatar, Name, Date, Stars, Comment.
- **ReputationSummary**: Header on profile showing "4.9 ★ (120 reviews)".
