import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/RoomBook/', // Base path for deployment
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend URL for development
        changeOrigin: true, // Ensures the origin of the host header is rewritten to the target
      },
    },
  },
});

