import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/crm/',
  plugins: [react()],
  envDir: '../..',
  publicDir: '../../public',
  server: { port: 4174 },
  preview: { port: 4174 },
  build: { outDir: '../../dist/crm', emptyOutDir: true, assetsDir: 'assets' },
});
