/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Это блок L1.7 (Шаг 6), который мы добавляем
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts', // <-- Указываем на файл из Шага 6.3
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Порог L1.7, как в плане
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
      },
    },
  },
});

