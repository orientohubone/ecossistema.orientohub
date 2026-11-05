import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { localApi } from './server/localApi';
import { supabasePublicDefines } from './build/supabaseEnv';
import { fileURLToPath } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({mode})=>({
  envDir:fileURLToPath(new URL('.',import.meta.url)),
  define:supabasePublicDefines(mode,fileURLToPath(new URL('.',import.meta.url))),
  plugins: [react(),localApi()],
  server: { host:'localhost',port:5173,strictPort:true },
  optimizeDeps: {
    force: true,
    exclude: ['lucide-react'],
  },
}));
