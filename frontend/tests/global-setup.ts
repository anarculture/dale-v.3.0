/**
 * Global Setup para Playwright
 * Se ejecuta antes de todos los tests
 * Configura el entorno de testing
 */

import { FullConfig } from '@playwright/test';

/**
 * Configuración global que se ejecuta una sola vez al inicio
 */
async function globalSetup(config: FullConfig) {
  console.log('🌟 Configuración global de Playwright iniciada...');
  
  // Verificar que la aplicación esté disponible
  const baseURL = config.use?.baseURL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseURL}/api/health`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      throw new Error(`Application not ready: ${response.status}`);
    }
    
    console.log('✅ Aplicación verificada y lista para tests');
  } catch (error) {
    console.warn('⚠️  No se pudo verificar la aplicación, continuando con tests...');
  }
  
  // Crear directorio para screenshots si no existe
  const fs = require('fs');
  const path = require('path');
  
  const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  console.log('🎯 Configuración global completada');
}

export default globalSetup;