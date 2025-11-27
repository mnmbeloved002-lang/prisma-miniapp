import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],

  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React ecosystem
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }

          // State management
          if (id.includes('node_modules/zustand')) {
            return 'vendor-state';
          }

          // Sentry
          if (id.includes('node_modules/@sentry')) {
            return 'vendor-sentry';
          }

          // Все остальные node_modules
          if (id.includes('node_modules')) {
            return 'vendor-libs';
          }
        },
      },
    },

    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    sourcemap: 'hidden',
    chunkSizeWarningLimit: 500,
  },
});
