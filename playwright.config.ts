import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',              // только e2e
  testMatch: /.*\.spec\.ts$/,        // исключаем unit *.test.ts*
  timeout: 60_000,
  expect: { timeout: 10_000 },

  webServer: {
    command: 'node scripts/serve-dist.js',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 30_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { NODE_ENV: 'production' },
  },

  use: {
    baseURL: 'http://127.0.0.1:4173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
})
