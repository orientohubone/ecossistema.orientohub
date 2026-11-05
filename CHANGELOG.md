# Histórico de alterações

## 2026-11-05 — Validação de configuração no deploy

- Site e CRM validam as variáveis públicas do Supabase antes de compilar; a ausência interrompe o build com os nomes das configurações necessárias.
- O build aceita os aliases de servidor SUPABASE_URL e SUPABASE_ANON_KEY e injeta somente os dois valores públicos no frontend.
- Chaves service_role e secret são recusadas na configuração pública.
- A configuração Vercel fixa o framework Vite, o comando npm run build e a saída dist.
- Testes verificam configuração ausente, aliases, precedência e incorporação dos valores públicos em um build Vite real.

## 2026-11-05 — Integração GitHub por usuário

- Conexão individual por GitHub App com OAuth e PKCE, tokens criptografados e renovação no servidor.
- Autorização de repositórios e vínculos por solução, com isolamento entre usuários e revogação por webhook.
- Execução das APIs no ambiente local com `npm run dev` e callback na porta 5173.
- Agrupamento de consultas duplicadas, limite de duas sincronizações simultâneas e tratamento do prazo de espera do GitHub.
- Seletores de conta e repositório padronizados, com nomes e URLs completos.
- Reinicialização da seleção ao trocar de solução para evitar vínculos acidentais.
- Cache de dependências separado para testes locais e atualização do guia de configuração.

### Publicação

As variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` precisam estar configuradas na Vercel no ambiente do deployment antes do build. Após alterá-las, execute um novo deploy com rebuild: o Vite incorpora esses valores na compilação.

As credenciais de servidor da GitHub App e a chave `SUPABASE_SERVICE_ROLE_KEY` não devem receber prefixo `VITE_`. Consulte [o guia de integração](docs/security/GITHUB_INTEGRATION.md) para migração, callbacks e ativação.
