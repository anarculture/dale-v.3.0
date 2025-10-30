# Setup Local

## 🎯 Visión General

Esta guía te llevará paso a paso para configurar y ejecutar Dale localmente en tu máquina de desarrollo. Al final tendrás una instancia completamente funcional de Dale corriendo en `localhost`.

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:

- [ ] ✅ [Requisitos](requirements.md) instalados y verificados
- [ ] ✅ [Configuración](configuration.md) completada
- [ ] ✅ [Cuenta de Supabase](configuration.md#-configuración-de-supabase) creada
- [ ] ✅ [API Key de Google Maps](configuration.md#-configuración-de-google-maps) generada

## 🚀 Setup Paso a Paso

### 1. 📥 Clonar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/dale/app.git dale-app
cd dale-app

# Verificar la estructura
ls -la
```

Deberías ver:
```
dale-app/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

### 2. 🐍 Configurar Backend

#### 2.1 Crear Entorno Virtual

```bash
# Navegar al directorio backend
cd backend

# Crear entorno virtual (Python 3.11+)
python3.11 -m venv venv

# Activar entorno virtual
# En Linux/macOS:
source venv/bin/activate

# En Windows:
# venv\Scripts\activate

# Verificar que el entorno está activo
which python
# Debe mostrar: .../venv/bin/python
```

#### 2.2 Instalar Dependencias

```bash
# Actualizar pip
pip install --upgrade pip

# Instalar dependencias
pip install -r requirements.txt

# Verificar instalación
pip list
```

Deberías ver paquetes como:
- fastapi
- uvicorn
- supabase
- python-jose
- pydantic
- pytest

#### 2.3 Verificar Configuración

```bash
# Verificar que el archivo .env existe
ls -la .env

# Si no existe, crear desde el ejemplo
cp ../.env.example .env

# Editar .env con tus credenciales reales
nano .env  # o tu editor preferido
```

### 3. 📱 Configurar Frontend

#### 3.1 Navegar al Directorio Frontend

```bash
# Desde la raíz del proyecto
cd frontend

# Verificar que package.json existe
ls -la package.json
```

#### 3.2 Instalar Dependencias

```bash
# Usar npm (incluido con Node.js)
npm install

# O si prefieres yarn
# yarn install

# Verificar instalación
npm list --depth=0
```

#### 3.3 Crear Configuración Local

```bash
# Verificar que .env.local existe
ls -la .env.local

# Si no existe, crear desde el ejemplo
cp ../.env.example .env.local

# Editar .env.local con tus credenciales reales
nano .env.local  # o tu editor preferido
```

### 4. 🗄️ Configurar Base de Datos

#### 4.1 Ejecutar Script SQL

1. Ve al dashboard de tu proyecto en [supabase.com](https://supabase.com)
2. Ve a **SQL Editor**
3. Ejecuta el script completo que está en [configuración](configuration.md#-configurar-base-de-datos)

#### 4.2 Verificar Tablas

```sql
-- Ejecutar en SQL Editor para verificar
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Deberías ver: users, rides, bookings
```

### 5. 🏃‍♂️ Ejecutar la Aplicación

#### 5.1 Iniciar Backend (Terminal 1)

```bash
# Desde directorio backend
cd backend
source venv/bin/activate  # Linux/macOS
# o venv\Scripts\activate  # Windows

# Ejecutar servidor FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Alternativa con Python
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

**Salida esperada:**
```
INFO: Started server process [12345]
INFO: Waiting for application startup.
INFO: Application startup complete.
INFO: Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

#### 5.2 Iniciar Frontend (Terminal 2)

```bash
# Desde nuevo terminal, navegar al directorio frontend
cd frontend

# Ejecutar servidor Next.js
npm run dev

# Alternativa con yarn
# yarn dev
```

**Salida esperada:**
```
Local:    http://localhost:3000
Network:  http://192.168.1.100:3000

Press Ctrl+C to stop
```

#### 5.3 Verificar Funcionamiento

```bash
# Test del backend
curl http://localhost:8000/health
# Debería devolver: {"status": "healthy"}

# Test del frontend
curl http://localhost:3000
# Debería devolver HTML de Next.js

# Documentación de la API
curl http://localhost:8000/docs
# Debería redirigir a la documentación Swagger
```

## 🌐 Acceder a la Aplicación

### URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:3000 | Interfaz web principal |
| **Backend API** | http://localhost:8000 | API REST |
| **API Docs** | http://localhost:8000/docs | Documentación Swagger |
| **API ReDoc** | http://localhost:8000/redoc | Documentación ReDoc |
| **Health Check** | http://localhost:8000/health | Estado del servidor |

### 🔐 Credenciales de Prueba

Para testing, puedes crear usuarios de prueba:

#### Usuario de Prueba 1 (Conductor)
```json
{
  "email": "conductor@test.com",
  "password": "password123",
  "data": {
    "name": "Juan Conductor",
    "phone": "+1234567890"
  }
}
```

#### Usuario de Prueba 2 (Pasajero)
```json
{
  "email": "pasajero@test.com", 
  "password": "password123",
  "data": {
    "name": "María Pasajera",
    "phone": "+0987654321"
  }
}
```

## 🧪 Testing Local

### 1. 🔍 Test Manual de Funcionalidades

#### Test de Autenticación
1. Ve a http://localhost:3000
2. Click en "Registrarse"
3. Completa el formulario
4. Verifica que puedas iniciar sesión

#### Test de Viajes
1. Inicia sesión como conductor
2. Ve a "Ofrecer Viaje"
3. Crea un nuevo viaje
4. Verifica que aparezca en la lista

#### Test de Reservas
1. Inicia sesión como pasajero
2. Busca viajes disponibles
3. Realiza una reserva
4. Verifica que los asientos se actualicen

### 2. 🧪 Tests Automatizados

#### Backend Tests
```bash
# Desde directorio backend
cd backend
source venv/bin/activate

# Ejecutar tests
pytest

# Tests con coverage
pytest --cov=main --cov-report=html

# Tests específicos
pytest tests/test_rides.py -v
```

#### Frontend Tests
```bash
# Desde directorio frontend
cd frontend

# Tests unitarios
npm test

# Tests en modo watch
npm run test:watch

# Tests con coverage
npm run test:coverage

# Build test
npm run build
```

### 3. 📊 Monitoreo de Logs

#### Backend Logs
```bash
# Ver logs en tiempo real
tail -f backend/logs/app.log

# O en la terminal donde ejecutaste uvicorn
# Los logs aparecen en tiempo real
```

#### Frontend Logs
```bash
# Ver logs de Next.js en la terminal
# Los logs aparecen automáticamente

# O verificar errores en navegador
# F12 → Console
```

## 🛠️ Comandos de Desarrollo

### 🐍 Backend Commands

```bash
# Activar entorno virtual
cd backend
source venv/bin/activate

# Ejecutar servidor en desarrollo
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ejecutar en modo debug
python -m pdb main.py

# Instalar nueva dependencia
pip install nombre-paquete

# Actualizar requirements.txt
pip freeze > requirements.txt

# Ejecutar linting
flake8 .
black .

# Type checking
mypy main.py
```

### 📱 Frontend Commands

```bash
cd frontend

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Start producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check

# Instalar nueva dependencia
npm install nombre-paquete

# Instalar dependencia de desarrollo
npm install --save-dev nombre-paquete
```

### 🔄 Comandos Útiles

```bash
# Limpiar node_modules y reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install

# Limpiar entorno virtual y recrear
cd backend
rm -rf venv
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Actualizar todo
git pull origin main
cd backend && source venv/bin/activate && pip install -r requirements.txt
cd ../frontend && npm install

# Verificar estado del proyecto
./scripts/check-status.sh
```

## 🐳 Desarrollo con Docker

### Usando Docker Compose

```bash
# Desde la raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Dockerfile Personalizado

Si necesitas personalizaciones:

```dockerfile
# backend/Dockerfile.dev
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

## 🐛 Debugging y Solución de Problemas

### 🔍 Debugging del Backend

#### Error: ModuleNotFoundError
```bash
# Verificar entorno virtual
which python
# Debe apuntar a venv/bin/python

# Reactivar entorno
source venv/bin/activate

# Reinstalar dependencias
pip install -r requirements.txt
```

#### Error: ConnectionError a Supabase
```bash
# Verificar variables de entorno
cat .env

# Test de conectividad
curl -H "apikey: tu_anon_key" \
     https://tu-proyecto.supabase.co/rest/v1/
```

#### Error: Database Tables don't exist
```sql
-- Verificar en Supabase SQL Editor
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public';
```

### 🔍 Debugging del Frontend

#### Error: Module not found
```bash
# Limpiar cache
rm -rf .next node_modules
npm install

# Verificar TypeScript
npm run type-check
```

#### Error: Environment variables not loaded
```bash
# Verificar que .env.local existe
ls -la .env.local

# Verificar contenido
cat .env.local

# Restart servidor Next.js
npm run dev
```

#### Error: CORS
```python
# Verificar CORS en backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 📊 Monitoring y Performance

#### Usar React DevTools
```bash
# Instalar React DevTools
npm install -g @react-native-community/cli-devtools

# O usar en navegador
# F12 → React tab
```

#### Usar Python Debugger
```python
# En main.py
import pdb; pdb.set_trace()

# O usar ipdb para mejor experiencia
pip install ipdb
import ipdb; ipdb.set_trace()
```

## 🎯 Workflows de Desarrollo

### 🔄 Desarrollo Daily

```bash
# 1. Actualizar código
git pull origin main

# 2. Activar entorno backend
cd backend
source venv/bin/activate

# 3. Instalar dependencias backend si cambió requirements.txt
pip install -r requirements.txt

# 4. Ir al frontend
cd ../frontend

# 5. Instalar dependencias frontend si cambió package.json
npm install

# 6. Iniciar ambos servidores
# Terminal 1: Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 2: Frontend  
cd frontend && npm run dev
```

### 🚀 Feature Development

```bash
# 1. Crear branch
git checkout -b feature/nueva-funcionalidad

# 2. Desarrollar funcionalidad
# ... hacer cambios ...

# 3. Ejecutar tests
cd backend && pytest
cd frontend && npm test

# 4. Commit cambios
git add .
git commit -m "feat: agregar nueva funcionalidad"

# 5. Push y crear PR
git push origin feature/nueva-funcionalidad
```

### 🧪 Testing antes de Deploy

```bash
# Tests completos
cd backend && pytest --cov=main
cd frontend && npm run test:coverage

# Build de producción
cd frontend && npm run build

# Test de build local
cd frontend && npm start

# Verificar que todo funciona
curl http://localhost:3000
curl http://localhost:8000/health
```

## 📚 Recursos Adicionales

### 📖 Documentación
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### 🎓 Tutoriales
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [Next.js Learn](https://nextjs.org/learn)
- [Supabase Academy](https://supabase.com/academy)

### 🛠️ Herramientas
- [VS Code](https://code.visualstudio.com/) + Extensions
- [Postman](https://www.postman.com/) para testing API
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

## ✅ Checklist Final

Al completar esta guía deberías tener:

- [ ] ✅ Backend ejecutándose en http://localhost:8000
- [ ] ✅ Frontend ejecutándose en http://localhost:3000
- [ ] ✅ Documentación de API disponible en http://localhost:8000/docs
- [ ] ✅ Base de datos configurada y funcionando
- [ ] ✅ Usuarios de prueba creados
- [ ] ✅ Tests ejecutándose correctamente
- [ ] ✅ Logs visible en ambas terminales
- [ ] ✅ Funcionalidades básicas funcionando (login, viajes, reservas)

## 🎉 ¡Felicitaciones!

Si has llegado hasta aquí, ¡ya tienes Dale ejecutándose localmente! 

### Próximos Pasos:
1. **📚 Explora la [documentación de APIs](../api/)** para entender todos los endpoints
2. **🔧 Lee la [guía de desarrollo](../development/)** para entender la arquitectura
3. **🚀 Prepara el [deployment](../deployment/)** para llevar Dale a producción
4. **🤝 Contribuye** siguiendo la [guía de contribución](../development/contributing.md)

### ¿Necesitas Ayuda?
- 💬 [Discord](https://discord.gg/dale) - Comunidad activa
- 🐛 [Issues](https://github.com/dale/app/issues) - Reporta bugs
- 📧 [Email](mailto:soporte@dale-app.com) - Soporte directo

---

> **🎯 Tip**: Mantén esta guía como bookmark. La referenciarás frecuentemente durante el desarrollo. ¡Happy coding! 🚀