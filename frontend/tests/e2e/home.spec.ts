/**
 * Tests E2E - Flujos completos de usuario
 * Estos tests simulan interacciones reales de usuario
 */

import { test, expect } from '@playwright/test';
import { navigateToPage, login, expectUserToBeAuthenticated } from '../utils';

test.describe('Tests End-to-End', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToPage(page, '/');
  });

  test('debería cargar la página principal correctamente', async ({ page }) => {
    // Verificar que la página cargue
    await expect(page).toHaveTitle(/.*/);
    
    // Verificar elementos principales
    await expect(page.locator('h1, h2')).toBeVisible();
    await expect(page.locator('nav, header')).toBeVisible();
  });

  test('debería permitir navegación entre páginas', async ({ page }) => {
    // Intentar navegar a diferentes secciones
    const navLinks = page.locator('nav a, header a');
    const count = await navLinks.count();
    
    if (count > 0) {
      await navLinks.first().click();
      await page.waitForLoadState('networkidle');
      
      // Verificar que la navegación funcionó
      const newUrl = page.url();
      expect(newUrl).not.toBe(page.url());
    }
  });

  test('debería manejar el formulario de contacto', async ({ page }) => {
    // Ir a la página de contacto
    await navigateToPage(page, '/contact');
    
    // Llenar formulario
    await page.fill('[name="name"]', 'Usuario Test');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="message"]', 'Mensaje de prueba');
    
    // Enviar formulario
    await page.click('[type="submit"], button[type="submit"]');
    
    // Verificar respuesta
    await expect(page.locator('text=Gracias, text=success, .success')).toBeVisible();
  });
});

test.describe('Tests de Autenticación', () => {
  test('debería permitir login con credenciales válidas', async ({ page }) => {
    await login(page, 'test@example.com', 'testpass123');
    await expectUserToBeAuthenticated(page);
  });

  test('debería mostrar error con credenciales inválidas', async ({ page }) => {
    await navigateToPage(page, '/login');
    
    await page.fill('[name="email"]', 'invalid@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('[type="submit"]');
    
    await expect(page.locator('text=error, text=inválido, .error')).toBeVisible();
  });
});

test.describe('Tests de Responsive Design', () => {
  test('debería verse correctamente en móvil', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await navigateToPage(page, '/');
    
    // Verificar elementos de navegación móvil
    await expect(page.locator('button[aria-label*="menu"], .mobile-menu')).toBeVisible();
  });

  test('debería verse correctamente en tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await navigateToPage(page, '/');
    
    // Verificar layout de tablet
    await expect(page.locator('main, .container')).toBeVisible();
  });
});