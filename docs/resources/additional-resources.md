# Recursos Adicionales

## 🎯 Visión General

Esta sección contiene recursos útiles para desarrolladores, usuarios y contribuidores del proyecto Dale. Aquí encontrarás enlaces, herramientas, plantillas y referencias que pueden ser de utilidad.

## 📚 Documentación Oficial

### 🏠 Enlaces Principales
- **Sitio Web**: [https://dale-app.com](https://dale-app.com)
- **Documentación**: [https://docs.dale-app.com](https://docs.dale-app.com)
- **API Reference**: [https://api.dale-app.com/docs](https://api.dale-app.com/docs)
- **GitHub**: [https://github.com/dale/app](https://github.com/dale/app)

### 📖 Documentación Técnica
- **Estructura del Proyecto**: [project-structure.md](../development/project-structure.md)
- **Guías de Instalación**: [installation/](../installation/)
- **Desarrollo**: [development/](../development/)
- **APIs**: [api/](../api/)
- **Deployment**: [deployment/](../deployment/)
- **Filosofía SDD**: [sdd/](../sdd/)

## 🛠️ Herramientas de Desarrollo

### 💻 Editores y IDEs

#### Visual Studio Code (Recomendado)
- **Descarga**: [https://code.visualstudio.com/](https://code.visualstudio.com/)
- **Extensiones Recomendadas**:
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
      "christian-kohler.path-intellisense"
    ]
  }
  ```

#### JetBrains PyCharm
- **Professional** (para desarrollo Python)
- **Community** (alternativa gratuita)
- **Características**: Debugging avanzado, refactoring, testing integrado

### 🌐 Herramientas Web

#### Postman (Testing de APIs)
- **Descarga**: [https://www.postman.com/](https://www.postman.com/)
- **Collection Dale**: [Postman Collection](#postman-collection)
- **Variables**: Configure entorno de desarrollo/producción

#### Insomnia (Alternativa)
- **Descarga**: [https://insomnia.rest/](https://insomnia.rest/)
- **Características**: REST, GraphQL, WebSocket testing

#### Swagger UI (Documentación Local)
- **URL Local**: http://localhost:8000/docs
- **Configuración**: Automática con FastAPI

### 🐳 Docker y Containers

#### Docker Desktop
- **Descarga**: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
- **Alternativas**:
  - [Podman](https://podman.io/) (sin daemon)
  - [Lima](https://github.com/lima-vm/lima) (Lima VMs para Docker)

#### Docker Compose
- **Configuraciones Incluidas**:
  - `docker-compose.yml` - Desarrollo local
  - `docker-compose.prod.yml` - Producción
  - `docker-compose.override.yml` - Overrides locales

### 📊 Monitoreo y Analytics

#### Sentry (Error Tracking)
- **Dashboard**: [https://sentry.io/](https://sentry.io/)
- **Configuración**: [Sentry Setup Guide](../development/debugging.md#sentry-integration)

#### Google Analytics
- **Property ID**: G-XXXXXXXXXX (configurar en variables de entorno)
- **Events**: Tracking de eventos custom de Dale

#### Vercel Analytics
- **URL**: [https://vercel.com/analytics](https://vercel.com/analytics)
- **Incluye**: Core Web Vitals, page views, unique visitors

## 📋 Plantillas y Cheatsheets

### 📝 Templates de Issues

#### Bug Report Template
```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Para Reproducir**
1. Ve a '...'
2. Click en '...'
3. Scroll hasta '...'
4. Ver error

**Comportamiento Esperado**
Descripción de lo que esperabas que pasara.

**Screenshots**
Si aplica, añade screenshots del problema.

**Información del Entorno**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
- Dale Version: [e.g. 1.0.0]
```

#### Feature Request Template
```markdown
**Problema/Feature**
Descripción del problema que esta feature resolvería.

**Solución Propuesta**
Descripción de lo que quieres que pase.

**Alternativas Consideradas**
Descripción de cualquier alternativa que hayas considerado.

**Información Adicional**
Añade cualquier contexto adicional sobre la feature request.
```

### 📊 API Testing Cheatsheet

#### Curl Examples Básicos
```bash
# Health Check
curl http://localhost:8000/health

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Search Rides
curl -X GET "http://localhost:8000/api/v1/rides?from_city=Madrid&to_city=Barcelona" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create Ride
curl -X POST http://localhost:8000/api/v1/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "from_city": "Madrid",
    "to_city": "Barcelona", 
    "date_time": "2025-11-15T10:00:00Z",
    "seats_total": 3,
    "price": 25.00
  }'
```

#### JavaScript Fetch Examples
```javascript
// API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Get rides
async function getRides(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/api/v1/rides?${params}`);
  return response.json();
}

// Create booking
async function createBooking(rideId, seatsBooked) {
  const response = await fetch(`${API_BASE}/api/v1/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ ride_id: rideId, seats_booked: seatsBooked })
  });
  return response.json();
}
```

### 🐍 Python Development

#### Requirements Template
```txt
# dale-backend/requirements.txt

# Core FastAPI
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6

# Database
supabase==2.3.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4

# Validation & Serialization  
pydantic==2.5.0
email-validator==2.1.0

# HTTP Client
httpx==0.25.2

# Cache
redis==5.0.1

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0

# Development Tools
black==23.11.0
flake8==6.1.0
mypy==1.7.1
```

#### Environment Variables Template
```env
# dale-backend/.env.example
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

HOST=0.0.0.0
PORT=8000
ENVIRONMENT=development
DEBUG=true

SECRET_KEY=your_secret_key
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256

ALLOWED_ORIGINS=http://localhost:3000

REDIS_URL=redis://localhost:6379
```

### 🎨 Frontend Development

#### Package.json Template
```json
{
  "name": "dale-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "next": "14.0.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.3.2",
    "tailwindcss": "^3.3.5",
    "@supabase/supabase-js": "^2.38.4",
    "lucide-react": "^0.294.0",
    "react-hook-form": "^7.48.2"
  },
  "devDependencies": {
    "@types/jest": "^29.5.8",
    "jest": "^29.7.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  }
}
```

#### Tailwind Config Template
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
        },
        secondary: {
          50: '#fff7ed', 
          500: '#f97316',
          600: '#ea580c',
        }
      }
    },
  },
  plugins: [],
}
```

## 🏃‍♂️ Scripts de Utilidad

### 🚀 Setup Script
```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Configurando entorno de desarrollo Dale..."

# Verificar requisitos
echo "📋 Verificando requisitos..."
command -v python3.11 >/dev/null 2>&1 || { echo "Python 3.11 requerido"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js requerido"; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git requerido"; exit 1; }

# Setup Backend
echo "🐍 Configurando backend..."
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup Frontend  
echo "📱 Configurando frontend..."
cd frontend
npm install
cd ..

# Configurar Git hooks
echo "🔧 Configurando Git hooks..."
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ Setup completado!"
echo "📖 Próximos pasos:"
echo "   1. Configurar variables de entorno en .env"
echo "   2. Ejecutar: ./scripts/start.sh"
```

### 🏃‍♂️ Start Script
```bash
#!/bin/bash
# scripts/start.sh

echo "🏃‍♂️ Iniciando Dale en modo desarrollo..."

# Función para cleanup
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT

# Iniciar Backend
echo "🐍 Iniciando backend..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Esperar a que backend esté listo
sleep 3

# Iniciar Frontend
echo "📱 Iniciando frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Servicios iniciados!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Presiona Ctrl+C para detener todos los servicios"

# Mantener script corriendo
wait
```

### 🧪 Test Script
```bash
#!/bin/bash
# scripts/test.sh

echo "🧪 Ejecutando tests de Dale..."

# Tests Backend
echo "🐍 Tests del backend..."
cd backend
if [ -d "venv" ]; then
    source venv/bin/activate
fi
pytest --cov=app --cov-report=html --cov-report=term
cd ..

# Tests Frontend
echo "📱 Tests del frontend..."
cd frontend
npm test -- --coverage
cd ..

echo "✅ Tests completados!"
echo "📊 Coverage reports:"
echo "   Backend: backend/htmlcov/index.html"
echo "   Frontend: frontend/coverage/index.html"
```

### 🐛 Debug Script
```bash
#!/bin/bash
# scripts/debug.sh

echo "🐛 Iniciando Dale en modo debug..."

# Verificar herramientas de debug
if ! command -v lldb >/dev/null 2>&1; then
    echo "⚠️  LLDB no encontrado (macOS)"
fi

if ! command -v pdb >/dev/null 2>&1; then
    echo "⚠️  pdb no encontrado (Python debugger)"
fi

# Iniciar con debugger
echo "🐍 Iniciando backend con debugger..."
cd backend
source venv/bin/activate
python -m pdb main.py &
BACKEND_PID=$!

echo "📱 Iniciando frontend con debugger..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

wait
```

## 📊 Collections y Configuraciones

### 📮 Postman Collection

Colección de requests para testing de APIs:

```json
{
  "info": {
    "name": "Dale API",
    "description": "Colección de requests para la API de Dale",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"{{testEmail}}\",\n  \"password\": \"{{testPassword}}\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            }
          }
        }
      ]
    },
    {
      "name": "Rides",
      "item": [
        {
          "name": "Search Rides",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/api/v1/rides",
            "query": [
              {
                "key": "from_city",
                "value": "Madrid"
              },
              {
                "key": "to_city", 
                "value": "Barcelona"
              }
            ],
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ]
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:8000"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ]
}
```

### 🔧 VS Code Settings

```json
{
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.terminal.activateEnvironment": true,
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": false,
  "python.linting.flake8Enabled": true,
  "python.linting.mypyEnabled": true,
  "python.formatting.provider": "black",
  "python.formatting.blackArgs": ["--line-length=88"],
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true,
    "source.fixAll": true
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### 🐳 Docker Compose Overrides

```yaml
# docker-compose.override.yml (desarrollo)
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
      - /app/venv
    environment:
      - ENVIRONMENT=development
      - DEBUG=true
      - LOG_LEVEL=DEBUG
    ports:
      - "8000:8000"
    command: ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - CHOKIDAR_USEPOLLING=true
    ports:
      - "3000:3000"
    command: ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

  postgres:
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=dale_dev
      - POSTGRES_USER=dale
      - POSTGRES_PASSWORD=dev_password
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data
      - ./docker/postgres/init-dev.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data

volumes:
  postgres_dev_data:
  redis_dev_data:
```

## 🎓 Tutoriales y Cursos

### 📚 Recursos de Aprendizaje

#### FastAPI
- **Documentación Oficial**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **Tutorial Interactivo**: [https://fastapi.tiangolo.com/tutorial/](https://fastapi.tiangolo.com/tutorial/)
- **Video Tutorial**: [FastAPI en Español](https://www.youtube.com/watch?v=7O2wTg8C1EI)

#### Next.js
- **Documentación**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Tutorial**: [https://nextjs.org/learn](https://nextjs.org/learn)
- **Curso Gratis**: [Next.js Full Course](https://www.youtube.com/watch?v=mTz0GXj8NNe)

#### Supabase
- **Documentación**: [https://supabase.com/docs](https://supabase.com/docs)
- **Tutorial**: [Supabase Academy](https://supabase.com/academy)
- **Crash Course**: [YouTube Tutorial](https://www.youtube.com/watch?v=7uKQBl9uZ00)

#### TypeScript
- **Handbook**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Playground**: [https://www.typescriptlang.org/play/](https://www.typescriptlang.org/play/)
- **Cheatsheet**: [TypeScript Cheatsheets](https://github.com/typescript-cheatsheets/react)

### 🎥 Videos Recomendados

#### Arquitectura y Diseño
- [Clean Architecture](https://www.youtube.com/watch?v=2U6cE9XKgZM) - Robert Martin
- [Domain-Driven Design](https://www.youtube.com/watch?v=oLbJ8D6qbDY) - Eric Evans
- [SOLID Principles](https://www.youtube.com/watch?v=Ntraj80sb8M) - Web Dev Simplified

#### Testing
- [Test-Driven Development](https://www.youtube.com/watch?v=J_vld3AGW9Q) - Test Automation University
- [React Testing](https://www.youtube.com/watch?v=8A4jXEGt0LI) - Kent C. Dodds

### 📖 Libros Recomendados

#### Desarrollo de Software
- **Clean Code** - Robert Martin
- **Clean Architecture** - Robert Martin  
- **Domain-Driven Design** - Eric Evans
- **The Pragmatic Programmer** - David Thomas & Andrew Hunt
- **Design Patterns** - Gang of Four

#### Tecnologías Específicas
- **FastAPI Cookbook** - Lynn Root
- **Real World Next.js** - Michele Riva
- **TypeScript Deep Dive** - Basarat Ali Syed

## 🎯 Proyectos de Práctica

### 🏗️ Proyectos de Ejemplo

#### 1. Clone Simplificado
```bash
# Crear un clone básico de Dale
git clone https://github.com/dale/app.git dale-clone
cd dale-clone
# Eliminar historia, mantener estructura
rm -rf .git
git init
```

#### 2. Feature Adicional
```bash
# Añadir nueva funcionalidad
git checkout -b feature/chat-system
# Implementar chat en tiempo real
```

#### 3. Mobile App
```bash
# Crear React Native app
npx react-native init DaleMobile
# Integrar con API existente
```

### 🧪 Proyectos de Testing

#### 1. Load Testing
```bash
# Instalar Artillery
npm install -g artillery

# Test de carga básico
artillery run load-test.yml
```

#### 2. Security Testing
```bash
# Instalar herramientas de seguridad
npm install -g @owasp/zap-api-scan

# Scan de APIs
zap-api-scan.py -t http://localhost:8000/docs -f openapi
```

## 📞 Canales de Soporte

### 💬 Comunidades

#### Discord
- **Servidor Principal**: [https://discord.gg/dale](https://discord.gg/dale)
- **Canales**:
  - #general - Discusiones generales
  - #development - Preguntas técnicas
  - #bugs - Reportar issues
  - #announcements - Anuncios oficiales

#### GitHub
- **Issues**: [https://github.com/dale/app/issues](https://github.com/dale/app/issues)
- **Discussions**: [https://github.com/dale/app/discussions](https://github.com/dale/app/discussions)
- **Projects**: [https://github.com/dale/app/projects](https://github.com/dale/app/projects)

### 📧 Contacto Directo

#### Email
- **Soporte General**: [soporte@dale-app.com](mailto:soporte@dale-app.com)
- **Desarrollo**: [dev@dale-app.com](mailto:dev@dale-app.com)
- **Partnerships**: [partnerships@dale-app.com](mailto:partnerships@dale-app.com)

#### Social Media
- **Twitter**: [@dale_app](https://twitter.com/dale_app)
- **LinkedIn**: [Dale Platform](https://linkedin.com/company/dale-app)
- **YouTube**: [Dale Channel](https://youtube.com/@daleapp)

### 🆘 Soporte de Emergencia

#### Issues Críticos
- **Email Urgente**: [critical@dale-app.com](mailto:critical@dale-app.com)
- **Response Time**: < 2 horas en horario laboral

#### Reportar Vulnerabilidades
- **Email**: [security@dale-app.com](mailto:security@dale-app.com)
- **PGP Key**: Disponible en el sitio web
- **Bug Bounty**: En desarrollo para 2026

## 🎯 Próximos Pasos

Después de revisar estos recursos:

1. **🔧 Configura tu entorno** usando las plantillas proporcionadas
2. **🧪 Ejecuta los tests** para verificar que todo funciona
3. **📚 Lee la documentación** técnica en detalle
4. **🤝 Únete a la comunidad** en Discord
5. **🚀 Comienza a contribuir** siguiendo nuestras guías

---

> **💡 Tip**: Guarda esta página como bookmark. Contiene muchas referencias útiles que necesitarás durante el desarrollo. ¡Happy coding! 🚀