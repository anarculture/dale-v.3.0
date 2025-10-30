.PHONY: help dev dev-frontend dev-backend stop test clean seed docs

help: ## Mostrar ayuda
	@echo "Dale - Makefile Commands"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Levantar frontend y backend
	@echo "🚀 Levantando backend..."
	@cd infra && docker compose up -d
	@echo "✅ Backend corriendo en http://localhost:8000"
	@echo ""
	@echo "🚀 Levantando frontend..."
	@echo "⚠️  Ejecuta manualmente: cd frontend && npm run dev"
	@echo "   Frontend estará en http://localhost:3000"

dev-frontend: ## Solo frontend (host)
	@echo "🚀 Levantando frontend..."
	@cd frontend && npm run dev

dev-backend: ## Solo backend (Docker)
	@echo "🚀 Levantando backend..."
	@cd infra && docker compose up -d
	@echo "✅ Backend corriendo en http://localhost:8000"
	@echo "📝 Logs: make logs-backend"

stop: ## Detener todos los servicios
	@echo "🛑 Deteniendo servicios..."
	@cd infra && docker compose down
	@echo "✅ Servicios detenidos"

logs-backend: ## Ver logs del backend
	@cd infra && docker compose logs -f backend

test: ## Ejecutar todos los tests
	@echo "🧪 Ejecutando tests del backend..."
	@cd backend && pytest
	@echo ""
	@echo "🧪 Ejecutando tests del frontend..."
	@cd frontend && npm run test:e2e

clean: ## Limpiar builds y dependencias
	@echo "🧹 Limpiando..."
	@cd frontend && rm -rf .next node_modules
	@cd backend && rm -rf __pycache__ .pytest_cache
	@cd infra && docker compose down -v
	@echo "✅ Limpieza completada"

seed: ## Cargar datos de ejemplo en la DB
	@echo "🌱 Cargando seeds..."
	@cd backend && docker exec -it dale-backend python scripts/seed.py
	@echo "✅ Seeds cargados"

docs: ## Servir documentación MkDocs
	@echo "📚 Sirviendo documentación..."
	@cd docs && mkdocs serve

install-frontend: ## Instalar dependencias del frontend
	@echo "📦 Instalando dependencias del frontend..."
	@cd frontend && npm install

install-backend: ## Instalar dependencias del backend
	@echo "📦 Instalando dependencias del backend..."
	@cd backend && pip install -e ".[dev]"

migrate: ## Aplicar migraciones de Prisma
	@echo "📊 Aplicando migraciones..."
	@cd backend && npx prisma migrate deploy
	@echo "✅ Migraciones aplicadas"

migrate-dev: ## Crear y aplicar nueva migración (desarrollo)
	@echo "📊 Creando migración..."
	@read -p "Nombre de la migración: " name; \
	cd backend && npx prisma migrate dev --name $$name

prisma-generate: ## Generar cliente Prisma
	@echo "🔄 Generando cliente Prisma..."
	@cd backend && npx prisma generate
	@echo "✅ Cliente Prisma generado"
