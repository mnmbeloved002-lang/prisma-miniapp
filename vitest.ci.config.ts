import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config';

// biome-ignore lint/style/noDefaultExport: Vitest config uses default export for tooling compatibility
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.ts',
      // Явно ограничиваем, какие файлы считаются тестами в CI
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
      // Исключаем e2e/Playwright и артефакты инструментов
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**', // Playwright e2e
        '**/*.e2e.spec.ts',
        '**/*.a11y.spec.ts',
        '**/*.visual.spec.ts',
        '**/.stryker-tmp/**',
        '**/reports/**',
        '**/playwright-report/**',
      ],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        // Любой src в рабочем дереве / в песочницах, но дальше фильтруем exclude
        include: ['**/src/**/*.{ts,tsx}'],
        exclude: [
          // Тесты и инфраструктурные файлы
          '**/src/**/*.test.{ts,tsx}',
          '**/src/**/*.spec.{ts,tsx}',
          '**/src/setupTests.ts',
          '**/src/vite-env.d.ts',

          // Тонкий бутстрап и точка входа — не считаем частью «ядра»
          '**/src/main.tsx',
          '**/src/App.tsx',

          // Чистые типы и замороженные интеграции
          '**/src/domain/types.ts',
          '**/src/infrastructure/sentry.ts',

          // Артефакты Stryker и отчётов (включая его песочницы)
          '**/.stryker-tmp/**',
          '**/reports/**',
        ],
        thresholds: {
          lines: 90,
          functions: 90,
          branches: 85,
          statements: 90,
        },
      },
    },
  }),
);
