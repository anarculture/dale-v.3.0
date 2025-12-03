# Authentication Baseline (Existing)

## 1. Context

This specification documents the existing Authentication implementation in Dale
v3. It serves as a baseline for future changes. The system uses Supabase Auth
for identity management and JWT tokens for backend authorization.

## 2. Goals

- Document the current authentication flow.
- Define existing API endpoints and frontend context.

## 3. Requirements

### User Stories

- **As a User**, I can sign up with email and password.
- **As a User**, I can log in with email and password.
- **As a User**, I can log out.
- **As a User**, I can view and update my profile.
- **As a Developer**, I can protect backend routes using JWT tokens.

### Backend API

- **Middleware**:
  - `get_current_user`: Validates Supabase JWT and returns `TokenPayload`.
  - `require_role(role)`: Enforces 'driver' or 'rider' role.
- **Endpoints**:
  - `GET /api/me`: Get current user profile.
  - `PATCH /api/me`: Update current user profile (name, avatar, role).
  - `GET /api/users/{id}`: Get public profile of a user.

### Frontend

- **AuthContext**:
  - Manages `user` state (Supabase User).
  - Provides `signUp`, `signIn`, `signOut`, `getToken` methods.
  - Persists session via Supabase client.
- **Pages**:
  - `/login`: Login form.
  - `/signup`: Registration form.
  - `/profile`: Profile management (uses `/api/me`).

## 4. Technical Design

- **Auth Provider**: Supabase Auth.
- **Token**: JWT (HS256) signed by Supabase.
- **Backend Validation**: `pyjwt` library verifying signature with
  `SUPABASE_JWT_SECRET`.
- **Database**: `User` table in public schema, synced with Supabase `auth.users`
  (conceptually, though currently managed via API).

## 5. Verification

- **Manual**:
  - Login/Signup flows work on frontend.
  - Protected API endpoints return 401 without token.
  - Protected API endpoints return 200 with valid token.
