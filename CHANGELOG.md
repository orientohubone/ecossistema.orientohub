# Histórico de alterações

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
