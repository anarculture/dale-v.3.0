// Service Worker para Dale - Aplicación de Viajes Compartidos
// Versión: 1.0.0

const CACHE_NAME = 'dale-v1.0.0';
const API_CACHE_NAME = 'dale-api-v1.0.0';
const STATIC_CACHE_NAME = 'dale-static-v1.0.0';

// Recursos estáticos que se cachéan inmediatamente
const STATIC_ASSETS = [
  '/',
  '/rides',
  '/bookings',
  '/profile',
  '/offer',
  '/login',
  '/signup',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Recursos que se obtienen de red primero
const NETWORK_FIRST = [
  '/api/',
  '/_next/',
];

// Recursos que se obtienen de caché primero
const CACHE_FIRST = [
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.ico',
  '.webp',
  '.woff',
  '.woff2',
  '.ttf',
  '.css',
  '.js',
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Caché de recursos estáticos
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('Service Worker: Caché de recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Activación inmediata
      self.skipWaiting()
    ])
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar cachés antiguos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Eliminando caché antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control de todos los clientes
      self.clients.claim()
    ])
  );
});

// Intercepción de requests (Fetch Event)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip para requests de Chrome extension y requests no HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Estrategia para API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
    return;
  }

  // Estrategia para recursos estáticos (cached first)
  if (CACHE_FIRST.some(ext => url.pathname.includes(ext))) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE_NAME));
    return;
  }

  // Estrategia para navegación (network first with fallback)
  if (request.mode === 'navigate') {
    event.respondWith(navigationStrategy(request));
    return;
  }

  // Estrategia por defecto (network first)
  event.respondWith(networkFirstStrategy(request, CACHE_NAME));
});

// Estrategia: Network First
async function networkFirstStrategy(request, cacheName) {
  try {
    // Intentar obtener de la red primero
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Guardar en caché si la respuesta es válida
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Sin conexión, buscando en caché:', request.url);
    
    // Fallback a caché
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si no hay caché, devolver página offline para navegación
    if (request.mode === 'navigate') {
      return caches.match('/') || new Response(
        `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sin Conexión - Dale</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #f3f4f6;
              color: #374151;
              text-align: center;
              padding: 20px;
            }
            .offline-container {
              max-width: 400px;
              background: white;
              padding: 40px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .offline-icon {
              width: 64px;
              height: 64px;
              margin: 0 auto 20px;
              background: #ef4444;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 24px;
            }
            h1 { margin: 0 0 16px; font-size: 24px; }
            p { margin: 0 0 24px; line-height: 1.5; }
            button {
              background: #3b82f6;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 16px;
            }
            button:hover { background: #2563eb; }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <div class="offline-icon">📱</div>
            <h1>Sin Conexión</h1>
            <p>No tienes conexión a internet. Verifica tu conexión y vuelve a intentar.</p>
            <button onclick="window.location.reload()">Reintentar</button>
          </div>
        </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }
    
    // Para otros tipos de requests, devolver error
    throw error;
  }
}

// Estrategia: Cache First
async function cacheFirstStrategy(request, cacheName) {
  try {
    // Buscar en caché primero
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      console.log('Service Worker: Sirviendo desde caché:', request.url);
      return cachedResponse;
    }
    
    // Si no está en caché, obtener de la red
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Service Worker: Error en cacheFirstStrategy:', error);
    
    // Fallback a una imagen por defecto para recursos de imagen
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Imagen no disponible</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Estrategia: Navigation (con fallback mejorado)
async function navigationStrategy(request) {
  try {
    // Intentar red primero
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback a caché para páginas de la app
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback final: página home
    return caches.match('/') || new Response('Página no disponible offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Mensajes del cliente
self.addEventListener('message', event => {
  const { type, payload } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      console.log('Service Worker: Saltando espera de actualizaciones');
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({
        version: CACHE_NAME,
        cacheNames: [CACHE_NAME, API_CACHE_NAME, STATIC_CACHE_NAME]
      });
      break;
      
    case 'CLEAR_CACHE':
      console.log('Service Worker: Limpiando caché por solicitud del cliente');
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        })
      );
      event.ports[0].postMessage({ success: true });
      break;
      
    default:
      console.log('Service Worker: Mensaje desconocido:', type);
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  }
});

// Sincronizar reservas pendientes
async function syncBookings() {
  try {
    // Obtener reservas pendientes del localStorage o IndexedDB
    const pendingBookings = await getPendingBookings();
    
    for (const booking of pendingBookings) {
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(booking)
        });
        
        if (response.ok) {
          await removePendingBooking(booking.id);
          console.log('Reserva sincronizada:', booking.id);
        }
      } catch (error) {
        console.error('Error sincronizando reserva:', error);
      }
    }
  } catch (error) {
    console.error('Error en syncBookings:', error);
  }
}

// Funciones auxiliares para sincronización
async function getPendingBookings() {
  // Implementar lógica para obtener reservas pendientes
  // Podría usar IndexedDB o localStorage
  return [];
}

async function removePendingBooking(bookingId) {
  // Implementar lógica para eliminar reserva pendiente
  console.log('Eliminando reserva pendiente:', bookingId);
}

// Notificaciones push (para futuras funcionalidades)
self.addEventListener('push', event => {
  console.log('Service Worker: Push recibido');
  
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de Dale',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver detalles',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icon-192x192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Dale', options)
  );
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notificación clickeada:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Dale SW v1.0.0 cargado correctamente');
