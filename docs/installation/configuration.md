# Configuración

## 🎯 Visión General

Esta guía te ayudará a configurar todas las variables de entorno y credenciales necesarias para que Dale funcione correctamente. La configuración correcta es crucial para el funcionamiento de la aplicación.

## 📋 Checklist de Configuración

Antes de comenzar, asegúrate de tener:

- [ ] ✅ Cuenta de Supabase creada y proyecto configurado
- [ ] ✅ API Key de Google Maps generada
- [ ] ✅ Sistema con todos los requisitos instalados
- [ ] ✅ Editor de código (VS Code recomendado)
- [ ] ✅ Terminal con acceso a Git

## 🗄️ Configuración de Supabase

### 1. 🏗️ Crear Proyecto en Supabase

1. **Acceder a Supabase**: Ve a [supabase.com](https://supabase.com)
2. **Crear Cuenta**: Regístrate o inicia sesión
3. **Nuevo Proyecto**: Click en "New Project"
4. **Configurar Proyecto**:
   - **Nombre**: `dale-production` (o el nombre que prefieras)
   - **Base de Datos**: PostgreSQL
   - **Región**: Elige la más cercana a tus usuarios
   - **Plan**: Free (para desarrollo) o Pro (para producción)

### 2. 🔑 Obtener Credenciales

Una vez creado el proyecto, obtén estas credenciales:

#### Desde Supabase Dashboard:
1. Ve a **Settings** → **API**
2. Copia las siguientes credenciales:

```env
# Datos de ejemplo (NO uses estos valores)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0ODMxNzQ5MCwiZXhwIjoxOTYzODkzNDkwfQ.example
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ4MzE3NDkwLCJleHAiOjE5NjM4OTM0OTB9.example
```

#### Desde Supabase CLI (Opcional):
```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link proyecto
supabase link --project-ref abcdefghijklmnop

# Obtener credenciales
supabase status
```

### 3. 🏗️ Configurar Base de Datos

Ejecuta este script SQL en el SQL Editor de Supabase:

```sql
-- =====================================================
-- SCRIPT DE CONFIGURACIÓN INICIAL PARA DALE
-- =====================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para geolocalización futura

-- Tabla de usuarios (extensión de auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    total_rides INTEGER DEFAULT 0,
    verification_status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de viajes
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
    status TEXT NOT NULL DEFAULT 'active' 
        CHECK (status IN ('active', 'full', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de reservas
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ride_id UUID REFERENCES public.rides(id) NOT NULL,
    rider_id UUID REFERENCES public.users(id) NOT NULL,
    seats_booked INTEGER NOT NULL CHECK (seats_booked > 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(ride_id, rider_id)
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad (RLS)
-- Usuarios
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Viajes
CREATE POLICY "Anyone can view active rides" ON public.rides
    FOR SELECT USING (status = 'active');

CREATE POLICY "Users can create rides" ON public.rides
    FOR INSERT WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update own rides" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can cancel own rides" ON public.rides
    FOR UPDATE USING (auth.uid() = driver_id AND status = 'active');

-- Reservas
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = rider_id);

CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = rider_id);

CREATE POLICY "Users can cancel own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = rider_id AND status = 'pending');

-- Índices para optimización
CREATE INDEX idx_rides_driver_id ON public.rides(driver_id);
CREATE INDEX idx_rides_status ON public.rides(status);
CREATE INDEX idx_rides_date_time ON public.rides(date_time);
CREATE INDEX idx_rides_from_city ON public.rides(from_city);
CREATE INDEX idx_rides_to_city ON public.rides(to_city);
CREATE INDEX idx_bookings_ride_id ON public.bookings(ride_id);
CREATE INDEX idx_bookings_rider_id ON public.bookings(rider_id);

-- Función para actualizar seats_available automáticamente
CREATE OR REPLACE FUNCTION update_seats_available()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.rides 
        SET seats_available = seats_available - NEW.seats_booked,
            updated_at = now()
        WHERE id = NEW.ride_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        -- Si se cancela, restaurar asientos
        IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
            UPDATE public.rides 
            SET seats_available = seats_available + NEW.seats_booked,
                updated_at = now()
            WHERE id = NEW.ride_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.rides 
        SET seats_available = seats_available + OLD.seats_booked,
            updated_at = now()
        WHERE id = OLD.ride_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar seats_available
CREATE TRIGGER booking_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_seats_available();

-- Vista para estadísticas
CREATE VIEW public.ride_statistics AS
SELECT 
    r.id,
    r.driver_id,
    u.name as driver_name,
    r.from_city,
    r.to_city,
    r.date_time,
    r.seats_total,
    r.seats_available,
    r.price,
    r.status,
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.seats_booked ELSE 0 END), 0) as confirmed_bookings
FROM public.rides r
LEFT JOIN public.bookings b ON r.id = b.ride_id
LEFT JOIN public.users u ON r.driver_id = u.id
GROUP BY r.id, u.name;

-- Comentarios para documentación
COMMENT ON TABLE public.users IS 'Extensión de la tabla auth.users con información adicional';
COMMENT ON TABLE public.rides IS 'Viajes ofrecidos por conductores';
COMMENT ON TABLE public.bookings IS 'Reservas de asientos en viajes';
COMMENT ON VIEW public.ride_statistics IS 'Vista con estadísticas de viajes y reservas';
```

### 4. 🪣 Configurar Storage (Opcional)

Si planeas subir avatares o imágenes:

1. **Ir a Storage** en el dashboard de Supabase
2. **Crear Bucket**: Nombre: `avatars`
3. **Configurar Políticas**:
   ```sql
   -- Permitir a usuarios subir su propio avatar
   CREATE POLICY "Users can upload own avatar" ON storage.objects
       FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
   
   -- Permitir ver avatares públicos
   CREATE POLICY "Avatar is publicly accessible" ON storage.objects
       FOR SELECT USING (bucket_id = 'avatars');
   ```

## 🗺️ Configuración de Google Maps

### 1. 🏗️ Configurar Google Cloud Platform

1. **Acceder a Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Crear Proyecto**: Nuevo proyecto o usar existente
3. **Habilitar APIs**:
   - Maps JavaScript API
   - Geocoding API
   - Places API (opcional)

### 2. 🔑 Crear API Key

1. **Ir a Credentials**: APIs & Services → Credentials
2. **Create Credentials**: API Key
3. **Restringir API Key** (recomendado):
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: 
     ```
     http://localhost:3000/*
     http://127.0.0.1:3000/*
     https://tu-dominio.com/*
     ```
   - **API restrictions**: Restrict key
   - **Selected APIs**: Maps JavaScript API, Geocoding API

### 3. 💳 Configurar Billing

Para producción, debes configurar billing:
1. **Ir a Billing**: Billing → Link a billing account
2. **Configurar límites**: Para evitar costos inesperados
3. **Monitorear uso**: Regularmente revisar el consumo

## 🔧 Configuración de Variables de Entorno

### 1. 📁 Estructura de Archivos

Crea los siguientes archivos `.env` en sus respective directorios:

```
dale/
├── backend/
│   └── .env
├── frontend/
│   └── .env.local
└── docs/
    └── .env.example
```

### 2. 🔐 Backend Configuration (.env)

Crea el archivo `/workspace/dale/backend/.env`:

```env
# =====================================================
# CONFIGURACIÓN DE DALE - BACKEND
# =====================================================

# Supabase Configuration
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui
SUPABASE_JWT_SECRET=tu_jwt_secret_aqui

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
DEBUG=true

# Security
SECRET_KEY=tu_clave_secreta_super_segura_aqui_cambiar_en_produccion
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://tu-frontend-url.vercel.app

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.tu-proyecto.supabase.co:5432/postgres

# Cache Configuration (Redis - Opcional)
REDIS_URL=redis://localhost:6379
CACHE_TTL=300

# Email Configuration (Opcional para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=tu-app-password

# External APIs
GOOGLE_MAPS_API_KEY=tu_google_maps_api_key

# Logging
LOG_LEVEL=INFO
LOG_FORMAT=json

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_BURST=10
```

### 3. 🌐 Frontend Configuration (.env.local)

Crea el archivo `/workspace/dale/frontend/.env.local`:

```env
# =====================================================
# CONFIGURACIÓN DE DALE - FRONTEND
# =====================================================

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# Para producción cambiar a: https://tu-backend-url.railway.app

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key_aqui

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_DEBUG=true

# Analytics (Opcional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_CHAT=false

# Performance
NEXT_PUBLIC_CACHE_TIMEOUT=300
NEXT_PUBLIC_API_TIMEOUT=10000
```

### 4. 📚 Example Configuration (.env.example)

Crea el archivo `/workspace/dale/.env.example`:

```env
# =====================================================
# EJEMPLO DE CONFIGURACIÓN - DALE
# =====================================================
# Copia este archivo a .env y .env.local respectivamente
# y completa con tus valores reales

# BACKEND CONFIGURATION
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=tu_clave_secreta_segura
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
ALLOWED_ORIGINS=http://localhost:3000

# FRONTEND CONFIGURATION
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key
NEXT_PUBLIC_ENVIRONMENT=development
```

## ⚙️ Configuración de Editor (VS Code)

### 1. 📦 Extensiones Recomendadas

Instala estas extensiones en VS Code:

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "eamodio.gitlens",
    "ms-vscode.remote-containers",
    "ms-vscode-remote.remote-ssh",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.live-server",
    "ms-vscode.vscode-json"
  ]
}
```

### 2. ⚙️ Configuración de VS Code

Crea el archivo `/workspace/dale/.vscode/settings.json`:

```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.terminal.activateEnvInCurrentTerminal": true,
  
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll": true
  },
  
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter",
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.organizeImports": true
    }
  },
  
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  
  "git.enableSmartCommit": true,
  "git.confirmSync": false,
  "git.autofetch": true,
  
  "files.associations": {
    ".env*": "dotenv"
  },
  
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### 3. 🔧 Configuración de Debugging

Crea el archivo `/workspace/dale/.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "FastAPI",
      "type": "python",
      "request": "launch",
      "program": "${workspaceFolder}/backend/venv/bin/uvicorn",
      "args": [
        "main:app",
        "--reload",
        "--host",
        "0.0.0.0",
        "--port",
        "8000"
      ],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal",
      "justMyCode": true
    },
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/frontend/node_modules/.bin/next",
      "args": ["dev"],
      "cwd": "${workspaceFolder}/frontend",
      "console": "integratedTerminal",
      "runtimeArgs": ["--inspect"]
    }
  ]
}
```

## 🧪 Verificación de Configuración

### 1. 🔍 Script de Verificación

Crea y ejecuta este script para verificar tu configuración:

```bash
#!/bin/bash
# Archivo: verify-config.sh

echo "🔍 Verificando configuración de Dale..."
echo "======================================"

# Verificar archivos .env
echo "📁 Verificando archivos de configuración..."

if [ -f "backend/.env" ]; then
    echo "✅ backend/.env existe"
else
    echo "❌ backend/.env no encontrado"
fi

if [ -f "frontend/.env.local" ]; then
    echo "✅ frontend/.env.local existe"
else
    echo "❌ frontend/.env.local no encontrado"
fi

# Verificar variables críticas
echo ""
echo "🔑 Verificando variables de entorno..."

# Backend
if grep -q "SUPABASE_URL=" backend/.env 2>/dev/null; then
    echo "✅ SUPABASE_URL configurado en backend"
else
    echo "❌ SUPABASE_URL no configurado"
fi

if grep -q "SUPABASE_SERVICE_ROLE_KEY=" backend/.env 2>/dev/null; then
    echo "✅ SUPABASE_SERVICE_ROLE_KEY configurado"
else
    echo "❌ SUPABASE_SERVICE_ROLE_KEY no configurado"
fi

# Frontend
if grep -q "NEXT_PUBLIC_SUPABASE_URL=" frontend/.env.local 2>/dev/null; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL configurado"
else
    echo "❌ NEXT_PUBLIC_SUPABASE_URL no configurado"
fi

if grep -q "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=" frontend/.env.local 2>/dev/null; then
    echo "✅ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY configurado"
else
    echo "❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no configurado"
fi

echo ""
echo "📋 Verificación completada"
```

### 2. 🧪 Test de Conectividad

```bash
# Test de Supabase
curl -H "apikey: tu_anon_key" \
     -H "Authorization: Bearer tu_anon_key" \
     https://tu-proyecto.supabase.co/rest/v1/users?select=count

# Test de Google Maps
curl "https://maps.googleapis.com/maps/api/geocode/json?address=Madrid&key=tu_api_key"
```

## 🚀 Configuración de Producción

### 1. 🔐 Variables de Seguridad

Para producción, asegúrate de:

- [ ] ✅ Usar claves secretas únicas y seguras
- [ ] ✅ Configurar HTTPS en todos los endpoints
- [ ] ✅ Restringir API keys por dominio/IP
- [ ] ✅ Usar variables de entorno del proveedor de hosting
- [ ] ✅ Configurar backup automático de base de datos

### 2. 🌐 URLs de Producción

```env
# Backend Production (.env)
ENVIRONMENT=production
DEBUG=false
NEXT_PUBLIC_API_BASE_URL=https://tu-backend.railway.app
ALLOWED_ORIGINS=https://dale-app.com,https://www.dale-app.com

# Frontend Production (.env.local)
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_API_BASE_URL=https://tu-backend.railway.app
```

## 🆘 Solución de Problemas

### ❌ Error de Conexión a Supabase

**Problema**: `ConnectionError` o `Invalid API Key`

**Soluciones**:
1. Verifica que las URLs y keys sean correctas
2. Asegúrate de que el proyecto no esté pausado
3. Revisa los logs en el dashboard de Supabase

### ❌ Google Maps no carga

**Problema**: "This page can't load Google Maps correctly"

**Soluciones**:
1. Verifica que la API key sea válida
2. Confirma que las APIs estén habilitadas
3. Revisa las restricciones de la API key

### ❌ CORS Errors

**Problema**: "Access to fetch blocked by CORS policy"

**Solución**:
```python
# En backend/main.py, actualiza CORS:
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://tu-dominio.com",
        "https://www.tu-dominio.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## ✅ Checklist Final

Antes de continuar con el setup local:

- [ ] ✅ Cuenta de Supabase configurada
- [ ] ✅ Base de datos creada con el script SQL
- [ ] ✅ API Key de Google Maps generada y configurada
- [ ] ✅ Archivo `.env` del backend creado
- [ ] ✅ Archivo `.env.local` del frontend creado
- [ ] ✅ Variables de entorno verificadas
- [ ] ✅ Editor de código configurado
- [ ] ✅ Scripts de verificación ejecutados

¿Todo configurado correctamente? ¡Ahora puedes continuar con el [Setup Local](local-setup.md)!

---

## 📞 Soporte

Si tienes problemas con la configuración:

1. **📚 Documentación**: Revisa esta guía nuevamente
2. **🔍 FAQ**: [Preguntas Frecuentes](../guides/faq.md)
3. **💬 Discord**: [Comunidad de Desarrolladores](https://discord.gg/dale)
4. **🐛 Issues**: [Reportar en GitHub](https://github.com/dale/app/issues)
5. **📧 Email**: [soporte@dale-app.com](mailto:soporte@dale-app.com)

---

> **💡 Tip**: Guarda tus credenciales de forma segura y nunca las compartas en repositorios públicos. Las variables de entorno están en `.gitignore` por seguridad.