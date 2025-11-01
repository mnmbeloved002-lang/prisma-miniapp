import { test, expect } from '@playwright/test'

test('app renders welcome heading (local preview)', async ({ page }) => {
  await page.goto('/')
  const heading = page.getByRole('heading', { name: /Prisma (News|MiniApp)/i })
  await expect(heading).toBeVisible()
})

test('prod has security headers', async ({ request }, testInfo) => {
  const prod = process.env.PROD_URL
  if (!prod) test.skip(true, 'PROD_URL is not set')
  const res = await request.get(prod!, { failOnStatusCode: false })
  expect(res.headers()['strict-transport-security']).toBeTruthy()
  expect(res.headers()['content-security-policy']).toBeTruthy()
  expect(res.headers()['x-content-type-options']).toMatch(/nosniff/i)
})

test('sourcemaps are hidden (404)', async ({ request }) => {
  const prod = process.env.PROD_URL
  if (!prod) test.skip(true, 'PROD_URL is not set')
  const res = await request.get(prod + '/assets/index.js.map', { failOnStatusCode: false })
  expect(res.status()).toBe(404)
})
