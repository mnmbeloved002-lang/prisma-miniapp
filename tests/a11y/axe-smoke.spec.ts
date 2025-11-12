import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('a11y smoke', async ({ page }) => {
  await page.goto(process.env.TARGET || 'http://127.0.0.1:4173/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''));
  expect(serious).toEqual([]);
});
