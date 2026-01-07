# 008 - Error Handling Standards

## 1. Overview

This document defines the standard for error handling, logging, and client
responses across the Dale platform (FastAPI Backend + Next.js Frontend). The
goal is to provide consistent, debuggable, and user-friendly error experiences.

## 2. Backend Error Handling (FastAPI)

### 2.1 HTTP Status Codes

We adhere to standard HTTP semantics:

| Code    | Status         | Meaning      | Use Case                                                                            |
| :------ | :------------- | :----------- | :---------------------------------------------------------------------------------- |
| **200** | OK             | Success      | Successful GET, PUT, PATCH.                                                         |
| **201** | Created        | Success      | Successful POST (Ride created, Booking created).                                    |
| **204** | No Content     | Success      | Successful DELETE.                                                                  |
| **400** | Bad Request    | Client Error | Validation error, malformed JSON, business rule violation (e.g., booking own ride). |
| **401** | Unauthorized   | Auth Error   | Missing or invalid JWT.                                                             |
| **403** | Forbidden      | Auth Error   | Valid JWT but insufficient permissions (e.g., deleting someone else's ride).        |
| **404** | Not Found      | Client Error | Resource does not exist.                                                            |
| **409** | Conflict       | Client Error | Resource state conflict (e.g., no seats available, already booked).                 |
| **422** | Unprocessable  | Client Error | Pydantic validation failure (auto-handled by FastAPI).                              |
| **500** | Internal Error | Server Error | Unhandled exceptions.                                                               |

### 2.2 Standard Error Response Structure

All error responses must follow this JSON structure:

```json
{
    "error": {
        "code": "BOOKING_CONFLICT",
        "message": "This ride is already full.",
        "details": {
            "seats_available": 0,
            "requested": 1
        }
    }
}
```

- **code**: Upper-snake-case machine-readable code.
- **message**: Human-readable message (safe for UI display in most cases, but UI
  should preferably translate codes).
- **details**: Optional dictionary with extra context.

### 2.3 Exception Classes

Create a base `AppException` and subclass it for specific scenarios.

```python
class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400, details: dict = None):
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details

class RideFullError(AppError):
    def __init__(self):
        super().__init__(
            code="RIDE_FULL",
            message="This ride has no available seats.",
            status_code=409
        )
```

## 3. Frontend Error Handling (Next.js)

### 3.1 Global Error Boundary

Implement a Global Error Boundary in `app/error.tsx` to catch crash-level errors
and display a "Something went wrong" UI with a retry button.

### 3.2 API Error Handling

Use a centralized Fetch wrapper or Axios interceptor to parse the standard error
JSON.

```typescript
// utils/api.ts
async function fetchAPI(...) {
  const res = await fetch(...);
  if (!res.ok) {
    const data = await res.json();
    throw new ApiError(data.error.code, data.error.message, res.status);
  }
  return res.json();
}
```

### 3.3 User Feedback (Toast Notifications)

Use `sonner` to display transient errors.

- **Validation Errors (400/422)**: Show specific field error if possible, or a
  summary toast "Please check the form."
- **Business Errors (409)**: "Ride is full."
- **Server Errors (500)**: "Service temporarily unavailable. Please try again
  later."

## 4. Logging Standards

### 4.1 Format

Logs must be structured JSON for easy parsing by monitoring tools (e.g.,
Datadog, CloudWatch).

```json
{
    "level": "ERROR",
    "timestamp": "2026-01-08T10:00:00Z",
    "service": "backend-api",
    "request_id": "req-12345",
    "user_id": "user-uuid",
    "path": "/api/bookings",
    "message": "RideFullError: Attempted to book full ride",
    "stack_trace": "..."
}
```

### 4.2 Logging Levels

- **DEBUG**: Detailed variable states (dev only).
- **INFO**: Key events (Startup, Auth success, Job completion).
- **WARNING**: Recoverable issues (Retries, Deprecated usage).
- **ERROR**: Exceptions that failed a request but the service is alive.
- **CRITICAL**: Service-ending failures (DB connection lost).
