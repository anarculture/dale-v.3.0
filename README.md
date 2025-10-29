# Dale - Plataforma de Carpooling

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/dale/app)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-000020.svg)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![Database](https://img.shields.io/badge/database-Supabase-3ECF8E.svg)](https://supabase.com/)

Dale es una aplicación web progresiva (PWA) de carpooling que permite a los usuarios compartir viajes, ahorrar dinero en transporte y reducir la huella de carbono. La plataforma conecta conductores con pasajeros que viajan en la misma dirección.

## 🚗 Características Principales

### Para Conductores
- ✅ **Crear Viajes**: Publica viajes con origen, destino, fecha, hora y precio por asiento
- ✅ **Gestión de Asientos**: Control automático de disponibilidad de asientos
- ✅ **Cancelar Viajes**: Cancela viajes cuando sea necesario
- ✅ **Perfil de Usuario**: Gestiona tu información personal y de contacto

### Para Pasajeros
- 🔍 **Buscar Viajes**: Filtra por ciudad, fecha y precio máximo
- 📍 **Vista de Mapas**: Integración con Google Maps para ubicaciones exactas
- 📋 **Hacer Reservas**: Reserva asientos en viajes disponibles
- 🎫 **Mis Reservas**: Gestiona todas tus reservas activas y historial
- ❌ **Cancelar Reservas**: Cancela reservas con actualización automática de asientos

### Funcionalidades Generales
- 🔐 **Autenticación Segura**: Sistema JWT con Supabase Auth
- 📱 **PWA**: Instalable como aplicación nativa
- 🎨 **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- 🌐 **API REST**: Backend completamente documentado
- 🗄️ **Base de Datos**: Almacenamiento en tiempo real con Supabase

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Autenticación**: Supabase Auth
- **Mapas**: Google Maps JavaScript API
- **UI/UX**: Lucide React Icons
- **Build Tool**: Vite (incluido en Next.js)

### Backend
- **Framework**: FastAPI (Python)
- **Autenticación**: JWT con python-jose
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Supabase Python Client
- **Validación**: Pydantic
- **Servidor**: Uvicorn

### DevOps & Deployment
- **Hosting**: Compatible con Vercel (frontend) y Railway/Heroku (backend)
- **Base de Datos**: Supabase Cloud
- **CDN**: Automático con Vercel
- **CI/CD**: GitHub Actions compatible

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18.0 o superior)
- **Python** (v3.9 o superior)
- **npm** o **yarn**
- **pip** (gestor de paquetes de Python)

### Servicios Externos Requeridos
- **Supabase**: Cuenta y proyecto configurado
- **Google Maps**: API Key con servicios habilitados:
  - Maps JavaScript API
  - Geocoding API
  - Places API (opcional)

## 🚀 Instalación y Setup

### 1. Clonar el Repositorio

```bash
git clone https://github.com/dale/app.git
cd dale
```

### 2. Configuración del Backend

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
venv\\Scripts\\activate
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

#### Variables de Entorno (Backend)

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Supabase Configuration
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
```

### 3. Configuración del Frontend

```bash
# Navegar al directorio frontend (desde la raíz)
cd frontend

# Instalar dependencias
npm install
# o
yarn install
```

#### Variables de Entorno (Frontend)

Crea un archivo `.env.local` en la carpeta `frontend/`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

### 4. Configuración de la Base de Datos

Ejecuta los siguientes scripts SQL en tu proyecto de Supabase:

```sql
-- Crear tabla de usuarios (extensión de auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de rides
CREATE TABLE public.rides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    driver_id UUID REFERENCES public.users(id) NOT NULL,
    from_city TEXT NOT NULL,
    from_lat DECIMAL(10, 8) NOT NULL,
    from_lon DECIMAL(11, 8) NOT NULL,
    to_city TEXT NOT NULL,
    to_lat DECIMAL(10, 8) NOT NULL,
    to_lon DECIMAL(11, 8) NOT NULL,
    date_time TIMESTAMP WITH TIME ZONE NOT NULL,
    seats_total INTEGER NOT NULL CHECK (seats_total > 0),
    seats_available INTEGER NOT NULL CHECK (seats_available >= 0),
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'full', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear tabla de bookings
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_id UUID REFERENCES public.rides(id) NOT NULL,
    rider_id UUID REFERENCES public.users(id) NOT NULL,
    seats_booked INTEGER NOT NULL CHECK (seats_booked > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view active rides" ON public.rides
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create rides" ON public.rides
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update own rides" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can cancel own rides" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id AND status = 'active');

CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = rider_id);

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Users can cancel own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = rider_id AND status = 'pending');

-- Índices para mejor performance
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_date_time ON public.rides(date_time);
CREATE INDEX idx_rides_from_city ON public.rides(from_city);
CREATE INDEX idx_rides_to_city ON public.rides(to_city);
CREATE INDEX idx_bookings_ride_id ON public.bookings(ride_id);
CREATE INDEX idx_bookings_rider_id ON public.bookings(rider_id);
```

## 🏃‍♂️ Comandos de Desarrollo

### Backend (FastAPI)

```bash
# Navegar al directorio backend
cd backend

# Activar entorno virtual
source venv/bin/activate  # Linux/macOS
# o
venv\\Scripts\\activate   # Windows

# Ejecutar servidor de desarrollo
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Ejecutar con hot reload automático
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Ejecutar en modo producción
uvicorn main:app --host 0.0.0.0 --port 8000
```

El backend estará disponible en: `http://localhost:8000`
Documentación de la API: `http://localhost:8000/docs`

### Frontend (Next.js)

```bash
# Navegar al directorio frontend
cd frontend

# Ejecutar servidor de desarrollo
npm run dev
# o
yarn dev

# Build para producción
npm run build
# o
yarn build

# Iniciar servidor de producción
npm start
# o
yarn start

# Ejecutar linting
npm run lint
# o
yarn lint
```

El frontend estará disponible en: `http://localhost:3000`

### Comandos Útiles

```bash
# Instalar nuevas dependencias en frontend
npm install nombre-paquete

# Instalar nuevas dependencias en backend
pip install nombre-paquete

# Actualizar requirements.txt
pip freeze > requirements.txt

# Verificar tipos TypeScript
npm run build -- --no-emit
```

## 📁 Estructura del Proyecto

```
dale/
├── backend/                 # Backend FastAPI
│   ├── main.py             # Aplicación principal FastAPI
│   ├── requirements.txt    # Dependencias Python
│   └── venv/              # Entorno virtual (excluido del repo)
│
├── frontend/               # Frontend Next.js
│   ├── src/
│   │   ├── app/           # App Router de Next.js 14
│   │   │   ├── page.tsx   # Página principal
│   │   │   ├── layout.tsx # Layout raíz
│   │   │   ├── globals.css # Estilos globales
│   │   │   ├── login/     # Páginas de autenticación
│   │   │   ├── signup/    # Registro de usuarios
│   │   │   ├── rides/     # Gestión de viajes
│   │   │   ├── bookings/  # Gestión de reservas
│   │   │   ├── offer/     # Crear ofertas de viaje
│   │   │   └── profile/   # Perfil de usuario
│   │   ├── components/    # Componentes reutilizables
│   │   │   ├── RideCard.tsx
│   │   │   ├── BookingCard.tsx
│   │   │   ├── RideFilters.tsx
│   │   │   ├── RidePagination.tsx
│   │   │   └── bookings/
│   │   └── lib/           # Utilidades y configuración
│   │       ├── api.ts     # Cliente API
│   │       ├── AuthContext.tsx # Contexto de autenticación
│   │       └── maps.ts    # Utilidades de mapas
│   ├── package.json       # Dependencias Node.js
│   ├── tsconfig.json      # Configuración TypeScript
│   ├── tailwind.config.js # Configuración Tailwind CSS
│   ├── next.config.js     # Configuración Next.js
│   └── .env.local         # Variables de entorno (excluido)
│
├── docs/                  # Documentación adicional
├── .gitignore            # Archivos excluidos de Git
├── LICENSE               # Licencia MIT
└── README.md             # Este archivo
```

## 🔌 APIs Disponibles

### Autenticación
- **POST** `/auth/login` - Iniciar sesión
- **POST** `/auth/register` - Registrarse
- **POST** `/auth/logout` - Cerrar sesión

### Sistema de Salud
- **GET** `/health` - Estado del servidor
- **GET** `/` - Información de la API

### Gestión de Usuarios
- **GET** `/api/users/{user_id}` - Obtener perfil de usuario
- **PATCH** `/api/users/{user_id}` - Actualizar perfil de usuario

### Gestión de Viajes (Rides)
- **POST** `/api/rides` - Crear nuevo viaje
- **GET** `/api/rides` - Buscar viajes con filtros
- **GET** `/api/rides/{ride_id}` - Obtener detalles de un viaje
- **PATCH** `/api/rides/{ride_id}/cancel` - Cancelar viaje

### Gestión de Reservas (Bookings)
- **POST** `/api/bookings` - Crear nueva reserva
- **GET** `/api/users/{user_id}/bookings` - Obtener reservas del usuario
- **PATCH** `/api/bookings/{booking_id}/cancel` - Cancelar reserva

### Ejemplos de Uso

#### Buscar Viajes
```bash
GET /api/rides?from_city=Madrid&to_city=Barcelona&date=2025-10-30&max_price=25.00
```

#### Crear Viaje
```bash
POST /api/rides
Content-Type: application/json
Authorization: Bearer <token>

{
  "from_city": "Madrid",
  "from_lat": 40.4168,
  "from_lon": -3.7038,
  "to_city": "Barcelona",
  "to_lat": 41.3851,
  "to_lon": 2.1734,
  "date_time": "2025-10-30T10:00:00Z",
  "seats_total": 3,
  "price": 20.00,
  "notes": "Viaje cómodo, música permitida"
}
```

#### Crear Reserva
```bash
POST /api/bookings
Content-Type: application/json
Authorization: Bearer <token>

{
  "ride_id": "uuid-del-viaje",
  "seats_booked": 2
}
```

## 🚀 Deployment

### Frontend (Vercel - Recomendado)

1. **Conectar Repositorio**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Variables de Entorno en Vercel**
   - `NEXT_PUBLIC_API_BASE_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### Backend (Railway/Heroku)

1. **Railway**
   ```bash
   # Instalar Railway CLI
   npm install -g @railway/cli
   
   # Login y deploy
   railway login
   railway init
   railway up
   ```

2. **Heroku**
   ```bash
   # Crear app
   heroku create dale-backend
   
   # Configurar variables
   heroku config:set SUPABASE_URL=tu_url
   heroku config:set SUPABASE_SERVICE_ROLE_KEY=tu_key
   
   # Deploy
   git subtree push --prefix backend heroku main
   ```

### Variables de Entorno de Producción

#### Backend (.env)
```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=production
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://tu-backend.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Instalar dependencias de testing
pip install pytest pytest-asyncio httpx

# Ejecutar tests
pytest

# Ejecutar tests con coverage
pytest --cov=main

# Ejecutar tests específicos
pytest tests/test_rides.py
```

### Frontend Testing

```bash
cd frontend

# Instalar dependencias de testing
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con coverage
npm test -- --coverage
```

### Tests de Integración API

```python
# tests/test_api.py
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_create_ride():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test crear viaje
        response = await client.post("/api/rides", json={
            "from_city": "Madrid",
            "from_lat": 40.4168,
            "from_lon": -3.7038,
            "to_city": "Barcelona",
            "to_lat": 41.3851,
            "to_lon": 2.1734,
            "date_time": "2025-10-30T10:00:00Z",
            "seats_total": 3,
            "price": 20.00
        })
        assert response.status_code == 201
```

## 🐛 Troubleshooting

### Problemas Comunes

#### 1. **Error de Conexión a Supabase**
```
Error: "Missing Supabase credentials"
```

**Solución:**
- Verifica que las variables de entorno estén correctamente configuradas
- Confirma que tu proyecto de Supabase esté activo
- Revisa que las claves sean correctas (URL y Service Role Key)

#### 2. **Error de CORS en el Frontend**
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solución:**
```python
# En main.py, asegúrate de que CORS esté configurado correctamente:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://tu-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 3. **Error de Autenticación JWT**
```
HTTPException: Invalid token
```

**Solución:**
- Verifica que el token JWT sea válido y no haya expirado
- Confirma que `SUPABASE_JWT_SECRET` esté configurado correctamente
- Revisa que el token se envíe en el header `Authorization: Bearer <token>`

#### 4. **Error de Google Maps**
```
Google Maps JavaScript API error: InvalidKeyMapError
```

**Solución:**
- Confirma que tu API Key de Google Maps sea válida
- Verifica que los servicios necesarios estén habilitados
- Restringe la API Key a tu dominio en Google Cloud Console

#### 5. **Error de Base de Datos**
```
psycopg2.errors.UndefinedTable: relation "rides" does not exist
```

**Solución:**
- Ejecuta el script de migración SQL en tu base de datos Supabase
- Confirma que las tablas estén creadas correctamente
- Verifica los permisos (RLS policies)

### Logs y Debugging

#### Backend
```bash
# Ver logs en desarrollo
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level debug

# Ver logs de la aplicación
python -c "import logging; logging.basicConfig(level=logging.DEBUG)"
```

#### Frontend
```bash
# Ejecutar con logs detallados
DEBUG=* npm run dev

# Verificar build
npm run build && npm run start
```

### Performance

#### Optimizaciones Recomendadas

1. **Base de Datos**
   ```sql
   -- Agregar índices para mejor performance
   CREATE INDEX CONCURRENTLY idx_rides_date_time_status 
   ON public.rides(date_time, status);
   
   CREATE INDEX CONCURRENTLY idx_bookings_status_created 
   ON public.bookings(status, created_at);
   ```

2. **Frontend**
   ```javascript
   // Usar React.memo para componentes pesados
   const RideCard = React.memo(({ ride }) => {
     // componente
   });
   
   // Implementar lazy loading
   const Bookings = lazy(() => import('./Bookings'));
   ```

3. **Caching**
   ```javascript
   // Implementar SWR para caching de datos
   const { data: rides } = useSWR('/api/rides', fetcher, {
     refreshInterval: 30000 // 30 segundos
   });
   ```

## 📝 Changelog

### v1.0.0 (2025-10-29)
- ✅ Implementación completa del sistema de carpooling
- ✅ Autenticación con Supabase Auth
- ✅ CRUD completo para rides y bookings
- ✅ Integración con Google Maps
- ✅ PWA funcional
- ✅ API REST completamente documentada
- ✅ Sistema de filtros y búsqueda
- ✅ Responsive design con Tailwind CSS

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guidelines de Contribución

- ✅ Sigue las convenciones de código existentes
- ✅ Escribe tests para nuevas funcionalidades
- ✅ Actualiza la documentación si es necesario
- ✅ Asegúrate de que el código pase todos los tests
- ✅ Usa mensajes de commit descriptivos

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes alguna pregunta o necesitas ayuda:

- 📧 **Email**: soporte@dale-app.com
- 💬 **Discord**: [Servidor de Dale](https://discord.gg/dale)
- 🐛 **Issues**: [GitHub Issues](https://github.com/dale/app/issues)
- 📖 **Wiki**: [Documentación completa](https://github.com/dale/app/wiki)

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) - Base de datos y autenticación
- [Google Maps](https://developers.google.com/maps) - Servicios de mapas
- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [Next.js](https://nextjs.org/) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

<div align="center">

**[Website](https://dale-app.com)** • 
**[Documentación](https://docs.dale-app.com)** • 
**[API Reference](https://api.dale-app.com/docs)** • 
**[Soporte](mailto:soporte@dale-app.com)**

Hecho con ❤️ por el equipo de Dale

</div>