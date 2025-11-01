import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
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
})
