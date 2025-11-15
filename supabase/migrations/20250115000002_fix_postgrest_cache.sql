-- Migration: Fix PostgREST Cache and Schema Issues
-- Date: 2025-01-15
-- Description: Fix PostgREST cache issues and ensure tables are in public schema
-- 
-- Este script resolve o erro PGRST205 forçando a atualização do cache do PostgREST
-- e garantindo que todas as tabelas estejam corretamente no schema public

-- 1. Garantir que estamos usando o schema public
SET search_path TO public;

-- 2. Verificar e mover tabelas para o schema public se necessário
DO $$
DECLARE
    table_record RECORD;
    current_schema TEXT;
BEGIN
    -- Verificar cada tabela
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_name IN ('projects', 'hypotheses', 'experiments', 'interviews')
    LOOP
        -- Verificar em qual schema a tabela está
        SELECT table_schema INTO current_schema
        FROM information_schema.tables
        WHERE table_name = table_record.table_name
        LIMIT 1;
        
        -- Se não estiver no schema public, mover
        IF current_schema != 'public' THEN
            RAISE NOTICE 'Movendo tabela % do schema % para public', table_record.table_name, current_schema;
            EXECUTE format('ALTER TABLE %I.%I SET SCHEMA public', current_schema, table_record.table_name);
        ELSE
            RAISE NOTICE 'Tabela % já está no schema public', table_record.table_name;
        END IF;
    END LOOP;
END $$;

-- 3. Garantir que as tabelas existem no schema public (recriar se necessário)
-- Projects
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stage VARCHAR(50) DEFAULT 'ideation' CHECK (stage IN ('ideation', 'validation', 'mvp', 'traction', 'growth')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    validation_score INTEGER DEFAULT 0 CHECK (validation_score >= 0 AND validation_score <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Hypotheses
CREATE TABLE IF NOT EXISTS public.hypotheses (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    statement TEXT,
    validated BOOLEAN DEFAULT FALSE,
    confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Experiments
CREATE TABLE IF NOT EXISTS public.experiments (
    id SERIAL PRIMARY KEY,
    hypothesis_id INT REFERENCES public.hypotheses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    method TEXT,
    results TEXT,
    learnings TEXT,
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Interviews
CREATE TABLE IF NOT EXISTS public.interviews (
    id SERIAL PRIMARY KEY,
    experiment_id INT REFERENCES public.experiments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_name VARCHAR(255),
    script TEXT,
    notes TEXT,
    responses JSONB DEFAULT '{}'::jsonb,
    insights JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed')),
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Garantir que o schema public está acessível ao PostgREST
-- Dar permissões explícitas ao role anon e authenticated
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 5. Garantir permissões futuras (para novas tabelas)
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON SEQUENCES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT ALL ON FUNCTIONS TO anon, authenticated;

-- 6. Habilitar RLS em todas as tabelas
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 7. Remover políticas antigas e criar novas (garantir que estão corretas)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('projects', 'hypotheses', 'experiments', 'interviews')
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- 8. Criar políticas RLS para projects
CREATE POLICY "Users can read own projects"
    ON public.projects FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects"
    ON public.projects FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON public.projects FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON public.projects FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- 9. Criar políticas RLS para hypotheses
CREATE POLICY "Users can read own hypotheses"
    ON public.hypotheses FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hypotheses"
    ON public.hypotheses FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hypotheses"
    ON public.hypotheses FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own hypotheses"
    ON public.hypotheses FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- 10. Criar políticas RLS para experiments
CREATE POLICY "Users can read own experiments"
    ON public.experiments FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own experiments"
    ON public.experiments FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiments"
    ON public.experiments FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiments"
    ON public.experiments FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- 11. Criar políticas RLS para interviews
CREATE POLICY "Users can read own interviews"
    ON public.interviews FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interviews"
    ON public.interviews FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
    ON public.interviews FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interviews"
    ON public.interviews FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- 12. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON public.projects(stage);
CREATE INDEX IF NOT EXISTS idx_hypotheses_project_id ON public.hypotheses(project_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_user_id ON public.hypotheses(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_hypothesis_id ON public.experiments(hypothesis_id);
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON public.experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_experiment_id ON public.interviews(experiment_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);

-- 13. Forçar atualização do cache do PostgREST
-- NOTA: No Supabase Cloud, isso é feito automaticamente após alguns segundos
-- No Supabase local, você pode precisar reiniciar o serviço PostgREST
-- Este comando notifica o PostgREST sobre mudanças no schema
NOTIFY pgrst, 'reload schema';

-- 14. Verificar se tudo está correto
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name IN ('projects', 'hypotheses', 'experiments', 'interviews');
    
    IF table_count = 4 THEN
        RAISE NOTICE '✓ Todas as 4 tabelas estão no schema public';
    ELSE
        RAISE WARNING '✗ Apenas % tabelas encontradas no schema public (esperado: 4)', table_count;
    END IF;
END $$;

