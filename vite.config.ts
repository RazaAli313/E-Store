import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  base: '/app',
  plugins: [
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: 'sentry-boilerplate',
      project: 'javascript-react',
      sourcemaps: {
        assets: './dist/**',
        filesToDeleteAfterUpload: ['./dist/**/*.js.map'],
      },
    }),
  ],
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src'),
      '#env': path.resolve(__dirname, './env.mjs'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
  },
});
