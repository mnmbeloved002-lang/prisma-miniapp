import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/setupTests.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'], // только unit в src/**
    // e2e из tests/** игнорируем, их запускает Playwright
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'src/ui/**',
        'src/application/**',
        'src/infrastructure/**',
        'src/domain/**',
        'src/config.ts',
        '**/*.test.*',
        'dist/**'
      ],
      thresholds: {
        global: { lines: 70, functions: 70, branches: 70, statements: 70 },
      },
    },
  },
});
