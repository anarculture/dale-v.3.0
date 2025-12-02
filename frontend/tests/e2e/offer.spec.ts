import { test, expect } from '@playwright/test';

test.describe('Offer Ride Flow', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/offer');
    await expect(page).toHaveURL(/.*login/);
  });
});
