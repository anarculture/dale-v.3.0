#!/bin/bash

# Script para ejecutar tests del proyecto Dale
# Combina testing de backend y frontend

set -e  # Salir en caso de error

echo "🧪 Iniciando suite de tests del Proyecto Dale"
echo "=============================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para instalar dependencias si es necesario
install_dependencies() {
    log_info "Verificando e instalando dependencias..."
    
    # Backend
    if [ -d "backend" ]; then
        log_info "Instalando dependencias de backend..."
        cd backend
        if command_exists pip; then
            pip install -r requirements.txt
            log_success "Dependencias de backend instaladas"
        else
            log_warning "pip no encontrado, saltando dependencias de backend"
        fi
        cd ..
    fi
    
    # Frontend
    if [ -d "frontend" ]; then
        log_info "Instalando dependencias de frontend..."
        cd frontend
        if command_exists npm; then
            npm install
            if command_exists npx; then
                npx playwright install
                log_success "Dependencias de frontend y Playwright instaladas"
            else
                log_warning "npx no encontrado, saltando instalación de Playwright"
            fi
        else
            log_warning "npm no encontrado, saltando dependencias de frontend"
        fi
        cd ..
    fi
}

# Función para ejecutar tests de backend
run_backend_tests() {
    if [ ! -d "backend" ]; then
        log_warning "Directorio backend no encontrado, saltando tests de backend"
        return 0
    fi
    
    log_info "Ejecutando tests de backend (Python/Pytest)..."
    
    cd backend
    
    # Verificar si pytest está instalado
    if ! python -c "import pytest" 2>/dev/null; then
        log_error "pytest no está instalado. Instalando..."
        pip install pytest pytest-cov pytest-html
    fi
    
    # Ejecutar tests
    if [ "$1" = "--coverage" ] || [ "$2" = "--coverage" ]; then
        log_info "Ejecutando tests con coverage..."
        pytest --cov=main --cov-report=html --cov-report=term --html=report.html --self-contained-html
        log_success "Tests de backend completados con coverage"
        log_info "Reporte de coverage disponible en: backend/htmlcov/index.html"
    else
        pytest -v --tb=short
        log_success "Tests de backend completados"
    fi
    
    cd ..
}

# Función para ejecutar tests de frontend
run_frontend_tests() {
    if [ ! -d "frontend" ]; then
        log_warning "Directorio frontend no encontrado, saltando tests de frontend"
        return 0
    fi
    
    log_info "Ejecutando tests de frontend (TypeScript/Playwright)..."
    
    cd frontend
    
    # Verificar si las dependencias están instaladas
    if [ ! -d "node_modules" ]; then
        log_warning "node_modules no encontrado, instalando dependencias..."
        npm install
        npx playwright install
    fi
    
    # Determinar qué tipo de tests ejecutar
    case "$1" in
        "e2e"|"ui")
            log_info "Ejecutando tests $1..."
            npm run test:$1
            ;;
        "api")
            log_info "Ejecutando tests de API..."
            npm run test:api
            ;;
        "mobile")
            log_info "Ejecutando tests móviles..."
            npm run test:mobile
            ;;
        "debug")
            log_info "Ejecutando tests en modo debug..."
            npm run test:debug
            ;;
        "fast")
            log_info "Ejecutando tests rápidos..."
            npm run test:fast
            ;;
        *)
            log_info "Ejecutando todos los tests..."
            npm run test
            ;;
    esac
    
    log_success "Tests de frontend completados"
    
    cd ..
}

# Función para mostrar reporte
show_reports() {
    log_info "Abriendo reportes..."
    
    # Backend
    if [ -f "backend/htmlcov/index.html" ]; then
        log_info "Reporte de coverage de backend disponible en: backend/htmlcov/index.html"
    fi
    
    # Frontend
    if [ -d "frontend/test-results" ]; then
        log_info "Resultados de tests de frontend disponibles en: frontend/test-results/"
        if command_exists open; then
            open frontend/test-results/index.html 2>/dev/null || true
        elif command_exists xdg-open; then
            xdg-open frontend/test-results/index.html 2>/dev/null || true
        fi
    fi
}

# Función de ayuda
show_help() {
    echo "Uso: $0 [opción]"
    echo ""
    echo "Opciones:"
    echo "  install         Instalar todas las dependencias de testing"
    echo "  backend         Ejecutar solo tests de backend"
    echo "  frontend        Ejecutar solo tests de frontend"
    echo "  e2e            Ejecutar tests end-to-end del frontend"
    echo "  ui             Ejecutar tests de UI del frontend"
    echo "  api            Ejecutar tests de API del frontend"
    echo "  mobile         Ejecutar tests móviles del frontend"
    echo "  debug          Ejecutar tests en modo debug (frontend)"
    echo "  fast           Ejecutar tests rápidos (frontend)"
    echo "  coverage       Ejecutar tests con coverage (backend)"
    echo "  reports        Mostrar reportes disponibles"
    echo "  all            Ejecutar todos los tests (backend y frontend)"
    echo "  help           Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 install      # Instalar dependencias"
    echo "  $0 backend      # Solo tests de backend"
    echo "  $0 e2e          # Tests E2E del frontend"
    echo "  $0 coverage     # Tests con coverage"
    echo "  $0 all          # Todos los tests"
}

# Función principal
main() {
    case "$1" in
        "install")
            install_dependencies
            ;;
        "backend")
            run_backend_tests "$@"
            ;;
        "frontend")
            run_frontend_tests "$@"
            ;;
        "e2e"|"ui"|"api"|"mobile"|"debug"|"fast")
            run_frontend_tests "$1"
            ;;
        "coverage")
            run_backend_tests "--coverage"
            ;;
        "reports")
            show_reports
            ;;
        "all")
            run_backend_tests
            echo ""
            run_frontend_tests
            echo ""
            log_success "¡Todos los tests completados!"
            show_reports
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            # Si no se especifica nada, ejecutar todos los tests
            log_info "Ejecutando todos los tests por defecto..."
            run_backend_tests
            echo ""
            run_frontend_tests
            echo ""
            log_success "¡Tests completados!"
            ;;
        *)
            log_error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Ejecutar función principal
main "$@"