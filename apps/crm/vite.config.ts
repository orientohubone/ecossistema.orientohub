import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { supabasePublicDefines } from '../../build/supabaseEnv';
import { fileURLToPath } from 'node:url';

const envDir=fileURLToPath(new URL('../..',import.meta.url));
export default defineConfig(({mode})=>({
  define:supabasePublicDefines(mode,envDir),
  base: '/crm/',
  plugins: [react()],
  envDir,
  publicDir: '../../public',
  server: { port: 4174 },
  preview: { port: 4174 },
  build: { outDir: '../../dist/crm', emptyOutDir: true, assetsDir: 'assets' },
}));
