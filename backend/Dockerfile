# Dockerfile para Backend FastAPI - Dale Rides Platform
# Usando multi-stage build para optimización de tamaño

# Stage 1: Build stage
FROM python:3.11-slim as builder

# Instalar dependencias del sistema necesarias para compilación
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivo de dependencias
COPY requirements.txt .

# Instalar dependencias de Python en directorio local
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime stage
FROM python:3.11-slim as runtime

# Instalar dependencias del sistema runtime necesarias
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Crear usuario no-root para seguridad
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias instaladas desde builder
COPY --from=builder /root/.local /home/appuser/.local

# Copiar código fuente
COPY . .

# Ajustar permisos
RUN chown -R appuser:appuser /home/appuser/.local /app
USER appuser

# Agregar directorio local al PATH
ENV PATH=/home/appuser/.local/bin:$PATH

# Variables de entorno para configuración de producción
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV ENV=production

# Variables de entorno específicas de la aplicación
ENV SUPABASE_URL=${SUPABASE_URL:-""}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-""}
ENV SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET:-""}

# Configurar puerto
ENV PORT=8000

# Exponer puerto
EXPOSE 8000

# Comando por defecto para producción
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 4 --log-level info --access-log

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Metadata
LABEL maintainer="Dale Team" \
      version="1.0.0" \
      description="Backend FastAPI para plataforma de rides Dale" \
      python.version="3.11"