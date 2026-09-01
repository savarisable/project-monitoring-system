import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@uploaded': 'C:/Users/USER/.gemini/antigravity/brain/4910d9a7-6e56-40f3-91d7-05abb3ae0061/.user_uploaded',
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    cors: true,
    allowedHosts: true,
    fs: {
      strict: false,
      allow: ['..', 'C:/Users/USER/'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
