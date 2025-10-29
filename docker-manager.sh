#!/bin/bash

# ========================================
# SCRIPT DE UTILIDAD - DOCKER COMPOSE
# Dale Rides Platform
# ========================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes coloreados
print_message() {
    echo -e "${2}${1}${NC}"
}

# Función para mostrar ayuda
show_help() {
    cat << EOF
${BLUE}========================================${NC}
${BLUE}    Dale Platform - Docker Manager     ${NC}
${BLUE}========================================${NC}

${YELLOW}USO:${NC}
    ./docker-manager.sh [COMANDO]

${YELLOW}COMANDOS:${NC}
    ${GREEN}up${NC}              - Iniciar todos los servicios en desarrollo
    ${GREEN}up-d${NC}            - Iniciar servicios en segundo plano
    ${GREEN}down${NC}            - Detener todos los servicios
    ${GREEN}restart${NC}         - Reiniciar servicios
    ${GREEN}build${NC}           - Reconstruir imágenes Docker
    ${GREEN}logs${NC}            - Ver logs de todos los servicios
    ${GREEN}logs-backend${NC}    - Ver logs del backend
    ${GREEN}logs-frontend${NC}   - Ver logs del frontend
    ${GREEN}logs-redis${NC}      - Ver logs de Redis
    ${GREEN}status${NC}          - Ver estado de servicios
    ${GREEN}clean${NC}           - Limpiar contenedores y volúmenes
    ${GREEN}prod${NC}            - Ejecutar en modo producción
    ${GREEN}shell-backend${NC}   - Acceder al shell del backend
    ${GREEN}shell-frontend${NC}  - Acceder al shell del frontend
    ${GREEN}health${NC}          - Verificar salud de servicios
    ${GREEN}help${NC}            - Mostrar esta ayuda

${YELLOW}EJEMPLOS:${NC}
    ./docker-manager.sh up               # Iniciar en desarrollo
    ./docker-manager.sh up-d             # Iniciar en background
    ./docker-manager.sh logs-backend     # Ver logs del backend
    ./docker-manager.sh prod             # Ejecutar en producción

${YELLOW}NOTA:${NC}
    - Asegúrate de tener un archivo .env configurado
    - Para producción usa: ./docker-manager.sh prod

EOF
}

# Función para verificar prerrequisitos
check_prerequisites() {
    print_message "🔍 Verificando prerrequisitos..." $BLUE
    
    if ! command -v docker &> /dev/null; then
        print_message "❌ Docker no está instalado" $RED
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_message "❌ Docker Compose no está instalado" $RED
        exit 1
    fi
    
    if [ ! -f .env ]; then
        print_message "⚠️  Archivo .env no encontrado. Creando desde .env.example..." $YELLOW
        if [ -f .env.example ]; then
            cp .env.example .env
            print_message "✅ Archivo .env creado. Por favor edítalo con tus configuraciones." $GREEN
            exit 1
        else
            print_message "❌ No se encontró .env.example" $RED
            exit 1
        fi
    fi
    
    print_message "✅ Prerrequisitos verificados" $GREEN
}

# Función para iniciar servicios
up() {
    print_message "🚀 Iniciando servicios en desarrollo..." $BLUE
    docker-compose up
}

# Función para iniciar servicios en segundo plano
up_d() {
    print_message "🚀 Iniciando servicios en segundo plano..." $BLUE
    docker-compose up -d
}

# Función para detener servicios
down() {
    print_message "🛑 Deteniendo servicios..." $BLUE
    docker-compose down
}

# Función para reiniciar servicios
restart() {
    print_message "🔄 Reiniciando servicios..." $BLUE
    docker-compose restart
}

# Función para reconstruir imágenes
build() {
    print_message "🔨 Reconstruyendo imágenes..." $BLUE
    docker-compose build --no-cache
}

# Función para ver logs
logs() {
    docker-compose logs -f --tail=50
}

# Función para ver logs del backend
logs_backend() {
    print_message "📋 Logs del backend (Ctrl+C para salir)" $BLUE
    docker-compose logs -f backend --tail=50
}

# Función para ver logs del frontend
logs_frontend() {
    print_message "📋 Logs del frontend (Ctrl+C para salir)" $BLUE
    docker-compose logs -f frontend --tail=50
}

# Función para ver logs de Redis
logs_redis() {
    print_message "📋 Logs de Redis (Ctrl+C para salir)" $BLUE
    docker-compose logs -f redis --tail=50
}

# Función para ver estado de servicios
status() {
    print_message "📊 Estado de servicios:" $BLUE
    docker-compose ps
}

# Función para limpiar
clean() {
    print_message "🧹 Limpiando contenedores y volúmenes..." $YELLOW
    read -p "¿Estás seguro? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_message "✅ Limpieza completada" $GREEN
    else
        print_message "❌ Limpieza cancelada" $RED
    fi
}

# Función para modo producción
prod() {
    print_message "🏭 Iniciando en modo producción..." $BLUE
    docker-compose --profile production up -d
}

# Función para acceder al shell del backend
shell_backend() {
    print_message "🐍 Accediendo al shell del backend..." $BLUE
    docker-compose exec backend bash || docker-compose exec backend sh
}

# Función para acceder al shell del frontend
shell_frontend() {
    print_message "⚛️  Accediendo al shell del frontend..." $BLUE
    docker-compose exec frontend sh || docker-compose exec frontend bash
}

# Función para verificar salud
health() {
    print_message "💓 Verificando salud de servicios..." $BLUE
    echo
    
    # Verificar backend
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        print_message "✅ Backend (FastAPI): Sano" $GREEN
    else
        print_message "❌ Backend (FastAPI): No disponible" $RED
    fi
    
    # Verificar frontend
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        print_message "✅ Frontend (Next.js): Sano" $GREEN
    else
        print_message "❌ Frontend (Next.js): No disponible" $RED
    fi
    
    # Verificar Redis
    if docker-compose exec redis redis-cli ping > /dev/null 2>&1; then
        print_message "✅ Redis: Sano" $GREEN
    else
        print_message "❌ Redis: No disponible" $RED
    fi
}

# Función principal
main() {
    case "${1:-help}" in
        "up")
            check_prerequisites
            up
            ;;
        "up-d")
            check_prerequisites
            up_d
            ;;
        "down")
            down
            ;;
        "restart")
            restart
            ;;
        "build")
            check_prerequisites
            build
            ;;
        "logs")
            logs
            ;;
        "logs-backend")
            logs_backend
            ;;
        "logs-frontend")
            logs_frontend
            ;;
        "logs-redis")
            logs_redis
            ;;
        "status")
            status
            ;;
        "clean")
            clean
            ;;
        "prod")
            check_prerequisites
            prod
            ;;
        "shell-backend")
            shell_backend
            ;;
        "shell-frontend")
            shell_frontend
            ;;
        "health")
            health
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"