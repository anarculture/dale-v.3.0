# Bookings Baseline (Existing)

## 1. Context

This specification documents the existing Bookings implementation. It covers the
reservation system for rides.

## 2. Goals

- Document the current booking functionality.
- Define existing API endpoints and frontend pages.

## 3. Requirements

### User Stories

- **As a Passenger**, I can book a seat on a ride.
- **As a Passenger**, I can view my bookings.
- **As a Passenger**, I can cancel a booking.
- **As a Driver**, I can confirm a booking (if logic requires, currently
  manual).

### Backend API

- **Endpoints**:
  - `POST /api/bookings`: Create a booking.
  - `GET /api/bookings`: Get my bookings.
  - `GET /api/bookings/{id}`: Get booking details.
  - `DELETE /api/bookings/{id}`: Cancel booking.
  - `PATCH /api/bookings/{id}/confirm`: Confirm booking (Driver only).

### Frontend

- **Pages**:
  - `/bookings`: List of user's bookings (`BookingList`).
- **Components**:
  - `BookingCard`: Displays booking status and ride info.

## 4. Technical Design

- **Database**: `Booking` table.
- **Logic**:
  - Creating booking decrements `ride.seats_available`.
  - Canceling booking increments `ride.seats_available`.
  - Prevent booking own ride.
  - Prevent duplicate bookings.
  - Status flow: `pending` -> `confirmed` | `cancelled`.

## 5. Verification

- **Manual**:
  - Passenger can book a ride.
  - `seats_available` decreases.
  - Booking appears in `/bookings`.
  - Passenger can cancel, restoring seat.
