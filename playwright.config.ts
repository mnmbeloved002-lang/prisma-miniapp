import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /.*\.spec\.ts$/,
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // ✅ Билд перед сервером для свежего дистрибутива
  webServer: {
    command: 'pnpm run build && pnpm run serve:dist',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { NODE_ENV: 'production' },
  },

  // ✅ Убираем Mobile Safari (требует установки WebKit) и оставляем только Chrome-based браузеры
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['Pixel 5'],
        baseURL: 'http://127.0.0.1:4173',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
});
