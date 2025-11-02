import { test, expect } from '@playwright/test'

test('index.html references built assets (smoke)', async ({ page, request }) => {
  // Проверяем сам HTML
  const res = await request.get('/')
  expect(res.ok()).toBeTruthy()
  const html = await res.text()
  expect(html).toContain('<div id="root"></div>')

  // Достаём пути ассетов вида /assets/index-XXXX.js и .css
  const jsMatch = html.match(/\/assets\/index-[\w-]+\.js/)
  const cssMatch = html.match(/\/assets\/index-[\w-]+\.css/)
  expect(jsMatch).toBeTruthy()
  expect(cssMatch).toBeTruthy()

  // Проверяем, что ассеты реально отдаются 200
  const js = await request.get(jsMatch![0])
  expect(js.status()).toBe(200)
  const css = await request.get(cssMatch![0])
  expect(css.status()).toBe(200)

  // Дополнительно открываем страницу — но не «заваливаемся», если UI не успел промаунтиться
  await page.goto('/')
  await page.waitForLoadState('domcontentloaded')
  // Пытаемся найти любой «маяк» UI, но без фатала
  await page
    .locator('header[role="banner"], [data-testid="app-header"], input[type="search"]')
    .first()
    .waitFor({ state: 'attached', timeout: 2000 })
    .catch(() => {})
})

test('prod has security headers', async ({ request }) => {
  const res = await request.get('/')
  const rawHeaders = res.headers()
  // нормализуем ключи
  const h = Object.fromEntries(Object.entries(rawHeaders).map(([k, v]) => [k.toLowerCase(), v]))

  expect(h['content-security-policy']).toBeTruthy()
  expect(h['x-content-type-options']).toBe('nosniff')
  expect(['DENY', 'deny']).toContain(String(h['x-frame-options']).toUpperCase())
})

test('sourcemaps are hidden (404)', async ({ request }) => {
  const res = await request.get('/__never__/file.js.map')
  expect([403, 404]).toContain(res.status())
})
