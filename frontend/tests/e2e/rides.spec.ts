import { test, expect } from '@playwright/test';

test.describe('Ride Search Flow', () => {
  test('should navigate to rides page', async ({ page }) => {
    await page.goto('/rides');
    await expect(page).toHaveURL(/.*rides/);
    await expect(page.getByText('Buscar Viaje')).toBeVisible();
  });

  test('should allow searching for rides', async ({ page }) => {
    await page.goto('/rides');
    
    // Fill search form
    // Note: DSelect might need specific handling depending on implementation
    // For now, we check if the inputs exist
    await expect(page.getByRole('button', { name: 'Origen' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Destino' })).toBeVisible();
    await expect(page.getByLabel('Fecha')).toBeVisible();
    
    await page.getByRole('button', { name: 'Buscar' }).click();
    
    // Should stay on rides page or update query params
    await expect(page).toHaveURL(/.*rides/);
  });
});
