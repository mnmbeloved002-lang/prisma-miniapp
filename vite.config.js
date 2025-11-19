// vite.config.js
import react from '@vitejs/plugin-react'
import { defineConfig as defineViteConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

const isProd = process.env.NODE_ENV === 'production'

// UEC FIX: Мы используем defineVitestConfig, чтобы разрешить секцию 'test'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default defineVitestConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    target: 'es2020',
    cssTarget: 'chrome100',
  },
  esbuild: isProd
    ? { drop: ['console', 'debugger'] }
    : undefined,
  
  // Конфигурация Vitest для L0/L2 Quality Gates
  test: {
    environment: 'jsdom', 
    globals: true, 
  },
})
