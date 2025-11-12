import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: 'visual.spec.ts',
  timeout: 60_000,
  use: {
    baseURL: process.env.TARGET || 'http://127.0.0.1:4173',
    headless: true,
    trace: 'on-first-retry',
    timezoneId: 'UTC',
    locale: 'ru-RU',
    // Скриншоты сравниваем очень строго, но не до фанатизма
    screenshot: 'only-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,   // до 1% разницы
    },
  },
  webServer: {
    command: 'pnpm build && node scripts/serve-dist.js',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  reporter: [['list']],
});
