#!/bin/bash

# Script para instalar dependencias de testing
# Ejecutar desde la raíz del proyecto Dale

echo "🔧 Instalando dependencias de testing..."

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para logging
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Instalar dependencias de backend
if [ -d "backend" ]; then
    log "Instalando dependencias de backend..."
    cd backend
    pip install -r requirements.txt
    success "Dependencias de backend instaladas"
    cd ..
else
    echo "Directorio backend no encontrado"
fi

# Instalar dependencias de frontend
if [ -d "frontend" ]; then
    log "Instalando dependencias de frontend..."
    cd frontend
    npm install
    npx playwright install
    success "Dependencias de frontend y Playwright instaladas"
    cd ..
else
    echo "Directorio frontend no encontrado"
fi

echo ""
success "¡Instalación de dependencias de testing completada!"
echo ""
echo "Para ejecutar los tests:"
echo "  Backend:  cd backend && pytest"
echo "  Frontend: cd frontend && npm run test"
echo "  Todo:     ./test.sh"