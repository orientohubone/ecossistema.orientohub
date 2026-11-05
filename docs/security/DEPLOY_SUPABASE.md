# Build e publicação do Supabase

O navegador precisa receber URL e chave pública durante a compilação. Configurar variáveis somente depois do build não altera o JavaScript já publicado.

## Vercel

1. Abra o projeto associado ao domínio orientohub.com.br.
2. Em Settings → Environment Variables, configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para o ambiente do deployment: Production para o domínio principal e Preview para branches de teste. O build também aceita SUPABASE_URL e SUPABASE_ANON_KEY como aliases. Se ambos existirem, os nomes VITE_ têm prioridade.
3. Use a URL do projeto e a chave anon/publishable do Supabase. Nunca use service_role ou sb_secret_ no frontend.
4. A Root Directory deve apontar para a raiz deste repositório, onde estão package.json, vite.config.ts e vercel.json. A publicação usa npm run build e a pasta dist; não a pasta apps/crm ou um dist antigo.
5. Publique o commit que contém build/supabaseEnv.ts. Se usar Redeploy, selecione o deployment desse commit e desmarque o reaproveitamento do Build Cache para esse diagnóstico.
6. Nos logs, confira a mensagem `[Supabase/build] URL pública e chave pública disponíveis; valores omitidos.` no build principal e no CRM. Se a configuração estiver ausente, o build deve falhar com `[Supabase/build] Variáveis ausentes`, sem publicar uma versão quebrada.
7. Confira que o deployment validado foi atribuído ao domínio de produção e recarregue o navegador descartando o cache.

Se o build passar sem a mensagem de validação e o navegador ainda mostrar Missing Supabase environment variables, verifique qual commit, projeto, Root Directory e artefato estão sendo publicados. Não compartilhe os valores das chaves para investigar isso; bastam os nomes das variáveis e as mensagens de build.

## Verificação local

```bash
node scripts/check-supabase-build-env.mjs
npm run build
node scripts/check-browser-secrets.mjs
```

Referência: [variáveis e modos no Vite](https://vite.dev/guide/env-and-mode).
