import { defineConfig, mergeConfig } from 'vitest/config';
import base from './vitest.config';

export default mergeConfig(base, defineConfig({
  test: {
    reporters: ['dot'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.{ts,tsx}'],
      // ГЛОБАЛЬНЫЕ пороги: выставлены чуть ниже текущих значений,
      // чтобы не ломать сборку. Пер-файл добавим отдельным шагом.
      thresholds: { lines: 99, branches: 98, functions: 99, statements: 99 }
    }
  }
}));
