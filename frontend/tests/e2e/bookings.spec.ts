import { test, expect } from '@playwright/test';

test.describe('Bookings Flow', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/bookings');
    await expect(page).toHaveURL(/.*login/);
  });
});
