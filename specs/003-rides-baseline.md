# Rides Baseline (Existing)

## 1. Context

This specification documents the existing Rides implementation. It covers the
creation, search, and management of carpooling rides.

## 2. Goals

- Document the current rides functionality.
- Define existing API endpoints and frontend pages.

## 3. Requirements

### User Stories

- **As a Driver**, I can publish a new ride (Offer).
- **As a Driver**, I can view my published rides.
- **As a Driver**, I can delete a ride I published.
- **As a Passenger**, I can search for rides by city, date, and seats.
- **As a Passenger**, I can view ride details.

### Backend API

- **Endpoints**:
  - `POST /api/rides`: Create a ride (Driver only).
  - `GET /api/rides`: Search rides (Filters: from, to, date, seats, price).
  - `GET /api/rides/{id}`: Get ride details.
  - `GET /api/rides/my/rides`: Get rides created by current user.
  - `DELETE /api/rides/{id}`: Delete a ride (Owner only).

### Frontend

- **Pages**:
  - `/offer`: Form to create a ride (`OfferRideForm`).
  - `/rides`: Search interface (`RideSearchForm`) and results list (`RideList`).
- **Components**:
  - `RideCard`: Displays ride summary.
  - `RideSearchForm`: Inputs for filtering.

## 4. Technical Design

- **Database**: `Ride` table.
- **Logic**:
  - `seats_available` initialized to `seats_total`.
  - Search filters applied via Supabase query builder.
  - Date filtering handles specific day range.

## 5. Verification

- **Manual**:
  - Driver can create a ride.
  - Passenger can find that ride in search.
  - Driver can delete the ride.
