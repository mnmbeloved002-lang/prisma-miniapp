// tests/e2e/smoke.spec.ts
import { test, expect } from '@playwright/test'

test('app renders header/search (local preview)', async ({ page }) => {
  await page.goto('/')
  // ждём, пока UI примонтируется и появится поле поиска
  await expect(page.getByPlaceholder('Поиск новостей…')).toBeVisible({ timeout: 10_000 })
  // заголовок может быть sr-only — достаточно, что он есть в дереве
  await expect(page.getByRole('heading', { name: /Prisma (News|MiniApp)/i })).toBeAttached()
})

test('prod has security headers', async ({ request }) => {
  const res = await request.get('/')
  expect(res.status()).toBe(200)
  const headers = res.headers()
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(Boolean(headers['content-security-policy'])).toBe(true)
})

test('sourcemaps are hidden (404)', async ({ request }) => {
  // несуществующая карта — сервер должен вернуть 404/403, а не SPA index.html
  const res = await request.get('/assets/index.js.map')
  expect([403, 404]).toContain(res.status())
})
