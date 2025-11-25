// 1. Убрали defineConfig из импорта, оставили только mergeConfig
import { mergeConfig } from 'vitest/config';
import base from './vitest.config';

// 2. Игнорируем правило Biome насчет default export
// biome-ignore lint/style/noDefaultExport: Config files require default export
export default mergeConfig(base, {
  test: {
    reporters: ['dot'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      // all: true, // Закомментировано, так как вызывает конфликт типов
      thresholds: {
        lines: 96,
        branches: 97,
        functions: 99,
        statements: 97,
      },
    },
  },
});
