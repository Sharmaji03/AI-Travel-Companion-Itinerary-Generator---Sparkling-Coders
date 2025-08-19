import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBase = env.VITE_API_BASE || 'http://localhost:3000';
  const server = {
    proxy: {
      '/api': {
        target: apiBase,
        changeOrigin: true,
        secure: false,
      },
    },
  };
  return {
    plugins: [react()],
    server,
  };
});


