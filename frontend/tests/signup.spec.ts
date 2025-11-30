import { test, expect } from '@playwright/test';

test.describe('Signup Flow', () => {
  test('shows cooldown message on rapid resend', async ({ page }) => {
    await page.goto('/accounts/signup');
    await page.fill('input[type=email]', 'ui-test-' + Date.now() + '@example.com');
    await page.click('button:has-text("Send Verification Code")');
    await expect(page.locator('text=Verification code sent')).toBeVisible();
    // Move to code step
    await expect(page.locator('input[type=text]')).toBeVisible();
    // Try to resend immediately
    await page.click('button:has-text("Resend")');
    await expect(page.locator('text=Please wait before requesting another code')).toBeVisible();
  });
});
