import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/a11y',
  testMatch: ['**/*.spec.ts', '**/*.a11y.spec.ts'],
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',   // preview-порт
    headless: true,
  },
  webServer: {
    command: 'pnpm preview',            // запускает vite preview (статический билд)
    port: 4173,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
