# 🔒 Dale! — Tier-2 Deep Production Readiness Audit

**Date:** 2026-02-27 **Auditor Role:** Senior Release Engineer & Security
Auditor **Stack:** FastAPI · Supabase · Next.js **Scope:** Full deep-read of
`backend/app/` and `frontend/src/`

> This audit assumes all Tier-1 issues (SS-1 through SS-7) have been resolved.

---

## 🔴 TIER-2 SHOWSTOPPERS

These will cause **data corruption, security breaches, or broken features** in
production.

---

### T2-1 · CRITICAL: Race Condition — Double-Booking the Last Seat

| File                                                                                                      | Lines |
| --------------------------------------------------------------------------------------------------------- | ----- |
| [bookings.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/bookings.py#L47-L82) | 47–82 |

```python
# Step 1: READ current seats (line 47)
if ride["seats_available"] <= 0:
    raise HTTPException(...)

# ... other checks happen here ...

# Step 2: WRITE decremented seats (lines 79-82)
new_seats = ride["seats_available"] - 1
db.table("Ride").update({"seats_available": new_seats}).eq("id", ...).execute()
```

**The problem:** This is a classic **TOCTOU (Time-of-Check to Time-of-Use)**
race condition. Between the `SELECT` on line 32 and the `UPDATE` on line 80,
another request can read the same `seats_available` value. If two users book the
last seat simultaneously:

1. User A reads `seats_available = 1` ✓
2. User B reads `seats_available = 1` ✓
3. User A writes `seats_available = 0`
4. User B writes `seats_available = 0` ← **Both succeed, but only 1 seat
   existed!**

**Result:** You end up with **more bookings than seats**. This is your most
dangerous data integrity bug.

The same pattern exists in
[cancel_booking](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/bookings.py#L226-L235)
(lines 226–235), where the increment is also non-atomic.

**Fix:** Use a Supabase RPC function with a PostgreSQL transaction:

```sql
CREATE OR REPLACE FUNCTION book_seat(p_ride_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_seats INTEGER;
BEGIN
  SELECT seats_available INTO v_seats
  FROM "Ride"
  WHERE id = p_ride_id
  FOR UPDATE;  -- Row-level lock

  IF v_seats <= 0 THEN
    RAISE EXCEPTION 'No seats available';
  END IF;

  UPDATE "Ride" SET seats_available = v_seats - 1 WHERE id = p_ride_id;
  RETURN v_seats - 1;
END;
$$ LANGUAGE plpgsql;
```

Then call: `db.rpc("book_seat", {"p_ride_id": ride_id}).execute()`

---

### T2-2 · Internal Exception Details Leaked in Every 500 Response

| Files                                                                                    | Count            |
| ---------------------------------------------------------------------------------------- | ---------------- |
| All route files: `bookings.py`, `rides.py`, `users.py`, `reviews.py`, `notifications.py` | **21 instances** |

Every single route handler has this pattern:

```python
except Exception as e:
    raise HTTPException(status_code=500, detail=f"Error al crear reserva: {str(e)}")
```

**The problem:** `str(e)` can contain:

- Full Supabase connection strings and error details
- Database table names and column names (leaking schema)
- Python tracebacks with file paths (leaking server structure)
- Pydantic validation internals
- Potentially user PII if it was part of the failed operation

This information gives attackers a detailed map of your backend.

**All 21 occurrences:**

| File                                                                                                            | Line                    |
| --------------------------------------------------------------------------------------------------------------- | ----------------------- |
| [bookings.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/bookings.py#L114)          | 114, 136, 176, 262, 335 |
| [rides.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/rides.py#L65)                 | 65, 137, 164, 186, 246  |
| [users.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/users.py#L36)                 | 36, 74, 99              |
| [reviews.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/reviews.py#L140)            | 140, 172                |
| [notifications.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/notifications.py#L62) | 62, 86, 133, 173        |
| [auth.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/middleware/auth.py#L56)               | 56, 62                  |

**Fix:** Log `str(e)` server-side, return a generic message to the client:

```python
except Exception as e:
    logger.exception("Error creating booking")
    raise HTTPException(status_code=500, detail="Error interno del servidor")
```

---

### T2-3 · Public User Endpoint Leaks Email and Phone Number (PII)

| File                                                                                                | Lines |
| --------------------------------------------------------------------------------------------------- | ----- |
| [users.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/users.py#L77-L99) | 77–99 |

```python
@router.get("/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, db: Client = Depends(get_db)):
    response = db.table("User").select("*").eq("id", user_id).execute()
    return UserResponse(**user)
```

The `UserResponse` schema (in
[schemas.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/models/schemas.py#L30-L37))
inherits from `UserBase` which includes:

- `email` (line 14)
- `phone` (line 17)

**The problem:** This endpoint does NOT require authentication. Any anonymous
user can hit `GET /api/users/{uuid}` and get back the user's **email address and
phone number**. This is a **GDPR/PII violation** and a spam/phishing vector.

**Fix:** Create a separate `PublicUserResponse` schema that excludes `email` and
`phone`:

```python
class PublicUserResponse(BaseModel):
    id: UUID
    name: str
    avatar_url: Optional[str] = None
    average_rating: Optional[float] = None
    rating_count: int = 0
    created_at: datetime
```

---

### T2-4 · Edit Ride Page Is 100% Hardcoded Mock Data

| File                                                                                                                       | Lines |
| -------------------------------------------------------------------------------------------------------------------------- | ----- |
| [edit/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/rides/%5Bid%5D/edit/page.tsx#L22-L55) | 22–55 |

```typescript
// Mock data for demo
const mockRide: RideData = {
    id: "1",
    origin: "Caracas",
    destination: "Valencia",
    date: "2025-01-10",
    time: "08:00",
    seats: 3,
    price: 25,
    notes: "Acepto mascotas pequeñas...",
};
```

Both `handleSubmit` and `handleDelete` do nothing but `console.log`:

```typescript
const handleSubmit = () => {
    // TODO: Call API to update ride
    console.log("Saving ride:", formData);
    router.push(`/rides/${rideId}`); // ← Navigates away, pretending it saved!
};

const handleDelete = () => {
    // TODO: Call API to delete ride
    console.log("Deleting ride:", rideId);
    router.push("/rides"); // ← Navigates away, pretending it deleted!
};
```

**Result in production:**

- Every ride always shows "Caracas → Valencia" when editing, regardless of
  actual data
- Clicking "Guardar cambios" does nothing but redirect — user thinks it saved
- Clicking "Eliminar viaje" does nothing but redirect — ride still exists
- The page says "Los pasajeros que hayan reservado serán notificados" — a lie

---

### T2-5 · Ride Booking Silently Swallows Errors

| File                                                                                                                        | Lines |
| --------------------------------------------------------------------------------------------------------------------------- | ----- |
| [rides/[id]/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/rides/%5Bid%5D/page.tsx#L38-L52) | 38–52 |

```typescript
const handleBook = async () => {
    setBookingLoading(true);
    try {
        await apiClient.createBooking(ride!.id);
        router.push("/bookings");
    } finally { // ← No catch block!
        setBookingLoading(false);
    }
};
```

**The problem:** There is no `catch` block. If the booking fails (no seats,
already booked, network error), the error propagates unhandled to React's error
boundary. The user sees a generic crash screen instead of a helpful error
message like "No hay plazas disponibles."

---

### T2-6 · Hardcoded Zero Coordinates in "Offer Ride" Page

| File                                                                                                          | Lines |
| ------------------------------------------------------------------------------------------------------------- | ----- |
| [offer/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/offer/page.tsx#L39-L50) | 39–50 |

```typescript
await apiClient.createRide({
    from_city: data.from_city,
    from_lat: 0, // Will be geocoded on backend or updated later
    from_lon: 0,
    to_city: data.to_city,
    to_lat: 0,   // Will be geocoded on backend or updated later
    to_lon: 0,
    ...
});
```

**The problem:** The comment says "Will be geocoded on backend or updated later"
— but the backend does **no geocoding**. It stores these zeros directly. Every
ride in production will have `lat=0, lon=0` (a point in the Atlantic Ocean off
the coast of Ghana). If you ever add a map view or distance calculation, **all
rides will appear at coordinate (0,0)**.

---

### T2-7 · Global Mutable Singleton Supabase Client — Unsafe for Async Concurrency

| File                                                                                                    | Lines |
| ------------------------------------------------------------------------------------------------------- | ----- |
| [database.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/utils/database.py#L9-L32) | 9–32  |

```python
_supabase_client: Optional[Client] = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is None:
        _supabase_client = create_client(supabase_url, supabase_key)
    return _supabase_client
```

**The problem:** `global _supabase_client` is a module-level mutable variable
initialized on first access without any locking. In FastAPI's async event loop,
if two requests arrive simultaneously before the client is initialized,
`create_client` could be called twice, with the second overwriting the first.
More importantly, all concurrent requests **share the same Supabase client
instance**, meaning any client-level state (auth headers, in-flight requests)
could leak between users.

**Risk level:** Medium — in practice, the Supabase Python client is likely
thread-safe enough for read operations, but this pattern is architecturally
fragile and becomes a real bug if the client ever holds per-request state.

---

## 🟡 ZOMBIE FEATURES & MOCKS

Logic paths that pretend to work but are empty shells.

---

### ZF-1 · Notification Settings Page — 100% Zombie

| File                                                                                                                          | Line |
| ----------------------------------------------------------------------------------------------------------------------------- | ---- |
| [settings/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/notifications/settings/page.tsx#L60) | 60   |

```typescript
// TODO: Call API to save preferences
```

The entire notification settings page renders Push/Email/SMS toggles for 3
categories (Trips, Chat, Promotions = 9 toggles). **None of them persist.** The
toggles change React state only — there is no API endpoint, no database table
for preferences, and no backend logic to read them. Refreshing the page resets
every toggle to defaults.

Additionally, the page promises "SMS" notifications, but no SMS integration
(Twilio/similar) exists anywhere in the codebase.

---

### ZF-2 · "Enviar Mensaje" Button — No Messaging System Exists

| File                                                                                                                        | Lines |
| --------------------------------------------------------------------------------------------------------------------------- | ----- |
| [users/[id]/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/users/%5Bid%5D/page.tsx#L68-L71) | 68–71 |

```typescript
const handleMessageClick = () => {
    // TODO: Navigate to messaging screen
    console.log("Message user:", userId);
};
```

The public profile page prominently shows a "Enviar mensaje" button. Clicking it
does nothing visible — it logs to console. There is no messaging feature, no
chat API, no messages table in the database. Users who click this will think the
app is broken.

---

### ZF-3 · "Conductor verificado" Badge — No Verification System Exists

| File                                                                                                                        | Lines |
| --------------------------------------------------------------------------------------------------------------------------- | ----- |
| [users/[id]/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/users/%5Bid%5D/page.tsx#L36-L39) | 36–39 |
| [rides/[id]/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/rides/%5Bid%5D/page.tsx#L166)    | 166   |

```typescript
// Public profile page:
setUser({
    ...userData,
    isDriver: true, // Will be determined by whether they have rides
    bio: undefined, // Backend doesn't have bio yet
});
```

Every user who has published any ride gets a "Conductor verificado" badge with a
blue checkmark. There is no ID verification, no license check, no admin approval
flow. **The badge is meaningless** and could create a false sense of safety for
riders.

On the ride detail page (line 166), the driver info section hardcodes
`"Conductor verificado"` for every single driver, unconditionally.

---

### ZF-4 · Dead `_check_review_visibility` Function

| File                                                                                                      | Lines   |
| --------------------------------------------------------------------------------------------------------- | ------- |
| [reviews.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/reviews.py#L226-L252) | 226–252 |

The function `_check_review_visibility(db, review, ride)` on line 226 is an
older implementation that is **never called**. The actual code uses
`_check_review_visibility_simple(db, review)` on line 166. This dead function is
confusing and could mislead future developers.

---

### ZF-5 · `require_role` Dependency Never Used — No Role Enforcement

| File                                                                                                   | Lines  |
| ------------------------------------------------------------------------------------------------------ | ------ |
| [auth.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/middleware/auth.py#L96-L116) | 96–116 |

The `require_role("driver")` factory is defined but **never imported or used**
by any route. The `POST /api/rides` endpoint (create ride) uses
`get_current_user` instead — meaning **any authenticated user can create
rides**, regardless of their role. The role system is effectively decorative.

Also note that
[TokenPayload](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/models/schemas.py#L119-L124)
reads the `role` from the JWT, but Supabase's default JWT structure puts role
info in `app_metadata.role`, not at the top level. Unless you've customized the
JWT hook, `user.role` will always be `None`, and `require_role` would always
fall back to `"rider"`.

---

## 🔵 DATA PRIVACY & CONCURRENCY RISKS

---

### DP-1 · User Phone Number Has No Validation on Update

| File                                                                                                    | Lines |
| ------------------------------------------------------------------------------------------------------- | ----- |
| [schemas.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/models/schemas.py#L24-L27) | 24–27 |

```python
class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None
    phone: Optional[str] = None  # ← No pattern validation!
```

Compare with `UserBase` (line 17) which has `pattern=r"^\+?[1-9]\d{1,14}$"`. The
update schema accepts **any string** as a phone number. A user could set their
phone to `"<script>alert(1)</script>"` or any arbitrary text. This is both a
data quality issue and a potential XSS vector if phone numbers are ever rendered
unescaped.

---

### DP-2 · Validation Error Handler Leaks Internal Field Paths

| File                                                                                        | Lines  |
| ------------------------------------------------------------------------------------------- | ------ |
| [main.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/main.py#L83-L103) | 83–103 |

```python
for error in exc.errors():
    field = " -> ".join([str(loc) for loc in error["loc"]])
    errors.append({
        "field": field,
        "message": error["msg"],
        "type": error["type"]
    })
```

The `field` value exposes internal Pydantic model structure like
`"body -> ride_id"` or `"body -> phone"`. The `error["type"]` reveals validation
rule types like `"string_pattern_mismatch"`, giving attackers clues about your
validation logic. Consider returning user-friendly field names only.

---

### DP-3 · `print()` Debug Statements Leaking to Production Logs

| File                                                                                                 | Line | Content                                           |
| ---------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------- |
| [reviews.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/reviews.py#L222) | 222  | `print(f"Error checking review visibility: {e}")` |
| [reviews.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/reviews.py#L278) | 278  | `print(f"Error updating user rating: {e}")`       |

These are raw `print()` calls (not `logger.error()`), so they'll appear in
stdout with no timestamp, severity level, or request context. Worse,
`_update_user_rating` on line 278 catches the exception and prints it but **does
not re-raise** — meaning the rating silently fails to update and the user gets a
200 OK response suggesting everything worked.

---

### DP-4 · Review Visibility Logic Defaults to "Show" on Every Error

| File                                                                                                      | Lines   |
| --------------------------------------------------------------------------------------------------------- | ------- |
| [reviews.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/reviews.py#L189-L223) | 189–223 |

```python
if not booking_id:
    return True  # If no booking_id, show by default

# ...
if not booking_response.data:
    return True  # If we can't find the booking, show by default

# ...
except Exception as e:
    print(f"Error checking review visibility: {e}")
    return True  # If there's any error, show by default
```

The "Mutual Blindness" review system (where reviews are hidden until both
parties review) **always defaults to showing** the review when anything goes
wrong. This means a database error, a missing booking, or any exception will
**bypass the mutual blindness rule** and show reviews that should be hidden —
violating the fairness contract with users.

---

### DP-5 · Public Profile Fetches ALL Rides Then Filters Client-Side

| File                                                                                                                        | Lines |
| --------------------------------------------------------------------------------------------------------------------------- | ----- |
| [users/[id]/page.tsx](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/frontend/src/app/users/%5Bid%5D/page.tsx#L47-L49) | 47–49 |

```typescript
const allRides = await apiClient.searchRides();
const userRides = allRides.filter((ride) => ride.driver_id === userId);
```

To show a user's published rides, the page fetches **every ride in the entire
database** then filters client-side. As the platform grows, this will:

- Return potentially thousands of ride records (with full driver info each)
- Leak other users' ride details to anyone viewing a profile
- Cause significant latency and bandwidth consumption

**Fix:** Add a `driver_id` filter to the `searchRides` API or create a dedicated
`GET /api/users/{id}/rides` endpoint.

---

### DP-6 · `ilike` Search Without Input Sanitization

| File                                                                                                  | Lines   |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [rides.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/rides.py#L103-L106) | 103–106 |

```python
if from_city:
    query = query.ilike("from_city", f"%{from_city}%")
```

The `from_city` and `to_city` search parameters are directly interpolated into
an `ilike` pattern. While Supabase's client library parameterizes the query
(preventing SQL injection), the `%` and `_` characters in PostgreSQL `ILIKE` are
**pattern wildcards**. A user searching for `%` would match every single ride.
Searching for `_` would match any single character. This allows enumeration of
all rides regardless of filters.

---

### DP-7 · Booking Deletion After Ride Delete May Create Orphaned Notifications

| File                                                                                                  | Lines   |
| ----------------------------------------------------------------------------------------------------- | ------- |
| [rides.py](file:///home/anarculture/Downloads/DALE3/dale-v.3.0/backend/app/routes/rides.py#L225-L239) | 225–239 |

```python
# Line 226: Delete ride first
db.table("Ride").delete().eq("id", ride_id).execute()

# Lines 230-239: Then try to notify passengers (in background task)
async def send_ride_cancellation_notifications():
    notification_service = NotificationService(db)
    for passenger_id in passenger_ids:
        await notification_service.notify_ride_cancelled(...)
```

The ride is deleted **before** notifications are sent. Since notifications store
`ride_id` as metadata, the notification will reference a ride that no longer
exists. If the user clicks the notification to view ride details, they'll get
a 404. Additionally, if the background task fails partway through the passenger
list, some riders will be notified and others won't — with no retry mechanism.

---

## 📋 Summary & Priority Matrix

| Priority | ID   | Category       | Fix Effort | Impact                                       |
| -------- | ---- | -------------- | ---------- | -------------------------------------------- |
| 🔴 P0    | T2-1 | Race Condition | 2h         | Double-booking corrupts seat counts          |
| 🔴 P0    | T2-2 | Info Leak      | 1h         | Internal details in every error response     |
| 🔴 P0    | T2-3 | PII Leak       | 30min      | Email + phone exposed to anonymous users     |
| 🔴 P0    | T2-4 | Zombie         | 4h         | Edit page uses mock data, lies about saving  |
| 🔴 P1    | T2-5 | UX Bug         | 15min      | Booking errors crash the page                |
| 🔴 P1    | T2-6 | Bad Data       | 30min      | All rides stored at (0°,0°)                  |
| 🟡 P2    | T2-7 | Concurrency    | 1h         | Singleton init race (theoretical)            |
| 🟡 P2    | ZF-1 | Zombie         | N/A        | Settings page is 100% fake                   |
| 🟡 P2    | ZF-2 | Zombie         | N/A        | Message button does nothing                  |
| 🟡 P2    | ZF-3 | Zombie         | 30min      | "Verified" badge is fake                     |
| 🟡 P3    | ZF-4 | Dead Code      | 5min       | Unused review function                       |
| 🟡 P3    | ZF-5 | Zombie         | 30min      | Role enforcement never applied               |
| 🔵 P2    | DP-1 | Validation     | 5min       | Phone number accepts any string              |
| 🔵 P2    | DP-2 | Info Leak      | 15min      | Pydantic field paths in 422 errors           |
| 🔵 P2    | DP-3 | Logging        | 10min      | `print()` debug in production                |
| 🔵 P2    | DP-4 | Logic Bug      | 30min      | Review blindness defaults to "show" on error |
| 🔵 P2    | DP-5 | Performance    | 1h         | Fetches entire rides table for profile       |
| 🔵 P3    | DP-6 | Fuzzing        | 15min      | Wildcard chars bypass search filters         |
| 🔵 P3    | DP-7 | Data Integrity | 1h         | Notifications reference deleted rides        |
