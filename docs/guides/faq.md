# FAQ - Preguntas Frecuentes

## 🎯 Visión General

Esta página contiene las respuestas a las preguntas más frecuentes sobre Dale, tanto para usuarios finales como para desarrolladores que contribuyen al proyecto.

---

## 👥 Para Usuarios Finales

### 🚗 Preguntas Generales

#### ¿Qué es Dale?
Dale es una plataforma de carpooling que permite a los usuarios compartir viajes, ahorrar dinero en transporte y reducir la huella de carbono. Los conductores pueden ofrecer asientos disponibles en sus viajes, y los pasajeros pueden buscar y reservar esos asientos.

#### ¿Cómo me registro en Dale?
1. Visita la página de registro en [dale-app.com](https://dale-app.com)
2. Completa el formulario con tu email, nombre y contraseña
3. Verifica tu email haciendo click en el enlace enviado
4. Completa tu perfil con información adicional (teléfono, foto, etc.)

#### ¿Es gratis usar Dale?
Sí, las funciones básicas de Dale son completamente gratuitas para todos los usuarios. No cobramos comisiones por los viajes compartidos.

#### ¿En qué ciudades está disponible Dale?
Actualmente Dale está disponible en:
- **España**: Madrid, Barcelona, Valencia, Sevilla
- **México**: Ciudad de México, Guadalajara
- **Argentina**: Buenos Aires, Córdoba

*Más ciudades se agregarán próximamente.*

#### ¿Cómo funciona el sistema de calificaciones?
- Después de cada viaje, tanto conductor como pasajeros pueden calificarse mutuamente
- La calificación va de 1 a 5 estrellas
- Tu calificación promedio aparece en tu perfil
- Las calificaciones ayudan a construir confianza en la comunidad

### 🚙 Preguntas sobre Viajes

#### ¿Cómo ofrezco un viaje?
1. Inicia sesión en tu cuenta
2. Ve a "Ofrecer Viaje" 
3. Completa los detalles:
   - Origen y destino
   - Fecha y hora de salida
   - Número de asientos disponibles
   - Precio por asiento
   - Notas adicionales (opcional)
4. Publica el viaje

#### ¿Cuánto puedo cobrar por asiento?
El precio es libre, pero recomendamos:
- Precios justos y razonables
- Considera costos de combustible y peajes
- Investiga precios de mercado en tu ruta
- Dale sugiere un rango de precio basado en la distancia

#### ¿Puedo cancelar un viaje?
Sí, puedes cancelar un viaje en cualquier momento:
- **Gratis**: Hasta 24 horas antes de la salida
- **Penalización**: Cancelaciones con menos de 24 horas pueden afectar tu rating

#### ¿Qué pasa si no tengo suficientes asientos?
Si un pasajero intenta reservar más asientos de los disponibles, el sistema mostrará un error. Es importante mantener actualizada la información de asientos disponibles.

### 🎫 Preguntas sobre Reservas

#### ¿Cómo reservo un asiento?
1. Busca viajes disponibles en la ruta que necesitas
2. Filtra por fecha, precio y otros criterios
3. Selecciona el viaje que prefieras
4. Haz click en "Reservar Asiento"
5. Confirma la reserva

#### ¿Puedo reservar para otras personas?
Actualmente solo puedes reservar para ti mismo. Cada persona debe tener su propia cuenta.

#### ¿Cómo cancelo una reserva?
1. Ve a "Mis Reservas"
2. Selecciona la reserva que quieres cancelar
3. Haz click en "Cancelar Reserva"
4. Confirma la cancelación

#### ¿Hay límite en las reservas?
- Puedes tener múltiples reservas activas
- No puedes reservar el mismo viaje dos veces
- Hay límites de cancelación para evitar abusos

### 🔒 Preguntas de Seguridad

#### ¿Es seguro usar Dale?
Dale implementa múltiples medidas de seguridad:
- ✅ Verificación de identidad
- ✅ Sistema de calificaciones y reseñas
- ✅ Chat interno para comunicación
- ✅ Verificación de teléfono (opcional)
- ✅ Reporte de usuarios sospechosos

#### ¿Cómo verifico la identidad de otros usuarios?
- Revisa su perfil completo
- Lee sus calificaciones y reseñas
- Verifica la información de contacto
- Usa el chat interno para comunicarte antes del viaje

#### ¿Qué hago si tengo un problema?
1. **Contacta al usuario** a través del chat interno
2. **Reporta el problema** usando el botón "Reportar"
3. **Contacta soporte**: [soporte@dale-app.com](mailto:soporte@dale-app.com)
4. **Documenta** cualquier evidencia (fotos, mensajes, etc.)

#### ¿Dale verifica a los conductores?
Dale verifica a los conductores mediante:
- Verificación de email
- Verificación de teléfono (opcional)
- Verificación de documentos (en desarrollo)
- Historial de calificaciones

### 📱 Preguntas Técnicas

#### ¿Dale funciona sin internet?
No, Dale requiere conexión a internet para funcionar completamente. Algunas funciones básicas pueden estar disponibles offline una vez cargadas.

#### ¿En qué dispositivos funciona Dale?
- **Navegadores**: Chrome, Firefox, Safari, Edge (últimas versiones)
- **Móviles**: iOS Safari, Android Chrome
- **Instalable**: Como PWA en Android y iOS

#### ¿Cómo instalo Dale en mi móvil?
1. Visita [dale-app.com](https://dale-app.com) en tu móvil
2. Busca la opción "Agregar a pantalla de inicio"
3. Sigue las instrucciones de tu navegador
4. Dale aparecerá como una app en tu dispositivo

#### ¿Hay una app nativa?
Actualmente Dale es una PWA (Progressive Web App) que funciona como una app nativa. Una app nativa está en desarrollo para 2026.

---

## 👨‍💻 Para Desarrolladores

### 🛠️ Preguntas Técnicas Generales

#### ¿Qué tecnologías usa Dale?
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT + Supabase Auth
- **Mapas**: Google Maps JavaScript API
- **Hosting**: Vercel (frontend), Railway (backend)

#### ¿Cómo contribuyo al proyecto?
1. **Fork** el repositorio en GitHub
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Desarrolla** siguiendo nuestras guías de contribución
4. **Testea** tu código thoroughly
5. **Commit** tus cambios con mensajes descriptivos
6. **Push** a tu fork y crea un Pull Request

#### ¿Dónde está la documentación técnica?
- **Esta documentación**: [docs.dale-app.com](https://docs.dale-app.com)
- **API Documentation**: [api.dale-app.com/docs](https://api.dale-app.com/docs)
- **GitHub Wiki**: [github.com/dale/app/wiki](https://github.com/dale/app/wiki)

#### ¿Hay un canal de Discord para desarrolladores?
Sí, únete a nuestro Discord: [discord.gg/dale](https://discord.gg/dale)

### 🚀 Preguntas de Setup

#### ¿Cuáles son los requisitos para desarrollar?
Consulta nuestra [guía de requisitos](../../installation/requirements.md) completa.

**Resumen rápido**:
- Node.js 18+
- Python 3.11+
- Git
- Cuenta de Supabase
- API Key de Google Maps

#### ¿Cómo configuro mi entorno de desarrollo?
Sigue nuestra [guía paso a paso](../../installation/local-setup.md).

**Comandos rápidos**:
```bash
git clone https://github.com/dale/app.git
cd dale

# Backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend  
cd ../frontend
npm install
```

#### ¿Necesito Docker para desarrollar?
No, Docker es opcional. Consulta nuestra [guía de Docker](../../installation/docker.md) si prefieres usarlo.

### 🏗️ Preguntas de Arquitectura

#### ¿Por qué eligieron esta arquitectura?
Dale sigue principios de **Clean Architecture** y **Domain-Driven Design**:

- **Separación de responsabilidades**: Frontend, backend y base de datos separados
- **Escalabilidad**: Microservicios preparados para crecimiento
- **Mantenibilidad**: Código limpio y bien organizado
- **Testabilidad**: Arquitectura que facilita testing

#### ¿Cómo manejan la autenticación?
Usamos **JWT tokens** con Supabase Auth:
- Tokens de acceso con expiración corta (30 min)
- Tokens de refresh para renovación
- Verificación en cada request
- Roles y permisos granulares

#### ¿Cómo implementaron el sistema de rides?
El sistema de rides sigue patrones de **CQRS**:
- **Commands**: Crear, actualizar, cancelar viajes
- **Queries**: Buscar, filtrar viajes disponibles
- **Events**: Notificaciones en tiempo real
- **Validation**: Reglas de negocio en el dominio

### 🧪 Preguntas de Testing

#### ¿Qué tipos de tests tienen?
- **Unit Tests**: Lógica de negocio ( Jest para frontend, pytest para backend)
- **Integration Tests**: APIs y base de datos
- **E2E Tests**: Flujos completos de usuario
- **Performance Tests**: Carga y stress testing

#### ¿Cómo ejecuto los tests?
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Todos los tests
npm run test:all
```

#### ¿Hay coverage requirements?
Sí, mantenemos altos estándares de coverage:
- **Minimum**: 80% de coverage
- **Target**: 90% de coverage
- **Critical paths**: 95%+ de coverage

### 🚀 Preguntas de Deployment

#### ¿Cómo deployan Dale?
Usamos **CI/CD** automatizado:
- **GitHub Actions** para build y testing
- **Vercel** para frontend (automatic deployment)
- **Railway** para backend
- **Supabase** para base de datos

#### ¿Hay entornos de staging?
Sí, tenemos múltiples entornos:
- **Development**: Para features en desarrollo
- **Staging**: Para testing pre-producción
- **Production**: Para usuarios finales

#### ¿Cómo configuro el deployment?
Consulta nuestras [guías de deployment](../../deployment/):
- [Frontend en Vercel](../../deployment/frontend-vercel.md)
- [Backend en Railway](../backend-railway.md)

### 🐛 Preguntas de Troubleshooting

#### ¿Cómo debuggeo problemas?
1. **Revisa los logs**: Ambos backend y frontend tienen logging detallado
2. **Usa las herramientas de desarrollo**: Chrome DevTools, React DevTools
3. **Consulta la documentación**: Muchas soluciones están documentadas
4. **Pregunta en Discord**: La comunidad puede ayudar

#### ¿Dónde reporto bugs?
1. **GitHub Issues**: [github.com/dale/app/issues](https://github.com/dale/app/issues)
2. **Discord**: Canal #bugs en nuestra comunidad
3. **Email**: bugs@dale-app.com para issues críticos

#### ¿Cómo contribuyo con bug fixes?
1. **Verifica** que el bug no esté ya reportado
2. **Crea** un issue descriptivo con steps to reproduce
3. **Fork** el repositorio
4. **Crea** una rama para el fix
5. **Implementa** la solución
6. **Testea** thoroughly
7. **Crea** un Pull Request

### 📊 Preguntas de Performance

#### ¿Cómo optimizan la performance?
- **Frontend**: Code splitting, lazy loading, caching
- **Backend**: Query optimization, caching, rate limiting
- **Database**: Índices, connection pooling, read replicas
- **CDN**: Vercel Edge Network para assets estáticos

#### ¿Monitorean la performance?
Sí, tenemos monitoreo completo:
- **Application Monitoring**: Sentry para error tracking
- **Performance Monitoring**: Web Vitals, API response times
- **Infrastructure Monitoring**: CPU, memory, disk usage
- **User Analytics**: Google Analytics, custom events

---

## 💼 Para Empresas y Partners

### 🤝 Preguntas de Partnerships

#### ¿Ofrecen partnerships a empresas?
Sí, estamos interesados en partnerships estratégicos:
- **Empresas de transporte**: Integración con servicios existentes
- **Empresas tecnológicas**: Colaboración técnica
- **ONGs ambientales**: Iniciativas de sostenibilidad
- **Gobiernos locales**: Soluciones de movilidad urbana

#### ¿Cómo contacto para partnership?
- **Email**: partnerships@dale-app.com
- **Discord**: Canal #partnerships
- **LinkedIn**: [Dale Team](https://linkedin.com/company/dale-app)

### 🏢 Preguntas de Enterprise

#### ¿Ofrecen soluciones enterprise?
Actualmente en desarrollo para 2026:
- **Dashboard administrativo**: Gestión avanzada de usuarios
- **Analytics avanzados**: Métricas detalladas de uso
- **SSO**: Single Sign-On para empresas
- **API privada**: Acceso directo a nuestros datos
- **SLA garantizado**: Uptime y soporte garantizado

#### ¿Pueden integrarse con nuestros sistemas?
Sí, ofrecemos:
- **API pública**: Acceso programático a datos
- **Webhooks**: Notificaciones en tiempo real
- **Integración personalizada**: Para necesidades específicas

---

## 💳 Preguntas de Facturación (Futuro)

### 💰 Modelo de Negocio

#### ¿Cuándo empezarían a cobrar?
Nuestro plan actual:
- **2025-2026**: Gratuito para usuarios finales
- **2027**: Posible introducción de funciones premium
- **2028**: Comisiones mínimas para ciertos servicios

#### ¿Qué servicios serían premium?
Funciones avanzadas planeadas:
- **Reservas prioritarias**: Acceso a viajes antes que usuarios gratuitos
- **Chat premium**: Mensajería mejorada
- **Soporte prioritario**: Atención al cliente preferencial
- **Analytics**: Estadísticas detalladas para usuarios frecuentes

#### ¿Habría comisiones en los viajes?
No planeamos comisiones en los viajes compartidos. Nuestro modelo de negocio se basará en:
- **Funciones premium** opcionales
- **Publicidad** no intrusiva
- **Partnerships** con empresas

---

## 🌍 Preguntas de Expansión

### 🗺️ Expansión Geográfica

#### ¿Cuándo estará en mi ciudad?
Nuestro roadmap de expansión:
- **Q1 2026**: 10 ciudades en España
- **Q2 2026**: Expansión a 5 ciudades en México
- **Q3 2026**: Entrada a Argentina (Buenos Aires, Córdoba)
- **Q4 2026**: Colombia (Bogotá, Medellín)

#### ¿Cómo pueden solicitar queDale llegue a su ciudad?
1. **Registro de interés**: Completa el formulario en nuestro sitio web
2. **Voluntarios locales**: Únete como voluntario para impulsar Dale en tu ciudad
3. **Partnership local**: Contacta partnerships@dale-app.com

#### ¿Qué requisitos tienen para expandirse a una ciudad?
- **Mínimo de usuarios interesados**: 500+ registros de interés
- **Voluntarios locales**: 5+ personas dispuestas a ayudar
- **Análisis de mercado**: Evaluación de viabilidad
- **Partnerships locales**: Colaboración con empresas/organizaciones

### 🛡️ Preguntas de Regulación

#### ¿Cumple con las regulaciones locales?
Sí, Dale se compromete a cumplir con:
- **GDPR**: Protección de datos en Europa
- **LGPD**: Ley de protección de datos en Brasil
- **Regulaciones de transporte**: Cumplimiento local
- **Normativas fiscales**: Según cada país

#### ¿Tienen licencias de transporte?
Actualmente operamos como plataforma tecnológica. En algunos países pueden requerirse licencias específicas que estamos evaluando obtener.

---

## 🔮 Preguntas Futuras

### 🚀 Roadmap

#### ¿Cuáles son los próximos features?
**Q1 2026**:
- Sistema de calificaciones y reseñas
- Chat en tiempo real entre usuarios
- Notificaciones push

**Q2 2026**:
- Integración con sistemas de pago
- Rutas optimizadas con IA
- Sharing de gastos automático

**Q3 2026**:
- Funciones de seguridad mejoradas
- Verificación de documentos
- Multi-idioma

#### ¿Tienen planes para vehículos autónomos?
Sí, en el roadmap a largo plazo (2028+):
- Integración con servicios de vehículos autónomos
- Optimización automática de rutas
- Predicción de demanda con ML

### 💡 Innovación

#### ¿Usan inteligencia artificial?
Actualmente en desarrollo:
- **Recomendación de rutas**: Algoritmos de matching
- **Detección de fraude**: ML para identificar patrones sospechosos
- **Predicción de precios**: Optimización dinámica de tarifas
- **Chatbot soporte**: IA para atención al cliente

#### ¿Tienen API para terceros?
Sí, planeamos lanzar:
- **API pública**: Acceso limitado para desarrolladores
- **SDKs**: Librerías para diferentes lenguajes
- **Webhooks**: Notificaciones en tiempo real

---

## 📞 Contacto y Soporte

### 💬 Canales de Soporte

#### ¿Cómo contacto soporte?
- **Email**: [soporte@dale-app.com](mailto:soporte@dale-app.com)
- **Discord**: [discord.gg/dale](https://discord.gg/dale)
- **Chat en app**: Disponible en la aplicación
- **FAQ**: Esta página

#### ¿Cuáles son los horarios de soporte?
- **Chat en vivo**: Lunes a Viernes, 9:00 - 18:00 (CET)
- **Email**: Respuesta en 24-48 horas
- **Discord**: Comunidad activa 24/7
- **Issues técnicos**: Response en 1-2 días laborales

### 🚨 Issues Críticos

#### ¿Qué constituye un issue crítico?
- **Seguridad**: Vulnerabilidades o breaches de datos
- **Disponibilidad**: Servicios caídos por más de 30 minutos
- **Pérdida de datos**: Problemas con información de usuarios
- **Problemas de pago**: Issues con transacciones (futuro)

#### ¿Cómo reporto un issue crítico?
- **Email urgente**: [critical@dale-app.com](mailto:critical@dale-app.com)
- **Teléfono**: +34 XXX XXX XXX (solo para issues críticos)
- **GitHub**: Tag con "critical" en el issue

---

## ✅ ¿Tu pregunta no está aquí?

### 🤔 ¿Qué hacer?

1. **Revisa la documentación completa** en [docs.dale-app.com](https://docs.dale-app.com)
2. **Busca en GitHub Issues** para issues similares
3. **Pregunta en Discord** en el canal apropiado:
   - #general para preguntas generales
   - #development para preguntas técnicas
   - #bugs para reportar problemas
   - #support para ayuda
4. **Contacta soporte** por email o chat

### 📝 ¿Quieres contribuir a esta FAQ?

Si tienes una pregunta frecuente que no está aquí, o una respuesta que puede mejorarse:

1. **Crea un issue** en GitHub
2. **Describe** la pregunta y la respuesta sugerida
3. **Añade** la categoría apropiada
4. **Nuestro equipo** revisará y añadirá a la FAQ

---

> **💡 Tip**: Esta FAQ se actualiza regularmente. Si no encuentras la respuesta a tu pregunta, es posible que sea muy nueva o específica. ¡No dudes en contactar con nosotros! 📧