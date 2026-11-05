# Integração GitHub — configuração do token

As telas de soluções consultam `/api/github-repository?solutionId=...`. O navegador envia somente o JWT do usuário OrientoHub. O token GitHub é lido exclusivamente pela função no servidor, em `process.env.GITHUB_TOKEN`.

## Onde inserir

Na Vercel, abra o projeto que publica `orientohub.com.br`:

1. **Settings → Environment Variables → Add**.
2. Nome: **`GITHUB_TOKEN`**, sem prefixo `VITE_`.
3. Valor: o novo fine-grained PAT emitido no GitHub. Marque a variável como Sensitive/Secret.
4. Selecione **Production**. Habilite **Preview** apenas se esses deployments também devem acessar os repositórios selecionados.
5. Salve e faça um novo deploy do código. Variáveis novas não alteram deployments existentes.
6. Remova a antiga variável `VITE_GITHUB_TOKEN` dos ambientes de frontend e revogue o token antigo no GitHub.

Alternativa no Bash, com Vercel CLI instalado e projeto vinculado:

```bash
vercel env add GITHUB_TOKEN production --sensitive
```

O CLI pedirá o valor interativamente. Não coloque o token literal no comando, em arquivos versionados ou em mensagens do chat.

## Permissões do PAT

Selecione apenas os repositórios necessários, com **Contents: Read-only** e **Metadata: Read-only**. A API consulta metadados, commits, linguagens e quantidade de contribuidores. Não precisa de escrita, administração ou acesso a workflows. Se o proprietário for uma organização, pode ser necessária a aprovação do token por ela.

## Acesso privado e isolamento

- A API valida o JWT no Supabase e busca a solução com o JWT do próprio usuário, filtro de proprietário e RLS. O cliente não escolhe uma URL arbitrária para a função consultar.
- Repositórios públicos podem ser consultados pelos proprietários das respectivas soluções.
- Repositórios privados, por padrão, são acessíveis apenas ao founder confirmado pelo RPC existente `is_orientohub_founder()`. Cadastrar a URL de um repositório privado não concede acesso a seus dados.
- O token do servidor também precisa ter permissão no próprio GitHub. Ser founder não supera as permissões do PAT.
- Opcionalmente, libere repositórios privados específicos para outras contas usando uma variável exclusivamente de servidor, **`GITHUB_REPOSITORY_ACCESS`**, no formato:

```json
{"UUID_REAL_DO_USUARIO":["organizacao/repositorio"]}
```

Use o ID imutável da conta no Supabase, não nome, e-mail ou metadados editáveis. Não há curinga. Cada item é um repositório exato. A variável é dispensável para o acesso do founder.

- O cache de servidor é limitado e separado por usuário, solução, repositório e autorização. O acesso é validado antes de usá-lo; a resposta HTTP usa `private, no-store`.
- O frontend mantém cache em memória por usuário/solução/URL e descarta os dados na troca de conta. Falhas não são cacheadas como resultados válidos.

## Como validar depois do deploy

Entre com sua conta founder, abra **Soluções**, cadastre a URL HTTPS do GitHub no campo de repositório da sua solução e clique em **Sincronizar** ou abra os detalhes. Confira commits, linguagens e contribuidores.

Erros de token expirado, falta de permissão, repositório não encontrado e limite de consultas têm mensagens próprias. Para repositórios privados, conferir também a seleção de repositórios e a aprovação da organização no GitHub.

Para desenvolvimento com funções de servidor, configure `GITHUB_TOKEN` e as variáveis Supabase no ambiente local e use **`vercel dev`**. O Vite sozinho não executa a API. Não é necessária uma nova migração SQL para esta integração; ela usa os RPCs e as políticas existentes.

Validação local executada com GitHub e Supabase simulados: `node scripts/check-github-integration.mjs`. O teste cobre autenticação, acesso de outro usuário, fundador, liberação explícita, repositório privado, cache isolado, URLs inválidas, token expirado, rate limit, paginação e repositório vazio. A consulta real com o novo PAT depende de sua configuração na Vercel; nenhuma credencial nova foi criada ou cadastrada automaticamente.

Referências: [GitHub REST](https://docs.github.com/en/rest/repos/repos), [variáveis na Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables), [variáveis sensíveis](https://vercel.com/docs/environment-variables/sensitive-environment-variables).
