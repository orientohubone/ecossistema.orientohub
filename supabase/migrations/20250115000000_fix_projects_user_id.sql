-- Migration: Add user_id to projects system tables
-- Date: 2025-01-15
-- Description: Add user_id column to all tables and update RLS policies
-- 
-- IMPORTANTE: Após executar esta migração, o PostgREST pode levar alguns segundos
-- para atualizar o cache do schema. Se você receber erro PGRST205, aguarde alguns
-- segundos e tente novamente, ou reinicie o projeto Supabase.

-- 0. Create tables if they don't exist (with public schema)
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hypotheses (
    id SERIAL PRIMARY KEY,
    project_id INT REFERENCES public.projects(id) ON DELETE CASCADE,
    hypothesis_text TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experiments (
    id SERIAL PRIMARY KEY,
    hypothesis_id INT REFERENCES public.hypotheses(id) ON DELETE CASCADE,
    experiment_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.interviews (
    id SERIAL PRIMARY KEY,
    experiment_id INT REFERENCES public.experiments(id) ON DELETE CASCADE,
    interview_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 0.1. Drop all existing policies first (they don't check user_id)
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

-- 1. Add user_id to projects table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.projects 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        
        -- Update existing projects (if any) - this will fail if there are projects without users
        -- In production, you might want to handle this differently
    END IF;
END $$;

-- 2. Add user_id to hypotheses table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'hypotheses' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.hypotheses 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Add user_id to experiments table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'experiments' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4. Add user_id to interviews table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'interviews' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 5. Make user_id NOT NULL after adding (only if column was just added)
-- Note: This will fail if there are existing rows. Handle with care in production.
DO $$ 
BEGIN
    -- For projects
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        -- Only make NOT NULL if table is empty or all rows have user_id
        IF NOT EXISTS (SELECT 1 FROM public.projects WHERE user_id IS NULL) THEN
            ALTER TABLE public.projects ALTER COLUMN user_id SET NOT NULL;
        END IF;
    END IF;
    
    -- For hypotheses
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'hypotheses' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM public.hypotheses WHERE user_id IS NULL) THEN
            ALTER TABLE public.hypotheses ALTER COLUMN user_id SET NOT NULL;
        END IF;
    END IF;
    
    -- For experiments
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'experiments' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM public.experiments WHERE user_id IS NULL) THEN
            ALTER TABLE public.experiments ALTER COLUMN user_id SET NOT NULL;
        END IF;
    END IF;
    
    -- For interviews
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'interviews' 
        AND column_name = 'user_id' 
        AND is_nullable = 'YES'
    ) THEN
        IF NOT EXISTS (SELECT 1 FROM public.interviews WHERE user_id IS NULL) THEN
            ALTER TABLE public.interviews ALTER COLUMN user_id SET NOT NULL;
        END IF;
    END IF;
END $$;

-- 6. Update projects table structure to match application needs
DO $$ 
BEGIN
    -- Add stage column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'stage'
    ) THEN
        ALTER TABLE public.projects 
        ADD COLUMN stage VARCHAR(50) DEFAULT 'ideation' CHECK (stage IN ('ideation', 'validation', 'mvp', 'traction', 'growth'));
    END IF;
    
    -- Add progress column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'progress'
    ) THEN
        ALTER TABLE public.projects 
        ADD COLUMN progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100);
    END IF;
    
    -- Add validation_score column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'validation_score'
    ) THEN
        ALTER TABLE public.projects 
        ADD COLUMN validation_score INTEGER DEFAULT 0 CHECK (validation_score >= 0 AND validation_score <= 100);
    END IF;
    
    -- Change id from SERIAL to UUID if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'projects' 
        AND column_name = 'id' 
        AND data_type = 'integer'
    ) THEN
        -- This is complex, so we'll keep SERIAL for now and handle conversion in application
        -- For new installations, consider using UUID from the start
    END IF;
END $$;

-- 7. Update hypotheses table structure
DO $$ 
BEGIN
    -- Rename hypothesis_text to statement if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'hypotheses' AND column_name = 'hypothesis_text'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'hypotheses' AND column_name = 'statement'
    ) THEN
        ALTER TABLE public.hypotheses 
        RENAME COLUMN hypothesis_text TO statement;
    END IF;
    
    -- Add validated column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'hypotheses' AND column_name = 'validated'
    ) THEN
        ALTER TABLE public.hypotheses 
        ADD COLUMN validated BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add confidence column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'hypotheses' AND column_name = 'confidence'
    ) THEN
        ALTER TABLE public.hypotheses 
        ADD COLUMN confidence INTEGER DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100);
    END IF;
END $$;

-- 8. Update experiments table structure
DO $$ 
BEGIN
    -- Rename experiment_description to title if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'experiment_description'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'title'
    ) THEN
        ALTER TABLE public.experiments 
        RENAME COLUMN experiment_description TO title;
    END IF;
    
    -- Add method column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'method'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN method TEXT;
    END IF;
    
    -- Add results column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'results'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN results TEXT;
    END IF;
    
    -- Add learnings column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'learnings'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN learnings TEXT;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed'));
    END IF;
    
    -- Add date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'date'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add success_rate column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'experiments' AND column_name = 'success_rate'
    ) THEN
        ALTER TABLE public.experiments 
        ADD COLUMN success_rate INTEGER CHECK (success_rate >= 0 AND success_rate <= 100);
    END IF;
END $$;

-- 9. Update interviews table structure
DO $$ 
BEGIN
    -- Rename interview_notes to notes if needed
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'interview_notes'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'notes'
    ) THEN
        ALTER TABLE public.interviews 
        RENAME COLUMN interview_notes TO notes;
    END IF;
    
    -- Add customer_name column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'customer_name'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN customer_name VARCHAR(255);
    END IF;
    
    -- Add script column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'script'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN script TEXT;
    END IF;
    
    -- Add responses column (JSONB) if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'responses'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN responses JSONB DEFAULT '{}'::jsonb;
    END IF;
    
    -- Add insights column (JSONB array) if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'insights'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN insights JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'status'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed'));
    END IF;
    
    -- Add sentiment column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'sentiment'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'neutral', 'negative'));
    END IF;
    
    -- Add date column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'interviews' AND column_name = 'date'
    ) THEN
        ALTER TABLE public.interviews 
        ADD COLUMN date TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_stage ON public.projects(stage);
CREATE INDEX IF NOT EXISTS idx_hypotheses_project_id ON public.hypotheses(project_id);
CREATE INDEX IF NOT EXISTS idx_hypotheses_user_id ON public.hypotheses(user_id);
CREATE INDEX IF NOT EXISTS idx_experiments_hypothesis_id ON public.experiments(hypothesis_id);
CREATE INDEX IF NOT EXISTS idx_experiments_user_id ON public.experiments(user_id);
CREATE INDEX IF NOT EXISTS idx_interviews_experiment_id ON public.interviews(experiment_id);
CREATE INDEX IF NOT EXISTS idx_interviews_user_id ON public.interviews(user_id);

-- 11. Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hypotheses_updated_at ON public.hypotheses;
CREATE TRIGGER update_hypotheses_updated_at
    BEFORE UPDATE ON public.hypotheses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_experiments_updated_at ON public.experiments;
CREATE TRIGGER update_experiments_updated_at
    BEFORE UPDATE ON public.experiments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_interviews_updated_at ON public.interviews;
CREATE TRIGGER update_interviews_updated_at
    BEFORE UPDATE ON public.interviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12.1. Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hypotheses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

-- 13. Create RLS policies for PROJECTS
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

-- 14. Create RLS policies for HYPOTHESES
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

-- 15. Create RLS policies for EXPERIMENTS
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

-- 16. Create RLS policies for INTERVIEWS
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

