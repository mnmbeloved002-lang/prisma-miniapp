import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    css: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      'dist/**',
      'tests/**',
      '**/playwright.*.ts',
    ],
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      // Исключаем только технические файлы (точки входа и конфиги)
      exclude: [
        'src/main.tsx',
        'src/App.tsx',
        'src/config.ts',
        'src/setupTests.ts',
        'src/domain/**',
        // Оставляем TTS и PersistentState как "задел на будущее" (Feature Flags)
        'src/application/tts.ts',
        'src/infrastructure/utils/usePersistentState.ts',
        'src/infrastructure/utils/useTTSState.ts',
      ],
      // Строгие пороги качества L4
      thresholds: {
        lines: 95,
        branches: 90,
        functions: 95,
        statements: 95,
      },
    },
  },
});
