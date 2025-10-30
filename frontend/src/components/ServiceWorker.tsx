"use client";

import { useEffect, useState } from 'react';

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isOnline: boolean;
  updateAvailable: boolean;
}

export default function ServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false,
  });

  useEffect(() => {
    // Verificar soporte para Service Workers
    const isSupported = 'serviceWorker' in navigator;
    
    if (!isSupported) {
      console.warn('Service Workers no están soportados en este navegador');
      setStatus(prev => ({ ...prev, isSupported: false }));
      return;
    }

    setStatus(prev => ({ ...prev, isSupported: true }));

    // Función para registrar el service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        console.log('Service Worker registrado:', registration);

        setStatus(prev => ({ ...prev, isRegistered: true }));

        // Manejar actualizaciones del service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // Nueva versión disponible
                setStatus(prev => ({ ...prev, updateAvailable: true }));
                
                // Mostrar notificación de actualización
                if (window.confirm('Nueva versión disponible. ¿Actualizar ahora?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });

        // Escuchar cuando el service worker toma control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('Service Worker ha tomado control');
          window.location.reload();
        });

      } catch (error) {
        console.error('Error registrando Service Worker:', error);
        setStatus(prev => ({ ...prev, isRegistered: false }));
      }
    };

    // Registrar el service worker
    registerServiceWorker();

    // Monitorear estado de conexión
    const handleOnline = () => {
      console.log('Conexión恢复');
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      console.log('Sin conexión a internet');
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Estado inicial de conexión
    setStatus(prev => ({ ...prev, isOnline: navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Mostrar indicador visual solo en desarrollo
  if (process.env.NODE_ENV === 'development' && !status.isOnline) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Modo Offline</span>
        </div>
      </div>
    );
  }

  return null;
}

// Hook personalizado para usar el estado del service worker
export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isOnline: true,
    updateAvailable: false,
  });

  useEffect(() => {
    const isSupported = 'serviceWorker' in navigator;
    setStatus(prev => ({ ...prev, isSupported }));

    if (!isSupported) return;

    const updateStatus = () => {
      const registration = navigator.serviceWorker?.getRegistration();
      setStatus(prev => ({ 
        ...prev, 
        isRegistered: !!registration,
        isOnline: navigator.onLine 
      }));
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return status;
}

// Función para limpiar caché si es necesario
export const clearCache = async () => {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('Caché limpiado');
  }
};
