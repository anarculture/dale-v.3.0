# Estructura del Proyecto

## 🎯 Visión General

Dale sigue una arquitectura de microservicios clara con separación de responsabilidades entre frontend y backend. Esta página detalla la estructura completa del proyecto, organizando archivos, directorios y su propósito.

## 📁 Estructura General

```
dale/                          # Raíz del proyecto
├── .github/                   # GitHub workflows y templates
│   ├── workflows/            # CI/CD pipelines
│   └── ISSUE_TEMPLATE/       # Templates de issues
├── .vscode/                  # Configuración de VS Code
│   ├── settings.json        # Configuraciones del workspace
│   ├── launch.json          # Configuración de debugging
│   ├── extensions.json      # Extensiones recomendadas
│   └── tasks.json           # Tareas personalizadas
├── backend/                  # Backend FastAPI
│   ├── main.py              # Aplicación principal
│   ├── requirements.txt     # Dependencias Python
│   ├── .env                 # Variables de entorno
│   ├── .env.example         # Ejemplo de variables
│   ├── .dockerignore        # Archivos excluidos de Docker
│   ├── Dockerfile           # Imagen Docker de producción
│   ├── Dockerfile.dev       # Imagen Docker de desarrollo
│   ├── alembic/             # Migraciones de BD (futuro)
│   │   └── versions/        # Versiones de migraciones
│   ├── tests/               # Tests del backend
│   │   ├── conftest.py      # Configuración de pytest
│   │   ├── test_auth.py     # Tests de autenticación
│   │   ├── test_rides.py    # Tests de viajes
│   │   ├── test_bookings.py # Tests de reservas
│   │   └── test_users.py    # Tests de usuarios
│   ├── app/                 # Código de la aplicación
│   │   ├── __init__.py      # Inicializador del paquete
│   │   ├── main.py          # Instancia de FastAPI
│   │   ├── config.py        # Configuraciones
│   │   ├── dependencies.py  # Dependencias comunes
│   │   ├── models/          # Modelos de datos Pydantic
│   │   │   ├── __init__.py
│   │   │   ├── user.py      # Modelos de usuario
│   │   │   ├── ride.py      # Modelos de viaje
│   │   │   ├── booking.py   # Modelos de reserva
│   │   │   └── auth.py      # Modelos de autenticación
│   │   ├── schemas/         # Esquemas de API
│   │   │   ├── __init__.py
│   │   │   ├── user.py      # Esquemas de usuario
│   │   │   ├── ride.py      # Esquemas de viaje
│   │   │   ├── booking.py   # Esquemas de reserva
│   │   │   └── auth.py      # Esquemas de autenticación
│   │   ├── api/             # Rutas de la API
│   │   │   ├── __init__.py
│   │   │   ├── deps.py      # Dependencias de API
│   │   │   ├── v1/          # Versión 1 de la API
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py  # Rutas de autenticación
│   │   │   │   ├── users.py # Rutas de usuarios
│   │   │   │   ├── rides.py # Rutas de viajes
│   │   │   │   └── bookings.py # Rutas de reservas
│   │   │   └── errors.py    # Manejo de errores
│   │   ├── services/        # Lógica de negocio
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py # Servicio de autenticación
│   │   │   ├── ride_service.py # Servicio de viajes
│   │   │   ├── booking_service.py # Servicio de reservas
│   │   │   ├── user_service.py    # Servicio de usuarios
│   │   │   └── notification_service.py # Servicio de notificaciones
│   │   ├── repositories/    # Acceso a datos
│   │   │   ├── __init__.py
│   │   │   ├── base.py      # Repositorio base
│   │   │   ├── user.py      # Repositorio de usuarios
│   │   │   ├── ride.py      # Repositorio de viajes
│   │   │   └── booking.py   # Repositorio de reservas
│   │   └── utils/           # Utilidades
│   │       ├── __init__.py
│   │       ├── security.py  # Utilidades de seguridad
│   │       ├── database.py  # Configuración de BD
│   │       ├── cache.py     # Cache Redis
│   │       ├── logging.py   # Configuración de logs
│   │       └── validators.py # Validadores personalizados
│   └── venv/                # Entorno virtual (excluido de Git)
├── frontend/                 # Frontend Next.js
│   ├── .env.local           # Variables de entorno locales
│   ├── .env.example         # Ejemplo de variables
│   ├── .dockerignore        # Archivos excluidos de Docker
│   ├── Dockerfile           # Imagen Docker de producción
│   ├── Dockerfile.dev       # Imagen Docker de desarrollo
│   ├── next.config.js       # Configuración de Next.js
│   ├── tailwind.config.js   # Configuración de Tailwind
│   ├── tsconfig.json        # Configuración de TypeScript
│   ├── jest.config.js       # Configuración de Jest
│   ├── package.json         # Dependencias y scripts
│   ├── package-lock.json    # Lock file de npm
│   ├── public/              # Archivos estáticos
│   │   ├── favicon.ico      # Favicon
│   │   ├── manifest.json    # PWA manifest
│   │   ├── sw.js            # Service Worker
│   │   ├── icon-192.png     # Icono PWA 192x192
│   │   ├── icon-512.png     # Icono PWA 512x512
│   │   └── images/          # Imágenes estáticas
│   ├── src/                 # Código fuente
│   │   ├── app/             # App Router de Next.js 13+
│   │   │   ├── layout.tsx   # Layout raíz
│   │   │   ├── page.tsx     # Página principal
│   │   │   ├── globals.css  # Estilos globales
│   │   │   ├── loading.tsx  # Componente de loading
│   │   │   ├── error.tsx    # Página de error global
│   │   │   ├── not-found.tsx # Página 404
│   │   │   ├── login/       # Páginas de login
│   │   │   │   ├── page.tsx
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── signup/      # Páginas de registro
│   │   │   │   ├── page.tsx
│   │   │   │   └── SignupForm.tsx
│   │   │   ├── rides/       # Páginas de viajes
│   │   │   │   ├── page.tsx # Lista de viajes
│   │   │   │   ├── offer/   # Ofrecer viaje
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── RideForm.tsx
│   │   │   │   └── [id]/    # Detalle de viaje
│   │   │   │       ├── page.tsx
│   │   │   │       └── RideDetails.tsx
│   │   │   ├── bookings/    # Páginas de reservas
│   │   │   │   ├── page.tsx # Mis reservas
│   │   │   │   ├── [id]/    # Detalle de reserva
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── BookingDetails.tsx
│   │   │   │   └── confirm/ # Confirmar reserva
│   │   │   │       ├── page.tsx
│   │   │   │       └── BookingForm.tsx
│   │   │   ├── profile/     # Páginas de perfil
│   │   │   │   ├── page.tsx # Perfil de usuario
│   │   │   │   ├── edit/    # Editar perfil
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── ProfileForm.tsx
│   │   │   │   └── settings/ # Configuraciones
│   │   │   │       └── page.tsx
│   │   │   └── api/         # API routes (futuro)
│   │   │       ├── auth/
│   │   │       └── rides/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── ui/          # Componentes base de UI
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   └── index.ts
│   │   │   ├── forms/       # Formularios especializados
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   ├── RideForm.tsx
│   │   │   │   ├── BookingForm.tsx
│   │   │   │   └── ProfileForm.tsx
│   │   │   ├── layout/      # Componentes de layout
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── Breadcrumbs.tsx
│   │   │   ├── rides/       # Componentes de viajes
│   │   │   │   ├── RideCard.tsx
│   │   │   │   ├── RideFilters.tsx
│   │   │   │   ├── RideList.tsx
│   │   │   │   ├── RideMap.tsx
│   │   │   │   ├── RideSearch.tsx
│   │   │   │   └── index.ts
│   │   │   ├── bookings/    # Componentes de reservas
│   │   │   │   ├── BookingCard.tsx
│   │   │   │   ├── BookingStatus.tsx
│   │   │   │   ├── BookingActions.tsx
│   │   │   │   └── index.ts
│   │   │   ├── maps/        # Componentes de mapas
│   │   │   │   ├── MapComponent.tsx
│   │   │   │   ├── MapMarker.tsx
│   │   │   │   ├── RouteDisplay.tsx
│   │   │   │   └── index.ts
│   │   │   └── common/      # Componentes comunes
│   │   │       ├── UserAvatar.tsx
│   │   │       ├── RatingStars.tsx
│   │   │       ├── DateTimePicker.tsx
│   │   │       └── index.ts
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useAuth.ts   # Hook de autenticación
│   │   │   ├── useRides.ts  # Hook para viajes
│   │   │   ├── useBookings.ts # Hook para reservas
│   │   │   ├── useUser.ts   # Hook para usuario
│   │   │   ├── useLocalStorage.ts # Hook para localStorage
│   │   │   ├── useGeolocation.ts # Hook para geolocalización
│   │   │   └── index.ts
│   │   ├── lib/             # Utilidades y configuración
│   │   │   ├── api.ts       # Cliente API
│   │   │   ├── supabase.ts  # Cliente Supabase
│   │   │   ├── auth.ts      # Utilidades de autenticación
│   │   │   ├── maps.ts      # Utilidades de mapas
│   │   │   ├── utils.ts     # Utilidades generales
│   │   │   ├── constants.ts # Constantes de la app
│   │   │   └── validators.ts # Validadores
│   │   ├── types/           # Definiciones de tipos TypeScript
│   │   │   ├── api.ts       # Tipos de API
│   │   │   ├── user.ts      # Tipos de usuario
│   │   │   ├── ride.ts      # Tipos de viaje
│   │   │   ├── booking.ts   # Tipos de reserva
│   │   │   └── index.ts
│   │   └── styles/          # Archivos de estilos
│   │       ├── globals.css  # Estilos globales
│   │       ├── components.css # Estilos de componentes
│   │       └── utils.css    # Utilidades CSS
│   └── tests/               # Tests del frontend
│       ├── __mocks__/       # Mocks de dependencias
│       ├── components/      # Tests de componentes
│       ├── hooks/           # Tests de hooks
│       ├── pages/           # Tests de páginas
│       └── utils/           # Tests de utilidades
├── docs/                    # Documentación (MkDocs)
│   ├── mkdocs.yml          # Configuración de MkDocs
│   ├── index.md            # Página principal
│   ├── introduction/       # Documentación de introducción
│   ├── installation/       # Guías de instalación
│   ├── development/        # Guías de desarrollo
│   ├── api/                # Documentación de APIs
│   ├── deployment/         # Guías de deployment
│   ├── sdd/                # Filosofía SDD
│   ├── guides/             # Guías de usuario
│   └── resources/          # Recursos adicionales
├── docker/                  # Configuración de Docker
│   ├── postgres/           # Configuración de PostgreSQL
│   ├── redis/              # Configuración de Redis
│   ├── nginx/              # Configuración de Nginx
│   └── scripts/            # Scripts de Docker
├── scripts/                 # Scripts de utilidad
│   ├── setup.sh            # Script de setup inicial
│   ├── deploy.sh           # Script de deployment
│   ├── backup.sh           # Script de backup
│   ├── check-health.sh     # Script de health check
│   └── clean.sh            # Script de limpieza
├── .gitignore              # Archivos excluidos de Git
├── .dockerignore           # Archivos excluidos de Docker
├── .env.example            # Ejemplo de variables de entorno
├── docker-compose.yml      # Configuración de Docker Compose
├── docker-compose.override.yml # Overrides para desarrollo
├── docker-compose.prod.yml # Configuración para producción
├── README.md               # Documentación principal
├── LICENSE                 # Licencia del proyecto
└── CHANGELOG.md            # Historial de cambios
```

## 🐍 Backend Structure Deep Dive

### 📂 Arquitectura Modular

El backend está organizado siguiendo los principios de **Domain-Driven Design (DDD)** y **Clean Architecture**:

#### App Directory Structure
```python
app/
├── __init__.py          # Inicializador del paquete principal
├── main.py             # Instancia de FastAPI con middleware
├── config.py           # Configuraciones centralizadas
├── dependencies.py     # Dependencias compartidas

# Dominios (Domain Layer)
├── models/             # Entidades del dominio (Pydantic)
├── schemas/            # DTOs para API (Pydantic)

# Application Layer
├── services/           # Casos de uso y lógica de negocio
├── repositories/       # Abstracción del acceso a datos

# Infrastructure Layer
├── api/               # Controladores HTTP (Routes)
└── utils/             # Herramientas de infraestructura
```

#### Modelos (models/)
```python
# models/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    rating: float = 5.0
    total_rides: int = 0
    verification_status: str = "pending"
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

#### Servicios (services/)
```python
# services/ride_service.py
from typing import List, Optional
from app.repositories.ride import RideRepository
from app.models.ride import RideCreate, RideUpdate

class RideService:
    def __init__(self, ride_repo: RideRepository):
        self.ride_repo = ride_repo
    
    async def create_ride(self, ride_data: RideCreate, driver_id: str) -> Ride:
        """Crear un nuevo viaje"""
        # Lógica de negocio
        ride = await self.ride_repo.create(ride_data, driver_id)
        return ride
    
    async def search_rides(
        self, 
        filters: dict, 
        limit: int = 20, 
        offset: int = 0
    ) -> List[Ride]:
        """Buscar viajes con filtros"""
        return await self.ride_repo.search(filters, limit, offset)
```

#### Repositorios (repositories/)
```python
# repositories/base.py
from abc import ABC, abstractmethod
from typing import Generic, TypeVar, List, Optional

T = TypeVar('T')

class BaseRepository(ABC, Generic[T]):
    @abstractmethod
    async def create(self, data: dict) -> T:
        pass
    
    @abstractmethod
    async def get_by_id(self, id: str) -> Optional[T]:
        pass
    
    @abstractmethod
    async def search(self, filters: dict, limit: int, offset: int) -> List[T]:
        pass
```

### 🔧 Configuración y Dependencias

#### Configuración Centralizada
```python
# config.py
from pydantic import BaseSettings
from typing import List

class Settings(BaseSettings):
    # Database
    supabase_url: str
    supabase_key: str
    supabase_jwt_secret: str
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # CORS
    allowed_origins: List[str] = []
    
    # Cache
    redis_url: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

#### Dependencias de FastAPI
```python
# dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from jose import JWTError, jwt
from app.config import settings

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(
            token.credentials, 
            settings.secret_key, 
            algorithms=[settings.algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    # Aquí buscarías el usuario en la BD
    # user = await user_service.get_by_email(email)
    # if user is None:
    #     raise credentials_exception
    # return user
```

## 📱 Frontend Structure Deep Dive

### 🏗️ App Router Structure

Next.js 13+ usa el **App Router** que organiza el código por segmentos de URL:

#### Layout y Nested Routes
```typescript
// app/layout.tsx - Layout raíz
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dale - Carpooling',
  description: 'Comparte viajes y ahorra en transporte',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### Nested Layouts
```typescript
// app/rides/layout.tsx - Layout para sección de viajes
export default function RidesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="rides-section">
      <RidesNavigation />
      {children}
    </div>
  )
}

// app/rides/page.tsx - Página índice de /rides
export default function RidesPage() {
  return (
    <div>
      <h1>Todos los Viajes</h1>
      <RideFilters />
      <RideList />
    </div>
  )
}
```

### 🎨 Component Architecture

#### UI Components
```typescript
// components/ui/Button.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-blue-500 text-white hover:bg-blue-600': variant === 'primary',
          'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
          'border border-gray-300 hover:bg-gray-50': variant === 'outline',
        },
        {
          'px-3 py-1 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
```

#### Feature Components
```typescript
// components/rides/RideCard.tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserAvatar } from '@/components/common/UserAvatar';
import { RatingStars } from '@/components/common/RatingStars';
import { Ride } from '@/types/ride';

interface RideCardProps {
  ride: Ride;
  onBook?: (rideId: string) => void;
  onCancel?: (rideId: string) => void;
}

export const RideCard: React.FC<RideCardProps> = ({
  ride,
  onBook,
  onCancel
}) => {
  return (
    <Card className="ride-card">
      <div className="ride-header">
        <UserAvatar user={ride.driver} />
        <div className="ride-info">
          <h3>{ride.driver.name}</h3>
          <RatingStars rating={ride.driver.rating} />
        </div>
      </div>
      
      <div className="ride-route">
        <div className="route-point">
          <span className="city">{ride.from_city}</span>
          <span className="time">{formatDateTime(ride.date_time)}</span>
        </div>
        <div className="route-arrow">→</div>
        <div className="route-point">
          <span className="city">{ride.to_city}</span>
          <span className="price">${ride.price}</span>
        </div>
      </div>
      
      <div className="ride-footer">
        <span className="seats">
          {ride.seats_available} / {ride.seats_total} asientos
        </span>
        {onBook && (
          <Button onClick={() => onBook(ride.id)}>
            Reservar
          </Button>
        )}
      </div>
    </Card>
  );
};
```

### 🔗 Custom Hooks

```typescript
// hooks/useRides.ts
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { Ride, RideFilters } from '@/types/ride';

export const useRides = (filters?: RideFilters) => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        setLoading(true);
        const response = await api.get('/rides', {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        });
        setRides(response.data);
      } catch (err) {
        setError('Error al cargar viajes');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [filters, token]);

  const createRide = async (rideData: Partial<Ride>) => {
    try {
      const response = await api.post('/rides', rideData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRides(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      throw new Error('Error al crear viaje');
    }
  };

  return {
    rides,
    loading,
    error,
    createRide,
    refetch: () => window.location.reload()
  };
};
```

### 🗺️ Utils y Configuración

```typescript
// lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
}
```

## 🔧 Configuración de Herramientas

### 🐍 Python Tools Configuration

#### pyproject.toml
```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "dale-backend"
version = "1.0.0"
description = "Backend for Dale Carpooling Platform"
readme = "README.md"
requires-python = ">=3.11"
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.11",
]

[project.dependencies]
fastapi = "0.104.1"
uvicorn = {extras = ["standard"], version = "0.24.0"}
supabase = "2.3.0"
python-jose = {extras = ["cryptography"], version = "3.3.0"}
pydantic = "2.5.0"

[project.optional-dependencies]
dev = [
    "pytest>=7.4.3",
    "pytest-asyncio>=0.21.1",
    "pytest-cov>=4.1.0",
    "black>=23.11.0",
    "flake8>=6.1.0",
    "mypy>=1.7.1",
]

[tool.black]
line-length = 88
target-version = ['py311']
include = '\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88

[tool.mypy]
python_version = "3.11"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
disallow_untyped_decorators = true
no_implicit_optional = true
warn_redundant_casts = true
warn_unused_ignores = true
warn_no_return = true
warn_unreachable = true
strict_equality = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --cov=app --cov-report=term-missing --cov-report=html"
python_files = "test_*.py"
python_classes = "Test*"
python_functions = "test_*"
asyncio_mode = "auto"
```

### ⚛️ Frontend Tools Configuration

#### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        secondary: {
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'supabase.co',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.dale-app.com/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Optimizaciones de build
  compiler: {
    // Remover console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // PWA configuration
  async generateSWmanifest(config) {
    return {
      name: 'Dale - Carpooling App',
      short_name: 'Dale',
      description: 'Comparte viajes y ahorra en transporte',
      start_url: '/',
      background_color: '#ffffff',
      theme_color: '#3b82f6',
      display: 'standalone',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    };
  },
};

module.exports = nextConfig;
```

## 📝 Archivos de Configuración Importantes

### 🔒 Environment Files

#### .env.example
```env
# Backend Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Server Configuration
HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
DEBUG=true

# Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Cache
REDIS_URL=redis://localhost:6379

# Frontend Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
NEXT_PUBLIC_ENVIRONMENT=development
```

### 🐳 Docker Configuration

#### .dockerignore
```dockerfile
# Git
.git
.gitignore
.gitattributes

# Documentation
README.md
CHANGELOG.md
docs/

# Environment files
.env*
!.env.example

# Python
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
ENV/
env.bak/
venv.bak/
.pytest_cache/
.coverage
htmlcov/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output

# Logs
logs/
*.log
```

## 🎯 Convenciones de Nombrado

### 📁 Archivos y Directorios
- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase comenzando con `use` (`useAuth.ts`)
- **Utilidades**: camelCase (`formatDate.ts`)
- **Constantes**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
- **Configuración**: kebab-case o snake_case (`next.config.js`, `tsconfig.json`)

### 🔤 Nombres de Clases y Funciones
```typescript
// Componentes: PascalCase
export const UserProfile: React.FC = () => {};

// Funciones: camelCase
const getUserData = async (userId: string) => {};

// Constantes: UPPER_SNAKE_CASE
export const API_ENDPOINTS = {
  USERS: '/api/users',
  RIDES: '/api/rides',
} as const;

// Tipos: PascalCase con sufijo
interface UserData {
  id: string;
  name: string;
}

type UserProfileProps = {
  user: UserData;
};
```

### 📊 Estructura de URLs
```
# API Endpoints
GET    /api/users/{user_id}
POST   /api/users
PATCH  /api/users/{user_id}

GET    /api/rides
POST   /api/rides
GET    /api/rides/{ride_id}
PATCH  /api/rides/{ride_id}/cancel

POST   /api/bookings
GET    /api/bookings/{booking_id}
PATCH  /api/bookings/{booking_id}/cancel

# Frontend Routes
/               # Página principal
/login          # Inicio de sesión
/signup         # Registro
/rides          # Lista de viajes
/rides/offer    # Crear viaje
/rides/[id]     # Detalle de viaje
/bookings       # Mis reservas
/profile        # Perfil de usuario
```

## ✅ Checklist de Estructura

Antes de empezar a desarrollar, verifica que:

- [ ] ✅ **Backend**: Estructura modular con separación clara de responsabilidades
- [ ] ✅ **Frontend**: App Router configurado con Next.js 14
- [ ] ✅ **Componentes**: UI components reutilizables y bien organizados
- [ ] ✅ **Hooks**: Custom hooks para lógica de estado compartida
- [ ] ✅ **Types**: Definiciones de TypeScript completas
- [ ] ✅ **Utils**: Funciones de utilidad organizadas por dominio
- [ ] ✅ **Configuración**: Archivos de configuración optimizados
- [ ] ✅ **Testing**: Estructura preparada para tests
- [ ] ✅ **Docker**: Configuración de contenedores completa
- [ ] ✅ **Documentación**: Comentarios y docstrings apropiados

## 🎯 Próximos Pasos

Con la estructura clara, ahora puedes:

1. **📚 Profundizar en [APIs](../api/)** - Entender todos los endpoints
2. **🧪 Leer sobre [Testing](./testing.md)** - Implementar tests
3. **🚀 Preparar [Deployment](../deployment/)** - Configurar producción
4. **🤝 Contribuir** siguiendo las [convenciones](./coding-standards.md)

---

> **🏗️ Tip**: Esta estructura está diseñada para escalar. A medida que crezca el proyecto, mantén la separación de responsabilidades y la modularidad. ¡Una buena estructura es la base de un código mantenible! 🚀