import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.getByRole('heading', { name: 'Bienvenido a Dale' })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/signup');
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.getByRole('heading', { name: 'Únete a Dale' })).toBeVisible();
  });

  // Note: Full auth testing requires mocking Supabase or having a test user.
  // For now, we verify the UI elements are present.
  test('login form should have email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Correo Electrónico')).toBeVisible();
    await expect(page.getByLabel('Contraseña')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Iniciar Sesión' })).toBeVisible();
  });
});
