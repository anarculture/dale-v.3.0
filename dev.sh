#!/bin/bash

# Script de desarrollo para Dale
# Este script levanta el backend (FastAPI) y frontend (Next.js) en paralelo

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Variables de configuración
BACKEND_PORT=${API_PORT:-8000}
FRONTEND_PORT=${FRONTEND_PORT:-3000}
BACKEND_HOST=${API_HOST:-0.0.0.0}
LOG_DIR="logs"

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" >&2
}

warn() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Banner
echo -e "${CYAN}"
echo "=============================================="
echo "  DALE - Servidor de Desarrollo"
echo "=============================================="
echo -e "${NC}"

# Crear directorio de logs
mkdir -p $LOG_DIR

# Verificar que estamos en el directorio correcto
if [ ! -f "requirements.txt" ] || [ ! -d "frontend" ] || [ ! -f "backend/main.py" ]; then
    error "Este script debe ejecutarse desde el directorio raíz del proyecto Dale"
    error "Archivos requeridos no encontrados"
    exit 1
fi

# Función para verificar si un puerto está en uso
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        warn "El puerto $port ($service) ya está en uso"
        return 1
    fi
    return 0
}

# Función para limpiar procesos al salir
cleanup() {
    echo ""
    log "Deteniendo servicios..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        info "Backend detenido"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        info "Frontend detenido"
    fi
    
    # Limpiar archivos PID
    rm -f backend.pid frontend.pid
    
    log "Todos los servicios detenidos"
    exit 0
}

# Configurar trap para cleanup en caso de interrupción
trap cleanup SIGINT SIGTERM

# Verificar dependencias
log "Verificando dependencias..."

# Verificar Python y entorno virtual
if [ ! -d "venv" ]; then
    error "Entorno virtual no encontrado. Ejecuta './install.sh' primero."
    exit 1
fi

if [ ! -f "venv/bin/activate" ]; then
    error "Archivo de activación del entorno virtual no encontrado"
    exit 1
fi

# Verificar Node.js y npm
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    error "npm no está instalado"
    exit 1
fi

# Verificar puertos
if ! check_port $BACKEND_PORT "Backend"; then
    warn "Puerto del backend en uso. Intentando encontrar puerto disponible..."
    for port in $(seq $BACKEND_PORT 8100); do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            BACKEND_PORT=$port
            info "Usando puerto alternativo para backend: $BACKEND_PORT"
            break
        fi
    done
fi

if ! check_port $FRONTEND_PORT "Frontend"; then
    warn "Puerto del frontend en uso. Intentando encontrar puerto disponible..."
    for port in $(seq $FRONTEND_PORT 3100); do
        if ! lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            FRONTEND_PORT=$port
            info "Usando puerto alternativo para frontend: $FRONTEND_PORT"
            break
        fi
    done
fi

# Verificar archivo .env
if [ ! -f ".env" ]; then
    warn "Archivo .env no encontrado"
    info "Creando archivo .env temporal..."
    cat > .env << EOF
# Configuración de Supabase (debe ser configurado)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Configuración del servidor
API_HOST=$BACKEND_HOST
API_PORT=$BACKEND_PORT
FRONTEND_PORT=$FRONTEND_PORT
EOF
    warn "⚠️  Por favor actualiza las credenciales en .env antes de usar la API"
fi

# Cargar variables de entorno
source .env 2>/dev/null || true

if [ ! -z "$API_PORT" ]; then
    BACKEND_PORT=$API_PORT
fi

log "Iniciando servicios de desarrollo..."

# Iniciar Backend (FastAPI)
log "Levantando backend en http://$BACKEND_HOST:$BACKEND_PORT"

# Activar entorno virtual y ejecutar backend
source venv/bin/activate
export PYTHONPATH="$PWD:$PYTHONPATH"
export SUPABASE_URL="${SUPABASE_URL:-https://placeholder.supabase.co}"
export SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY:-placeholder}"
export SUPABASE_JWT_SECRET="${SUPABASE_JWT_SECRET:-placeholder}"

nohup uvicorn backend.main:app --host $BACKEND_HOST --port $BACKEND_PORT --reload > $LOG_DIR/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > backend.pid

# Esperar un poco para que el backend se inicie
sleep 3

# Verificar que el backend se inició correctamente
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    error "Error al iniciar el backend. Revisa el log: $LOG_DIR/backend.log"
    cat $LOG_DIR/backend.log
    exit 1
fi

# Iniciar Frontend (Next.js)
log "Levantando frontend en http://localhost:$FRONTEND_PORT"

cd frontend

# Crear archivo .env.local para Next.js si no existe
if [ ! -f ".env.local" ]; then
    cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-placeholder}
EOF
fi

nohup env PORT=$FRONTEND_PORT npm run dev > ../$LOG_DIR/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
echo $FRONTEND_PID > frontend.pid

# Esperar un poco para que el frontend se inicie
sleep 5

# Verificar que el frontend se inició correctamente
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    error "Error al iniciar el frontend. Revisa el log: $LOG_DIR/frontend.log"
    cat $LOG_DIR/frontend.log
    cleanup
    exit 1
fi

# Mostrar información de los servicios
echo ""
echo -e "${GREEN}==============================================${NC}"
echo -e "${GREEN}✓ ¡Servicios iniciados exitosamente!${NC}"
echo -e "${GREEN}==============================================${NC}"
echo ""
echo -e "${PURPLE}Backend (FastAPI):${NC}"
echo -e "  ${CYAN}URL:${NC}      http://$BACKEND_HOST:$BACKEND_PORT"
echo -e "  ${CYAN}Documentos:${NC} http://$BACKEND_HOST:$BACKEND_PORT/docs"
echo -e "  ${CYAN}PID:${NC}      $BACKEND_PID"
echo ""
echo -e "${PURPLE}Frontend (Next.js):${NC}"
echo -e "  ${CYAN}URL:${NC}      http://localhost:$FRONTEND_PORT"
echo -e "  ${CYAN}PID:${NC}      $FRONTEND_PID"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "  ${CYAN}Backend:${NC}  $LOG_DIR/backend.log"
echo -e "  ${CYAN}Frontend:${NC} $LOG_DIR/frontend.log"
echo ""
echo -e "${YELLOW}Para detener los servicios:${NC}"
echo -e "  Presiona ${RED}Ctrl+C${NC} o ejecuta ${BLUE}./stop.sh${NC}"
echo ""

# Función para mostrar logs en tiempo real
show_logs() {
    echo -e "${YELLOW}Mostrando logs en tiempo real (Ctrl+C para salir)...${NC}"
    echo ""
    
    # Función para mostrar logs con colores
    show_colored_logs() {
        tail -f $LOG_DIR/backend.log | sed "s/^/${BLUE}[BACKEND]${NC} /" &
        BACKEND_LOG_PID=$!
        
        tail -f $LOG_DIR/frontend.log | sed "s/^/${PURPLE}[FRONTEND]${NC} /" &
        FRONTEND_LOG_PID=$!
        
        # Esperar señal de interrupción
        wait
    }
    
    show_colored_logs
}

# Preguntar si mostrar logs
read -p "¿Deseas ver los logs en tiempo real? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    show_logs
else
    # Mantener el script ejecutándose para que los servicios sigan activos
    log "Servicios ejecutándose en segundo plano..."
    log "Usa 'tail -f $LOG_DIR/backend.log' para ver logs del backend"
    log "Usa 'tail -f $LOG_DIR/frontend.log' para ver logs del frontend"
    log "Presiona Ctrl+C para detener los servicios"
    
    # Esperar hasta que se reciba SIGINT
    while true; do
        sleep 1
        # Verificar que los procesos aún estén activos
        if ! kill -0 $BACKEND_PID 2>/dev/null || ! kill -0 $FRONTEND_PID 2>/dev/null; then
            warn "Uno de los servicios se detuvo inesperadamente"
            break
        fi
    done
fi

# Limpiar al salir
cleanup