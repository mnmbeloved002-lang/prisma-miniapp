import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,

    // Vitest гоняет только unit/IT из src/**
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**',             // <-- Playwright-дерево мимо Vitest
      '**/playwright.*.ts',
    ],

    setupFiles: ['./vitest.setup.ts'],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      // Временные исключения (нет тестов/не исполняемый код):
      exclude: [
        'src/main.tsx',
        'src/setupTests.ts',
        'src/domain/**',
        'src/ui/ReaderPreview.tsx',
        'src/ui/NewItemsBar.tsx',
        'src/application/tts.ts',
        'src/utils/usePersistentState.ts',
        'src/utils/useTTSState.ts',
      ],
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 95,
        statements: 95,
      },
    },
  },
});
