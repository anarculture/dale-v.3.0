#!/bin/bash

# Script de inicio alternativo para Dale
# Versión simplificada del script de desarrollo

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables de configuración
BACKEND_PORT=${API_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_HOST=${API_HOST:-0.0.0.0}

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner simplificado
echo -e "${BLUE}"
echo "=== DALE - Inicio Rápido ==="
echo -e "${NC}"

# Verificar directorio
if [ ! -f "requirements.txt" ] || [ ! -d "frontend" ]; then
    error "Ejecutar desde directorio raíz de Dale"
    exit 1
fi

# Verificar entorno virtual
if [ ! -d "venv" ]; then
    error "Entorno virtual no encontrado. Ejecuta './install.sh' primero."
    exit 1
fi

# Verificar archivos necesarios
if [ ! -f "backend/main.py" ]; then
    error "Archivo backend/main.py no encontrado"
    exit 1
fi

# Verificar que los puertos estén libres
if lsof -Pi :$BACKEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    error "Puerto $BACKEND_PORT ya está en uso"
    lsof -Pi :$BACKEND_PORT -sTCP:LISTEN || true
    exit 1
fi

if lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    error "Puerto $FRONTEND_PORT ya está en uso"
    lsof -Pi :$FRONTEND_PORT -sTCP:LISTEN || true
    exit 1
fi

# Verificar dependencias básicas
if ! command -v node &> /dev/null; then
    error "Node.js no instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm no instalado"
    exit 1
fi

log "Iniciando servicios..."

# Iniciar Backend en background
log "Backend iniciando en puerto $BACKEND_PORT..."
source venv/bin/activate
export PYTHONPATH="$PWD:$PYTHONPATH"

# Cargar variables de entorno si existe .env
source .env 2>/dev/null || true

# Iniciar backend
uvicorn backend.main:app --host $BACKEND_HOST --port $BACKEND_PORT --reload &
BACKEND_PID=$!

# Esperar que el backend se inicie
sleep 2

# Verificar que el backend esté corriendo
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    error "Backend falló al iniciar"
    exit 1
fi

log "Backend corriendo (PID: $BACKEND_PID)"

# Iniciar Frontend
log "Frontend iniciando en puerto $FRONTEND_PORT..."
cd frontend

# Preparar variables de entorno para Next.js
export NEXT_PUBLIC_SUPABASE_URL="${SUPABASE_URL:-https://placeholder.supabase.co}"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-placeholder}"

# Iniciar frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Esperar que el frontend se inicie
sleep 3

# Verificar que el frontend esté corriendo
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    error "Frontend falló al iniciar"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

log "Frontend corriendo (PID: $FRONTEND_PID)"

# Mostrar resumen
echo ""
echo -e "${GREEN}=== SERVICIOS INICIADOS ===${NC}"
echo ""
echo -e "${BLUE}Backend:${NC}   http://$BACKEND_HOST:$BACKEND_PORT"
echo -e "${BLUE}Frontend:${NC} http://localhost:$FRONTEND_PORT"
echo -e "${BLUE}API Docs:${NC} http://$BACKEND_HOST:$BACKEND_PORT/docs"
echo ""
echo -e "${YELLOW}Presiona Ctrl+C para detener${NC}"

# Función de cleanup
cleanup() {
    echo ""
    log "Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    log "Servicios detenidos"
    exit 0
}

trap cleanup SIGINT

# Mantener el script ejecutándose
wait