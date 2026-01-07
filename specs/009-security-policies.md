# 009 - Security Policies

## 1. Overview

This document outlines the security architecture and policies for the Dale
platform, ensuring data protection, secure authentication, and authorization
integrity.

## 2. Authentication & Authorization

### 2.1 JWT Validation

- **Provider**: Supabase Auth (GoTrue).
- **Algorithm**: HS256.
- **Verification**: All backend endpoints must verify:
  1. **Signature**: Using `SUPABASE_JWT_SECRET`.
  2. **Audience**: Must be `authenticated`.
  3. **Expiration**: Token must not be expired.

### 2.2 Row Level Security (RLS)

Direct Supabase database access (if used by Edge Functions or Frontend) must be
protected by RLS policies. Even though our FastAPI backend uses the Service Role
key (bypassing RLS), we **must** maintain robust RLS policies as a
defense-in-depth measure and for future direct-to-db features.

- **Users Table**:
  - `SELECT`: Public (for profiles).
  - `UPDATE`: Users can only update their own row (`auth.uid() = id`).
- **Rides Table**:
  - `SELECT`: Public.
  - `INSERT/UPDATE/DELETE`: Drivers can only manage their own rides
    (`auth.uid() = driver_id`).
- **Bookings Table**:
  - `SELECT`: Users can see their own bookings OR bookings for rides they drive.
  - `INSERT`: Authenticated users.

## 3. API Security

### 3.1 CORS (Cross-Origin Resource Sharing)

- **Allowed Origins**:
  - Localhost: `http://localhost:3000`
  - Production: `https://dale-app.com`, `https://www.dale-app.com`
- **Methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS.
- **Headers**: Authorization, Content-Type.

### 3.2 Rate Limiting

(Future Implementation)

- Global limit: 100 requests/minute per IP.
- Auth endpoints: 10 requests/minute (brute-force protection).

### 3.3 Input Validation

- **Pydantic Models**: All incoming data MUST be validated against strict
  Pydantic schemas.
- **Sanitization**: No HTML allowed in text fields (notes, messages) to prevent
  XSS.

## 4. Data Privacy

### 4.1 PII Handling

- **Phone Numbers**: Stored but only revealed to confirmed bookings.
- **Email**: Never exposed publicly in API responses.
- **Location**: Exact coordinates stored, but frontend displays
  City/Neighborhood, not exact street address until booking confirmation.

### 4.2 Data Deletion

- Users have the "Right to be Forgotten".
- Deleting an account cascades to delete their published rides.
- Bookings are preserved (anonymized) for audit logs if legally required,
  otherwise deleted.

## 5. Infrastructure Security

### 5.1 Secrets Management

- **Production**: Use environment variables (Vercel Env Vars, Railway
  Variables).
- **Development**: `.env` file (gitignored).
- **Rotation**: JWT Secrets should be rotated annually or upon compromise.

### 5.2 Dependency Management

- Regular `npm audit` and `pip-audit`.
- Dependabot alerts enabled in GitHub.
