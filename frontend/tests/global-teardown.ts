/**
 * Global Teardown para Playwright
 * Se ejecuta después de todos los tests
 * Limpia recursos y genera reportes
 */

import { FullConfig, FullResult } from '@playwright/test';

/**
 * Limpieza global que se ejecuta una sola vez al final
 */
async function globalTeardown(config: FullConfig, results: FullResult) {
  console.log('🧹 Limpieza global de Playwright iniciada...');
  
  // Generar reporte de resumen si se desean procesamientos adicionales
  if (results.status === 'failed') {
    console.log('❌ Algunos tests fallaron. Revisa el reporte HTML para detalles.');
  } else if (results.status === 'passed') {
    console.log('🎉 Todos los tests pasaron exitosamente!');
  }
  
  // Aquí se pueden agregar limpiezas adicionales como:
  // - Cerrar conexiones a base de datos
  // - Eliminar archivos temporales
  // - Enviar notificaciones
  // - Subir resultados a servicios externos
  
  console.log('✅ Limpieza global completada');
}

export default globalTeardown;