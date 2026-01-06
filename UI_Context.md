# Dale App – UI/UX Blueprint

> **Purpose:** This document provides strict data contracts, branding
> guidelines, and design tokens that **must** be followed when generating UI
> components. All validation rules are derived from backend Pydantic schemas.

---

## 0. Brand Identity

### Logo

- **Wordmark:** `dale!` (lowercase with exclamation mark)
- **Logo style:** Rounded corners, white background, bold black text
- **Visual mascot:** 3D thumbs-up emoji with orange gradient background

### PWA Configuration

| Property      | Value                            |
| ------------- | -------------------------------- |
| Display       | `standalone` (no browser chrome) |
| Orientation   | `portrait`                       |
| Theme Color   | `#fd5810` (Primary Orange)       |
| Background    | `#fffbf3` (Cream)                |
| Touch Targets | min 44×44px                      |
| Language      | `es` (Spanish)                   |

---

## 1. Strict Data Contracts (from `schemas.py`)

### 1.1 Entity: User

| Field        | Type                  | Constraints                                                   | UI Rule                                                         |
| ------------ | --------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| `email`      | `string`              | `pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"` | Use `type="email"` with regex validation                        |
| `name`       | `string`              | `min_length=2, max_length=100`                                | Input: `minLength={2}` `maxLength={100}`, show char counter     |
| `avatar_url` | `string \| null`      | Optional                                                      | Optional file/URL input                                         |
| `role`       | `"rider" \| "driver"` | Default: `"rider"`                                            | **Radio group** or **Segmented control** with exactly 2 options |

### 1.2 Entity: Ride

| Field         | Type             | Constraints                    | UI Rule                                                    |
| ------------- | ---------------- | ------------------------------ | ---------------------------------------------------------- |
| `from_city`   | `string`         | `min_length=2, max_length=100` | Text input with autocomplete (city search)                 |
| `from_lat`    | `float`          | `ge=-90, le=90`                | Hidden input, populated via geocoding                      |
| `from_lon`    | `float`          | `ge=-180, le=180`              | Hidden input, populated via geocoding                      |
| `to_city`     | `string`         | `min_length=2, max_length=100` | Text input with autocomplete (city search)                 |
| `to_lat`      | `float`          | `ge=-90, le=90`                | Hidden input, populated via geocoding                      |
| `to_lon`      | `float`          | `ge=-180, le=180`              | Hidden input, populated via geocoding                      |
| `date_time`   | `datetime`       | Must be **future date**        | Date-time picker with `min={new Date().toISOString()}`     |
| `seats_total` | `int`            | `ge=1, le=8`                   | **Number input** or **Stepper**: `min={1}` `max={8}`       |
| `price`       | `float \| null`  | Optional, `ge=0`               | Number input: `min={0}`, show currency symbol, allow empty |
| `notes`       | `string \| null` | `max_length=500`               | Textarea: `maxLength={500}`, show char counter             |

**Validator:**

```
@field_validator('date_time')
def validate_future_date(cls, v):
    if v < datetime.now():
        raise ValueError('La fecha del viaje debe ser futura')
```

→ **Frontend:** Disable past dates in date picker; display error: _"La fecha del
viaje debe ser futura"_

### 1.3 Entity: Booking

| Field     | Type                                      | Constraints | UI Rule                          |
| --------- | ----------------------------------------- | ----------- | -------------------------------- |
| `ride_id` | `UUID`                                    | Required    | Hidden, passed from ride context |
| `status`  | `"pending" \| "confirmed" \| "cancelled"` | —           | Badge/chip with status colors    |

### 1.4 Enums Reference

| Enum             | Allowed Values                            | UI Component              |
| ---------------- | ----------------------------------------- | ------------------------- |
| `User.role`      | `"rider"`, `"driver"`                     | Segmented control / Radio |
| `Booking.status` | `"pending"`, `"confirmed"`, `"cancelled"` | Status badge with colors  |

**Status Badge Colors:**

- `pending` → `accent` (#ffa53c)
- `confirmed` → `success` (#10B981)
- `cancelled` → `error` (#EF4444)

---

## 2. Design System Tokens (Brand Guidelines)

### 2.1 Color Palette

| Token       | Hex       | Usage                                   |
| ----------- | --------- | --------------------------------------- |
| `primary`   | `#fd5810` | CTAs, links, active states, theme color |
| `secondary` | `#fc5e59` | Accents, coral highlights               |
| `accent`    | `#ffa53c` | Warm highlights, amber tones            |
| `surface`   | `#fffbf3` | Backgrounds, cream base                 |
| `success`   | `#10B981` | Confirmations, positive feedback        |
| `error`     | `#EF4444` | Errors, destructive actions             |
| `warning`   | `#ffa53c` | Pending states, alerts (use accent)     |
| `text`      | `#1a1a1a` | Primary text (near-black)               |

**Gradient (for cards/buttons):**

```css
background: linear-gradient(135deg, #fd5810 0%, #ffa53c 100%);
```

### 2.2 UI Library Stack

| Library           | Usage                                       |
| ----------------- | ------------------------------------------- |
| **HeroUI**        | Primary component library (formerly NextUI) |
| **Lucide React**  | Icon library (`lucide-react`)               |
| **Framer Motion** | Animations and transitions                  |

### 2.3 Spacing & Shape Tokens

| Token               | Value                             | Usage                    |
| ------------------- | --------------------------------- | ------------------------ |
| `borderRadius.xl`   | `16px`                            | Card corners, inputs     |
| `borderRadius.2xl`  | `24px`                            | Modals, large cards      |
| `borderRadius.full` | `9999px`                          | Pills, avatars           |
| `shadow.card`       | `0 4px 16px rgba(253,88,16,0.12)` | Default card (warm tint) |
| `shadow.card-hover` | `0 8px 24px rgba(253,88,16,0.18)` | Hover state elevation    |

### 2.4 Typography

| Token        | Value                                        |
| ------------ | -------------------------------------------- |
| `fontFamily` | `['Agrandir', 'Inter', 'system-ui', 'sans']` |
| `headings`   | **Agrandir Bold**                            |
| `body`       | Agrandir Regular                             |
| `fallback`   | Inter (for system compatibility)             |

---

## 3. API & Search Logic

### 3.1 RideSearchParams → Search Filter UI

Source: `RideSearchParams` Pydantic model

| Parameter   | Type             | Constraints        | UI Component                      |
| ----------- | ---------------- | ------------------ | --------------------------------- |
| `from_city` | `string \| null` | Optional           | Text input with city autocomplete |
| `to_city`   | `string \| null` | Optional           | Text input with city autocomplete |
| `date`      | `string \| null` | Format: YYYY-MM-DD | Date picker (future dates only)   |
| `min_seats` | `int \| null`    | `ge=1`             | Number input or dropdown (1-8)    |
| `max_price` | `float \| null`  | `ge=0`             | Number input with currency symbol |

**Search Filter Component Spec:**

```tsx
<SearchFilters>
    <CityAutocomplete name="from_city" label="Desde" />
    <CityAutocomplete name="to_city" label="Hasta" />
    <DatePicker name="date" label="Fecha" minDate={today} />
    <NumberInput name="min_seats" label="Asientos mínimos" min={1} max={8} />
    <NumberInput name="max_price" label="Precio máximo" min={0} prefix="$" />
</SearchFilters>;
```

---

## 4. Frontend Architecture

### 4.1 Framework Stack

| Technology     | Version | Notes                      |
| -------------- | ------- | -------------------------- |
| **Next.js**    | 16.x    | App Router architecture    |
| **React**      | 19.x    | Latest concurrent features |
| **TypeScript** | 5.x     | Strict mode enabled        |

### 4.2 Key Dependencies

| Package                   | Purpose                          |
| ------------------------- | -------------------------------- |
| `@heroui/react`           | UI component library             |
| `lucide-react`            | Icon system                      |
| `sonner`                  | **Toast notifications** (errors) |
| `framer-motion`           | Animations                       |
| `@supabase/supabase-js`   | Auth & database client           |
| `clsx` + `tailwind-merge` | Class utilities                  |

### 4.3 Error Handling Pattern

Use `sonner` for all user-facing error messages:

```tsx
import { toast } from "sonner";

// API error handling
try {
    await createRide(data);
    toast.success("Viaje creado exitosamente");
} catch (error) {
    toast.error(error.message || "Error al crear el viaje");
}
```

---

## 5. Validation Rules Summary (Quick Reference)

| Field         | Rule               | Error Message (ES)                              |
| ------------- | ------------------ | ----------------------------------------------- |
| `email`       | Valid email format | "Email inválido"                                |
| `name`        | 2-100 characters   | "El nombre debe tener entre 2 y 100 caracteres" |
| `seats_total` | 1-8                | "Debe ser entre 1 y 8 asientos"                 |
| `price`       | ≥ 0 (if provided)  | "El precio no puede ser negativo"               |
| `notes`       | ≤ 500 characters   | "Las notas no pueden exceder 500 caracteres"    |
| `date_time`   | Future date        | "La fecha del viaje debe ser futura"            |
| `from_city`   | 2-100 characters   | "Ciudad inválida"                               |
| `to_city`     | 2-100 characters   | "Ciudad inválida"                               |

---

## 6. Card Component Pattern

All ride cards must follow this pattern:

```tsx
<Card className="rounded-2xl shadow-card hover:shadow-card-hover transition-shadow">
    <CardHeader>
        <div className="flex items-center gap-2">
            <MapPin className="text-primary" />
            <span>{ride.from_city} → {ride.to_city}</span>
        </div>
    </CardHeader>
    <CardBody>
        <StatusBadge status={booking?.status} />
        <SeatsDisplay
            available={ride.seats_available}
            total={ride.seats_total}
        />
        {ride.price && <PriceDisplay amount={ride.price} />}
    </CardBody>
</Card>;
```

---

> **Generated:** 2026-01-05 | **Updated:** 2026-01-05 (PWA + Branding) |
> **Source:** `backend/app/models/schemas.py`, `frontend/tailwind.config.ts`,
> `frontend/package.json`, Brand Guidelines
