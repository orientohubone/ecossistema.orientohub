# Diagnóstico e Solução de Problemas com Tabela Projects

## Problema Relatado

O sistema está exibindo o erro:
> "A tabela 'projects' não foi encontrada. Por favor, execute a migração do banco de dados no Supabase."

Mas a migração já foi executada e a tabela existe no banco de dados.

## Possíveis Causas

### 1. Cache do PostgREST (PostgreSQL REST API)
O Supabase usa PostgREST para expor a API REST. Após executar migrações, o cache do schema pode levar alguns segundos para atualizar.

**Solução:**
- Aguarde 10-30 segundos após executar a migração
- Recarregue a página do aplicativo
- Se persistir, reinicie o projeto Supabase (se estiver usando Supabase local)

### 2. Problemas com RLS (Row Level Security)
As políticas de segurança podem estar bloqueando o acesso mesmo que a tabela exista.

**Solução:**
1. Acesse o Supabase Dashboard
2. Vá em Authentication > Policies
3. Verifique se as políticas para a tabela `projects` estão ativas
4. Execute o script de diagnóstico: `supabase/migrations/20250115000001_diagnose_projects.sql`

### 3. Problema de Autenticação
O usuário pode não estar autenticado corretamente.

**Solução:**
- Verifique se você está logado
- Faça logout e login novamente
- Verifique o console do navegador (F12) para erros de autenticação

### 4. Ordem de Execução das Migrações
Se as migrações foram executadas fora de ordem, pode haver conflitos.

**Solução:**
Execute as migrações na seguinte ordem:
1. `20251108191316_create_projects_system.sql` (cria tabelas básicas)
2. `20250115000000_fix_projects_user_id.sql` (adiciona user_id e RLS)
3. `20251112_fix_projects_rls.sql` (atualiza políticas RLS)

## Como Diagnosticar

### Opção 1: Usar o Script SQL de Diagnóstico

Execute no SQL Editor do Supabase:
```sql
-- Execute o arquivo: supabase/migrations/20250115000001_diagnose_projects.sql
```

Este script verifica:
- Se a tabela existe
- Estrutura da tabela
- Status do RLS
- Políticas ativas
- Índices
- Permissões

### Opção 2: Verificar Manualmente no Supabase Dashboard

1. **Table Editor:**
   - Vá em Table Editor
   - Verifique se a tabela `projects` aparece na lista
   - Verifique se há coluna `user_id` do tipo UUID

2. **SQL Editor:**
   - Execute: `SELECT * FROM projects LIMIT 1;`
   - Se der erro de permissão, o problema é RLS
   - Se der erro de tabela não encontrada, a tabela não existe

3. **Authentication > Policies:**
   - Verifique se há 4 políticas para `projects`:
     - SELECT: "Users can read own projects"
     - INSERT: "Users can insert own projects"
     - UPDATE: "Users can update own projects"
     - DELETE: "Users can delete own projects"

### Opção 3: Usar a Função de Diagnóstico no Código

O código agora inclui uma função de diagnóstico automática. Quando ocorrer um erro:
1. Abra o console do navegador (F12)
2. Procure por "Diagnóstico completo:"
3. Verifique as informações retornadas

## Soluções por Tipo de Erro

### Erro PGRST205 ou PGRST116
**Causa:** Tabela não encontrada ou cache não atualizado

**Solução:**
1. Verifique se a tabela existe no Table Editor
2. Se existir, aguarde alguns segundos e tente novamente
3. Se não existir, execute a migração `20250115000000_fix_projects_user_id.sql`

### Erro 42501 ou "Permission denied"
**Causa:** RLS bloqueando o acesso

**Solução:**
1. Execute o script de diagnóstico
2. Verifique as políticas RLS no Dashboard
3. Se necessário, recrie as políticas executando `20251112_fix_projects_rls.sql`

### Erro PGRST301 ou "JWT"
**Causa:** Problema de autenticação

**Solução:**
1. Faça logout e login novamente
2. Verifique se o token de autenticação está válido
3. Limpe o cache do navegador

## Melhorias Implementadas

### 1. Tratamento de Erros Melhorado
- Logs detalhados no console
- Mensagens de erro mais informativas
- Identificação automática do tipo de erro

### 2. Função de Diagnóstico Automática
- Executa diagnóstico quando detecta erros relacionados
- Fornece informações detalhadas sobre o problema
- Sugere soluções específicas

### 3. Script SQL de Diagnóstico
- Verifica estrutura da tabela
- Verifica políticas RLS
- Verifica permissões
- Testa autenticação

## Próximos Passos

1. **Teste o sistema novamente:**
   - Tente criar um projeto
   - Verifique o console do navegador para logs detalhados
   - Se houver erro, verifique a mensagem específica

2. **Execute o diagnóstico:**
   - Use o script SQL de diagnóstico
   - Ou verifique o console do navegador após um erro

3. **Corrija conforme necessário:**
   - Siga as soluções sugeridas acima
   - Se o problema persistir, compartilhe os logs do console

## Contato

Se o problema persistir após seguir estas instruções, compartilhe:
- Mensagem de erro completa do console
- Resultado do script de diagnóstico
- Screenshot das políticas RLS no Supabase Dashboard

