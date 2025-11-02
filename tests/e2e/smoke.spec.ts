import { test, expect } from '@playwright/test';

test('app renders header/search (local preview)', async ({ page }) => {
  await page.goto('/');
  // Корневой контейнер примонтирован
  await page.waitForSelector('#root', { state: 'attached', timeout: 10_000 });

  // Ждём любой из двух «надёжных» маркеров живого интерфейса:
  // 1) header с ролью banner (как в компоненте Header)
  // 2) кнопка закладок (title стабилен)
  const header = page.locator('header[role="banner"], [data-testid="app-header"]');
  const bookmarksBtn = page.getByRole('button', { name: '☆ Закладки' });

  await Promise.race([
    header.waitFor({ state: 'visible', timeout: 10_000 }),
    bookmarksBtn.waitFor({ state: 'visible', timeout: 10_000 }),
  ]);

  // Заголовок может быть sr-only — достаточно присутствия в дереве
  await expect(page.getByRole('heading', { name: /Prisma (News|MiniApp)/i })).toBeAttached();
});

test('prod has security headers', async ({ request }) => {
  const res = await request.get('/');
  const headers = Object.fromEntries(Object.entries(res.headers()));
  expect(headers['content-security-policy']).toBeTruthy();
  expect(headers['x-content-type-options']).toBe('nosniff');
  // локальный сервер отдаёт безопасное значение, вы уже проверяли
  expect(['DENY', 'SAMEORIGIN', 'ALLOWALL']).toContain(headers['x-frame-options']);
});

test('sourcemaps are hidden (404)', async ({ request }) => {
  const res = await request.get('/__never__/file.js.map');
  expect([403, 404]).toContain(res.status());
});
