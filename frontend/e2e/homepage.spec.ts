import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title contains WolvCapital
    await expect(page).toHaveTitle(/WolvCapital/);
  });

  test('should display main navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for main navigation links
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('should display the FlipVisaCard component', async ({ page }) => {
    await page.goto('/');
    
    // Check for card content
    await expect(page.getByText('WOLVCAPITAL LTD')).toBeVisible();
    await expect(page.getByText('Premium Banking')).toBeVisible();
  });

  test('should flip the visa card on click', async ({ page }) => {
    await page.goto('/');
    
    // Find and click the card
    const card = page.getByRole('button', { name: /click to flip card/i });
    await expect(card).toBeVisible();
    
    await card.click();
    
    // Wait for flip animation and check aria-label changed
    await expect(card).toHaveAttribute('aria-label', /click to flip card to front/i);
  });
});

test.describe('Authentication Flow', () => {
  test('should have login button on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Look for login link/button
    const loginButton = page.getByRole('link', { name: /login/i }).or(
      page.getByRole('button', { name: /login/i })
    );
    
    await expect(loginButton).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main content is still visible
    await expect(page.getByText('WOLVCAPITAL LTD')).toBeVisible();
  });

  test('should be tablet responsive', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // Check that main content is still visible
    await expect(page.getByText('WOLVCAPITAL LTD')).toBeVisible();
  });
});
