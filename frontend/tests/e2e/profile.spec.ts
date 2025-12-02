import { test, expect } from '@playwright/test';

test.describe('Profile Flow', () => {
  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/.*login/);
  });
});
