# Missing Features Analysis & Prioritization

Current Status: The project has a basic "Ride Board" functionality (Create,
Search, Book). Ideally, it needs to evolve into a "Trust Platform".

## 1. Vital (MVP Breakers)

_These features are essential for a functional, trustworthy carpooling loop._

### 1.1 Reputation System (Ratings & Reviews)

- **Gap:** No data models or API for reviews.
- **Why:** Trust is the core currency. Without ratings, passengers won't book
  with strangers.
- **Requirement:**
  - `Review` model (reviewer, reviewee, rating 1-5, comment).
  - API to submit review after trip date.
  - User profile update to show Average Rating.

### 1.2 In-App Messaging

- **Gap:** No messaging infrastructure.
- **Why:** Passengers need to clarify meeting points and luggage space before
  booking. Use of external tools (WhatsApp) breaks the "Safe Platform"
  narrative.
- **Requirement:**
  - `Message` model (from, to, content, timestamp).
  - Simple chat UI in Booking details.

### 1.3 Ride Preferences (The "Details")

- **Gap:** `Ride` model only has basic "From/To/Time/Price".
- **Why:** Matching expectations is key (Smoking, Pets, Music).
- **Requirement:**
  - Add columns to `Ride`: `smoking_allowed`, `pets_allowed`,
    `max_back_seat_capacity`.
  - UI toggles during Ride Publication.

## 2. Important (Post-MVP High Value)

_These features significantly improve safety and monetization._

### 2.1 Booking Modes (Instant vs. Request)

- **Gap:** Current booking logic is singular.
- **Why:** Drivers have different comfort levels. "Request to Book" provides
  safety control. "Instant" provides liquidity.
- **Requirement:**
  - `auto_approval` boolean on Ride.
  - Logic to auto-confirm or set to `pending_approval`.

### 2.2 ID Verification

- **Gap:** Users only have `email`/`phone`.
- **Why:** Safety perception. "Verified Profile" increases conversion.
- **Requirement:**
  - Integration with ID verification provider or manual upload flow (initially).
  - `is_verified` badge on UI.

### 2.3 Stopovers

- **Gap:** Rides are Point A to Point B only.
- **Why:** Drivers miss out on passengers along the route.
- **Requirement:**
  - Complex routing logic to match sub-segments of a trip.

## 3. Nice to Have (Polish)

_Features that refine the experience._

### 3.1 Advanced Search Filters

- **Gap:** Basic search only.
- **Requirement:** Filter by "Pet friendly", "Lowest Price", "Earliest
  Departure".

### 3.2 "Women Only" Toggle

- **Gap:** Missing.
- **Why:** Important safety feature for female demographic.

### 3.3 Cancellation Policies

- **Gap:** Only rudimentary "Cancelled" status.
- **Requirement:** Automated refund calculations based on time-to-departure (if
  payments are integrated).

## Summary of Action Plan

1. **Immediate:** Implement **Reviews** and **Ride Preferences**.
2. **Next:** Build basic **Messaging**.
3. **Future:** ID Verification & Stopovers.
