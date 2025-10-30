# Docker

## 🎯 Visión General

Docker te permite ejecutar Dale en contenedores aislados, garantizando consistencia entre diferentes entornos y facilitando el deployment. Esta guía te ayudará a configurar y usar Dale con Docker.

## 📋 Prerrequisitos

Antes de comenzar:

- [ ] ✅ [Docker](https://docs.docker.com/get-docker/) instalado y funcionando
- [ ] ✅ [Docker Compose](https://docs.docker.com/compose/install/) instalado
- [ ] ✅ [Git](https://git-scm.com/) instalado
- [ ] ✅ [Configuración](configuration.md) completada

## 🚀 Setup Rápido con Docker

### 1. 📥 Clonar y Configurar

```bash
# Clonar repositorio
git clone https://github.com/dale/app.git dale-docker
cd dale-docker

# Configurar variables de entorno
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# Editar con tus credenciales reales
nano .env
```

### 2. 🐳 Ejecutar con Docker Compose

```bash
# Construir e iniciar todos los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver estado de contenedores
docker-compose ps
```

### 3. ✅ Verificar Funcionamiento

```bash
# Test del frontend
curl http://localhost:3000

# Test del backend
curl http://localhost:8000/health

# Test de la documentación API
curl http://localhost:8000/docs
```

## 🏗️ Configuración de Docker

### 📁 Estructura de Archivos Docker

```
dale/
├── docker-compose.yml          # Configuración principal
├── docker-compose.override.yml # Desarrollo (local)
├── docker-compose.prod.yml     # Producción
├── backend/
│   ├── Dockerfile              # Imagen del backend
│   ├── Dockerfile.dev          # Desarrollo con hot reload
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile              # Imagen del frontend
│   ├── Dockerfile.dev          # Desarrollo con hot reload
│   ├── package.json
│   └── .dockerignore
└── nginx/
    ├── Dockerfile              # Reverse proxy
    ├── nginx.conf
    └── default.conf
```

### 🐳 Docker Compose Configuration

#### docker-compose.yml (Principal)

```yaml
version: '3.8'

services:
  # Backend FastAPI
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: dale-backend
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=development
      - DEBUG=true
    env_file:
      - backend/.env
    volumes:
      - ./backend:/app
      - /app/venv
    depends_on:
      - redis
      - postgres
    networks:
      - dale-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Frontend Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: dale-frontend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    env_file:
      - frontend/.env.local
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend
    networks:
      - dale-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Redis para caching
  redis:
    image: redis:7-alpine
    container_name: dale-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - dale-network
    restart: unless-stopped
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  # PostgreSQL (alternativa a Supabase local)
  postgres:
    image: postgres:15-alpine
    container_name: dale-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=dale
      - POSTGRES_USER=dale
      - POSTGRES_PASSWORD=dale_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - dale-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dale -d dale"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Nginx reverse proxy
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    container_name: dale-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - dale-network
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:

networks:
  dale-network:
    driver: bridge
```

#### docker-compose.override.yml (Desarrollo)

```yaml
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

  # Desarrollo con hot reload
  postgres:
    ports:
      - "5432:5432"
```

#### docker-compose.prod.yml (Producción)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - ENVIRONMENT=production
      - DEBUG=false
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    restart: always

  # Sin volúmenes de desarrollo
  nginx:
    build:
      context: ./nginx
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf
    restart: always
```

### 🐍 Backend Dockerfile

#### Dockerfile (Producción)

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim as builder

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Configurar directorio de trabajo
WORKDIR /app

# Copiar requirements y instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage final
FROM python:3.11-slim

# Instalar curl para healthchecks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Crear usuario no-root
RUN useradd --create-home --shell /bin/bash app
USER app
WORKDIR /home/app

# Copiar dependencias instaladas desde builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copiar código de la aplicación
COPY --chown=app:app . .

# Exponer puerto
EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Comando por defecto
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Dockerfile.dev (Desarrollo)

```dockerfile
# backend/Dockerfile.dev
FROM python:3.11-slim

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Crear entorno virtual
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Configurar directorio de trabajo
WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando con hot reload
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 📱 Frontend Dockerfile

#### Dockerfile (Producción)

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

# Configurar directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Stage final
FROM node:18-alpine as runtime

# Instalar serve para servir la aplicación
RUN npm install -g serve

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Configurar directorio de trabajo
WORKDIR /app

# Copiar archivos de build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Comando
CMD ["serve", "-s", "public", "-l", "3000"]
```

#### Dockerfile.dev (Desarrollo)

```dockerfile
# frontend/Dockerfile.dev
FROM node:18-alpine

# Instalar herramientas de desarrollo
RUN apk add --no-cache git

# Configurar directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar todas las dependencias (incluye devDependencies)
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando con hot reload
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### 🌐 Nginx Configuration

#### nginx/nginx.conf

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # Logs
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                   '$status $body_bytes_sent "$http_referer" '
                   '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    # Upstream servers
    upstream backend {
        server backend:8000;
    }
    
    upstream frontend {
        server frontend:3000;
    }
    
    # Redirect HTTP to HTTPS (for production)
    server {
        listen 80;
        server_name _;
        
        # For development, just proxy to services
        location /api/ {
            proxy_pass http://backend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
        
        location / {
            proxy_pass http://frontend/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

#### nginx/default.conf (Alternativo)

```nginx
# nginx/default.conf
server {
    listen 80;
    server_name localhost;
    
    # Backend API
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Health check
    location /health {
        proxy_pass http://backend/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Frontend
    location / {
        proxy_pass http://frontend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        proxy_pass http://frontend;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🚀 Comandos de Docker

### 🏃‍♂️ Comandos Básicos

```bash
# Construir e iniciar servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend

# Ver estado de contenedores
docker-compose ps

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v
```

### 🔄 Comandos de Desarrollo

```bash
# Reconstruir solo un servicio
docker-compose build backend
docker-compose up -d backend

# Ver logs con timestamp
docker-compose logs -f -t

# Ejecutar comando en contenedor
docker-compose exec backend bash
docker-compose exec frontend sh

# Acceder a la base de datos
docker-compose exec postgres psql -U dale -d dale

# Monitorear recursos
docker stats

# Limpiar contenedores e imágenes no utilizadas
docker system prune
```

### 🧪 Comandos de Testing

```bash
# Ejecutar tests en contenedor
docker-compose exec backend pytest
docker-compose exec frontend npm test

# Ejecutar linting
docker-compose exec backend flake8 .
docker-compose exec frontend npm run lint

# Verificar health checks
docker-compose ps
curl http://localhost:3000/health
curl http://localhost:8000/health
```

### 🛠️ Comandos de Mantenimiento

```bash
# Backup de base de datos
docker-compose exec postgres pg_dump -U dale dale > backup.sql

# Restaurar base de datos
docker-compose exec -T postgres psql -U dale dale < backup.sql

# Ver logs con filtro
docker-compose logs --tail=100 backend

# Limpiar logs
docker-compose logs --no-color backend > backend.log
truncate -s 0 backend.log

# Actualizar servicios
docker-compose pull
docker-compose up -d
```

## 🐳 Docker para Desarrollo

### 🔧 Configuración de Desarrollo

#### docker-compose.dev.yml

```yaml
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
    ports:
      - "8000:8000"
    command: ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

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

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data

volumes:
  redis_dev_data:
```

#### Usar configuración de desarrollo

```bash
# Usar compose override para desarrollo
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# O renombrar compose.override.yml
mv docker-compose.override.yml docker-compose.yml.backup
cp docker-compose.dev.yml docker-compose.override.yml
docker-compose up -d
```

### 📝 Dockerignore Files

#### backend/.dockerignore

```
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
.tox/
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.dmypy.json
dmypy.json

# IDE
.vscode
.idea
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
Dockerfile*
docker-compose*
.dockerignore
```

#### frontend/.dockerignore

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Production builds
.next/
out/
build/
dist/

# Environment variables
.env*
!.env.example

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Git
.git/
.gitignore

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Testing
coverage/
.nyc_output

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock
```

## 🚀 Deployment con Docker

### 🏭 Producción

#### Prepare for Production

```bash
# 1. Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# 2. Tag images for registry
docker tag dale_backend:latest your-registry/dale-backend:latest
docker tag dale_frontend:latest your-registry/dale-frontend:latest

# 3. Push to registry
docker push your-registry/dale-backend:latest
docker push your-registry/dale-frontend:latest

# 4. Deploy to production
docker-compose -f docker-compose.prod.yml up -d
```

#### Docker Swarm (Alternativa)

```yaml
# docker-stack.yml
version: '3.8'

services:
  backend:
    image: your-registry/dale-backend:latest
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
    secrets:
      - backend_env
    deploy:
      replicas: 3
      restart_policy:
        condition: on-failure
      update_config:
        parallelism: 1
        delay: 10s
      placement:
        constraints:
          - node.role == worker

  frontend:
    image: your-registry/dale-frontend:latest
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 2
      restart_policy:
        condition: on-failure

secrets:
  backend_env:
    external: true
```

```bash
# Deploy stack
docker stack deploy -c docker-stack.yml dale

# View services
docker service ls

# View logs
docker service logs -f dale_backend
```

### ☁️ Cloud Deployment

#### AWS ECS

```json
{
  "family": "dale-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/dale-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "SUPABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:dale/supabase-url"
        }
      ]
    }
  ]
}
```

#### Google Cloud Run

```yaml
# cloudrun.yaml
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dale-backend
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/cpu-throttling: "false"
        autoscaling.knative.dev/maxScale: "10"
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: gcr.io/project-id/dale-backend:latest
        ports:
        - name: http1
          containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
```

```bash
# Deploy to Cloud Run
gcloud run deploy dale-backend \
  --image gcr.io/project-id/dale-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENVIRONMENT=production
```

## 🔧 Optimización y Performance

### 📊 Monitoreo con Docker

#### Setup Prometheus y Grafana

```yaml
# monitoring/docker-compose.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
```

#### Configuración de Prometheus

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'dale-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
    scrape_interval: 30s

  - job_name: 'dale-frontend'
    static_configs:
      - targets: ['frontend:3000']
    metrics_path: '/_next/static/chunks/pages/_app-*.js'
    scrape_interval: 60s
```

### 🚀 Optimización de Imágenes

#### Multi-stage Build (Backend)

```dockerfile
# backend/Dockerfile.optimized
FROM python:3.11-slim as builder

# Instalar build dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copiar solo requirements primero (mejor cache)
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage final mínima
FROM python:3.11-slim as runtime

# Instalar solo runtime dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Crear usuario no-root
RUN useradd --create-home --shell /bin/bash app

WORKDIR /home/app

# Copiar dependencias de builder
COPY --from=builder /root/.local /home/app/.local

# Copiar código
COPY --chown=app:app . .

# Ajustar PATH
ENV PATH=/home/app/.local/bin:$PATH

USER app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Optimización de Imágenes Frontend

```dockerfile
# frontend/Dockerfile.optimized
FROM node:18-alpine as dependencies

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine as builder

WORKDIR /app

# Copiar dependencias
COPY --from=dependencies /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Build optimizado
RUN npm run build

# Stage final
FROM node:18-alpine as runtime

# Instalar serve con user específico
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

WORKDIR /app

# Copiar build
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["npx", "serve", "-s", "public", "-l", "3000"]
```

## 🐛 Troubleshooting Docker

### ❌ Problemas Comunes

#### Error: Port Already in Use

```bash
# Verificar puertos en uso
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000

# Matar proceso en puerto
kill -9 $(lsof -ti:3000)
kill -9 $(lsof -ti:8000)

# O cambiar puertos en docker-compose.yml
services:
  frontend:
    ports:
      - "3001:3000"  # Cambiar puerto local
```

#### Error: Permission Denied

```bash
# En Linux, agregar usuario al grupo docker
sudo usermod -aG docker $USER

# O cambiar ownership de archivos
sudo chown -R $USER:$USER .

# Verificar permisos de archivos docker
ls -la docker-compose.yml
```

#### Error: Container Exit Immediately

```bash
# Ver logs del contenedor
docker-compose logs backend
docker-compose logs frontend

# Verificar variables de entorno
docker-compose exec backend env
docker-compose exec frontend env

# Test manual del comando
docker-compose exec backend bash
> uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Error: Database Connection Failed

```bash
# Verificar que Postgres esté corriendo
docker-compose ps postgres

# Ver logs de Postgres
docker-compose logs postgres

# Test de conectividad
docker-compose exec postgres pg_isready -U dale

# Conectar manualmente
docker-compose exec postgres psql -U dale -d dale
```

### 🔍 Comandos de Debug

```bash
# Ver todos los logs
docker-compose logs > all-logs.txt

# Ver logs con timestamps
docker-compose logs -t > logs-timestamped.txt

# Ejecutar shell en contenedor
docker-compose exec backend bash
docker-compose exec frontend sh

# Ver procesos en contenedor
docker-compose exec backend ps aux

# Monitorear recursos
docker stats

# Ver configuraciones
docker-compose config

# Verificar networking
docker network ls
docker network inspect dale_dale-network
```

## ✅ Checklist Final

Con Docker deberías tener:

- [ ] ✅ Docker y Docker Compose instalados
- [ ] ✅ Archivos de configuración creados
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ `docker-compose up -d` ejecutado exitosamente
- [ ] ✅ Frontend accesible en http://localhost:3000
- [ ] ✅ Backend accesible en http://localhost:8000
- [ ] ✅ Documentación API en http://localhost:8000/docs
- [ ] ✅ Health checks pasando
- [ ] ✅ Logs sin errores críticos

## 🎯 Próximos Pasos

- **🧪 Testing**: Lee la [guía de testing](../development/testing.md)
- **🚀 Deployment**: Prepara la [guía de deployment](../deployment/)
- **🔧 Desarrollo**: Explora la [guía de desarrollo](../development/)

---

## 📞 Soporte

¿Problemas con Docker?

- 💬 [Discord](https://discord.gg/dale) - Comunidad activa
- 📚 [Docker Documentation](https://docs.docker.com/)
- 🐛 [Issues](https://github.com/dale/app/issues)

---

> **🐳 Tip**: Docker es ideal para mantener consistencia entre entornos. Úsalo para development, testing y production deployment. ¡Happy containerizing! 🚀