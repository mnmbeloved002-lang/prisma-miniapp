import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/a11y',
  timeout: 30_000,
  use: {
    baseURL: process.env.TARGET || 'http://127.0.0.1:4173',
    headless: true,
  },
  webServer: {
    command: 'pnpm build && node scripts/serve-dist.js',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  reporter: [['list']],
});
