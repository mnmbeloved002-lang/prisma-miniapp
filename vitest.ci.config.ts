import { defineConfig } from 'vitest/config';

// biome-ignore lint/style/noDefaultExport: Vitest config requires default export
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
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
      // Реалистичные пороги для L5 (93%+ это отлично!)
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
});
