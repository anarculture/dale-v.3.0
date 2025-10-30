# API de Dale - Documentación de Endpoints

**Base URL**: `http://localhost:8000`

## Autenticación

Todos los endpoints protegidos requieren un token JWT de Supabase en el header:

```
Authorization: Bearer <token>
```

## Endpoints Disponibles

### Health & Info

#### `GET /`
Información básica de la API.

**Response 200**:
```json
{
  "name": "Dale API",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs"
}
```

#### `GET /health`
Health check para monitoreo.

**Response 200**:
```json
{
  "status": "healthy",
  "service": "dale-api"
}
```

#### `GET /api/info`
Lista todos los endpoints disponibles con descripciones.

---

### Usuarios

#### `GET /api/me`
Obtiene el perfil del usuario autenticado.

**Requiere autenticación**: ✅

**Response 200**:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Nombre Usuario",
  "avatar_url": "https://...",
  "role": "rider",
  "created_at": "2025-10-29T..."
}
```

#### `PATCH /api/me`
Actualiza el perfil del usuario autenticado.

**Requiere autenticación**: ✅

**Body**:
```json
{
  "name": "Nuevo Nombre",
  "avatar_url": "https://...",
  "role": "driver"
}
```

**Response 200**: Usuario actualizado

#### `GET /api/users/{user_id}`
Obtiene el perfil público de un usuario.

**Requiere autenticación**: ❌

---

### Viajes (Rides)

#### `POST /api/rides`
Crea un nuevo viaje.

**Requiere autenticación**: ✅ (solo rol `driver`)

**Body**:
```json
{
  "from_city": "Madrid",
  "from_lat": 40.4168,
  "from_lon": -3.7038,
  "to_city": "Barcelona",
  "to_lat": 41.3851,
  "to_lon": 2.1734,
  "date_time": "2025-10-30T10:00:00",
  "seats_total": 3,
  "price": 25.00,
  "notes": "Salida desde Atocha"
}
```

**Response 201**: Viaje creado con información del conductor

#### `GET /api/rides`
Busca viajes con filtros opcionales.

**Requiere autenticación**: ❌

**Query Params**:
- `from_city` (string): Ciudad de origen
- `to_city` (string): Ciudad de destino
- `date` (string): Fecha del viaje (YYYY-MM-DD)
- `min_seats` (int): Mínimo de plazas disponibles
- `max_price` (float): Precio máximo

**Example**:
```
GET /api/rides?from_city=Madrid&to_city=Barcelona&date=2025-10-30
```

**Response 200**:
```json
[
  {
    "id": "uuid",
    "driver_id": "uuid",
    "from_city": "Madrid",
    "from_lat": 40.4168,
    "from_lon": -3.7038,
    "to_city": "Barcelona",
    "to_lat": 41.3851,
    "to_lon": 2.1734,
    "date_time": "2025-10-30T10:00:00",
    "seats_total": 3,
    "seats_available": 2,
    "price": 25.00,
    "notes": "...",
    "created_at": "2025-10-29T...",
    "driver": {
      "id": "uuid",
      "name": "Conductor",
      "avatar_url": "...",
      "role": "driver"
    }
  }
]
```

#### `GET /api/rides/{ride_id}`
Obtiene los detalles de un viaje específico.

**Requiere autenticación**: ❌

**Response 200**: Detalles del viaje con información del conductor

#### `GET /api/rides/my/rides`
Obtiene todos los viajes creados por el usuario autenticado.

**Requiere autenticación**: ✅

**Response 200**: Array de viajes

#### `DELETE /api/rides/{ride_id}`
Elimina un viaje (solo el conductor que lo creó).

**Requiere autenticación**: ✅

**Response 204**: Sin contenido (éxito)

---

### Reservas (Bookings)

#### `POST /api/bookings`
Crea una nueva reserva para un viaje.

**Requiere autenticación**: ✅

**Body**:
```json
{
  "ride_id": "uuid"
}
```

**Validaciones**:
- El viaje debe existir y tener plazas disponibles
- No puedes reservar tu propio viaje
- No puedes tener una reserva duplicada para el mismo viaje

**Response 201**: Reserva creada (decrementa `seats_available`)

#### `GET /api/bookings`
Obtiene todas las reservas del usuario autenticado.

**Requiere autenticación**: ✅

**Response 200**:
```json
[
  {
    "id": "uuid",
    "ride_id": "uuid",
    "rider_id": "uuid",
    "status": "pending",
    "created_at": "2025-10-29T...",
    "ride": {
      "id": "uuid",
      "from_city": "Madrid",
      "to_city": "Barcelona",
      "date_time": "...",
      "price": 25.00,
      "driver": {...}
    },
    "rider": {
      "id": "uuid",
      "name": "Pasajero",
      "avatar_url": "..."
    }
  }
]
```

#### `GET /api/bookings/{booking_id}`
Obtiene los detalles de una reserva (solo el pasajero o el conductor).

**Requiere autenticación**: ✅

**Response 200**: Detalles de la reserva

#### `DELETE /api/bookings/{booking_id}`
Cancela una reserva (pasajero o conductor).

**Requiere autenticación**: ✅

**Efecto**: Marca como `cancelled` e incrementa `seats_available`

**Response 204**: Sin contenido (éxito)

#### `PATCH /api/bookings/{booking_id}/confirm`
Confirma una reserva (solo el conductor).

**Requiere autenticación**: ✅ (debe ser el conductor del viaje)

**Response 200**: Reserva con status `confirmed`

---

## Códigos de Error

- **400 Bad Request**: Validación fallida o lógica de negocio (ej: no hay plazas)
- **401 Unauthorized**: Token inválido o expirado
- **403 Forbidden**: No tienes permisos para esta acción
- **404 Not Found**: Recurso no encontrado
- **422 Unprocessable Entity**: Error de validación de datos
- **500 Internal Server Error**: Error del servidor

## Documentación Interactiva

Una vez el servidor esté corriendo, accede a:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Ejecutar el Servidor

```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

O usar el Makefile:
```bash
make backend
```
