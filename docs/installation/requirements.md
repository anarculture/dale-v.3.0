# Requisitos del Sistema

## 🎯 Visión General

Antes de comenzar con la instalación de Dale, es importante verificar que tu sistema cumple con todos los requisitos necesarios. Esta guía te ayudará a identificar y preparar todo lo que necesitas para una instalación exitosa.

## 💻 Requisitos Mínimos del Sistema

### 🖥️ Hardware

| Componente | Mínimo | Recomendado | Óptimo |
|------------|--------|-------------|--------|
| **RAM** | 4 GB | 8 GB | 16 GB |
| **CPU** | 2 cores | 4 cores | 8 cores |
| **Almacenamiento** | 2 GB libres | 5 GB libres | 10 GB libres |
| **Conexión** | Broadband | Broadband | Broadband |

### 🌍 Compatibilidad del Sistema Operativo

#### ✅ Soportados Completamente
- **Ubuntu** 20.04 LTS o superior
- **macOS** 11.0 (Big Sur) o superior
- **Windows** 10 o superior
- **Windows 11** (recomendado para desarrollo)

#### ⚠️ Soporte Limitado
- **Docker Desktop** en Windows 10 Home
- **WSL2** (Windows Subsystem for Linux)

#### ❌ No Soportados
- Windows 8 o anteriores
- macOS 10.14 (Mojave) o anteriores
- Distribuciones Linux muy antiguas

## 🛠️ Software Requerido

### 1. 🐍 Python (Backend)

**Versión Requerida**: Python 3.11+

```bash
# Verificar versión instalada
python3 --version
# Debe mostrar: Python 3.11.x o superior
```

**Instalación por OS:**

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3.11 python3.11-venv python3.11-dev
```

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install python@3.11

# O descarga desde python.org
# https://www.python.org/downloads/macos/
```

#### Windows
```powershell
# Usando chocolatey
choco install python311

# O descarga desde python.org
# https://www.python.org/downloads/windows/
```

**Verificación:**
```bash
python3 --version
# Output esperado: Python 3.11.x
```

### 2. 📦 Node.js (Frontend)

**Versión Requerida**: Node.js 18.0+ (LTS recomendado)

```bash
# Verificar versión instalada
node --version
# Debe mostrar: v18.x.x o superior
```

**Instalación por OS:**

#### Ubuntu/Debian
```bash
# Usando NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### macOS
```bash
# Usando Homebrew (recomendado)
brew install node@18

# O usando nvm (alternativa)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Windows
```powershell
# Usando chocolatey
choco install nodejs

# O descarga desde nodejs.org
# https://nodejs.org/en/download/
```

**Verificación:**
```bash
node --version    # v18.x.x o superior
npm --version     # 9.x.x o superior
```

### 3. 📦 npm/Yarn (Gestor de Paquetes)

**Recomendado**: npm viene incluido con Node.js, pero puedes usar Yarn.

```bash
# Yarn (opcional, alternativo a npm)
npm install -g yarn

# Verificar instalación
yarn --version
```

### 4. 🐳 Docker (Opcional pero Recomendado)

**Versión Requerida**: Docker 20.10+ y Docker Compose 2.0+

#### Ubuntu/Debian
```bash
# Instalar Docker
sudo apt update
sudo apt install docker.io docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Verificar instalación
docker --version
docker-compose --version
```

#### macOS
```bash
# Descargar e instalar Docker Desktop
# https://www.docker.com/products/docker-desktop

# Verificar instalación
docker --version
docker-compose --version
```

#### Windows
```powershell
# Instalar Docker Desktop
# https://www.docker.com/products/docker-desktop

# Verificar instalación
docker --version
docker-compose --version
```

### 5. 🔧 Git

**Versión Requerida**: Git 2.20+

```bash
# Verificar instalación
git --version
```

**Instalación por OS:**

#### Ubuntu/Debian
```bash
sudo apt install git
```

#### macOS
```bash
# Ya viene instalado, pero puedes actualizar
brew install git
```

#### Windows
```powershell
# Usando chocolatey
choco install git

# O descarga desde git-scm.com
# https://git-scm.com/download/win
```

## 🌐 Servicios Externos Requeridos

### 1. 🗄️ Supabase

**¿Qué es Supabase?**
Supabase es nuestra plataforma backend-as-a-service que proporciona:
- Base de datos PostgreSQL
- Autenticación y autorización
- Storage para archivos
- APIs automáticas
- Real-time subscriptions

**Requerimientos:**
- ✅ Cuenta en Supabase (gratuita)
- ✅ Proyecto creado
- ✅ Credenciales de acceso

**Configuración:**

1. **Crear Cuenta**: [supabase.com](https://supabase.com)
2. **Crear Proyecto**: Sigue el wizard de creación
3. **Obtener Credenciales**:
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 2. 🗺️ Google Maps API

**¿Por qué Google Maps?**
- Geocodificación de direcciones
- Cálculo de rutas
- Visualización de mapas
- Autocompletado de ubicaciones

**Requerimientos:**
- ✅ Cuenta de Google Cloud Platform
- ✅ API Key con servicios habilitados
- ✅ Billing configurado (para producción)

**Configuración:**

1. **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **Habilitar APIs**:
   - Maps JavaScript API
   - Geocoding API
   - Places API (opcional)

3. **Crear API Key**:
   ```bash
   # La API key debe tener restricciones apropiadas
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 🛠️ Herramientas de Desarrollo (Opcionales)

### 🔍 Editors Recomendados

#### Visual Studio Code
**Extensiones Requeridas:**
- Python
- Pylance
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- GitLens
- Prettier - Code formatter

```bash
# Instalar VS Code
# Descarga desde: https://code.visualstudio.com/
```

#### JetBrains PyCharm (Alternativa)
- Excelente para desarrollo Python
- Soporte nativo para FastAPI
- Debugging integrado

### 📊 Herramientas de Monitoreo

#### Postman/Insomnia
Para testing de APIs:
```bash
# Instalar Postman
# https://www.postman.com/downloads/

# O Insomnia
# https://insomnia.rest/download
```

#### Docker Desktop
Para desarrollo con contenedores:
```bash
# Ya mencionado arriba en la sección Docker
```

### 🎨 Herramientas de Diseño (Para Contributors)

#### Figma
Para design system y wireframes:
- [figma.com](https://figma.com)

#### Adobe XD (Alternativa)
- [adobe.com/products/xd](https://adobe.com/products/xd)

## 🔧 Verificación del Sistema

### 📋 Checklist de Requisitos

Copia y completa esta checklist para verificar tu sistema:

#### ✅ Software Base
- [ ] Python 3.11+ instalado y funcionando
- [ ] Node.js 18+ instalado y funcionando
- [ ] npm instalado y funcionando
- [ ] Git instalado y configurado
- [ ] Editor de código instalado (VS Code recomendado)

#### ✅ Servicios Externos
- [ ] Cuenta de Supabase creada
- [ ] Proyecto de Supabase configurado
- [ ] API Key de Google Maps generada
- [ ] Billing configurado en Google Cloud (para producción)

#### ✅ Herramientas Opcionales
- [ ] Docker Desktop instalado y funcionando
- [ ] Yarn instalado (si prefieres sobre npm)
- [ ] Extensiones de VS Code instaladas

### 🧪 Script de Verificación

Ejecuta este script para verificar automáticamente tu sistema:

```bash
#!/bin/bash
# Nombre del archivo: check-requirements.sh

echo "🔍 Verificando requisitos del sistema para Dale..."
echo "================================================"

# Verificar Python
echo "🐍 Verificando Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo "✅ Python $PYTHON_VERSION encontrado"
else
    echo "❌ Python no encontrado"
fi

# Verificar Node.js
echo "📦 Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js $NODE_VERSION encontrado"
else
    echo "❌ Node.js no encontrado"
fi

# Verificar npm
echo "📦 Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm $NPM_VERSION encontrado"
else
    echo "❌ npm no encontrado"
fi

# Verificar Git
echo "🔧 Verificando Git..."
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ $GIT_VERSION encontrado"
else
    echo "❌ Git no encontrado"
fi

# Verificar Docker (opcional)
echo "🐳 Verificando Docker..."
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    echo "✅ $DOCKER_VERSION encontrado"
else
    echo "⚠️  Docker no encontrado (opcional)"
fi

echo ""
echo "📋 Checklist completado. Revisa los elementos marcados con ❌"
echo "📚 Documentación: https://docs.dale-app.com/installation/requirements"
```

```powershell
# Para Windows (check-requirements.ps1)
Write-Host "🔍 Verificando requisitos del sistema para Dale..." -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Verificar Python
Write-Host "🐍 Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "✅ $pythonVersion encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ Python no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Python no encontrado" -ForegroundColor Red
}

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js $nodeVersion encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Node.js no encontrado" -ForegroundColor Red
}

# Verificar npm
Write-Host "📦 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm $npmVersion encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ npm no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
}

# Verificar Git
Write-Host "🔧 Verificando Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>$null
    if ($gitVersion) {
        Write-Host "✅ $gitVersion encontrado" -ForegroundColor Green
    } else {
        Write-Host "❌ Git no encontrado" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Git no encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Checklist completado. Revisa los elementos marcados con ❌" -ForegroundColor Green
Write-Host "📚 Documentación: https://docs.dale-app.com/installation/requirements" -ForegroundColor Blue
```

## ⚡ Quick Start (Requisitos Mínimos)

Si quieres empezar rápidamente con los requisitos mínimos:

### 🏃‍♂️ Instalación Express

#### 1. Instalar Node.js (incluye npm)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Windows
# Descargar desde https://nodejs.org/
```

#### 2. Instalar Python
```bash
# Ubuntu/Debian
sudo apt install python3.11 python3.11-venv python3.11-dev

# macOS (con Homebrew)
brew install python@3.11

# Windows
# Descargar desde https://python.org/
```

#### 3. Clonar Repositorio
```bash
git clone https://github.com/dale/app.git dale-app
cd dale-app
```

#### 4. Setup Básico
```bash
# Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate  # Linux/macOS
# o venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

¡Con estos 4 pasos ya tienes lo básico funcionando! Ahora puedes continuar con la configuración detallada.

## 🆘 Solución de Problemas Comunes

### ❌ Python no encontrado

**Problema**: `python: command not found`

**Soluciones**:
```bash
# Intenta con python3
python3 --version

# O instala Python correctamente
# Ubuntu/Debian:
sudo apt update && sudo apt install python3.11 python3.11-venv python3.11-dev

# macOS:
brew install python@3.11

# Windows:
# Descarga e instala desde python.org
```

### ❌ Node.js versión antigua

**Problema**: `Node.js version < 18.0`

**Soluciones**:
```bash
# Usando nvm (recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# O actualiza con tu gestor de paquetes
# Ubuntu/Debian:
sudo npm install -g n
sudo n 18

# macOS:
brew upgrade node
```

### ❌ Permisos de npm

**Problema**: `EACCES` al instalar paquetes globales

**Solución**:
```bash
# NO uses sudo con npm (problema de seguridad)
# En su lugar, configura npm para usar un directorio local:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### ❌ Supabase no accesible

**Problema**: Cannot connect to Supabase

**Verificaciones**:
1. ✅ URL del proyecto correcta
2. ✅ API Keys válidas
3. ✅ Proyecto no pausado en Supabase Dashboard
4. ✅ Conexión a internet estable

### ❌ Google Maps no carga

**Problema**: "Invalid API Key" error

**Verificaciones**:
1. ✅ API Key válida y activa
2. ✅ APIs habilitadas en Google Cloud Console
3. ✅ Restricciones configuradas apropiadamente
4. ✅ Billing configurado (requerido para producción)

## 📞 Soporte

### 🆘 Si Necesitas Ayuda

1. **📚 Documentación**: Revisa esta página nuevamente
2. **🔍 FAQ**: Consulta la [sección de Preguntas Frecuentes](../guides/faq.md)
3. **💬 Discord**: [Únete a nuestra comunidad](https://discord.gg/dale)
4. **🐛 Issues**: [Reporta problemas en GitHub](https://github.com/dale/app/issues)
5. **📧 Email**: [soporte@dale-app.com](mailto:soporte@dale-app.com)

### 📋 Información para Soporte

Cuando busques ayuda, incluye esta información:

```bash
# Información del sistema
uname -a          # Linux/macOS
systeminfo        # Windows

# Versiones de software
python3 --version
node --version
npm --version
git --version

# Información de red
ping google.com   # Test de conectividad
curl -I https://supabase.com  # Test de conectividad a Supabase
```

---

## ✅ Checklist Final

Antes de continuar con la configuración, asegúrate de tener:

- [ ] **Python 3.11+** instalado y verificado
- [ ] **Node.js 18+** instalado y verificado  
- [ ] **npm** instalado y funcionando
- [ ] **Git** instalado y configurado
- [ ] **Cuenta de Supabase** creada y proyecto configurado
- [ ] **API Key de Google Maps** generada
- [ ] **Editor de código** instalado (VS Code recomendado)
- [ ] **Conexión a internet** estable

¿Todo listo? ¡Continúa con la [Configuración](configuration.md)!

---

> **💡 Tip**: Guarda esta página como bookmark para referencia futura. Los requisitos del sistema pueden actualizarse con nuevas versiones de Dale.