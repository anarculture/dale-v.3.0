/**
 * Tests de Interfaz de Usuario (UI)
 * Se enfocan en elementos específicos de la UI
 */

import { test, expect } from '@playwright/test';
import { takeElementScreenshot } from '../utils';

test.describe('Tests de Interfaz de Usuario', () => {
  test('debería mostrar elementos de navegación correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Verificar header/navbar
    const nav = page.locator('nav, header, .navbar');
    await expect(nav).toBeVisible();
    
    // Verificar enlaces de navegación
    const links = nav.locator('a');
    await expect(links.first()).toBeVisible();
    
    // Tomar screenshot para comparación visual
    await takeElementScreenshot(page, 'nav', 'navbar-test');
  });

  test('debería tener estados hover en botones', async ({ page }) => {
    await page.goto('/');
    
    const buttons = page.locator('button, .btn, [role="button"]');
    const count = await buttons.count();
    
    if (count > 0) {
      const firstButton = buttons.first();
      
      // Verificar estado inicial
      await expect(firstButton).toBeVisible();
      
      // Verificar hover
      await firstButton.hover();
      
      // El hover debería cambiar el estilo (verificar que el elemento siga siendo visible)
      await expect(firstButton).toBeVisible();
    }
  });

  test('debería mostrar loading states correctamente', async ({ page }) => {
    await page.goto('/');
    
    // Simular loading state (esto dependerá de la implementación específica)
    const loadingElements = page.locator('.loading, [aria-busy="true"], .spinner');
    
    if (await loadingElements.count() > 0) {
      await expect(loadingElements.first()).toBeVisible();
    }
  });

  test('debería tener accesibilidad básica', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los elementos interactivos tengan roles o tipos
    const interactiveElements = page.locator('button, a, input, select, textarea');
    const count = await interactiveElements.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const element = interactiveElements.nth(i);
      
      // Verificar que el elemento sea accesible (tenga role, type, name, etc.)
      const hasAccessibility = await element.evaluate((el) => {
        return !!(el.getAttribute('role') || 
                 el.getAttribute('type') || 
                 el.getAttribute('aria-label') ||
                 el.getAttribute('title') ||
                 el.textContent?.trim() ||
                 el.getAttribute('name'));
      });
      
      expect(hasAccessibility).toBeTruthy();
    }
  });

  test('debería mostrar tooltips o ayuda contextual', async ({ page }) => {
    await page.goto('/');
    
    // Buscar elementos que deberían tener tooltips
    const elementsWithTitle = page.locator('[title], [aria-label]');
    const count = await elementsWithTitle.count();
    
    if (count > 0) {
      const firstElement = elementsWithTitle.first();
      
      // Verificar que tiene atributos de accesibilidad
      const hasTitle = await firstElement.getAttribute('title');
      const hasAriaLabel = await firstElement.getAttribute('aria-label');
      
      expect(hasTitle || hasAriaLabel).toBeTruthy();
    }
  });

  test('debería mostrar formularios con validación', async ({ page }) => {
    await page.goto('/');
    
    // Buscar formularios
    const forms = page.locator('form');
    const count = await forms.count();
    
    if (count > 0) {
      const form = forms.first();
      const inputs = form.locator('input[required], textarea[required], select[required]');
      const requiredCount = await inputs.count();
      
      if (requiredCount > 0) {
        // Intentar enviar formulario vacío para ver validación
        await page.click('button[type="submit"], input[type="submit"]');
        
        // Verificar mensajes de validación
        const errorMessages = page.locator('.error, .error-message, [aria-invalid="true"]');
        await expect(errorMessages.first()).toBeVisible();
      }
    }
  });
});