import { test, expect, request } from '@playwright/test';

test('app renders welcome heading (local preview)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Prisma MiniApp/i })).toBeVisible();
});

test('prod has security headers', async ({ request }) => {
  const prodUrl = 'https://prisma-miniapp-prod.vercel.app/';
  const res = await request.get(prodUrl);
  expect(res.status()).toBe(200);

  const h = (k: string) => res.headers()[k.toLowerCase()];
  expect(h('strict-transport-security')).toContain('max-age=');
  expect(h('x-content-type-options')).toBe('nosniff');
  expect(h('x-frame-options')).toBe('DENY');
  expect(h('referrer-policy')).toContain('strict-origin-when-cross-origin');
  expect(h('content-security-policy')).toContain("default-src 'self'");
});

test('sourcemaps are hidden (404)', async ({ request }) => {
  const res = await request.get('https://prisma-miniapp-prod.vercel.app/assets/index.js.map');
  expect(res.status()).toBe(404);
});
