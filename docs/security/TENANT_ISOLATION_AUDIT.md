# Auditoria de isolamento entre usuários — 05/11/2026

## Parecer

O ambiente não pode ser considerado comprovadamente isolado. Foram identificadas falhas na configuração versionada e no código; há correções locais e uma migração pronta. Nenhuma correção foi aplicada remotamente nesta auditoria.

O modelo atual é isolamento por usuário (`user_id`). Não existe, neste escopo, um modelo de organizações com membros e papéis por tenant. O founder tem acesso administrativo deliberado. Publicações, comentários e curtidas da comunidade são compartilhados entre membros; favoritos, ideias, projetos, soluções, cobranças, eventos e anotações administrativas são privados.

## Evidência obtida

- Consulta real, somente leitura, com chave pública anônima do projeto configurado no `.env`: 22 tabelas e 3 RPCs. Nenhum registro privado retornou. `200 []` significa apenas que a consulta não retornou linhas; não certifica RLS nem isolamento A/B.
- PostgreSQL local em PGlite: 44 verificações em schema sintético compatível, carregando as migrações reais relevantes. Incluem reprodução de duas falhas anteriores, leituras e mutações entre A/B, troca de proprietário, vínculos entre contas, RPCs privilegiadas, billing, favoritos, Storage, founder legítimo e reaplicação da migração.
- Testes de navegador/serviço com Supabase simulado: cache por proprietário, resposta antiga após troca de conta, imagens legadas e URLs assinadas, checkout sem sessão e webhook sem segredo.
- Build da aplicação e CRM passaram. A checagem completa de tipos possui erros preexistentes em outras áreas; as alterações de isolamento foram revisadas separadamente. A varredura de 90 arquivos do build não encontrou o valor configurado do token GitHub nem chaves service-role.

Os resultados sanitizados ficam em `scratch/tenant-audit/anonymous-probe.json` e `database-tests.json`. Não contêm chaves, JWTs, IDs de usuários reais ou conteúdos privados.

## Achados e correções

| Gravidade | Achado | Correção preparada |
|---|---|---|
| Alta | Cache de soluções global, não limpo pelo cache central; dados de A poderiam aparecer em sessão B no mesmo navegador | Cache de soluções associado ao proprietário e descartado na troca de sessão; consultas e mutações filtram proprietário |
| Alta | Requisição em andamento podia repovoar o cache após logout | Revisão de sessão invalida respostas antigas; componentes protegidos remontam na troca de usuário; chaves de projeto incluem usuário |
| Alta | Favoritos da comunidade tinham leitura global para autenticados | Fronteira restritiva por `user_id`, testada contra política antiga permissiva |
| Alta | Uma hipótese própria podia apontar ao projeto de outra conta; verificações de dono não validavam todos os vínculos | Trigger valida dono de projetos, hipóteses, experimentos, entrevistas e ideias relacionados; impede transferência de dono |
| Alta | Bucket `idea-images` configurado como público | Bucket privado, leitura assinada pelo proprietário, compatibilidade com caminhos de URLs antigas; gravação apenas na pasta da conta |
| Alta | Token GitHub configurado como variável VITE e utilizado pelo navegador | Removido do código cliente; somente repositórios públicos são consultados. Revogar/rotacionar a credencial já configurada e republicar é necessário |
| Alta | Checkout aceitava `newUserId` + e-mail sem comprovar posse da conta | Removido o atalho; exige JWT válido. Cadastro que exige confirmação orienta confirmar e entrar antes de pagar |
| Alta | Webhook Asaas aceitava ausência de token quando o segredo também estava ausente | Falha fechada quando o segredo não está configurado |
| Média | RPCs de planos/features aceitavam alvo arbitrário ou dependiam de validação indireta | Validação explícita de caller/target, privilégios mínimos e exceção administrativa deliberada |
| Média | Ambiente pode conter políticas antigas mais amplas que as migrações recentes | Fronteiras restritivas em tabelas privadas, administrativas, cobranças e contatos; formulários públicos continuam insert-only |
| Média | Avatares podiam depender de políticas de Storage amplas no ambiente | Escrita e remoção limitadas ao proprietário; leitura pública de avatar continua deliberada |

## Publicação e validação no ambiente real

1. Aplicar as migrações pendentes em ordem; a correção desta auditoria é `supabase/migrations/20261105000003_tenant_isolation.sql`. Foi testada duas vezes seguidas no PostgreSQL local.
2. Publicar frontend e APIs. A mudança de privacidade do bucket precisa do frontend que gera URLs assinadas; coordenar as duas alterações.
3. Revogar/rotacionar o token GitHub configurado anteriormente como `VITE_GITHUB_TOKEN`. Excluir essa variável das configurações de frontend. Nenhuma credencial foi revogada automaticamente.
4. Executar `supabase/diagnostics/tenant-isolation-audit.sql` no SQL Editor para conferir o catálogo realmente implantado, views, grants, funções SECURITY DEFINER, buckets e vínculos históricos inconsistentes. A auditoria não altera os registros históricos nem atribui dono a dados de outra conta.
5. Executar `node scripts/check-tenant-live.mjs` com `TENANT_TEST_A_TOKEN` e `TENANT_TEST_B_TOKEN` no ambiente do processo, usando duas contas de teste não administrativas. O script é somente leitura, não cria contas nem envia e-mails. A chave administrativa não é necessária. O script não foi executado nesta sessão por ausência dessas duas sessões.
6. Repetir operações de criação, atualização, exclusão e Storage em staging com dados sintéticos. A prova local não cobre divergências de schema/políticas remotas, CDN, URLs assinadas previamente emitidas, extensões, Realtime ou configurações de hospedagem.

Não há evidência, nesta auditoria, de exploração anterior ou de exfiltração. Também não há base para afirmar ausência absoluta de brechas. URLs assinadas são capacidades temporárias: quem recebe uma URL válida pode acessá-la durante sua validade, por isso não devem ser publicadas ou registradas em logs.

## Reprodução local

```powershell
npm.cmd install --prefix scratch/tenant-audit --no-save --package-lock=false @electric-sql/pglite
node scripts/check-tenant-database.mjs
node scripts/check-tenant-client.mjs
node scripts/check-dashboard-security.mjs
node scripts/probe-anonymous-isolation.mjs
```

O fixture testa mecanismos reais de PostgreSQL, mas não reproduz integralmente todos os componentes do Supabase. A migração antiga `20251108191316_create_projects_system.sql` contém sequências literais `\\n` e conflita com a evolução de tipos das primeiras migrações; reconstruir o banco completo do zero permanece uma pendência separada. O teste carrega uma base compatível e as migrações relevantes, sem fingir que executou toda a história do repositório.

Referências: [RLS e funções privilegiadas](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage e políticas de acesso](https://supabase.com/docs/guides/storage/security/access-control), [testes de RLS](https://supabase.com/docs/guides/database/postgres/testing-row-level-security).
