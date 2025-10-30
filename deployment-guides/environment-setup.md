# Configuración de Variables de Entorno - Dale Rides Platform

Guía completa para configurar variables de entorno en diferentes plataformas de deployment y herramientas de gestión de secrets.

## 📋 Variables Requeridas

### Variables por Servicio

#### **Frontend (Next.js)**

| Variable | Tipo | Requerido | Ejemplo | Descripción |
|----------|------|-----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | ✅ | `https://xyz.supabase.co` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Clave anónima pública |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Pública | ✅ | `AIzaSyC...` | API Key de Google Maps |
| `NEXT_PUBLIC_API_URL` | Pública | ✅ | `https://api.tu-dominio.com` | URL del backend API |
| `NODE_ENV` | Pública | ✅ | `production` | Entorno de ejecución |
| `NEXT_TELEMETRY_DISABLED` | Pública | ❌ | `1` | Desactivar telemetría de Next.js |
| `NEXTAUTH_SECRET` | Pública | ❌ | `random-secret-string` | Secreto para NextAuth |
| `NEXTAUTH_URL` | Pública | ❌ | `https://tu-dominio.com` | URL base para NextAuth |
| `NEXT_PUBLIC_ANALYTICS_ID` | Pública | ❌ | `G-XXXXXXXXXX` | Google Analytics ID |

#### **Backend (FastAPI)**

| Variable | Tipo | Requerido | Ejemplo | Descripción |
|----------|------|-----------|---------|-------------|
| `SUPABASE_URL` | Secreto | ✅ | `https://xyz.supabase.co` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreto | ✅ | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Clave de servicio (CRÍTICO) |
| `SUPABASE_JWT_SECRET` | Secreto | ✅ | `tu-jwt-secret-secreto` | Secreto para JWT |
| `ENV` | Público | ✅ | `production` | Entorno de aplicación |
| `PORT` | Público | ✅ | `8000` | Puerto del servidor |
| `CORS_ORIGINS` | Público | ❌ | `https://tu-dominio.com` | Dominios permitidos para CORS |
| `SESSION_SECRET` | Secreto | ❌ | `session-secret-muy-secreto` | Secreto para sesiones |
| `LOG_LEVEL` | Público | ❌ | `info` | Nivel de logging |
| `REDIS_URL` | Secreto | ❌ | `redis://user:pass@host:6379` | URL de Redis |
| `SENTRY_DSN` | Secreto | ❌ | `https://xxx@sentry.io/xxx` | DSN de Sentry |

#### **Redis (Opcional)**

| Variable | Tipo | Requerido | Ejemplo | Descripción |
|----------|------|-----------|---------|-------------|
| `REDIS_PASSWORD` | Secreto | ❌ | `redis-password-secreto` | Contraseña de Redis |
| `REDIS_URL` | Secreto | ❌ | `redis://localhost:6379` | URL completa de Redis |

#### **Email (Opcional)**

| Variable | Tipo | Requerido | Ejemplo | Descripción |
|----------|------|-----------|---------|-------------|
| `EMAIL_SERVICE` | Público | ❌ | `sendgrid` | Servicio de email |
| `EMAIL_API_KEY` | Secreto | ❌ | `SG.xxxxxx` | API Key del servicio |
| `EMAIL_FROM` | Público | ❌ | `noreply@tu-dominio.com` | Email remitente |

#### **Monitoreo (Opcional)**

| Variable | Tipo | Requerido | Ejemplo | Descripción |
|----------|------|-----------|---------|-------------|
| `SENTRY_DSN` | Secreto | ❌ | `https://xxx@sentry.io/xxx` | DSN de Sentry |
| `NEW_RELIC_LICENSE_KEY` | Secreto | ❌ | `xxxxx` | License key de New Relic |
| `DATADOG_API_KEY` | Secreto | ❌ | `xxxxx` | API key de DataDog |

## 🏗️ Configuración por Plataforma

### 1. Vercel (Frontend)

#### Dashboard Web
1. Ir a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccionar proyecto → **Settings** → **Environment Variables**
3. Agregar variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSyC...
NEXT_PUBLIC_API_URL = https://api.tu-dominio.com
NODE_ENV = production
```

#### CLI de Vercel
```bash
# Agregar variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY production

# Listar variables
vercel env ls

# Remover variable
vercel env rm NEXT_PUBLIC_SUPABASE_URL
```

#### Archivos de Configuración
```bash
# .env.local (local development)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...

# .env.production (not to commit)
# Usar en deploy manual, no usar en Git
```

### 2. Railway (Backend)

#### Dashboard Web
1. Ir a [Railway Dashboard](https://railway.app/dashboard)
2. Seleccionar proyecto → **Variables**
3. Configurar variables:

```
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=tu-jwt-secret
ENV=production
PORT=8000
```

#### CLI de Railway
```bash
# Login
railway login

# Agregar variables
railway variables set SUPABASE_URL=https://xyz.supabase.co
railway variables set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Listar variables
railway variables

# Variable desde archivo
railway variables set --file .env.production
```

#### Integración con GitHub
```bash
# Railway detecta variables del archivo .env.example
echo "SUPABASE_URL=https://xyz.supabase.co" > .env.example
echo "SUPABASE_SERVICE_ROLE_KEY=your-key" >> .env.example
```

### 3. Docker Compose

#### Archivo `.env`
```bash
# .env
ENV=production
DOMAIN=tu-dominio.com

# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=tu-jwt-secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC...

# Redis
REDIS_PASSWORD=redis-password-super-secreto

# SSL
SSL_EMAIL=admin@tu-dominio.com

# API URLs
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com
```

#### Cargar en Docker Compose
```yaml
# docker-compose.yml
services:
  backend:
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - ENV=${ENV}
  frontend:
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
```

### 4. AWS (Parameter Store)

#### CLI de AWS
```bash
# Crear parameters
aws ssm put-parameter \
  --name "/dale/supabase/url" \
  --value "https://xyz.supabase.co" \
  --type String \
  --description "Supabase URL for Dale Platform"

aws ssm put-parameter \
  --name "/dale/supabase/service-key" \
  --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --type SecureString \
  --description "Supabase Service Role Key" \
  --key-id alias/aws/ssm

# Listar parameters
aws ssm describe-parameters \
  --parameter-filters "Key=Name,Values=/dale/*"

# Obtener parameter
aws ssm get-parameter \
  --name "/dale/supabase/url" \
  --with-decryption
```

#### En ECS Task Definition
```json
{
  "secrets": [
    {
      "name": "SUPABASE_URL",
      "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/dale/supabase/url"
    },
    {
      "name": "SUPABASE_SERVICE_ROLE_KEY",
      "valueFrom": "arn:aws:ssm:us-east-1:123456789012:parameter/dale/supabase/service-key"
    }
  ]
}
```

### 5. Google Cloud (Secret Manager)

#### CLI de gcloud
```bash
# Crear secrets
echo -n "https://xyz.supabase.co" | gcloud secrets create supabase-url --data-file=-

echo -n "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." | gcloud secrets create supabase-service-key --data-file=-

# Listar secrets
gcloud secrets list

# Acceder a secret
gcloud secrets versions access latest --secret="supabase-url"
```

#### En Cloud Run
```yaml
# cloudbuild.yaml o kubectl
apiVersion: v1
kind: Secret
metadata:
  name: dale-secrets
type: Opaque
stringData:
  SUPABASE_URL: "https://xyz.supabase.co"
  SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

---
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: dale-backend
spec:
  template:
    spec:
      containers:
      - image: gcr.io/dale-123456/backend:latest
        env:
        - name: SUPABASE_URL
          valueFrom:
            secretKeyRef:
              name: dale-secrets
              key: SUPABASE_URL
```

### 6. Azure (Key Vault)

#### CLI de Azure
```bash
# Crear Key Vault
az keyvault create \
  --name "dale-keyvault" \
  --resource-group "dale-rg" \
  --location "eastus"

# Agregar secrets
az keyvault secret set \
  --vault-name "dale-keyvault" \
  --name "supabase-url" \
  --value "https://xyz.supabase.co"

az keyvault secret set \
  --vault-name "dale-keyvault" \
  --name "supabase-service-key" \
  --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Listar secrets
az keyvault secret list \
  --vault-name "dale-keyvault"

# Obtener secret
az keyvault secret show \
  --vault-name "dale-keyvault" \
  --name "supabase-url" \
  --query value -o tsv
```

## 🔒 Herramientas de Gestión de Secrets

### 1. Doppler

```bash
# Instalar CLI
curl -fsSL https://get.doppler.com/install.sh | sh

# Login
doppler login

# Setup proyecto
doppler setup

# Crear archivo .env.local
doppler secrets download --format env > .env.local

# Variables por entorno
doppler secrets set SUPABASE_URL=https://xyz.supabase.co
doppler secrets set SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Integración en código
# Python (backend)
import os
import dopplerpy

doppler = dopplerpy.create_client()
supabase_url = doppler.secrets.get('SUPABASE_URL')

# Node.js (frontend)
const doppler = require('@dopplerhq/node-sdk');
const client = doppler({
  token: process.env.DOPPLER_TOKEN
});

const secrets = await client.secrets.get();
const supabaseUrl = secrets.find(s => s.name === 'SUPABASE_URL')?.value;
```

### 2. HashiCorp Vault

```bash
# Instalar Vault CLI
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install vault

# Start Vault
vault server -dev

# Agregar secrets
vault kv put secret/dale/supabase url="https://xyz.supabase.co"
vault kv put secret/dale/supabase service_key="eyJhbGciOiJIUzI1NiIs..."

# Leer secrets
vault kv get secret/dale/supabase
```

### 3. 1Password

```bash
# Instalar CLI
brew install 1password/tap/op

# Login
op signin

# Crear item de vault
op create item password \
  --title="Dale Platform Secrets" \
  --url="https://1password.com" \
  --username="admin@tu-dominio.com" \
  --password="very-secure-password"

# Agregar custom fields
op create item "Database" \
  --title="Dale Database Credentials" \
  --url="https://supabase.com" \
  --fields='[{"label":"SUPABASE_URL", "value":"https://xyz.supabase.co", "type":"TEXT"}, {"label":"SERVICE_KEY", "value":"eyJhbGciOiJIUzI1NiIs...", "type":"PASSWORD"}]'
```

## 🚨 Mejores Prácticas de Seguridad

### 1. Nunca Subir Secrets a Git

```bash
# .gitignore
.env
.env.local
.env.production
.env.staging
*.key
*.pem
config/secrets.*

# Variables públicas van en .env.example
echo "NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co" > .env.example
echo "NEXT_PUBLIC_API_URL=https://api.tu-dominio.com" >> .env.example
```

### 2. Principio de Menor Privilegio

```bash
# Supabase - Usar claves diferentes para diferentes entornos
PRODUCTION_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (production)
STAGING_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (staging)
DEV_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (development)

# Never use production keys in development/staging
```

### 3. Rotación de Secrets

```bash
# Script para rotación automática
#!/bin/bash
# rotate-secrets.sh

echo "🔄 Rotating Dale Platform secrets..."

# Generate new JWT secret
NEW_JWT_SECRET=$(openssl rand -base64 32)

# Update in all platforms
vercel env add SUPABASE_JWT_SECRET production
railway variables set SUPABASE_JWT_SECRET=$NEW_JWT_SECRET
aws ssm put-parameter \
  --name "/dale/supabase/jwt-secret" \
  --value "$NEW_JWT_SECRET" \
  --type SecureString \
  --overwrite

# Update Supabase
# This would require API call to Supabase Management API

echo "✅ Secrets rotated successfully!"
```

### 4. Monitoreo de Acceso

```bash
# AWS CloudTrail - log all secret access
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=ResourceName,AttributeValue=/dale/supabase/service-key \
  --start-time $(date -d '24 hours ago' +%Y-%m-%d)

# Audit logs en aplicaciones
# Agregar logging de acceso a secrets en la aplicación
def get_secret(secret_name):
    secret = os.getenv(secret_name)
    logger.info(f"Accessing secret: {secret_name}")
    # Log de acceso para auditoría
    audit_logger.info({
        "action": "SECRET_ACCESS",
        "secret_name": secret_name,
        "timestamp": datetime.utcnow().isoformat(),
        "user": get_current_user_id()
    })
    return secret
```

### 5. Validación de Configuración

```python
# backend/config.py
from pydantic import BaseSettings, validator
from typing import List

class Settings(BaseSettings):
    # Required secrets
    supabase_url: str
    supabase_service_role_key: str
    supabase_jwt_secret: str
    
    # Public variables
    node_env: str = "development"
    cors_origins: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    @validator('supabase_url')
    def validate_supabase_url(cls, v):
        if not v.startswith('https://'):
            raise ValueError('Supabase URL must use HTTPS')
        return v
    
    @validator('supabase_service_role_key')
    def validate_service_key(cls, v):
        if not v.startswith('eyJ'):
            raise ValueError('Invalid Supabase service key format')
        return v

# Validar configuración al inicio
try:
    settings = Settings()
    print("✅ Configuration validated successfully")
except ValueError as e:
    print(f"❌ Configuration error: {e}")
    exit(1)
```

## 🔍 Troubleshooting

### Problemas Comunes

#### 1. Variables No Cargadas

```bash
# Verificar que el archivo .env existe y tiene permisos
ls -la .env
cat .env

# Verificar que las variables están en el entorno del proceso
docker exec dale-backend env | grep SUPABASE

# Verificar formato de variables
# ✅ CORRECTO: VARIABLE_NAME=value
# ❌ INCORRECTO: VARIABLE_NAME = value (con espacios)
```

#### 2. Variables Públicas vs Secretas

```bash
# Variables públicas (next.config.js o .env.local)
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com

# Variables secretas (process.env, no accesibles en el cliente)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. Encoding de Strings

```bash
# Problema común con caracteres especiales
# ✅ CORRECTO: SECRET="base64-encoded-string"
# ❌ INCORRECTO: SECRET=base64-encoded-string (sin comas)

# Para valores multiline, usar cat EOF
cat > .env << EOF
MULTILINE_SECRET=line1
line2
line3
EOF
```

#### 4. Escapado de Comillas

```bash
# En JSON/API responses, escapar comillas
export JSON_STRING='{"message": "Hello \"World\""}'

# En Docker Compose, usar doble escape
echo 'JSON_STRING={"message": "Hello \"World\""}' >> .env
```

## 📚 Recursos Adicionales

### Documentación Oficial
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Railway Environment Variables](https://docs.railway.app/develop/variables)
- [Docker Compose ENV](https://docs.docker.com/compose/environment-variables/)
- [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html)

### Herramientas Útiles
- [Doppler](https://www.doppler.com/) - Secrets management
- [1Password CLI](https://developer.1password.com/docs/cli/) - CLI integration
- [Git-crypt](https://github.com/AGWA/git-crypt) - Encrypt files in git
- [Vault](https://www.vaultproject.io/) - HashiCorp's secrets management

---

**Última actualización**: Diciembre 2024
**Compatible con**: Todas las plataformas de deployment soportadas
