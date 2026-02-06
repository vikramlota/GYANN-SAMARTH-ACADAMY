import { test, expect } from '@playwright/test';

test.describe('Admin UI', () => {
  test('can login and reach dashboard', async ({ page }) => {
    // Assumes backend is running at http://localhost:8000 (e2e:start)
    // and frontend dev server is running at http://localhost:5174
    
    // Create admin via backend API first (idempotent - won't fail if exists)
    try {
      await page.request.post('http://localhost:8000/api/admin/register', {
        data: { username: 'e2eadmin', password: 'password123' }
      });
    } catch (err) {
      // Admin may already exist, that's fine
    }

    await page.goto('http://localhost:5174/admin/login');

    await page.fill('input[placeholder="Username"]', 'e2eadmin');
    await page.fill('input[placeholder="Password"]', 'password123');

    await page.click('button:has-text("Login")');

    // After successful login, should redirect to /admin/dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.locator('text=Welcome Admin')).toBeVisible();
  });
});
