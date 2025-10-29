# Documentación de Dale

Este directorio contiene la documentación completa del proyecto Dale, construida con [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/).

## 📚 Estructura de la Documentación

```
docs/
├── index.md                      # Página principal
├── mkdocs.yml                    # Configuración de MkDocs
├── introduction/                 # Documentación de introducción
│   ├── about.md                 # Sobre Dale
│   ├── architecture.md          # Arquitectura del sistema
│   └── tech-stack.md            # Stack tecnológico
├── installation/                 # Guías de instalación
│   ├── requirements.md          # Requisitos del sistema
│   ├── configuration.md         # Configuración
│   ├── local-setup.md           # Setup local
│   └── docker.md                # Configuración Docker
├── development/                  # Guías de desarrollo
│   └── project-structure.md     # Estructura del proyecto
├── api/                         # Documentación de APIs
│   └── overview.md              # Resumen de APIs
├── deployment/                  # Guías de deployment
│   └── frontend-vercel.md       # Deploy en Vercel
├── sdd/                        # Filosofía SDD
│   └── principles.md            # Principios fundamentales
├── guides/                     # Guías de usuario
│   └── faq.md                  # Preguntas frecuentes
├── resources/                  # Recursos adicionales
│   └── additional-resources.md # Recursos y herramientas
└── stylesheets/                # Estilos CSS personalizados
    ├── dale.css               # Estilos principales
    └── extra.css              # Estilos adicionales
```

## 🚀 Ejecutar la Documentación Localmente

### Prerrequisitos

```bash
# Instalar Python 3.8+
python --version

# Instalar pip
pip --version

# Instalar MkDocs y Material theme
pip install mkdocs mkdocs-material
```

### Desarrollo Local

```bash
# Navegar al directorio docs
cd docs

# Servidor de desarrollo con hot reload
mkdocs serve

# La documentación estará disponible en:
# http://localhost:8000
```

### Build de Producción

```bash
# Generar archivos estáticos
mkdocs build

# Los archivos se generan en:
# site/
```

### Limpieza

```bash
# Limpiar archivos generados
mkdocs clean
```

## 🎨 Personalización de Estilos

### Archivos CSS

- **`stylesheets/dale.css`**: Estilos principales personalizados
- **`stylesheets/extra.css`**: Estilos adicionales y mejoras

### Variables CSS

```css
:root {
  /* Colores principales de Dale */
  --dale-primary: #3b82f6;
  --dale-secondary: #f97316;
  
  /* Tipografía */
  --dale-font-family: 'Inter', sans-serif;
  --dale-font-mono: 'Fira Code', monospace;
  
  /* Espaciado */
  --dale-space-md: 1rem;
  --dale-space-lg: 1.5rem;
}
```

### Temas

La documentación soporta:
- **Modo claro** (por defecto)
- **Modo oscuro** (automático según preferencias del sistema)

## 📝 Añadir Nueva Documentación

### 1. Crear Archivo Markdown

```bash
# Crear nuevo archivo de documentación
touch docs/nueva-seccion/mi-documento.md
```

### 2. Estructura Básica

```markdown
# Título de la Página

## Visión General

Descripción de la sección...

## Contenido Principal

### Subsección

Contenido detallado...

## Ejemplos

```bash
# Código de ejemplo
echo "Hola Dale"
```

## Conclusión

Resumen final...
```

### 3. Actualizar Navegación

Editar `mkdocs.yml`:

```yaml
nav:
  # ... navegación existente
  - Nueva Sección:
      - Mi Documento: nueva-seccion/mi-documento.md
```

### 4. Guidelines de Contenido

#### ✅ Buenas Prácticas

- **Títulos claros**: Usa títulos descriptivos y jerárquicos
- **Estructura**: Organiza el contenido con subsecciones lógicas
- **Código**: Incluye ejemplos de código relevantes
- **Enlaces**: Usa enlaces relativos cuando sea posible
- **Imágenes**: Optimiza imágenes (preferiblemente WebP)
- **Consistencia**: Sigue el estilo existente

#### ❌ Evitar

- Enlaces externos rotos
- Código desactualizado
- Información duplicada
- Formato inconsistente
- Falta de contexto

## 🎯 Mejores Prácticas de Redacción

### Estilo de Escritura

- **Tono profesional pero amigable**
- **Párrafos concisos y enfocados**
- **Uso de viñetas para listas**
- **Ejemplos prácticos cuando sea relevante**

### Formato de Código

```bash
# Comandos de terminal
npm install paquete

# Código Python
def funcion_ejemplo():
    print("Hola Dale")

# JSON
{
  "nombre": "valor",
  "configuracion": true
}
```

### Advertencias y Notas

```markdown
> **💡 Tip**: Consejo útil para desarrolladores

> **⚠️ Warning**: Información importante a tener en cuenta

> **🎯 Nota**: Información adicional relevante
```

### Tablas

| Columna 1 | Columna 2 | Columna 3 |
|-----------|-----------|-----------|
| Valor 1   | Valor 2   | Valor 3   |
| Valor A   | Valor B   | Valor C   |

## 🔧 Configuración Avanzada

### mkdocs.yml

Configuración principal con:
- **Tema Material**: Configuración de colores, fonts, extensiones
- **Navegación**: Estructura del menú de navegación
- **Plugins**: Extensions como search, git, etc.
- **Markdown**: Extensiones para mejor rendering

### Plugins Incluidos

- **Search**: Búsqueda en toda la documentación
- **Git Revision Date**: Fechas de modificación
- **Git Authors**: Autores de los archivos
- **Awesome Pages**: Navegación mejorada
- **Minify**: Optimización de HTML/CSS/JS

### Extensiones Markdown

- **Arithmatex**: Soporte para matemáticas
- **Emoji**: Soporte para emojis
- **Highlight**: Syntax highlighting mejorado
- **Tabs**: Pestañas para contenido
- **Tasklist**: Listas de tareas

## 🌐 Deployment de la Documentación

### GitHub Pages

```bash
# Instalar plugin de GitHub Pages
pip install mkdocs-gh-pages

# Deploy automático
mkdocs gh-deploy
```

### Vercel (Recomendado)

```json
{
  "builds": [
    {
      "src": "mkdocs.yml",
      "use": "@mkdocs-material/vercel"
    }
  ]
}
```

### Netlify

```toml
[build]
command = "mkdocs build"
publish = "site"
```

## 🧪 Testing de Documentación

### Link Checker

```bash
# Verificar enlaces rotos
pip install mkdocs-linkcheck
mkdocs linkcheck
```

### Spell Check

```bash
# Verificar ortografía (requiere extensión)
pip install mkdocs-spellcheck
mkdocs spellcheck
```

### Build Test

```bash
# Verificar que el build funciona sin errores
mkdocs build --strict
```

## 📊 Analytics y Monitoreo

### Google Analytics

```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Feeds de Actualización

```yaml
extra:
  feed:
    enable: true
```

## 🤝 Contribución a la Documentación

### Workflow de Contribución

1. **Fork** el repositorio
2. **Crear** rama para la documentación
3. **Editar** archivos de documentación
4. **Testear** localmente con `mkdocs serve`
5. **Commit** cambios con mensaje descriptivo
6. **Crear** Pull Request

### Guidelines de Contribución

- **Revisar** contenido existente antes de añadir
- **Seguir** la estructura de navegación establecida
- **Incluir** ejemplos de código actualizados
- **Verificar** enlaces y referencias
- **Usar** el estilo de escritura establecido

### Revisión de PR

Cada PR de documentación será revisado por:
- **Contenido técnico**: Correctitud y completitud
- **Estilo**: Consistencia con el tono y formato
- **Enlaces**: Verificación de enlaces y referencias
- **Ejemplos**: Validación de código mostrado

## 🔄 Actualización Automática

### GitHub Actions

```yaml
# .github/workflows/docs.yml
name: Deploy Documentation

on:
  push:
    branches: [main]
    paths: ['docs/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - run: pip install mkdocs mkdocs-material
      - run: mkdocs gh-deploy --force
```

### Actualizaciones Automáticas

- **Fechas**: Se actualizan automáticamente desde git
- **Autores**: Se muestran automáticamente desde git
- **Versiones**: Se sincronizan desde tags de release

## 📱 Responsive Design

La documentación es completamente responsive:
- **Desktop**: Layout completo con sidebar
- **Tablet**: Sidebar colapsible
- **Mobile**: Navegación hamburguesa

### Optimizaciones Móviles

- **Tipografía escalada**: Tamaños apropiados para pantallas pequeñas
- **Tablas responsivas**: Scroll horizontal en tablas anchas
- **Navegación táctil**: Elementos interactivos apropiados
- **Imágenes optimizadas**: Lazy loading y formatos modernos

## 🔍 SEO y Accesibilidad

### SEO

- **Meta descriptions**: Automáticas para cada página
- **Open Graph**: Metadatos para redes sociales
- **Sitemap**: Generado automáticamente
- **Schema markup**: Datos estructurados

### Accesibilidad

- **Alt text**: Requerido para todas las imágenes
- **Contrast ratio**: Cumple WCAG 2.1 AA
- **Keyboard navigation**: Completamente navegable
- **Screen readers**: Compatible con lectores de pantalla
- **Focus indicators**: Visibles y apropiados

## 📞 Soporte de Documentación

### ¿Necesitas Ayuda?

1. **Revisar** esta guía de contribución
2. **Consultar** ejemplos en la documentación existente
3. **Preguntar** en Discord #documentation
4. **Crear** issue en GitHub con tag "documentation"

### Problemas Comunes

#### Build Errors
```bash
# Verificar sintaxis YAML
python -c "import yaml; yaml.safe_load(open('mkdocs.yml'))"

# Verificar sintaxis Markdown
python -c "import markdown; markdown.markdown(open('archivo.md').read())"
```

#### Enlaces Rotos
```bash
# Verificar enlaces
mkdocs linkcheck

# Verificar manualmente
curl -I https://enlace-ejemplo.com
```

#### Estilos no Aplicados
- Verificar que los archivos CSS estén en la ruta correcta
- Comprobar la configuración en mkdocs.yml
- Limpiar cache del navegador

## 📈 Métricas de Uso

### Analytics Configurados

- **Page views**: Tracking de páginas más visitadas
- **Search queries**: Búsquedas más frecuentes
- **Exit pages**: Páginas donde los usuarios salen
- **Time on page**: Tiempo promedio en cada sección

### Métricas Objetivo

- **Engagement rate**: > 70% de usuarios navegan más de 2 páginas
- **Search success**: > 90% de búsquedas encuentran resultados
- **Mobile usage**: > 60% del tráfico desde móviles
- **Return rate**: > 30% de usuarios regresan en 30 días

---

## ✅ Checklist de Calidad

Antes de publicar documentación nueva:

- [ ] **Contenido**: Información completa y actualizada
- [ ] **Enlaces**: Todos los enlaces funcionan
- [ ] **Código**: Ejemplos probados y actualizados
- [ ] **Estilo**: Consistente con el resto de la documentación
- [ ] **Responsive**: Funciona en todos los dispositivos
- [ ] **SEO**: Meta descripción y título apropiados
- [ ] **Accesibilidad**: Alt texts y navegación por teclado
- [ ] **Testing**: Build local exitoso sin errores

---

> **📝 Tip**: Esta documentación está en constante evolución. Si ves oportunidades de mejora, ¡no dudes en contribuir! Juntos hacemos que Dale sea más accesible para toda la comunidad. 🚀