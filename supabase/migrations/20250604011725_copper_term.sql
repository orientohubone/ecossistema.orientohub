/*
  # Solutions Management Schema

  1. New Tables
    - `solutions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `logo_url` (text)
      - `solution_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on solutions table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  logo_url text,
  solution_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own solutions
CREATE POLICY "Users can read own solutions"
  ON solutions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own solutions
CREATE POLICY "Users can insert own solutions"
  ON solutions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own solutions
CREATE POLICY "Users can update own solutions"
  ON solutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own solutions
CREATE POLICY "Users can delete own solutions"
  ON solutions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);