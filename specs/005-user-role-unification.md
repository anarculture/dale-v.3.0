# User Role Unification

## 1. Context

The original system had two distinct user roles: `driver` and `rider`. This
created artificial separation where users had to choose one role, unlike
platforms such as BlaBlaCar where any user can both publish rides and book rides
interchangeably.

This spec documents the architectural change to unify these roles into a single
user type.

## 2. Goals

- Allow any authenticated user to publish rides (previously driver-only)
- Allow any authenticated user to book rides (already permitted)
- Remove role-based restrictions from the API
- Simplify the user model

## 3. Requirements

### User Stories

- **As a User**, I can publish a ride offer without needing a special "driver"
  role.
- **As a User**, I can book a seat on another user's ride.
- **As a User**, I can do both actions with the same account.

### Acceptance Criteria

- [x] `POST /api/rides` accepts requests from any authenticated user (no role
      check)
- [x] `role` field removed from `UserBase` and `UserUpdate` Pydantic schemas
- [x] `role` field removed from frontend `User` TypeScript interface
- [x] Existing tests pass after changes

## 4. Technical Design

### Files Modified

| File                            | Change                                        |
| ------------------------------- | --------------------------------------------- |
| `backend/app/routes/rides.py`   | `require_role("driver")` → `get_current_user` |
| `backend/app/models/schemas.py` | Removed `role` from `UserBase`, `UserUpdate`  |
| `frontend/src/lib/api.ts`       | Removed `role` from `User` interface          |
| `backend/tests/conftest.py`     | Removed `role` from test fixture              |

### Backward Compatibility

- `require_role()` function kept in `auth.py` (deprecated, unused)
- `role` field in `TokenPayload` kept (unused but harmless)
- Database `role` column not deleted (can be cleaned up in future migration)

## 5. Implementation Plan

- [x] Remove `require_role("driver")` from ride creation endpoint
- [x] Remove `role` field from Pydantic schemas
- [x] Remove `role` field from frontend TypeScript interface
- [x] Update test fixtures
- [x] Run backend tests
- [x] Verify frontend TypeScript compilation

## 6. Verification

### Automated

```bash
# Backend tests
cd backend && python3 -m pytest tests/ -v

# Frontend type check
cd frontend && npx tsc --noEmit
```

### Manual

1. Log in as any user
2. Navigate to `/offer` and create a ride → Should succeed (no 403)
3. Navigate to `/rides` and book another user's ride → Should succeed
