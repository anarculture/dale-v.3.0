/**
 * Utilidades y helpers para tests de Playwright
 * Funciones comunes reutilizables en los tests
 */

import { Page, expect, Locator } from '@playwright/test';

/**
 * Navegar a una página y verificar que cargue correctamente
 */
export async function navigateToPage(page: Page, url: string) {
  await page.goto(url);
  await expect(page).toHaveTitle(/.*/); // Verificar que la página tenga título
}

/**
 * Esperar a que un elemento sea visible
 */
export async function waitForElement(page: Page, selector: string, timeout = 5000) {
  await page.waitForSelector(selector, { timeout });
}

/**
 * Hacer clic en un elemento y esperar navegación
 */
export async function clickAndWaitForNavigation(page: Page, selector: string) {
  const [response] = await Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
  return response;
}

/**
 * Llenar formulario con datos
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    const fieldSelector = `[name="${field}"], [data-testid="${field}"], #${field}`;
    await page.fill(fieldSelector, value);
  }
}

/**
 * Verificar que un elemento contenga un texto específico
 */
export async function expectElementToContainText(page: Page, selector: string, text: string) {
  await expect(page.locator(selector)).toContainText(text);
}

/**
 * Verificar que un elemento tenga un atributo específico
 */
export async function expectElementToHaveAttribute(page: Page, selector: string, attribute: string, value?: string) {
  const element = page.locator(selector);
  if (value) {
    await expect(element).toHaveAttribute(attribute, value);
  } else {
    await expect(element).toHaveAttribute(attribute);
  }
}

/**
 * Tomar screenshot de un elemento específico
 */
export async function takeElementScreenshot(page: Page, selector: string, name: string) {
  const element = page.locator(selector);
  await element.screenshot({ path: `test-results/screenshots/${name}.png` });
}

/**
 * Simular login (ejemplo básico)
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('[type="submit"]');
  await page.waitForURL('/dashboard');
}

/**
 * Verificar que el usuario esté autenticado
 */
export async function expectUserToBeAuthenticated(page: Page) {
  await expect(page.locator('[data-testid="user-menu"], [data-testid="dashboard"]')).toBeVisible();
}

/**
 * Esperar a que la página cargue completamente
 */
export async function waitForPageToLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForFunction(() => document.readyState === 'complete');
}

/**
 * Verificar respuesta de API
 */
export async function expectApiResponse(page: Page, url: string, expectedStatus = 200) {
  const response = await page.request.get(url);
  expect(response.status()).toBe(expectedStatus);
  return response;
}

/**
 * Simular scroll en la página
 */
export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
}

/**
 * Esperar y verificar que una notificación aparezca
 */
export async function waitForNotification(page: Page, text: string) {
  await expect(page.locator(`text=${text}, [data-testid="notification"]`)).toBeVisible();
}

/**
 * Constantes para usar en tests
 */
export const TEST_USERS = {
  regular: {
    email: 'test@example.com',
    password: 'testpass123',
  },
  admin: {
    email: 'admin@example.com',
    password: 'adminpass123',
  },
};

export const TEST_DATA = {
  projects: {
    name: 'Proyecto de Prueba',
    description: 'Descripción del proyecto de prueba',
  },
  tasks: {
    title: 'Tarea de Prueba',
    description: 'Descripción de la tarea de prueba',
    priority: 'medium',
  },
};

/**
 * Configuración de viewport para diferentes dispositivos
 */
export const VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  laptop: { width: 1366, height: 768 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
};