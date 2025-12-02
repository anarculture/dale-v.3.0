#!/bin/bash

# Script de instalación de dependencias para Dale
# Este script instala las dependencias del backend y frontend

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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
echo -e "${BLUE}"
echo "=============================================="
echo "  DALE - Script de Instalación de Dependencias"
echo "=============================================="
echo -e "${NC}"

# Verificar que estamos en el directorio correcto
if [ ! -f "requirements.txt" ] || [ ! -d "frontend" ]; then
    error "Este script debe ejecutarse desde el directorio raíz del proyecto Dale"
    error "Archivos requeridos no encontrados: requirements.txt y/o frontend/"
    exit 1
fi

log "Iniciando instalación de dependencias..."

# Instalar dependencias del backend
log "Instalando dependencias del backend (Python/FastAPI)..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    error "Python 3 no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si pip está instalado
if ! command -v pip3 &> /dev/null; then
    error "pip3 no está instalado. Por favor instálalo primero."
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    info "Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
info "Activando entorno virtual..."
source venv/bin/activate

# Actualizar pip
info "Actualizando pip..."
pip install --upgrade pip

# Instalar dependencias del backend
info "Instalando dependencias del backend..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    log "✓ Dependencias del backend instaladas correctamente"
else
    error "Error al instalar dependencias del backend"
    exit 1
fi

# Instalar dependencias del frontend
log "Instalando dependencias del frontend (Next.js/React)..."

cd frontend

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    error "npm no está instalado. Por favor instálalo primero."
    exit 1
fi

# Instalar dependencias
info "Instalando dependencias del frontend..."
npm install

if [ $? -eq 0 ]; then
    log "✓ Dependencias del frontend instaladas correctamente"
else
    error "Error al instalar dependencias del frontend"
    exit 1
fi

cd ..

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    info "Creando archivo .env de ejemplo..."
    cat > .env << EOF
# Configuración de Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here


# Configuración del servidor
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_PORT=3000
EOF
    warn "⚠️  Archivo .env creado. Por favor actualiza las credenciales de Supabase."
else
    info "Archivo .env ya existe, no se sobrescribió"
fi

# Verificar instalación
log "Verificando instalación..."

# Verificar FastAPI
python3 -c "import fastapi; print('FastAPI version:', fastapi.__version__)" 2>/dev/null || warn "FastAPI no disponible en entorno actual"

# Verificar Next.js
cd frontend && npm list next react react-dom 2>/dev/null && cd .. || warn "Dependencias del frontend no verificadas"

echo ""
log "=============================================="
log "✓ Instalación completada exitosamente!"
log "=============================================="
echo ""
log "Próximos pasos:"
echo "  1. Actualiza el archivo .env con tus credenciales de Supabase"
echo "  2. Ejecuta './dev.sh' para iniciar el servidor de desarrollo"
echo ""
info "Para activar el entorno virtual manualmente: source venv/bin/activate"
