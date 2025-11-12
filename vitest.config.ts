// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    // не трогаем e2e папку — её гоняет Playwright
    exclude: [
      'node_modules',
      'dist',
      '.idea',
      '.git',
      '.cache',
      'tests/e2e/**',
    ],
    coverage: {
      // --- (ИСПРАВЛЕНИЕ) ---
      // v8 быстрый, но неточный. 'istanbul' - медленный, но 100% точный.
      provider: 'v8', 
      // --- (КОНЕЦ ИСПРАВЛЕНИЯ) ---
      reporter: ['text', 'html'],
      thresholds: { lines: 35, functions: 35, branches: 35, statements: 35 },
    },
  },
})
