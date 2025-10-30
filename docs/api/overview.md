# Resumen de APIs

## 🎯 Visión General

La API de Dale está construida con **FastAPI** y sigue principios RESTful modernos. Proporciona una interfaz completa para todas las funcionalidades de la plataforma de carpooling, incluyendo autenticación, gestión de usuarios, viajes y reservas.

## 🌐 Información Base

### 🔗 Endpoints Base

| Entorno | URL Base | Documentación |
|---------|----------|---------------|
| **Desarrollo** | `http://localhost:8000` | http://localhost:8000/docs |
| **Producción** | `https://api.dale-app.com` | https://api.dale-app.com/docs |

### 📊 Estadísticas de la API

- **Total de Endpoints**: 15+
- **Versiones Activas**: v1
- **Formatos Soportados**: JSON
- **Autenticación**: JWT Bearer Tokens
- **Rate Limiting**: 60 requests/minuto
- **Documentación**: OpenAPI 3.0 + Swagger UI

## 🏗️ Arquitectura de la API

### 📂 Estructura de Endpoints

```
/                          # Información general
├── /auth/                 # Autenticación y autorización
├── /api/v1/              # API versión 1
│   ├── /users/           # Gestión de usuarios
│   ├── /rides/           # Gestión de viajes
│   └── /bookings/        # Gestión de reservas
├── /health               # Health check
└── /docs                 # Documentación Swagger
```

### 🔒 Métodos HTTP Soportados

| Método | Descripción | Endpoint de Ejemplo |
|--------|-------------|-------------------|
| **GET** | Obtener recursos | `GET /api/v1/rides` |
| **POST** | Crear recursos | `POST /api/v1/rides` |
| **PATCH** | Actualizar parcialmente | `PATCH /api/v1/users/{id}` |
| **PUT** | Reemplazar completamente | `PUT /api/v1/users/{id}` |
| **DELETE** | Eliminar recursos | `DELETE /api/v1/bookings/{id}` |

### 📊 Códigos de Estado HTTP

| Código | Descripción | Uso en Dale |
|--------|-------------|-------------|
| **200** | OK | Operaciones exitosas |
| **201** | Created | Recursos creados exitosamente |
| **400** | Bad Request | Error en datos de entrada |
| **401** | Unauthorized | Token de autenticación inválido |
| **403** | Forbidden | Permisos insuficientes |
| **404** | Not Found | Recurso no encontrado |
| **409** | Conflict | Conflicto (ej: asiento no disponible) |
| **422** | Unprocessable Entity | Validación de datos fallida |
| **429** | Too Many Requests | Rate limit excedido |
| **500** | Internal Server Error | Error interno del servidor |

## 🔐 Autenticación

### JWT Bearer Token

Todas las endpoints protegidas requieren autenticación:

```bash
# Header de autenticación
Authorization: Bearer <jwt_token>

# Ejemplo
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 🔑 Flow de Autenticación

```mermaid
sequenceDiagram
    participant C as Cliente
    participant A as Auth API
    participant DB as Base de Datos

    C->>A: POST /auth/login {email, password}
    A->>DB: Verificar credenciales
    DB-->>A: Usuario válido
    A->>A: Generar JWT token
    A-->>C: {access_token, refresh_token}
    
    Note over C: Usar access_token en requests
    
    C->>A: GET /api/v1/rides (con token)
    A->>A: Verificar token
    A-->>C: Datos de rides
    
    Note over C: Renovar token antes de expiración
    
    C->>A: POST /auth/refresh {refresh_token}
    A-->>C: Nuevo access_token
```

## 📋 Endpoints por Categoría

### 🔐 Autenticación (`/auth`)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/auth/login` | POST | Iniciar sesión | ❌ |
| `/auth/register` | POST | Registrar usuario | ❌ |
| `/auth/logout` | POST | Cerrar sesión | ✅ |
| `/auth/refresh` | POST | Renovar token | ❌ |
| `/auth/me` | GET | Obtener perfil actual | ✅ |

### 👥 Usuarios (`/api/v1/users`)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/v1/users/{user_id}` | GET | Obtener usuario por ID | ❌ |
| `/api/v1/users/me` | GET | Obtener perfil actual | ✅ |
| `/api/v1/users/me` | PATCH | Actualizar perfil | ✅ |
| `/api/v1/users/{user_id}/rating` | POST | Calificar usuario | ✅ |
| `/api/v1/users/me/history` | GET | Historial de actividad | ✅ |

### 🚗 Viajes (`/api/v1/rides`)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/v1/rides` | GET | Buscar viajes con filtros | ❌ |
| `/api/v1/rides` | POST | Crear nuevo viaje | ✅ |
| `/api/v1/rides/{ride_id}` | GET | Obtener detalles de viaje | ❌ |
| `/api/v1/rides/{ride_id}` | PATCH | Actualizar viaje | ✅ |
| `/api/v1/rides/{ride_id}/cancel` | PATCH | Cancelar viaje | ✅ |
| `/api/v1/rides/{ride_id}/complete` | PATCH | Completar viaje | ✅ |
| `/api/v1/users/me/rides` | GET | Mis viajes como conductor | ✅ |

### 🎫 Reservas (`/api/v1/bookings`)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/api/v1/bookings` | POST | Crear nueva reserva | ✅ |
| `/api/v1/bookings/{booking_id}` | GET | Obtener detalles de reserva | ✅ |
| `/api/v1/bookings/{booking_id}/cancel` | PATCH | Cancelar reserva | ✅ |
| `/api/v1/bookings/{booking_id}/confirm` | PATCH | Confirmar reserva | ✅ |
| `/api/v1/users/me/bookings` | GET | Mis reservas como pasajero | ✅ |
| `/api/v1/rides/{ride_id}/bookings` | GET | Reservas de un viaje | ✅ |

### 🏥 Sistema (`/`)

| Endpoint | Método | Descripción | Auth |
|----------|--------|-------------|------|
| `/` | GET | Información general de la API | ❌ |
| `/health` | GET | Health check del servicio | ❌ |
| `/docs` | GET | Documentación Swagger UI | ❌ |
| `/redoc` | GET | Documentación ReDoc | ❌ |

## 📊 Ejemplos de Request/Response

### 🔐 Login

#### Request
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

#### Response (200 OK)
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@example.com",
    "name": "Juan Pérez",
    "rating": 4.8,
    "total_rides": 25
  }
}
```

### 🚗 Crear Viaje

#### Request
```bash
POST /api/v1/rides
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "from_city": "Madrid",
  "from_lat": 40.4168,
  "from_lon": -3.7038,
  "to_city": "Barcelona",
  "to_lat": 41.3851,
  "to_lon": 2.1734,
  "date_time": "2025-11-15T10:00:00Z",
  "seats_total": 3,
  "price": 25.00,
  "notes": "Viaje cómodo, música permitida"
}
```

#### Response (201 Created)
```json
{
  "id": "ride-789abc",
  "driver_id": "user-123",
  "driver": {
    "id": "user-123",
    "name": "Juan Pérez",
    "rating": 4.8,
    "total_rides": 25
  },
  "from_city": "Madrid",
  "from_lat": 40.4168,
  "from_lon": -3.7038,
  "to_city": "Barcelona",
  "to_lat": 41.3851,
  "to_lon": 2.1734,
  "date_time": "2025-11-15T10:00:00Z",
  "seats_total": 3,
  "seats_available": 3,
  "price": 25.00,
  "notes": "Viaje cómodo, música permitida",
  "status": "active",
  "created_at": "2025-10-29T20:40:02Z",
  "updated_at": "2025-10-29T20:40:02Z"
}
```

### 🔍 Buscar Viajes

#### Request
```bash
GET /api/v1/rides?from_city=Madrid&to_city=Barcelona&date=2025-11-15&max_price=30.00&seats_needed=2
```

#### Response (200 OK)
```json
{
  "rides": [
    {
      "id": "ride-789abc",
      "driver": {
        "name": "Juan Pérez",
        "rating": 4.8,
        "total_rides": 25
      },
      "from_city": "Madrid",
      "to_city": "Barcelona",
      "date_time": "2025-11-15T10:00:00Z",
      "seats_available": 3,
      "price": 25.00,
      "status": "active"
    },
    {
      "id": "ride-def456",
      "driver": {
        "name": "María García",
        "rating": 4.9,
        "total_rides": 42
      },
      "from_city": "Madrid",
      "to_city": "Barcelona",
      "date_time": "2025-11-15T14:30:00Z",
      "seats_available": 2,
      "price": 28.00,
      "status": "active"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 20,
  "pages": 1
}
```

### 🎫 Crear Reserva

#### Request
```bash
POST /api/v1/bookings
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "ride_id": "ride-789abc",
  "seats_booked": 2
}
```

#### Response (201 Created)
```json
{
  "id": "booking-123",
  "ride_id": "ride-789abc",
  "rider_id": "user-456",
  "seats_booked": 2,
  "total_price": 50.00,
  "status": "confirmed",
  "created_at": "2025-10-29T20:40:02Z",
  "updated_at": "2025-10-29T20:40:02Z",
  "ride": {
    "from_city": "Madrid",
    "to_city": "Barcelona",
    "date_time": "2025-11-15T10:00:00Z",
    "seats_available": 1
  }
}
```

## 🔍 Filtros y Parámetros

### 🗺️ Filtros de Viajes

```bash
GET /api/v1/rides?{
  "from_city": "Madrid",           # Ciudad de origen
  "to_city": "Barcelona",          # Ciudad de destino
  "date": "2025-11-15",            # Fecha (YYYY-MM-DD)
  "max_price": 30.00,              # Precio máximo por asiento
  "seats_needed": 2,               # Número de asientos requeridos
  "sort_by": "date",               # Ordenamiento: date, price, rating
  "sort_order": "asc",             # asc, desc
  "page": 1,                       # Página (default: 1)
  "limit": 20                      # Elementos por página (default: 20, max: 100)
}
```

### 👤 Filtros de Usuarios

```bash
GET /api/v1/users?{
  "rating_min": 4.0,               # Rating mínimo
  "total_rides_min": 5,            # Viajes totales mínimos
  "verified": true,                # Solo usuarios verificados
  "page": 1,
  "limit": 20
}
```

### 📅 Filtros de Reservas

```bash
GET /api/v1/bookings?{
  "status": "confirmed",           # pending, confirmed, cancelled, completed
  "date_from": "2025-11-01",       # Fecha desde
  "date_to": "2025-11-30",         # Fecha hasta
  "page": 1,
  "limit": 20
}
```

## 📋 Paginación

### Estructura de Respuesta Paginada

```json
{
  "data": [...],           # Array de resultados
  "total": 150,            # Total de elementos
  "page": 1,               # Página actual
  "limit": 20,             # Elementos por página
  "pages": 8,              # Total de páginas
  "has_next": true,        # Hay página siguiente
  "has_prev": false        # Hay página anterior
}
```

### Headers de Paginación

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Total-Count: 150
X-Page: 1
X-Limit: 20
X-Pages: 8
```

## 🚫 Manejo de Errores

### Estructura de Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": [
      {
        "field": "email",
        "message": "El formato del email no es válido"
      },
      {
        "field": "password",
        "message": "La contraseña debe tener al menos 8 caracteres"
      }
    ],
    "timestamp": "2025-10-29T20:40:02Z",
    "request_id": "req-123456"
  }
}
```

### Códigos de Error Comunes

| Código | Descripción | HTTP Status |
|--------|-------------|-------------|
| `VALIDATION_ERROR` | Error en validación de datos | 422 |
| `AUTHENTICATION_REQUIRED` | Token de autenticación requerido | 401 |
| `INVALID_TOKEN` | Token JWT inválido o expirado | 401 |
| `INSUFFICIENT_PERMISSIONS` | Permisos insuficientes | 403 |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado | 404 |
| `SEAT_NOT_AVAILABLE` | No hay asientos disponibles | 409 |
| `RIDE_ALREADY_BOOKED` | Ya tienes una reserva en este viaje | 409 |
| `RIDE_CANNOT_BE_CANCELLED` | El viaje no puede cancelarse | 409 |
| `RATE_LIMIT_EXCEEDED` | Límite de requests excedido | 429 |
| `INTERNAL_ERROR` | Error interno del servidor | 500 |

## 🔒 Rate Limiting

### Límites por Endpoint

| Categoría | Límite | Ventana |
|-----------|---------|---------|
| **General** | 60 requests | 1 minuto |
| **Autenticación** | 10 requests | 1 minuto |
| **Búsqueda de viajes** | 30 requests | 1 minuto |
| **Creación de recursos** | 20 requests | 1 minuto |

### Headers de Rate Limiting

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1635729602
```

### Respuesta de Rate Limit Excedido

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Demasiadas requests. Intenta nuevamente en unos minutos.",
    "timestamp": "2025-10-29T20:40:02Z",
    "retry_after": 60
  }
}
```

## 📊 WebSockets (Futuro)

### Eventos en Tiempo Real

La API WebSocket estará disponible en `/ws` para:

- **Ride Updates**: Actualizaciones en tiempo real de disponibilidad
- **Booking Notifications**: Notificaciones instantáneas de reservas
- **Chat Messages**: Mensajes entre usuarios (futuro)
- **Location Updates**: Ubicación en tiempo real (futuro)

### Estructura de Evento WebSocket

```json
{
  "type": "booking_confirmed",
  "data": {
    "booking_id": "booking-123",
    "ride_id": "ride-789",
    "message": "Tu reserva ha sido confirmada"
  },
  "timestamp": "2025-10-29T20:40:02Z"
}
```

## 🧪 Testing de APIs

### curl Examples

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Buscar viajes
curl -X GET "http://localhost:8000/api/v1/rides?from_city=Madrid&to_city=Barcelona" \
  -H "Accept: application/json"

# Crear viaje (con autenticación)
curl -X POST http://localhost:8000/api/v1/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "from_city": "Madrid",
    "to_city": "Barcelona",
    "date_time": "2025-11-15T10:00:00Z",
    "seats_total": 3,
    "price": 25.00
  }'
```

### Postman Collection

Descarga la colección de Postman desde: 
[Postman Collection Download]

### JavaScript SDK (Futuro)

```javascript
// Instalar Dale SDK (próximamente)
// npm install @dale/sdk

import { DaleAPI } from '@dale/sdk';

const api = new DaleAPI({
  baseURL: 'https://api.dale-app.com',
  apiKey: 'your-api-key'
});

// Usar la API
const rides = await api.rides.search({
  from_city: 'Madrid',
  to_city: 'Barcelona',
  date: '2025-11-15'
});

const booking = await api.bookings.create({
  ride_id: rides[0].id,
  seats_booked: 2
});
```

## 📈 Monitoreo y Analytics

### Métricas Disponibles

- **Response Time**: Tiempo promedio de respuesta
- **Success Rate**: Porcentaje de requests exitosas
- **Error Rate**: Porcentaje de errores
- **Throughput**: Requests por segundo
- **Active Users**: Usuarios activos
- **Popular Routes**: Rutas más populares

### Endpoints de Métricas (Admin)

```bash
GET /admin/metrics/overview      # Métricas generales
GET /admin/metrics/users         # Métricas de usuarios
GET /admin/metrics/rides         # Métricas de viajes
GET /admin/metrics/bookings      # Métricas de reservas
```

## 🔄 Versionado

### Estrategia de Versionado

- **URL Versioning**: `/api/v1/`, `/api/v2/`
- **Backward Compatibility**: Soporte para versiones anteriores durante 6 meses
- **Deprecation Notices**: Notificaciones 3 meses antes de discontinuar

### Changelog de API

| Versión | Fecha | Cambios |
|---------|-------|---------|
| **v1.0.0** | 2025-10-29 | Lanzamiento inicial |
| v1.1.0 | TBD | WebSockets, Chat básico |
| v1.2.0 | TBD | Advanced filtering, Analytics |

## ✅ Checklist de API

Para verificar la calidad de la API:

- [ ] ✅ **Documentación completa** en Swagger UI
- [ ] ✅ **Autenticación JWT** implementada correctamente
- [ ] ✅ **Validación de datos** con Pydantic
- [ ] ✅ **Manejo de errores** consistente
- [ ] ✅ **Rate limiting** configurado
- [ ] ✅ **Paginación** en endpoints de lista
- [ ] ✅ **Logging** detallado para debugging
- [ ] ✅ **Health checks** funcionando
- [ ] ✅ **Tests** automatizados
- [ ] ✅ **Monitoring** y alertas configuradas

## 🎯 Próximos Pasos

Para profundizar en cada sección de la API:

1. **🔐 [Autenticación](authentication.md)** - Detalles del sistema JWT
2. **👥 [Usuarios](users.md)** - Gestión de perfiles y ratings
3. **🚗 [Viajes](rides.md)** - Crear, buscar y gestionar viajes
4. **🎫 [Reservas](bookings.md)** - Sistema de reservas de asientos
5. **📝 [Ejemplos](examples.md)** - Casos de uso completos

---

## 📞 Soporte de API

¿Problemas con la API?

- 📚 **Documentación**: http://localhost:8000/docs (dev)
- 🔍 **Debugging**: Revisar logs del servidor
- 💬 **Discord**: [Comunidad de Desarrolladores](https://discord.gg/dale)
- 🐛 **Issues**: [Reportar en GitHub](https://github.com/dale/app/issues)

---

> **🌐 Tip**: La API sigue estándares RESTful y está optimizada para performance. Utiliza los filtros y paginación apropiadamente para obtener los mejores resultados. ¡Happy coding! 🚀