# Scripts de Desarrollo - Dale

Este directorio contiene scripts para automatizar el desarrollo y la gestión de la aplicación Dale.

## Scripts Disponibles

### 🚀 install.sh
**Instalación de dependencias**

```bash
./install.sh
```

**Funcionalidades:**
- Verifica Python 3 y pip
- Crea entorno virtual de Python
- Instala dependencias del backend (FastAPI)
- Instala dependencias del frontend (Next.js)
- Crea archivo .env de ejemplo
- Verifica la instalación

**Salida esperada:**
- Entorno virtual en `venv/`
- Dependencias de backend instaladas
- Dependencias de frontend instaladas
- Archivo `.env` creado

### ⚡ dev.sh
**Servidor de desarrollo completo**

```bash
./dev.sh
```

**Funcionalidades:**
- Levanta backend (FastAPI) y frontend (Next.js) en paralelo
- Verificación de puertos disponibles
- Manejo automático de puertos en uso
- Logs detallados en directorio `logs/`
- Limpieza automática al interrumpir
- Opción de ver logs en tiempo real
- Manejo robusto de errores

**Puertos por defecto:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

**Logs:**
- `logs/backend.log` - Logs del backend
- `logs/frontend.log` - Logs del frontend

### 🏃 start.sh
**Inicio rápido simplificado**

```bash
./start.sh
```

**Funcionalidades:**
- Versión simplificada de dev.sh
- Levanta ambos servicios sin logs detallados
- Verificaciones básicas
- Más rápido para desarrollo diario

### 🛑 stop.sh
**Detener servicios**

```bash
./stop.sh
```

**Funcionalidades:**
- Detiene todos los servicios en ejecución
- Limpia procesos por PID y por puerto
- Detiene procesos huérfanos

## Uso Básico

### Primer Uso
```bash
# 1. Instalar dependencias
./install.sh

# 2. Configurar variables de entorno
# Editar archivo .env con credenciales de Supabase

# 3. Iniciar desarrollo
./dev.sh
```

### Desarrollo Diario
```bash
# Opción 1: Script completo (recomendado)
./dev.sh

# Opción 2: Inicio rápido
./start.sh

# Para detener servicios
./stop.sh
```

## Estructura de Archivos

```
/workspace/dale/
├── install.sh          # Instalación de dependencias
├── dev.sh             # Desarrollo completo
├── start.sh           # Inicio rápido
├── stop.sh            # Detener servicios
├── .env               # Variables de entorno (creado por install.sh)
├── venv/              # Entorno virtual Python (creado por install.sh)
└── logs/              # Directorio de logs (creado por dev.sh)
    ├── backend.log
    └── frontend.log
```

## Configuración

### Variables de Entorno (.env)

```env
# Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret
SUPABASE_ANON_KEY=tu_anon_key

# Servidor
API_HOST=0.0.0.0
API_PORT=8000
FRONTEND_PORT=3000
```

## Características de los Scripts

### ✅ Manejo de Errores
- Verificación de dependencias antes de ejecutar
- Validación de puertos disponibles
- Limpieza automática en caso de error
- Mensajes de error descriptivos

### 📝 Logging
- Logs estructurados con timestamps
- Colores para mejor legibilidad
- Separación de logs por servicio
- Opciones para ver logs en tiempo real

### 🔄 Gestión de Procesos
- Inicio en paralelo de servicios
- Tracking de PIDs
- Limpieza automática al salir
- Kill por señal (SIGINT, SIGTERM)

### 🛡️ Verificaciones
- Puertos disponibles
- Archivos de configuración
- Dependencias del sistema
- Estados de procesos

## Solución de Problemas

### Error: "Puerto ya en uso"
```bash
# Opción 1: Detener servicios existentes
./stop.sh

# Opción 2: Cambiar puertos manualmente
export API_PORT=8001
export FRONTEND_PORT=3001
./dev.sh
```

### Error: "Entorno virtual no encontrado"
```bash
# Reinstallar dependencias
./install.sh
```

### Error: "Node.js no encontrado"
```bash
# Instalar Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node

# Verificar instalación
node --version
npm --version
```

### Verificar servicios
```bash
# Verificar backend
curl http://localhost:8000/health

# Verificar frontend
curl http://localhost:3000

# Verificar logs
tail -f logs/backend.log
tail -f logs/frontend.log
```

## Comandos Útiles

```bash
# Ver logs en tiempo real
tail -f logs/backend.log | grep ERROR

# Verificar procesos activos
ps aux | grep -E "(uvicorn|next)"

# Verificar puertos en uso
lsof -i :8000
lsof -i :3000

# Reinstalar solo frontend
cd frontend && npm install

# Reinstalar solo backend
pip install -r requirements.txt
```

## Desarrollo Avanzado

### Variables de Entorno Personalizadas
```bash
# Usar puerto personalizado
API_PORT=8001 FRONTEND_PORT=3001 ./dev.sh

# Usar host personalizado
API_HOST=127.0.0.1 ./dev.sh
```

### Logs Verbosos
```bash
# Activar logs detallados
export DEBUG=1
./dev.sh
```

### Modo Silent
```bash
# Suprimir prompts interactivos
export CI=true
./dev.sh
```

---

**Nota:** Todos los scripts incluyen manejo de errores robusto y logging detallado para facilitar el desarrollo y la depuración.