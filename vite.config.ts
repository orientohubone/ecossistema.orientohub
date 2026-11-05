import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localApi } from './server/localApi';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),localApi()],
  server: { host:'localhost',port:5173,strictPort:true },
  optimizeDeps: {
    force: true,
    exclude: ['lucide-react'],
  },
});
