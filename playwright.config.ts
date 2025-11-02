import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },

  // ВАЖНО: базовый URL для запросов/переходов в тестах
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  // Веб-сервер для предварительно собранного dist
  webServer: {
    command: 'node scripts/serve-dist.js',
    url: 'http://localhost:4173',
    timeout: 60_000,            // даём до минуты на старт
    reuseExistingServer: true,  // не падаем, если порт уже занят нашим же сервером
    stdout: 'pipe',
    stderr: 'pipe',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
