-- Migration: Fix RLS Policies for Projects System
-- Date: 2025-11-12
-- Description: Complete RLS setup for projects, hypotheses, experiments, and interviews

-- 1. Ensure RLS is enabled
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 2. Drop all existing policies
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

-- 3. Create RLS policies for PROJECTS
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

-- 4. Create RLS policies for HYPOTHESES
CREATE POLICY "Users can read own hypotheses"
    ON public.hypotheses FOR SELECT 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can insert own hypotheses"
    ON public.hypotheses FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id OR 
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can update own hypotheses"
    ON public.hypotheses FOR UPDATE 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

CREATE POLICY "Users can delete own hypotheses"
    ON public.hypotheses FOR DELETE 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
    );

-- 5. Create RLS policies for EXPERIMENTS
CREATE POLICY "Users can read own experiments"
    ON public.experiments FOR SELECT 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        hypothesis_id IN (
            SELECT h.id FROM public.hypotheses h
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own experiments"
    ON public.experiments FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id OR 
        hypothesis_id IN (
            SELECT h.id FROM public.hypotheses h
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own experiments"
    ON public.experiments FOR UPDATE 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        hypothesis_id IN (
            SELECT h.id FROM public.hypotheses h
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        hypothesis_id IN (
            SELECT h.id FROM public.hypotheses h
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own experiments"
    ON public.experiments FOR DELETE 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        hypothesis_id IN (
            SELECT h.id FROM public.hypotheses h
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 6. Create RLS policies for INTERVIEWS
CREATE POLICY "Users can read own interviews"
    ON public.interviews FOR SELECT 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        experiment_id IN (
            SELECT e.id FROM public.experiments e
            INNER JOIN public.hypotheses h ON e.hypothesis_id = h.id
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own interviews"
    ON public.interviews FOR INSERT 
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id OR 
        experiment_id IN (
            SELECT e.id FROM public.experiments e
            INNER JOIN public.hypotheses h ON e.hypothesis_id = h.id
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own interviews"
    ON public.interviews FOR UPDATE 
    TO authenticated
    USING (
        auth.uid() = user_id OR 
        experiment_id IN (
            SELECT e.id FROM public.experiments e
            INNER JOIN public.hypotheses h ON e.hypothesis_id = h.id
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id OR 
        experiment_id IN (
            SELECT e.id FROM public.experiments e
            INNER JOIN public.hypotheses h ON e.hypothesis_id = h.id
            INNER JOIN public.projects p ON h.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_project_id ON public.hypotheses(project_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_user_id ON public.hypotheses(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_hypothesis_id ON public.experiments(hypothesis_id);
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON public.experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_experiment_id ON public.interviews(experiment_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);