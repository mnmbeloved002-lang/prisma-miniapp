// vitest.config.ts
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 70, functions: 70, branches: 70 },
    },
    // важно: Vitest не трогает Playwright e2e
    exclude: ['node_modules', 'dist', 'tests/e2e/**'],
  },
});
