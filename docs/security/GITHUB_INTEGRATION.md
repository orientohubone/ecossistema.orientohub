# Integração GitHub App por usuário

Cada usuário conecta sua conta GitHub e escolhe o repositório de cada solução. O acesso privado exige permissões tanto do usuário quanto da GitHub App. Um installation_id ou uma URL informados pelo navegador não concedem acesso.

## 1. Cadastrar a GitHub App

Acesse https://github.com/settings/apps/new na conta ou organização responsável pela OrientoHub e configure:

- Nome disponível, por exemplo OrientoHub; Homepage: https://orientohub.com.br.
- Em **Identifying and authorizing users → Redirect URI**, insira `https://orientohub.com.br/api/github-app?action=callback`. Esse campo é o endereço de retorno da autorização OAuth (callback); não é necessário encontrar um campo chamado “Callback URL”. Deixe **wildcard matching desabilitado** e cadastre a URL exata, incluindo `?action=callback`.
- Em **Post installation → Setup URL (optional)**, insira `https://orientohub.com.br/api/github-app?action=setup`. Esse é um campo separado do **Redirect URI**. Habilite o redirecionamento após atualizações de instalação, se disponível.
- Mantenha **Expire user authorization tokens** habilitado.
- Deixe **Request user authorization (OAuth) during installation** desabilitado. A plataforma inicia a autorização separadamente, com estado vinculado à sessão e PKCE.
- Webhook ativo: `https://orientohub.com.br/api/github-app-webhook`.
- Repository permissions: **Contents: Read-only** e **Metadata: Read-only**. Nenhuma permissão de escrita é necessária.
- Instalação em **Any account**, para atender usuários externos. Organizações podem exigir aprovação administrativa.

O endpoint processa eventos `installation`, `installation_repositories` e `github_app_authorization`. O GitHub entrega eventos de instalação/autorização automaticamente; não é necessário assinar push. A implementação usa tokens de usuário da GitHub App e dispensa chave privada PEM.

Se a aplicação já estiver criada, abra **Settings → Developer settings → GitHub Apps → sua App → General** para editar esses campos.

## 2. Inserir as credenciais na Vercel

No projeto de produção, abra **Settings → Environment Variables**:

| Variável | Valor |
| --- | --- |
| `GITHUB_APP_ID` | App ID do GitHub |
| `GITHUB_APP_SLUG` | Slug da URL pública da App, sem a URL completa |
| `GITHUB_APP_CLIENT_ID` | Client ID da App |
| `GITHUB_APP_CLIENT_SECRET` | Client secret gerado no GitHub |
| `GITHUB_APP_ENCRYPTION_KEY` | Chave de 64 caracteres hexadecimais |
| `GITHUB_APP_WEBHOOK_SECRET` | Mesmo segredo cadastrado no webhook do GitHub |
| `APP_URL` | `https://orientohub.com.br` |

Mantenha também `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`. Segredos são exclusivos do servidor, sem prefixo `VITE_`. Marque-os como sensíveis; não os envie pelo chat.

No Bash, gere dois valores diferentes, guardando cada resultado no campo correspondente:

```bash
# Primeiro resultado: GITHUB_APP_ENCRYPTION_KEY
openssl rand -hex 32
# Segundo resultado: GITHUB_APP_WEBHOOK_SECRET, também cadastrado no GitHub
openssl rand -hex 32
```

A chave de criptografia deve permanecer estável: sua troca exige reconectar os usuários existentes. Não reutilize essa chave como segredo do webhook.

O código novo não usa `GITHUB_TOKEN`, `VITE_GITHUB_TOKEN` nem `GITHUB_REPOSITORY_ACCESS`. Remova as variáveis antigas e revogue o PAT anterior após a transição.

## 3. Aplicar a migração e ativar

1. Aplique `supabase/migrations/20261105000005_github_app_connections.sql` depois das migrações anteriores. A migração é idempotente e cria as tabelas de conexões, estados OAuth, vínculos e entregas de webhook.
2. Cadastre a App e configure as variáveis acima. Faça um novo deploy; mudanças de ambiente não alteram deployments existentes.
3. Em **Soluções**, clique em **Conectar GitHub** e autorize sua conta.
4. Use **Autorizar repositórios**, escolha os repositórios no GitHub e retorne à plataforma. Clique em atualizar a conexão se necessário.
5. Abra a solução, escolha a instalação e o repositório permitido e clique em **Vincular à solução**.
6. Valide com duas contas reais: cada conta deve acessar apenas suas soluções e os repositórios permitidos à própria identidade GitHub.

URLs privadas já cadastradas precisam do vínculo verificado para voltar a carregar dados. Repositórios públicos continuam disponíveis por consulta anônima, sujeita aos limites do GitHub.

## Rodar localmente com a mesma GitHub App

Não é necessário criar outra App nem outro banco. Em **Identifying and authorizing users → Redirect URI**, adicione mais uma URI, mantendo a de produção:

```text
http://localhost:5173/api/github-app?action=callback
```

Deixe wildcard matching desabilitado nas duas URIs. A GitHub App aceita múltiplos retornos; a aplicação envia o `redirect_uri` correspondente ao ambiente que iniciou o fluxo ([documentação](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/about-the-user-authorization-callback-url)).

No arquivo local `.env.local` (ignorado pelo Git), configure as mesmas variáveis Supabase e `GITHUB_APP_*` da Vercel, incluindo a **mesma chave de criptografia**, pois o banco é compartilhado. Não coloque prefixo VITE_ nos segredos. Para obter variáveis já cadastradas, com Vercel CLI e projeto vinculado, use `vercel env pull .env.local --environment=production`; confira se as variáveis sensíveis foram disponibilizadas pelo CLI e preencha as ausentes diretamente no arquivo.

Execute:

```bash
npm run dev
```

Abra **http://localhost:5173**. O Vite executa os mesmos handlers `/api` no servidor Node, carrega `.env` e `.env.local` e configura uma origem local separada para GitHub e sessão, sem substituir APP_URL. A porta 5173 é fixa: se estiver ocupada, o servidor avisa em vez de mudar o callback. Use localhost no navegador para coincidir com a URI cadastrada.

Em produção, mantenha APP_URL=https://orientohub.com.br. Cookies de produção continuam Secure, HttpOnly e com prefixo __Host-; somente o servidor de desenvolvimento local usa cookies HttpOnly separados para HTTP.

A **Setup URL** e o **webhook** continuam em produção. Depois de autorizar novos repositórios no GitHub, retorne à aba local e clique em atualizar a conexão. O webhook de produção atualiza o mesmo banco usado localmente. Alterações de dados, vínculos e desconexões locais também afetam esse banco compartilhado.

### Erro 404 depois de clicar em Install

O retorno de instalação usa a Setup URL cadastrada no GitHub, mesmo quando a autorização começou localmente. Se `https://orientohub.com.br/api/github-app?action=setup` abrir o 404 do site ou retornar HTML, o handler ainda não está disponível nesse deployment. Publique a versão que inclui `api/github-app.ts`; esse endereço deve responder com redirecionamento HTTP 302 para `/dashboard/solutions?github=installation_updated`, e não com o HTML de index.html.

A instalação pode ter sido concluída no GitHub antes da falha de retorno. Volte à aba local: o painel atualiza as instalações ao receber foco; se necessário use o botão de atualizar e selecione o repositório na solução. Não é preciso desconectar e conectar a conta novamente apenas por esse erro de retorno.

Se quiser testar o retorno de instalação antes do deploy, altere temporariamente **Post installation → Setup URL** para `http://localhost:5173/api/github-app?action=setup`. Essa configuração é única para a App e afeta todos que instalarem enquanto estiver assim; restaure a URL de produção depois de publicar a API. Isso não altera as duas Redirect URIs do OAuth.

## Isolamento e testes

Tokens de acesso e renovação ficam criptografados com AES-256-GCM e associados ao usuário. As tabelas não permitem leitura direta pelos papéis anônimo/autenticado. A renovação utiliza uma concessão temporária no banco para evitar chamadas concorrentes com o mesmo refresh token.

O callback exige estado de uso único, PKCE e a sessão OrientoHub que iniciou o fluxo. A API verifica o proprietário da solução e as permissões atuais no GitHub antes de consultar o cache. O cache é separado por usuário, solução e geração da conexão.

Alterar manualmente a URL remove o vínculo anterior. Reconectar remove vínculos antigos; desconectar remove os próprios vínculos e tenta revogar o token no GitHub. Webhooks assinados tratam revogação, suspensão e remoção de repositórios; as consultas também verificam permissões ao vivo.

Verificações locais:

```bash
node scripts/check-github-integration.mjs
node scripts/check-tenant-database.mjs
```

Os testes simulados cobrem OAuth, isolamento em organização compartilhada, refresh concorrente, revogação e ausência de fallback ao PAT global. Os testes PostgreSQL verificam permissões e vínculos no banco. A autorização real ainda depende do cadastro externo, das credenciais e do deploy.

Referências: [tokens de usuário de GitHub Apps](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app), [setup URL e validação de acesso](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/about-the-setup-url), [variáveis na Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables).
