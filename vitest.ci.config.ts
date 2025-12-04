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
      include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/tests/**',
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
        include: ['**/src/**/*.{ts,tsx}'],
        exclude: [
          '**/src/**/*.test.{ts,tsx}',
          '**/src/**/*.spec.{ts,tsx}',
          '**/src/setupTests.ts',
          '**/src/vite-env.d.ts',
          '**/src/main.tsx', // Entry point (тестируется через E2E)
          '**/src/domain/types.ts',
          '**/src/infrastructure/sentry.ts', // Заглушен в dev
          '**/src/infrastructure/telegram.ts', // Требует Telegram окружения
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
