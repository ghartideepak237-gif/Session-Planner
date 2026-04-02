-- FULL SCHEMA UPDATE FOR USABILITY ENHANCEMENTS
-- Run this in your Supabase SQL Editor (SQL Tools > New Query)

-- 1. Create folders table
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Add folder_id to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;

-- 3. Disable RLS for testing/migration session (if not already disabled)
ALTER TABLE folders DISABLE ROW LEVEL SECURITY;
