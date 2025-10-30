    /// <reference types="vitest" />
    import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';

    // https://vitejs.dev/config/
    export default defineConfig({
      build: {
        sourcemap: process.env.NODE_ENV === 'production',
      },
      plugins: [
        react(),
      ],
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'lcov'],
          thresholds: { lines: 70, functions: 70, branches: 70 }
        }
      }
    });
    
