/*
  # Create solutions table

  1. New Tables
    - `solutions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, required)
      - `logo_url` (text, optional)
      - `solution_url` (text, required)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `solutions` table
    - Add policies for authenticated users to manage their own solutions
    - Users can only read, insert, update, and delete their own solutions

  3. Changes
    - Creates the main solutions table for storing user solutions
    - Adds foreign key constraint to auth.users
    - Sets up comprehensive RLS policies for data security
*/

-- Create the solutions table
CREATE TABLE IF NOT EXISTS public.solutions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    name text NOT NULL,
    logo_url text,
    solution_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add foreign key constraint to auth.users
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'solutions_user_id_fkey'
    ) THEN
        ALTER TABLE public.solutions
        ADD CONSTRAINT solutions_user_id_fkey
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Policy for SELECT: Users can read their own solutions
CREATE POLICY "Users can read own solutions"
    ON public.solutions
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy for INSERT: Users can insert their own solutions
CREATE POLICY "Users can insert own solutions"
    ON public.solutions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can update their own solutions
CREATE POLICY "Users can update own solutions"
    ON public.solutions
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Users can delete their own solutions
CREATE POLICY "Users can delete own solutions"
    ON public.solutions
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS solutions_user_id_idx ON public.solutions(user_id);
CREATE INDEX IF NOT EXISTS solutions_created_at_idx ON public.solutions(created_at DESC);