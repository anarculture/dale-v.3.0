# 🐳 Docker - Dale Rides Platform

Guía completa para ejecutar la plataforma Dale usando Docker Compose.

## 📋 Prerrequisitos

- [Docker](https://docs.docker.com/get-docker/) (versión 20.10 o superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versión 2.0 o superior)
- [Git](https://git-scm.com/)

## 🚀 Inicio Rápido

### 1. Configuración Inicial

```bash
# Clonar el repositorio (si no está hecho)
git clone <repository-url>
cd dale

# Copiar archivo de configuración
cp .env.example .env
```

### 2. Configurar Variables de Entorno

Editar el archivo `.env` con las credenciales reales:

```env
# Supabase Configuration (OBLIGATORIO)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Google Maps API (OBLIGATORIO)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Ejecutar la Aplicación

```bash
# Desarrollo (con hot reload)
docker-compose up

# Producción (optimizado)
docker-compose --profile production up -d

# Desarrollo en segundo plano
docker-compose up -d
```

## 📁 Estructura del Proyecto

```
dale/
├── docker-compose.yml          # Configuración principal
├── docker-compose.override.yml # Configuración de desarrollo
├── .env.example                # Plantilla de variables de entorno
├── backend/
│   ├── Dockerfile             # Multi-stage build para FastAPI
│   ├── requirements.txt       # Dependencias Python
│   └── main.py               # Aplicación FastAPI
├── frontend/
│   ├── Dockerfile            # Multi-stage build para Next.js
│   ├── package.json          # Dependencias Node.js
│   └── src/                  # Código fuente React/Next.js
└── logs/                     # Logs de desarrollo
```

## 🛠️ Comandos Útiles

### Desarrollo

```bash
# Ejecutar en modo desarrollo (con hot reload)
docker-compose up

# Ver logs en tiempo real
docker-compose logs -f

# Rebuild de servicios específicos
docker-compose build backend
docker-compose build frontend

# Acceder a un contenedor
docker-compose exec backend bash
docker-compose exec frontend sh

# Parar todos los servicios
docker-compose down
```

### Producción

```bash
# Ejecutar en modo producción
docker-compose --profile production up -d

# Ver logs de producción
docker-compose logs -f --tail=100

# Backup de volúmenes
docker-compose exec backend tar -czf /app/backup.tar.gz /app/data

# Restaurar volúmenes
docker-compose exec backend tar -xzf /app/backup.tar.gz -C /
```

### Mantenimiento

```bash
# Limpiar imágenes no utilizadas
docker system prune

# Limpiar volúmenes huérfanos
docker volume prune

# Ver estado de servicios
docker-compose ps

# Ver consumo de recursos
docker stats
```

## 🔧 Configuración de Servicios

### Backend (FastAPI)

- **Puerto**: 8000
- **Health Check**: `http://localhost:8000/health`
- **API Docs**: `http://localhost:8000/docs`
- **Volumen**: Hot reload habilitado
- **Dependencias**: Redis, Supabase

### Frontend (Next.js)

- **Puerto**: 3000
- **Health Check**: `http://localhost:3000/api/health`
- **Volumen**: Hot reload habilitado
- **Dependencias**: Backend

### Redis

- **Puerto**: 6379
- **Propósito**: Cache y sesiones
- **Persistencia**: Habilitada

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Redis**: localhost:6379

## 🔍 Monitoreo y Logs

### Ver logs de servicios

```bash
# Todos los servicios
docker-compose logs

# Servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs redis

# Logs con timestamp
docker-compose logs -t

# Últimas 50 líneas
docker-compose logs --tail=50
```

### Health Checks

```bash
# Verificar estado de servicios
docker-compose ps

# Health check manual
curl http://localhost:8000/health
curl http://localhost:3000/api/health
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Verificar qué proceso usa el puerto
netstat -tulpn | grep :8000

# Cambiar puerto en .env
BACKEND_PORT=8001
```

#### 2. Variables de entorno faltantes
```bash
# Verificar variables cargadas
docker-compose config

# Verificar archivo .env
cat .env
```

#### 3. Permisos de archivos
```bash
# Reparar permisos
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

#### 4. Problemas de red
```bash
# Limpiar red Docker
docker network prune
docker-compose down --remove-orphans
docker-compose up -d --force-recreate
```

### Logs de Debug

```bash
# Logs detallados de construcción
docker-compose build --no-cache --progress=plain

# Verificar configuración
docker-compose config --services
docker-compose config --volumes
```

## 🔒 Configuración de Producción

### Variables de Seguridad

```env
# Asegurar en producción
ENV=production
DEBUG=false
REDIS_PASSWORD=secure-random-password
CORS_ORIGINS=https://yourdomain.com
```

### Recursos Recomendados

- **Backend**: 1GB RAM, 1 CPU
- **Frontend**: 1GB RAM, 1 CPU
- **Redis**: 512MB RAM, 0.5 CPU

### SSL/HTTPS

Para producción, configurar un reverse proxy (nginx, traefik) con SSL:

```yaml
# docker-compose.prod.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - backend
      - frontend
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Docker Guide](https://fastapi.tiangolo.com/deployment/docker/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment)

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Notas

- Los datos se persisten en volúmenes Docker
- Para desarrollo, se recomienda usar `docker-compose up`
- Para producción, usar `--profile production`
- Los logs se guardan en `./logs/`
- Los datos de Redis se guardan en `./data/redis/`