import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: Vitest config requires default export
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    // Исключаем Playwright тесты - они запускаются отдельно
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**', // ← Playwright E2E тесты
      '**/*.e2e.spec.ts',
      '**/*.a11y.spec.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/setupTests.ts',
        '**/vite-env.d.ts',
        '**/main.tsx',
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
