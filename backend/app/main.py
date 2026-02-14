"""
Dale API - Backend principal
API REST para la plataforma de viajes compartidos Dale.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager
import logging
import os
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# CRITICAL: Load environment variables BEFORE importing app modules
# auth.py reads SUPABASE_JWT_SECRET at import time
load_dotenv()

# Importar routers (after load_dotenv!)
from app.routes import users, rides, bookings, reviews, notifications


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifecycle events para inicialización y limpieza.
    """
    # Startup
    logger.info("Dale API starting up")
    logger.info("Supabase connection configured: %s", bool(os.getenv("SUPABASE_URL")))
    
    yield
    
    # Shutdown
    logger.info("Dale API shutting down")


# Crear aplicación FastAPI
app = FastAPI(
    title="Dale API",
    description="API REST para la plataforma de viajes compartidos Dale",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# Configurar CORS — entirely environment-driven
# Set CORS_ORIGINS as a comma-separated list, e.g.:
#   Dev:  CORS_ORIGINS=http://localhost:3000,http://localhost:3001
#   Prod: CORS_ORIGINS=https://dale.app,https://www.dale.app
_raw_origins = os.getenv("CORS_ORIGINS", "")
_cors_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# allow_origin_regex handles Vercel preview URLs (*.vercel.app)
# which CORSMiddleware's allow_origins list cannot glob-match.
_cors_regex = os.getenv("CORS_ORIGIN_REGEX", r"https://.*\.vercel\.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_origin_regex=_cors_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Registrar routers
app.include_router(users.router)
app.include_router(rides.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(notifications.router)


# Manejador global de errores de validación
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Personaliza los errores de validación de Pydantic.
    """
    errors = []
    for error in exc.errors():
        field = " -> ".join([str(loc) for loc in error["loc"]])
        errors.append({
            "field": field,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Error de validación",
            "errors": errors
        }
    )


# Ruta raíz
@app.get("/", tags=["health"])
async def root():
    """
    Endpoint raíz - información de la API.
    """
    return {
        "name": "Dale API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


# Health check
@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint para monitoreo.
    """
    return {
        "status": "healthy",
        "service": "dale-api"
    }


# Endpoint de información
@app.get("/api/info", tags=["info"])
async def api_info():
    """
    Información sobre los endpoints disponibles.
    """
    return {
        "endpoints": {
            "users": {
                "GET /api/users/me": "Obtener perfil del usuario autenticado",
                "PATCH /api/users/me": "Actualizar perfil del usuario",
                "GET /api/users/{id}": "Obtener perfil público de usuario"
            },
            "rides": {
                "POST /api/rides": "Crear nuevo viaje (requiere rol driver)",
                "GET /api/rides": "Buscar viajes con filtros",
                "GET /api/rides/{id}": "Obtener detalles de un viaje",
                "GET /api/rides/my/rides": "Obtener mis viajes como conductor",
                "DELETE /api/rides/{id}": "Eliminar mi viaje"
            },
            "bookings": {
                "POST /api/bookings": "Crear reserva para un viaje",
                "GET /api/bookings": "Obtener mis reservas",
                "GET /api/bookings/{id}": "Obtener detalles de una reserva",
                "DELETE /api/bookings/{id}": "Cancelar reserva",
                "PATCH /api/bookings/{id}/confirm": "Confirmar reserva (solo conductor)"
            }
        },
        "authentication": {
            "method": "Bearer token (JWT de Supabase)",
            "header": "Authorization: Bearer <token>"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
