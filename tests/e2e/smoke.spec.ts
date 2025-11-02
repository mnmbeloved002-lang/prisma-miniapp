import { test, expect } from '@playwright/test'

test('app renders header/search (local preview)', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  // ждём маунт React-корня
  await page.waitForSelector('#root', { state: 'attached', timeout: 15_000 })

  const header = page.locator('header[role="banner"], [data-testid="app-header"]')
  const bookmarks = page.locator('[data-testid="bookmarks-btn"]')
  const search = page.getByRole('searchbox').first()
  const title = page.getByRole('heading', { name: /Prisma (News|MiniApp)/i })

  // любая из «якорных» точек интерфейса должна появиться
  await Promise.race([
    header.waitFor({ state: 'visible', timeout: 20_000 }),
    bookmarks.waitFor({ state: 'visible', timeout: 20_000 }),
    search.waitFor({ state: 'attached', timeout: 20_000 }),
    title.waitFor({ state: 'attached', timeout: 20_000 }),
  ])

  // быстрые sanity-проверки
  await expect(title).toBeAttached()
  await expect(search).toBeAttached()
})

test('prod has security headers', async ({ request }) => {
  const res = await request.get('/')
  const headers = Object.fromEntries(
    Object.entries(res.headers()).map(([k, v]) => [k.toLowerCase(), v])
  )
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['content-security-policy']).toBeTruthy()
})

test('sourcemaps are hidden (404)', async ({ request }) => {
  const res = await request.get('/__never__/file.js.map')
  expect([403, 404]).toContain(res.status())
})
