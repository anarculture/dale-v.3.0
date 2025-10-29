# Deployment con Docker Compose - Dale Rides Platform

Esta guía cubre el deployment completo de Dale Rides Platform usando Docker Compose, ideal para VPS, servidores dedicados, o cloud instances.

## ✅ Prerequisites

### Hardware Mínimo
- **CPU**: 2 cores
- **RAM**: 4GB (2GB para el sistema, 2GB para aplicaciones)
- **Storage**: 20GB SSD
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Docker compatible

### Software Requerido
- [x] Docker Engine 20.10+
- [x] Docker Compose v2.0+
- [x] Git
- [x] SSL Certificate (Let's Encrypt recomendado)
- [x] Domain name configurado

### Puertos Requeridos
- **80**: HTTP (redirected to 443)
- **443**: HTTPS (reverse proxy)
- **22**: SSH (para administración)

## 🚀 Quick Start

### 1. Preparación del Servidor

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

### 2. Configuración del Proyecto

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/dale-platform.git
cd dale-platform

# Crear estructura de datos
mkdir -p data/{redis,nginx,backups}

# Configurar variables de entorno
cp .env.production .env
nano .env  # Editar con tus valores

# Verificar configuración
./scripts/health-check.sh
```

### 3. Deploy Inicial

```bash
# Deploy en modo desarrollo
docker-compose -f docker-compose.yml -f docker-compose.override.yml up -d

# Verificar estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Deploy en Producción

```bash
# Deploy optimizado para producción
docker-compose -f docker-compose.prod.yml up -d

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps

# Health check
curl -f https://tu-dominio.com/health
```

## ⚙️ Configuración Detallada

### 1. Estructura de Archivos

```
dale-platform/
├── docker-compose.yml              # Configuración base
├── docker-compose.override.yml     # Desarrollo
├── docker-compose.prod.yml         # Producción
├── .env                            # Variables de entorno
├── nginx/
│   ├── nginx.conf                  # Configuración Nginx
│   ├── ssl/                        # Certificados SSL
│   └── conf.d/                     # Configuraciones adicionales
├── scripts/
│   ├── deploy.sh                   # Script de deployment
│   ├── backup.sh                   # Script de backup
│   ├── health-check.sh             # Health checks
│   └── update.sh                   # Script de actualización
└── data/
    ├── redis/                      # Datos de Redis
    ├── nginx/                      # Cache de Nginx
    └── backups/                    # Backups automáticos
```

### 2. Configuración de Variables

```bash
# .env - Variables de producción
ENV=production
DOMAIN=tu-dominio.com
EMAIL=admin@tu-dominio.com

# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-key
SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_JWT_SECRET=tu-jwt-secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu-api-key

# Redis
REDIS_PASSWORD=tu-redis-password-super-secreto

# SSL
SSL_EMAIL=admin@tu-dominio.com
LETSENCRYPT_EMAIL=admin@tu-dominio.com

# DNS
NEXTAUTH_URL=https://tu-dominio.com
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
```

### 3. Configuración de Nginx

```nginx
# nginx/nginx.prod.conf
events {
    worker_connections 1024;
}

http {
    upstream frontend {
        server frontend:3000;
    }
    
    upstream backend {
        server backend:8000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # HTTP Server (redirect to HTTPS)
    server {
        listen 80;
        server_name tu-dominio.com www.tu-dominio.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name tu-dominio.com www.tu-dominio.com;

        # SSL Configuration
        ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;

        # Security headers
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
        add_header X-Content-Type-Options nosniff always;
        add_header X-Frame-Options DENY always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Frontend (Next.js)
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            limit_req zone=general burst=20 nodelay;
        }

        # API Backend
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            limit_req zone=api burst=10 nodelay;
        }

        # Health checks
        location /health {
            proxy_pass http://frontend;
            access_log off;
        }
    }
}
```

## 🔒 SSL/TLS con Let's Encrypt

### 1. Certificados Automáticos

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado (modo standalone)
sudo certbot certonly --standalone -d tu-dominio.com -d www.tu-dominio.com

# Verificar renovación automática
sudo crontab -l | grep certbot
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Configuración SSL en Docker

```yaml
# docker-compose.prod.yml (additions)
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
  - /var/www/certbot:/var/www/certbot:ro

services:
  certbot:
    image: certbot/certbot
    container_name: dale-certbot
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt
      - /var/www/certbot:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email admin@tu-dominio.com --agree-tos --no-eff-email -d tu-dominio.com -d www.tu-dominio.com
```

## 📊 Monitoreo y Logs

### 1. Configuración de Logs

```yaml
# docker-compose.prod.yml (logging section)
logging:
  driver: "json-file"
  options:
    max-size: "50m"
    max-file: "5"
    labels: "service=backend,env=production"
```

### 2. Script de Health Check

```bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 Checking Dale Platform health..."

# Check Frontend
echo "Checking Frontend..."
if curl -f -s https://tu-dominio.com/health > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: FAIL"
    exit 1
fi

# Check Backend
echo "Checking Backend..."
if curl -f -s https://tu-dominio.com/api/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: FAIL"
    exit 1
fi

# Check Redis
echo "Checking Redis..."
if docker exec dale-redis-prod redis-cli ping | grep -q PONG; then
    echo "✅ Redis: OK"
else
    echo "❌ Redis: FAIL"
    exit 1
fi

echo "🎉 All services are healthy!"
```

### 3. Monitoreo con Scripts

```bash
#!/bin/bash
# scripts/monitor.sh

while true; do
    ./scripts/health-check.sh
    if [ $? -ne 0 ]; then
        # Enviar notificación (email, Slack, etc.)
        echo "Alert: Services are down" | mail -s "Dale Platform Alert" admin@tu-dominio.com
    fi
    sleep 300  # Check every 5 minutes
done
```

## 🔄 Backup y Restore

### 1. Script de Backup Automático

```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="./data/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "Starting backup $DATE"

# Backup Redis data
docker exec dale-redis-prod redis-cli BGSAVE
sleep 5
docker cp dale-redis-prod:/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Backup Nginx config
cp -r ./nginx "$BACKUP_DIR/nginx_$DATE"

# Backup logs
tar -czf "$BACKUP_DIR/logs_$DATE.tar.gz" ./logs/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR"
```

### 2. Cron para Backups

```bash
# Agregar a crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * /path/to/dale-platform/scripts/backup.sh

# Health check cada 30 minutos
*/30 * * * * /path/to/dale-platform/scripts/health-check.sh || echo "Health check failed" | mail -s "Alert" admin@tu-dominio.com
```

### 3. Restore

```bash
#!/bin/bash
# scripts/restore.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop services
docker-compose -f docker-compose.prod.yml stop

# Restore Redis
cp "$BACKUP_FILE" ./data/redis/dump.rdb
docker-compose -f docker-compose.prod.yml start redis

# Restore services
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Actualizaciones

### 1. Script de Actualización

```bash
#!/bin/bash
# scripts/update.sh

echo "🚀 Starting Dale Platform update..."

# Backup antes de actualizar
./scripts/backup.sh

# Pull latest changes
git pull origin main

# Rebuild and deploy
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Health check
sleep 30
./scripts/health-check.sh

echo "✅ Update completed!"
```

### 2. Zero-Downtime Deployment

```bash
#!/bin/bash
# scripts/rolling-update.sh

echo "Starting rolling update..."

# Update one service at a time
for service in backend frontend; do
    echo "Updating $service..."
    docker-compose -f docker-compose.prod.yml up -d --no-deps $service
    
    # Wait for health check
    for i in {1..30}; do
        if curl -f -s https://tu-dominio.com/health > /dev/null; then
            echo "✅ $service updated successfully"
            break
        fi
        sleep 10
    done
done

echo "🎉 Rolling update completed!"
```

## 🚨 Troubleshooting

### Problemas Comunes

#### 1. Container no inicia

```bash
# Ver logs
docker-compose logs [service-name]

# Verificar configuración
docker-compose config

# Rebuild
docker-compose build --no-cache [service-name]
```

#### 2. Variables de entorno no cargadas

```bash
# Verificar archivo .env
cat .env

# Verificar variables en container
docker exec dale-backend-prod env | grep SUPABASE

# Recargar variables
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

#### 3. Problemas de permisos

```bash
# Corregir permisos de archivos
sudo chown -R $USER:$USER .

# Corregir permisos de Docker
sudo chmod 666 /var/run/docker.sock
```

#### 4. SSL/TLS Issues

```bash
# Verificar certificados
sudo certbot certificates

# Renovar certificados
sudo certbot renew

# Verificar configuración SSL
openssl s_client -connect tu-dominio.com:443
```

### Logs Útiles

```bash
# Logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Logs con timestamps
docker-compose logs -f -t

# Últimas 100 líneas
docker-compose logs --tail=100
```

## 📈 Optimizaciones

### 1. Performance Tuning

```yaml
# docker-compose.prod.yml (resource limits)
deploy:
  resources:
    limits:
      memory: 1G
      cpus: '1.0'
    reservations:
      memory: 512M
      cpus: '0.5'
```

### 2. Redis Optimization

```bash
# redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### 3. Nginx Optimization

```nginx
# worker processes
worker_processes auto;

# worker connections
worker_connections 1024;

# buffering
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;

# gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript;
```

## 📞 Soporte

### Recursos
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [SSL Configuration Guide](https://letsencrypt.org/docs/)

### Comandos de Emergencia

```bash
# Parar todos los servicios
docker-compose down

# Parar y remover volúmenes (CUIDADO: elimina datos)
docker-compose down -v

# Reconstruir todo
docker-compose down && docker-compose build --no-cache && docker-compose up -d

# Acceder al shell de un container
docker exec -it dale-backend-prod bash

# Ver uso de recursos
docker stats

# Ver información del sistema
docker system df
docker system prune
```

---

**Última actualización**: Diciembre 2024
**Compatible con**: Docker 20.10+, Docker Compose v2.0+, Ubuntu 20.04+
