-- PHASE 14: REPOSITORY UX UPGRADE MIGRATION
-- Run this in your Supabase SQL Editor

-- 1. Add folder_ids array to activities
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS folder_ids JSONB DEFAULT '[]'::jsonb;

-- 2. Add interaction_types array to activities
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS interaction_types JSONB DEFAULT '[]'::jsonb;

-- 3. Data Migration: Move existing single folder_id to folder_ids array
UPDATE activities 
SET folder_ids = jsonb_build_array(folder_id)
WHERE folder_id IS NOT NULL AND (folder_ids IS NULL OR jsonb_array_length(folder_ids) = 0);

-- 4. Initial tagging for existing interaction types if any
-- (Optional, based on engagementType existing data)
UPDATE activities 
SET interaction_types = jsonb_build_array("engagementType")
WHERE "engagementType" IS NOT NULL AND (interaction_types IS NULL OR jsonb_array_length(interaction_types) = 0);
