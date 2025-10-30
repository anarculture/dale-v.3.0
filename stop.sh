#!/bin/bash

# Script para detener todos los servicios de Dale

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Deteniendo servicios de Dale...${NC}"

# Función para detener proceso por PID
stop_process() {
    local name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            echo -e "${GREEN}✓ $name detenido${NC}"
        else
            echo -e "${YELLOW}⚠ $name ya estaba detenido${NC}"
        fi
        rm -f "$pid_file"
    else
        echo -e "${YELLOW}⚠ No se encontró PID para $name${NC}"
    fi
}

# Detener backend
stop_process "Backend" "backend.pid"

# Detener frontend  
stop_process "Frontend" "frontend.pid"

# Matar procesos por puerto como respaldo
echo -e "${YELLOW}Limpiando procesos por puerto...${NC}"

# Matar procesos en puerto 8000 (backend)
pkill -f "uvicorn.*8000" 2>/dev/null || true
pkill -f "uvicorn.*backend.main" 2>/dev/null || true

# Matar procesos en puerto 3000 (frontend)
pkill -f "next.*dev" 2>/dev/null || true
pkill -f "npm.*dev" 2>/dev/null || true

# Matar procesos node relacionados
pkill -f "node.*next" 2>/dev/null || true

echo -e "${GREEN}✓ Todos los servicios detenidos${NC}"