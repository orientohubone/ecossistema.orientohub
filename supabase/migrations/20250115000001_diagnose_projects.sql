-- Script de Diagnóstico para Tabela Projects
-- Execute este script no SQL Editor do Supabase para diagnosticar problemas
-- Data: 2025-01-15

-- 1. Verificar se a tabela existe
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'projects'
    ) THEN
        RAISE NOTICE '✓ Tabela "projects" existe';
    ELSE
        RAISE WARNING '✗ Tabela "projects" NÃO existe';
    END IF;
END $$;

-- 2. Verificar estrutura da tabela
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'projects'
ORDER BY ordinal_position;

-- 3. Verificar se RLS está habilitado
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'projects';

-- 4. Listar todas as políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'projects'
ORDER BY policyname;

-- 5. Verificar se há índices
SELECT 
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public' 
AND tablename = 'projects';

-- 6. Verificar se a coluna user_id existe e tem o tipo correto
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'projects'
AND column_name = 'user_id';

-- 7. Contar registros (se houver permissão)
SELECT COUNT(*) as total_projects FROM public.projects;

-- 8. Verificar se há foreign keys
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name = 'projects';

-- 9. Verificar permissões da tabela
SELECT 
    grantee,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
AND table_name = 'projects';

-- 10. Testar se o usuário atual pode inserir (simulação)
-- NOTA: Isso pode falhar se RLS estiver bloqueando, mas é útil para diagnóstico
DO $$
DECLARE
    current_user_id UUID;
    test_result TEXT;
BEGIN
    -- Tentar obter o usuário atual
    SELECT auth.uid() INTO current_user_id;
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE '⚠ Nenhum usuário autenticado encontrado';
    ELSE
        RAISE NOTICE '✓ Usuário autenticado: %', current_user_id;
        
        -- Verificar se há políticas que permitem INSERT
        IF EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = 'projects'
            AND cmd = 'INSERT'
        ) THEN
            RAISE NOTICE '✓ Política de INSERT encontrada';
        ELSE
            RAISE WARNING '✗ Nenhuma política de INSERT encontrada';
        END IF;
        
        -- Verificar se há políticas que permitem SELECT
        IF EXISTS (
            SELECT 1 FROM pg_policies
            WHERE schemaname = 'public'
            AND tablename = 'projects'
            AND cmd = 'SELECT'
        ) THEN
            RAISE NOTICE '✓ Política de SELECT encontrada';
        ELSE
            RAISE WARNING '✗ Nenhuma política de SELECT encontrada';
        END IF;
    END IF;
END $$;

