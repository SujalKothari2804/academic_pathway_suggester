-- =============================================================
-- Academic Pathway Recommendation Engine — Supabase SQL Schema
-- Run this in your Supabase SQL Editor
-- =============================================================

-- Create the submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  qualification TEXT NOT NULL,
  years_experience INTEGER NOT NULL CHECK (years_experience >= 0 AND years_experience <= 60),
  profession TEXT NOT NULL,
  career_goal TEXT NOT NULL,
  interested_research BOOLEAN NOT NULL DEFAULT FALSE,
  recommendation TEXT NOT NULL CHECK (
    recommendation IN ('Certification Program', 'DBA', 'PhD', 'Honorary Doctorate')
  ),
  ai_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_recommendation ON submissions (recommendation);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions (email);

-- Enable Row Level Security
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow INSERT from anyone (public form submissions)
CREATE POLICY "Allow public inserts" ON submissions
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow SELECT only with service role key (admin dashboard)
-- The admin API route uses supabaseAdmin() which bypasses RLS with service role key
-- No public SELECT policy needed — admin reads are server-side only

-- Optional: If you want to allow reads from authenticated users too:
-- CREATE POLICY "Allow authenticated reads" ON submissions
--   FOR SELECT
--   TO authenticated
--   USING (true);

-- Grant usage on the table to anon role (needed for INSERT)
GRANT INSERT ON submissions TO anon;
GRANT SELECT ON submissions TO service_role;
