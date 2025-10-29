# Deployment en Railway - Dale Rides Backend API

Railway es una plataforma excelente para desplegar APIs de Python/FastAPI con configuración mínima y deployment automático desde GitHub.

## ✅ Prerequisites

- [x] Cuenta en [Railway](https://railway.app) (conexión con GitHub)
- [x] Backend de Dale configurado con FastAPI
- [x] Variables de entorno de Supabase configuradas
- [x] Railway CLI instalado (opcional)

## 🚀 Deploy Rápido

### 1. Desde Railway Dashboard

```bash
# 1. Ir a https://railway.app/new
# 2. Seleccionar "Deploy from GitHub repo"
# 3. Seleccionar tu repo de Dale Platform
# 4. Railway detectará automáticamente que es un proyecto Python
```

### 2. Desde Railway CLI

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Deploy
railway init
railway up
```

## ⚙️ Configuración Detallada

### 1. Configuración del Proyecto

Railway detecta automáticamente la estructura del proyecto, pero puedes configurar:

#### `railway.json` (opcional)

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

#### `Procfile` (alternativa)

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

#### `runtime.txt` (opcional)

```
python-3.11.5
```

### 2. Estructura del Proyecto

```
backend/
├── main.py                 # FastAPI app
├── requirements.txt        # Dependencias Python
├── Dockerfile             # (opcional, Railway puede detectar automáticamente)
├── railway.json           # Configuración de Railway
├── Procfile               # Comando de inicio
└── runtime.txt            # Versión de Python
```

### 3. Configuración de Build

Railway usa Nixpacks por defecto, pero puedes personalizar:

```toml
# pyproject.toml (opcional, Railway lo detecta)
[tool.poetry]
name = "dale-backend"
version = "1.0.0"
description = "Dale Rides Platform Backend API"

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.104.0"
uvicorn = {extras = ["standard"], version = "^0.24.0"}
supabase = "^2.0.0"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
python-multipart = "^0.0.6"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
black = "^23.0.0"
isort = "^5.12.0"
```

## 🔐 Variables de Entorno

### En Railway Dashboard

```
Project > Variables
```

### Variables Requeridas

| Variable | Description | Ejemplo | Required |
|----------|-------------|---------|----------|
| `SUPABASE_URL` | URL del proyecto Supabase | `https://xyz.supabase.co` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio | `eyJhbGciOiJIUzI1NiIs...` | ✅ |
| `SUPABASE_JWT_SECRET` | Secreto JWT | `tu-jwt-secret` | ✅ |
| `ENV` | Entorno | `production` | ✅ |
| `PYTHONUNBUFFERED` | Logs en tiempo real | `1` | ✅ |
| `PORT` | Puerto (automático) | `$PORT` | ✅ |
| `REDIS_URL` | URL de Redis | `redis://...` | ❌ |
| `SESSION_SECRET` | Secreto de sesión | `tu-session-secret` | ❌ |
| `LOG_LEVEL` | Nivel de logging | `info` | ❌ |

### Configuración de Puerto

```python
# main.py - Usar puerto de Railway automáticamente
import os

port = int(os.getenv("PORT", 8000))

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False  # Desactivar en producción
    )
```

## 🔄 CI/CD Automático

Railway despliega automáticamente cuando haces push a la rama configurada:

```bash
# Deploy automático configurado
git add .
git commit -m "Update backend API"
git push origin main  # Railway desplegará automáticamente
```

### Configurar Branch de Deploy

```
Project Settings > Source > Branch Configuration
Default Branch: main
Deploy Branches: main, staging
```

### Webhooks Personalizados

```yaml
# .github/workflows/railway-deploy.yml
name: Deploy Backend to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Railway
        uses: railway/deploy@v1
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE_ID }}
```

## 🌐 Configuración de Dominio

### 1. En Railway Dashboard

```
Project > Settings > Domains
```

### 2. Agregar Dominio Custom

```
backend.tu-dominio.com
api.tu-dominio.com
```

### 3. Configurar DNS

```
Type: CNAME
Name: backend o api
Value: tu-proyecto.railway.app
```

## 📊 Monitoreo y Logs

### Railway Dashboard

```
Project > Deployments > View Logs
```

### Railway CLI

```bash
# Ver logs en tiempo real
railway logs --follow

# Ver estado de servicios
railway status

# Ver métricas
railway metrics
```

### Integración con Sentry

```python
# main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if os.getenv("SENTRY_DSN"):
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        integrations=[FastApiIntegration(auto_enabling=True)],
        environment=os.getenv("ENV", "development")
    )
```

## 🔧 Configuración Avanzada

### 1. Configuración de Build Personalizada

```dockerfile
# backend/Dockerfile (opcional)
FROM python:3.11-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Health Checks

```python
# main.py
@app.get("/health")
async def health_check():
    """Health check endpoint para Railway"""
    try:
        # Verificar conexión a Supabase
        await supabase.table("rides").select("id").limit(1).execute()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }
```

### 3. Configuración de Rate Limiting

```python
# main.py
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/rides")
@limiter.limit("10/minute")
async def search_rides(request: Request):
    # Endpoint code
```

## 🐛 Troubleshooting

### Build Failures

**Problema**: Build fails
```bash
# Verificar requirements.txt
pip freeze > requirements.txt

# Verificar estructura del proyecto
ls -la

# Debug local
docker run -p 8000:8000 -e PORT=8000 python:3.11 uvicorn main:app --host 0.0.0.0 --port 8000
```

### Environment Variables

**Problema**: Variables no cargadas
```bash
# Verificar en Railway CLI
railway variables

# Recargar variables
railway redeploy
```

### Database Connection

**Problema**: No se conecta a Supabase
```python
# Verificar conexión
try:
    supabase = create_client(supabase_url, supabase_key)
    test_response = supabase.table("users").select("count").execute()
    print("✅ Supabase connected")
except Exception as e:
    print(f"❌ Supabase error: {e}")
```

### Port Issues

**Problema**: Port binding error
```python
# Usar variable PORT de Railway
import os
port = int(os.getenv("PORT", 8000))

@app.get("/")
async def root():
    return {"message": f"Running on port {port}"}
```

## 📈 Optimizaciones

### 1. Connection Pooling

```python
# main.py
from sqlalchemy.pool import QueuePool

# Para conexiones persistentes si usas SQLAlchemy
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=10,
    max_overflow=20
)
```

### 2. Caching

```python
# main.py
import redis

redis_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379"))

@app.get("/api/rides/{ride_id}")
async def get_ride_cached(ride_id: str):
    # Check cache first
    cached = redis_client.get(f"ride:{ride_id}")
    if cached:
        return json.loads(cached)
    
    # Fetch from database
    response = supabase.table("rides").select("*").eq("id", ride_id).execute()
    data = response.data[0] if response.data else None
    
    # Cache for 5 minutes
    if data:
        redis_client.setex(f"ride:{ride_id}", 300, json.dumps(data))
    
    return data
```

### 3. Async Optimizations

```python
# main.py
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=10)

@app.post("/api/bookings")
async def create_booking(booking_data: BookingCreate):
    # Usar executor para operaciones bloqueantes
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        executor, 
        process_booking_sync, 
        booking_data
    )
    return result
```

## 📞 Soporte y Recursos

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway CLI**: [docs.railway.app/reference/cli-api](https://docs.railway.app/reference/cli-api)
- **Python en Railway**: [docs.railway.app/start/python](https://docs.railway.app/start/python)
- **Community**: [discord.gg/railway](https://discord.gg/railway)

## 💰 Pricing

- **Developer Plan**: $5/mes por proyecto
- **Team Plan**: $20/mes (includes 2 projects)
- **Production**: Pay per usage

---

**Última actualización**: Diciembre 2024
**Compatible con**: Python 3.9+, FastAPI 0.104+, Railway CLI v2+
