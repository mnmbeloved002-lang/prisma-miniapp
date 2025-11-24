import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('a11y smoke', async ({ page }) => {
  await page.goto(process.env.TARGET || 'http://127.0.0.1:4173/');
  const results = await new AxeBuilder({ page }).disableRules(['color-contrast']).analyze();
  const critical = results.violations.filter((v) => (v.impact || '') === 'critical');
  if (critical.length) {
    console.error('A11y critical:', critical.slice(0, 5));
  }
  expect(critical.length).toBe(0);
});
