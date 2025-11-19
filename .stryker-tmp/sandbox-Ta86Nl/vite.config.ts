// @ts-nocheck
// vite.config.ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    target: 'es2020',
    cssTarget: 'chrome100',
    // Опции Rollup по умолчанию (с `moduleSideEffects: true`)
    // идеально подходят для React-приложений.
    // Агрессивный treeshake удален.
  },
  esbuild: isProd
    ? { drop: ['console', 'debugger'] }
    : undefined,
})
