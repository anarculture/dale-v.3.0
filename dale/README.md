# 🚗 Dale - PWA de Ride-Sharing

> **Progressive Web App móvil tipo BlaBlaCar** para compartir viajes urbanos e interurbanos.

[![CI/CD](https://github.com/tu-org/dale/workflows/test/badge.svg)](https://github.com/tu-org/dale/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 Descripción

**Dale** conecta conductores (drivers) que ofrecen asientos disponibles en sus viajes con pasajeros (riders) que buscan transporte económico y sostenible. Una experiencia mobile-first, instalable y offline-capable.

### ✨ Características MVP

- ✅ **Autenticación segura** (Supabase Auth)
- ✅ **Publicar viajes** con origen, destino, fecha, precio y asientos
- ✅ **Buscar viajes** por ruta y fecha
- ✅ **Reservar y cancelar** asientos
- ✅ **Perfil de usuario** con historial
- ✅ **PWA instalable** con soporte offline
- ✅ **Mobile-first** y accesible (WCAG AA)

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | Next.js 14 + TypeScript + TailwindCSS |
| **UI Components** | Kirk UI (wrappers custom) |
| **Backend** | FastAPI + Prisma ORM |
| **Base de datos** | PostgreSQL (Supabase) |
| **Autenticación** | Supabase Auth (JWT) |
| **Hosting** | Vercel (frontend) + Supabase (backend) |
| **Testing** | Playwright (E2E) + pytest |
| **Documentación** | MkDocs Material |

---

## 🚀 Quick Start

### Prerrequisitos

- **Node.js** ≥ 18.x
- **Python** ≥ 3.11
- **Docker** & **Docker Compose**
- **Git**

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-org/dale.git
cd dale
```

### 2. Configurar variables de entorno

#### Frontend (host)
```bash
cd frontend
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

#### Backend (contenedor)
```bash
cd ../backend
cp .env.example .env
# Editar .env con DATABASE_URL y secrets
```

### 3. Instalar dependencias

#### Frontend (ejecutar en host)
```bash
# Desde /dale/frontend
npm install
```

#### Backend (se instalan automáticamente en Docker)
```bash
# No requiere instalación manual, Docker lo gestiona
```

### 4. Levantar servicios

#### Backend (en contenedor)
```bash
# Desde /dale/infra
docker compose up -d
```

Esto levanta:
- FastAPI en `http://localhost:8000`
- Conexión a PostgreSQL de Supabase

#### Frontend (en host, mejor DX)
```bash
# Desde /dale/frontend
npm run dev
```

Frontend disponible en: `http://localhost:3000`

### 5. Aplicar migraciones de base de datos

```bash
# Desde /dale/backend (dentro del contenedor)
docker compose exec backend npx prisma migrate deploy
```

### 6. (Opcional) Cargar datos de ejemplo

```bash
# Desde /dale/backend
docker compose exec backend python scripts/seed.py
```

---

## 📂 Estructura del Proyecto

```
/dale
├─ /.spec/              # Spec-Driven Development
│  ├─ constitution.md   # Reglas del proyecto
│  ├─ specs/            # Especificaciones funcionales
│  ├─ plans/            # Planes técnicos
│  ├─ tasks/            # Tareas de implementación
│  └─ evals/            # Criterios de aceptación
│
├─ /frontend            # Next.js (App Router)
│  ├─ /src/app          # Páginas: /, /rides, /offer, /bookings, /profile
│  ├─ /src/components   # RideCard, RideForm, etc.
│  ├─ /src/lib          # API client, utils
│  ├─ /public           # Icons, manifest.json (PWA)
│  └─ package.json
│
├─ /backend             # FastAPI + Prisma
│  ├─ /app/api          # Endpoints: /rides, /bookings, /me
│  ├─ /prisma           # Schema + migraciones
│  ├─ Dockerfile
│  └─ pyproject.toml
│
├─ /infra               # Docker Compose + GitHub Actions
│  ├─ docker-compose.yml
│  └─ /.github/workflows
│
├─ /docs                # MkDocs documentation
│  ├─ mkdocs.yml
│  └─ /docs/index.md
│
└─ README.md            # Este archivo
```

---

## 🧪 Testing

### Backend (pytest)

```bash
# Desde /dale/backend
docker compose exec backend pytest
```

### Frontend (Playwright E2E)

```bash
# Desde /dale/frontend
npm run test:e2e
```

### Cobertura

```bash
# Backend
docker compose exec backend pytest --cov

# Frontend (component tests)
npm run test:coverage
```

---

## 📚 Documentación

La documentación completa está disponible en MkDocs:

```bash
# Desde /dale/docs
pip install mkdocs-material
mkdocs serve
```

Navegar a: `http://localhost:8001`

### Secciones principales:
- [Welcome](docs/index.md)
- [Filosofía SDD](docs/sdd-philosophy.md)
- [Environment Setup](docs/setup.md)
- [Frontend Guide](docs/frontend.md)
- [Backend Guide](docs/backend.md)
- [API Reference](docs/api-reference.md)
- [Deployment](docs/deployment.md)

---

## 🔐 Seguridad

- **Autenticación JWT** (Supabase Auth)
- **Validación de inputs** (Pydantic en backend, Zod en frontend)
- **HTTPS obligatorio** en producción
- **CSP headers** configurados
- **Rate limiting** (100 req/min por IP)
- **No secrets en código** (solo `.env`)

Revisa: `/.spec/constitution.md#security-checklist`

---

## 🌍 i18n (Internacionalización)

- **Español (ES)**: Idioma por defecto ✅
- **English (EN)**: Preparado, traducción pendiente

Archivos de traducción: `/frontend/messages/{locale}.json`

---

## 🚢 Deployment

### Desarrollo

```bash
# Frontend (host)
cd frontend && npm run dev

# Backend (Docker)
cd infra && docker compose up
```

### Producción

#### Frontend (Vercel)
1. Conectar repo a Vercel
2. Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático en push a `main`

#### Backend (Supabase)
1. Configurar Supabase project
2. Aplicar migraciones: `npx prisma migrate deploy`
3. (Opcional) Deploy edge functions si se requiere lógica serverless adicional

Detalles completos: [docs/deployment.md](docs/deployment.md)

---

## 🛠️ Scripts Comunes

### Makefile (raíz)

```bash
make dev          # Levantar frontend + backend
make test         # Ejecutar todos los tests
make seed         # Cargar datos de ejemplo
make clean        # Limpiar builds y node_modules
make docs         # Servir documentación MkDocs
```

### Frontend (npm)

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run test:e2e  # Tests Playwright
npm run lint      # ESLint + Prettier
```

### Backend (Docker)

```bash
docker compose up -d              # Levantar backend
docker compose exec backend bash  # Shell dentro del contenedor
docker compose logs -f backend    # Ver logs en tiempo real
```

---

## 🤝 Contribuir

Este proyecto sigue **Spec-Driven Development (SDD)**. Antes de contribuir:

1. Lee **[.spec/constitution.md](.spec/constitution.md)**
2. Revisa las specs existentes en `/.spec/specs/`
3. Crea una nueva spec si tu feature no existe
4. Sigue el workflow: **Spec → Plan → Tasks → Implementation → Evals**

### Pull Request Checklist

- [ ] La feature está especificada en `/.spec/specs/`
- [ ] Hay un plan técnico en `/.spec/plans/`
- [ ] Todos los tests pasan (CI verde)
- [ ] Cobertura de tests cumple mínimos (≥80% backend, ≥70% frontend)
- [ ] Accesibilidad verificada (axe)
- [ ] Performance budget respetado (Lighthouse)
- [ ] Documentación actualizada

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para detalles.

---

## 📞 Soporte

- **Documentación**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/tu-org/dale/issues)
- **Discusiones**: [GitHub Discussions](https://github.com/tu-org/dale/discussions)

---

## 🙏 Agradecimientos

- **BlaBlaCar** por inspirar el modelo de negocio
- **Kirk UI** por el design system
- **Supabase** por la infraestructura backend
- **Vercel** por el hosting frontend

---

**Desarrollado con ❤️ siguiendo Spec-Driven Development**
