#!/bin/bash

# Dale Documentation Setup Script
# Este script automatiza la configuración inicial de la documentación MkDocs

set -e  # Exit on any error

echo "🚀 Configurando documentación de Dale..."
echo "=========================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging con colores
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "mkdocs.yml" ]; then
    log_error "Error: No se encontró mkdocs.yml. Asegúrate de ejecutar este script desde el directorio docs/"
    exit 1
fi

log_info "Verificando prerrequisitos..."

# Verificar Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    log_success "Python encontrado: $PYTHON_VERSION"
else
    log_error "Python3 no encontrado. Por favor instala Python 3.8+"
    exit 1
fi

# Verificar pip
if command -v pip &> /dev/null; then
    log_success "pip encontrado"
else
    log_error "pip no encontrado. Instala pip primero"
    exit 1
fi

# Verificar si estamos en un entorno virtual
if [[ "$VIRTUAL_ENV" != "" ]]; then
    log_success "Entorno virtual detectado: $VIRTUAL_ENV"
else
    log_warning "No estás en un entorno virtual. Se recomienda usar uno."
    read -p "¿Deseas continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

log_info "Instalando dependencias de documentación..."

# Instalar MkDocs y plugins
if pip install mkdocs mkdocs-material mkdocs-mermaid2-plugin; then
    log_success "Dependencias instaladas correctamente"
else
    log_error "Error instalando dependencias"
    exit 1
fi

# Verificar instalación
if mkdocs --version > /dev/null 2>&1; then
    MKDOCS_VERSION=$(mkdocs --version | head -n1)
    log_success "MkDocs instalado: $MKDOCS_VERSION"
else
    log_error "Error verificando instalación de MkDocs"
    exit 1
fi

log_info "Configurando archivos adicionales..."

# Crear directorio de logs si no existe
mkdir -p logs

# Crear archivo de configuración para desarrollo local
cat > mkdocs.dev.yml << EOF
# Configuración de desarrollo para Dale Documentation
# Este archivo se usa durante el desarrollo local

site_name: Dale - Documentación (Desarrollo)
site_url: http://localhost:8000

# Documentación plugins de desarrollo
dev_addr: '127.0.0.1:8000'

# Watch archivos adicionales
watch:
  - includes/
  - stylesheets/

# Configuración de build para desarrollo
strict: false

# Extra config para desarrollo
extra:
  version:
    provider: mike
  development: true
EOF

log_success "Archivo de desarrollo creado: mkdocs.dev.yml"

# Crear script de servidor de desarrollo
cat > serve-docs.sh << 'EOF'
#!/bin/bash

# Script para servir documentación localmente con hot reload

echo "🚀 Iniciando servidor de documentación Dale..."
echo "Servidor disponible en: http://localhost:8000"
echo "Presiona Ctrl+C para detener el servidor"
echo ""

# Verificar que mkdocs esté disponible
if ! command -v mkdocs &> /dev/null; then
    echo "❌ Error: mkdocs no está instalado"
    echo "Ejecuta: pip install mkdocs mkdocs-material"
    exit 1
fi

# Usar configuración de desarrollo si existe
if [ -f "mkdocs.dev.yml" ]; then
    mkdocs serve -f mkdocs.dev.yml --dev-addr=127.0.0.1:8000
else
    mkdocs serve --dev-addr=127.0.0.1:8000
fi
EOF

chmod +x serve-docs.sh
log_success "Script de servidor creado: serve-docs.sh"

# Crear script de build
cat > build-docs.sh << 'EOF'
#!/bin/bash

# Script para generar documentación estática

echo "🏗️  Generando documentación estática..."
echo ""

# Verificar que mkdocs esté disponible
if ! command -v mkdocs &> /dev/null; then
    echo "❌ Error: mkdocs no está instalado"
    echo "Ejecuta: pip install mkdocs mkdocs-material"
    exit 1
fi

# Limpiar build anterior
if [ -d "site" ]; then
    echo "🧹 Limpiando build anterior..."
    rm -rf site
fi

# Generar documentación
echo "📚 Generando documentación..."
if mkdocs build; then
    echo "✅ Documentación generada exitosamente"
    echo "📁 Los archivos están en el directorio: site/"
    echo ""
    echo "Para servir localmente:"
    echo "  cd site && python -m http.server 8000"
    echo ""
else
    echo "❌ Error generando documentación"
    exit 1
fi
EOF

chmod +x build-docs.sh
log_success "Script de build creado: build-docs.sh"

# Crear script de deploy
cat > deploy-docs.sh << 'EOF'
#!/bin/bash

# Script para deploy automático (GitHub Pages, Vercel, etc.)

echo "🚀 Desplegando documentación..."

# Verificar que mkdocs esté disponible
if ! command -v mkdocs &> /dev/null; then
    echo "❌ Error: mkdocs no está instalado"
    echo "Ejecuta: pip install mkdocs mkdocs-material"
    exit 1
fi

# Determinar método de deploy
if command -v vercel &> /dev/null; then
    echo "🌐 Detectado Vercel CLI"
    echo "Deployando con Vercel..."
    mkdocs build
    vercel --prod
elif command -v gh &> /dev/null; then
    echo "📄 Detectado GitHub CLI"
    echo "Deployando con GitHub Pages..."
    pip install mkdocs-gh-pages
    mkdocs gh-deploy --force
else
    echo "⚠️  No se detectó herramienta de deploy automática"
    echo "Métodos disponibles:"
    echo "  - GitHub Pages: pip install mkdocs-gh-pages && mkdocs gh-deploy"
    echo "  - Vercel: npm i -g vercel && vercel"
    echo "  - Manual: mkdocs build (archivos en site/)"
fi
EOF

chmod +x deploy-docs.sh
log_success "Script de deploy creado: deploy-docs.sh"

# Crear README para la documentación local
cat > README-LOCAL.md << 'EOF'
# Documentación Dale - Guía Local

## 🚀 Comandos Rápidos

### Servidor de Desarrollo
```bash
./serve-docs.sh
```
O manualmente:
```bash
mkdocs serve --dev-addr=127.0.0.1:8000
```

### Generar Documentación Estática
```bash
./build-docs.sh
```

### Deploy Automático
```bash
./deploy-docs.sh
```

## 📁 Estructura de Archivos

```
docs/
├── mkdocs.yml              # Configuración principal
├── mkdocs.dev.yml          # Configuración de desarrollo
├── serve-docs.sh           # Script servidor desarrollo
├── build-docs.sh           # Script build
├── deploy-docs.sh          # Script deploy
├── index.md                # Página principal
├── introduction/           # Documentación introducción
├── installation/           # Guías instalación
├── development/            # Guías desarrollo
├── api/                    # Documentación APIs
├── deployment/             # Guías deployment
├── sdd/                    # Filosofía SDD
├── guides/                 # Guías usuario
├── resources/              # Recursos adicionales
├── includes/               # Archivos incluidos
└── stylesheets/            # Estilos CSS personalizados
```

## 🛠️ Desarrollo

### Añadir Nueva Página

1. Crear archivo markdown en la sección apropiada
2. Añadir a la navegación en `mkdocs.yml`
3. Verificar que el servidor de desarrollo muestra los cambios

### Personalizar Estilos

- `stylesheets/dale.css` - Estilos principales
- `stylesheets/extra.css` - Estilos adicionales

### Extensiones

La documentación usa varias extensiones de Markdown:
- Admonitions (note, warning, tip)
- Tabs
- Code highlighting
- Mermaid diagrams
- Git integration

## 🔧 Troubleshooting

### Error de importación de módulos
```bash
pip install --upgrade mkdocs mkdocs-material
```

### Puerto en uso
```bash
mkdocs serve --dev-addr=127.0.0.1:8001
```

### Cambios no se reflejan
- Verificar que el servidor esté corriendo
- Limpiar cache del navegador
- Reiniciar servidor

## 📞 Soporte

- Issues: [GitHub Issues](https://github.com/dale/app/issues)
- Discord: [Comunidad Dale](https://discord.gg/dale)
- Email: [docs@dale-app.com](mailto:docs@dale-app.com)
EOF

log_success "README local creado: README-LOCAL.md"

# Verificar configuración
log_info "Verificando configuración..."

if mkdocs build --strict > /dev/null 2>&1; then
    log_success "Configuración de MkDocs válida"
else
    log_warning "Hay warnings o errores en la configuración"
    log_info "Ejecuta 'mkdocs build --strict' para ver detalles"
fi

# Mostrar resumen final
echo ""
echo "🎉 ¡Configuración completada!"
echo "=========================="
echo ""
echo "📚 Comandos disponibles:"
echo "  • ./serve-docs.sh     - Servidor de desarrollo"
echo "  • ./build-docs.sh     - Generar documentación"
echo "  • ./deploy-docs.sh    - Deploy automático"
echo ""
echo "🌐 URLs locales:"
echo "  • Documentación: http://localhost:8000"
echo "  • Config desarrollo: mkdocs.dev.yml"
echo ""
echo "📖 Próximos pasos:"
echo "  1. Ejecuta: ./serve-docs.sh"
echo "  2. Abre: http://localhost:8000"
echo "  3. Edita archivos .md en las carpetas correspondientes"
echo ""
log_success "¡Documentación lista para desarrollo! 🚀"
