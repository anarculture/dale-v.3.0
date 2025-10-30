# 🚗 Dale - Plataforma de Carpooling

<div align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/frontend-Next.js%2014-000020.svg" alt="Frontend">
  <img src="https://img.shields.io/badge/backend-FastAPI-009688.svg" alt="Backend">
  <img src="https://img.shields.io/badge/database-Supabase-3ECF8E.svg" alt="Database">
</div>

## 🌟 ¿Qué es Dale?

Dale es una **aplicación web progresiva (PWA)** de carpooling que permite a los usuarios compartir viajes, ahorrar dinero en transporte y reducir la huella de carbono. La plataforma conecta conductores con pasajeros que viajan en la misma dirección, creando una red de movilidad compartida sostenible.

### ✨ Características Principales

#### 👨‍💼 Para Conductores
- ✅ **Crear Viajes**: Publica viajes con origen, destino, fecha, hora y precio por asiento
- ✅ **Gestión de Asientos**: Control automático de disponibilidad de asientos
- ✅ **Cancelar Viajes**: Cancela viajes cuando sea necesario
- ✅ **Perfil de Usuario**: Gestiona tu información personal y de contacto

#### 👥 Para Pasajeros
- 🔍 **Buscar Viajes**: Filtra por ciudad, fecha y precio máximo
- 📍 **Vista de Mapas**: Integración con Google Maps para ubicaciones exactas
- 📋 **Hacer Reservas**: Reserva asientos en viajes disponibles
- 🎫 **Mis Reservas**: Gestiona todas tus reservas activas y historial
- ❌ **Cancelar Reservas**: Cancela reservas con actualización automática de asientos

#### ⚙️ Funcionalidades Generales
- 🔐 **Autenticación Segura**: Sistema JWT con Supabase Auth
- 📱 **PWA**: Instalable como aplicación nativa
- 🎨 **Interfaz Moderna**: Diseño responsivo con Tailwind CSS
- 🌐 **API REST**: Backend completamente documentado
- 🗄️ **Base de Datos**: Almacenamiento en tiempo real con Supabase

## 🛠 Stack Tecnológico

<div class="grid cards">

#### Frontend
- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Autenticación**: Supabase Auth
- **Mapas**: Google Maps JavaScript API
- **UI/UX**: Lucide React Icons
- **Build Tool**: Vite (incluido en Next.js)

#### Backend
- **Framework**: FastAPI (Python)
- **Autenticación**: JWT con python-jose
- **Base de Datos**: Supabase (PostgreSQL)
- **ORM**: Supabase Python Client
- **Validación**: Pydantic
- **Servidor**: Uvicorn

#### DevOps & Deployment
- **Hosting**: Compatible con Vercel (frontend) y Railway/Heroku (backend)
- **Base de Datos**: Supabase Cloud
- **CDN**: Automático con Vercel
- **CI/CD**: GitHub Actions compatible

</div>

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/dale/app.git
cd dale
```

### 2. Configuración del Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/macOS
# o
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 3. Configuración del Frontend

```bash
cd frontend
npm install
```

### 4. Variables de Entorno

Crea archivos `.env` en ambos directorios con las credenciales necesarias:

```env
# Backend (.env)
SUPABASE_URL=tu_supabase_url
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
SUPABASE_JWT_SECRET=tu_jwt_secret

# Frontend (.env.local)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_google_maps_api_key
```

### 5. Ejecutar la Aplicación

```bash
# Backend (Terminal 1)
cd backend && uvicorn main:app --reload

# Frontend (Terminal 2)
cd frontend && npm run dev
```

## 📚 Documentación

Explora nuestra documentación completa:

- **[📋 Instalación](installation/)**: Guía paso a paso para configurar Dale
- **[🔧 Desarrollo](development/)**: Documentación para desarrolladores
- **[🌐 APIs](api/)**: Referencia completa de la API REST
- **[🚀 Deployment](deployment/)**: Guías de despliegue en producción
- **[🎯 Filosofía SDD](sdd/)**: Principios de diseño impulsado por dominio
- **[❓ FAQ](guides/faq/)**: Preguntas frecuentes

## 🔗 Enlaces Útiles

<div class="grid cards">

- [🏠 **Sitio Web**](https://dale-app.com) - Plataforma en vivo
- [🔌 **API Docs**](https://api.dale-app.com/docs) - Documentación interactiva
- [🐛 **Issues**](https://github.com/dale/app/issues) - Reportar bugs
- [💬 **Discord**](https://discord.gg/dale) - Comunidad
- [📧 **Soporte**](mailto:soporte@dale-app.com) - Contacto

</div>

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Consulta nuestra [Guía de Contribución](development/contributing.md) para más detalles.

### 📝 Workflow de Desarrollo

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### ✅ Guidelines

- ✅ Sigue las convenciones de código existentes
- ✅ Escribe tests para nuevas funcionalidades
- ✅ Actualiza la documentación si es necesario
- ✅ Asegúrate de que el código pase todos los tests
- ✅ Usa mensajes de commit descriptivos

## 📊 Estado del Proyecto

<div align="center">

![GitHub stars](https://img.shields.io/github/stars/dale/app?style=social)
![GitHub forks](https://img.shields.io/github/forks/dale/app?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/dale/app?style=social)

</div>

### 📈 Métricas

| Métrica | Valor |
|---------|-------|
| ⭐ Stars | 0 |
| 🍴 Forks | 0 |
| 👀 Watchers | 0 |
| 🐛 Issues | 0 |
| 🔧 Pull Requests | 0 |

## 🌍 Roadmap

### 🎯 v1.1.0 (Q1 2026)
- [ ] Sistema de calificaciones y reseñas
- [ ] Notificaciones push
- [ ] Chat en tiempo real
- [ ] Geolocalización en tiempo real
- [ ] Modo offline

### 🎯 v1.2.0 (Q2 2026)
- [ ] Integración con sistemas de pago
- [ ] Chat de grupos por viaje
- [ ] Notificaciones por email
- [ ] Analytics y métricas
- [ ] Modo enterprise

## 📄 Licencia

Este proyecto está licenciado bajo la **Licencia MIT** - ver el archivo [LICENSE](resources/license.md) para detalles.

## 🙏 Agradecimientos

- [Supabase](https://supabase.com/) - Base de datos y autenticación
- [Google Maps](https://developers.google.com/maps) - Servicios de mapas
- [FastAPI](https://fastapi.tiangolo.com/) - Framework backend
- [Next.js](https://nextjs.org/) - Framework frontend
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) - Tema de documentación

---

<div align="center">

**Hecho con ❤️ por el equipo de Dale**

[Website](https://dale-app.com) • 
[Documentación](https://docs.dale-app.com) • 
[API Reference](https://api.dale-app.com/docs) • 
[Soporte](mailto:soporte@dale-app.com)

</div>