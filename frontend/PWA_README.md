# Dale - PWA Implementation

## 📱 Progressive Web App (PWA)

Esta aplicación implementa una PWA completa con capacidades offline, instalación en dispositivos móviles y funcionalidad de aplicación nativa.

### 🎯 Características Implementadas

#### ✅ Manifest.json
- **Configuración completa**: Nombre, descripción, iconos, colores de tema
- **Display standalone**: La aplicación se comporta como una app nativa
- **Atajos de aplicación**: Accesos directos a funcionalidades principales
- **Orientación**: Configurada para modo portrait
- **Soporte para compartir**: Integración con Web Share API

#### ✅ Service Worker
- **Registro automático**: Se registra y actualiza automáticamente
- **Estrategias de caché**:
  - **Network First**: Para APIs y contenido dinámico
  - **Cache First**: Para recursos estáticos (imágenes, CSS, JS)
  - **Navigation**: Para páginas de la aplicación
- **Página offline**: Interfaz personalizada cuando no hay conexión
- **Sincronización**: Preparado para sincronización en segundo plano
- **Notificaciones**: Soporte para push notifications (futuro)

#### ✅ Componente ServiceWorker
- **Integración React**: Componente cliente para manejar el SW
- **Estado online/offline**: Detección y notificación de estado de conexión
- **Actualizaciones**: Manejo inteligente de actualizaciones del SW
- **Hook personalizado**: `useServiceWorker()` para usar en otros componentes
- **Indicador visual**: Muestra estado offline en desarrollo

### 🗂️ Estructura de Archivos

```
/workspace/dale/frontend/
├── public/
│   ├── manifest.json          # Configuración PWA
│   ├── sw.js                  # Service Worker
│   ├── icon-192x192.png      # Icono para Android
│   └── icon-512x512.png      # Icono para Android
└── src/
    └── components/
        └── ServiceWorker.tsx  # Componente React
```

### 🚀 Cómo Usar

#### Instalación en Dispositivos

**En Android (Chrome/Edge):**
1. Abrir la aplicación en el navegador
2. Tocar el menú (⋮) 
3. Seleccionar "Agregar a pantalla de inicio"
4. Confirmar la instalación

**En iOS (Safari):**
1. Abrir la aplicación en Safari
2. Tocar el botón de compartir (□↑)
3. Seleccionar "Agregar a pantalla de inicio"
4. Confirmar la instalación

**En Desktop (Chrome/Edge):**
1. Buscar el ícono de instalación en la barra de direcciones
2. O usar Ctrl+Shift+I > Application > Install

#### Funcionalidades Offline

La aplicación funciona offline para:
- ✅ Navegación básica entre páginas cacheadas
- ✅ Visualización de contenido previamente cargado
- ✅ Interfaz offline personalizada
- ✅ Recuperación automática al volver online

### 🔧 Desarrollo

#### Monitoreo del Service Worker

```typescript
import { useServiceWorker } from '@/components/ServiceWorker'

function MiComponente() {
  const { isOnline, isRegistered, updateAvailable } = useServiceWorker()
  
  return (
    <div>
      <p>Estado online: {isOnline ? '✅' : '❌'}</p>
      <p>SW registrado: {isRegistered ? '✅' : '❌'}</p>
    </div>
  )
}
```

#### Limpiar Caché

```typescript
import { clearCache } from '@/components/ServiceWorker'

// Limpiar todo el caché
await clearCache()
```

#### Escuchar Actualizaciones

El Service Worker maneja automáticamente las actualizaciones. Los usuarios verán una notificación cuando haya una nueva versión disponible.

### 📊 Estrategias de Caché

| Tipo de Recurso | Estrategia | Tiempo de Vida |
|-----------------|------------|----------------|
| Páginas principales | Network First | Actualización automática |
| API calls | Network First | Solo si éxito |
| Recursos estáticos | Cache First | Hasta nueva versión |
| Imágenes | Cache First | Hasta nueva versión |
| Navegación | Network First con fallback | Cache si falla red |

### 🎨 Personalización

#### Colores del Tema
- **Primario**: `#3b82f6` (Azul)
- **Secundario**: `#ffffff` (Blanco)
- **Fondo**: `#f3f4f6` (Gris claro)

#### Iconos
Los iconos están en formato PNG optimizados para PWA:
- 192x192px: Para Android e iOS
- 512x512px: Para pantallas de alta resolución

### 🔍 Debugging

#### DevTools
1. Abrir Chrome DevTools
2. Ir a Application/Application
3. Verificar:
   - Service Workers: Debe aparecer registrado
   - Manifest: Debe cargar sin errores
   - Cache Storage: Ver recursos cacheados
   - Offline: Probar modo offline

#### Logs del Service Worker
```javascript
// En la consola del navegador
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations))

// Para verificar versión actual
navigator.serviceWorker.controller?.postMessage({ type: 'GET_VERSION' })
```

### 🚨 Notas Importantes

1. **HTTPS requerido**: Los Service Workers solo funcionan en HTTPS o localhost
2. **Actualización automática**: Los usuarios serán notificados de nuevas versiones
3. **Caché inteligente**: Solo se cachea contenido válido y exitoso
4. **Fallback offline**: Siempre hay una interfaz disponible sin conexión
5. **Sincronización**: Preparado para sincronización en segundo plano futura

### 🛠️ Extensiones Futuras

- [ ] Notificaciones push para alertas de viajes
- [ ] Sincronización de reservas pendientes
- [ ] Más estrategias de caché específicas
- [ ] Integración con Web Share API
- [ ] Shortcuts dinámicos basados en uso
- [ ] Instalación condicional
- [ ] Actualizaciones background sync

### 📞 Soporte

Para problemas con la PWA:
1. Verificar que Service Worker esté registrado
2. Limpiar caché si hay problemas de actualización
3. Verificar conectividad de red
4. Revisar console logs para errores

---

**Versión**: 1.0.0  
**Última actualización**: 2025-10-29  
**Compatibilidad**: Navegadores modernos con soporte PWA
