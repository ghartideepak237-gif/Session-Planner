-- CONSOLIDATED FOLDER SYSTEM REPAIR
-- Run this in your Supabase SQL Editor to fix "Add to Folder"

-- 1. Create folders table if missing
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- 2. Add required columns to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES folders(id) ON DELETE SET NULL;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS folder_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS interaction_types JSONB DEFAULT '[]'::jsonb;

-- 3. Data Migration: Sync legacy folder_id to new folder_ids array
UPDATE activities 
SET folder_ids = jsonb_build_array(folder_id)
WHERE folder_id IS NOT NULL AND (folder_ids IS NULL OR jsonb_array_length(folder_ids) = 0);

-- 4. Ensure RLS is disabled for public prototyping (if that's your project state)
ALTER TABLE folders DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;

-- 5. Add index for performance
CREATE INDEX IF NOT EXISTS idx_activities_folder_ids ON activities USING GIN (folder_ids);
