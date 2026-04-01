-- FULL SCHEMA SETUP FOR SUPABASE
-- Run this in your Supabase SQL Editor (SQL Tools > New Query)

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    college TEXT,
    duration INTEGER, -- Number of weeks
    "totalSessions" INTEGER,
    objective TEXT,
    weeks JSONB, -- Array of week themes/focus
    date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sessions Table (Session Plans)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "programId" UUID REFERENCES programs(id) ON DELETE CASCADE,
    "programWeek" INTEGER,
    "programTheme" TEXT,
    "programFocus" TEXT,
    college TEXT,
    "sessionNumber" TEXT,
    "targetGroup" TEXT,
    objective TEXT,
    "baseDuration" INTEGER,
    "selectedGames" JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    date TIMESTAMPTZ DEFAULT NOW(),
    "createdAt" BIGINT,
    "totalActualDuration" INTEGER DEFAULT 0,
    "targetActualDuration" INTEGER DEFAULT 0,
    reflection JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Activities Table (The Repository)
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    theme TEXT,
    difficulty NUMERIC,
    duration TEXT,
    rules TEXT,
    comments TEXT,
    theme_clean TEXT,
    cat_clean TEXT,
    tier TEXT,
    "baseDurationNum" INTEGER,
    "energyType" TEXT,
    "engagementType" TEXT,
    notes TEXT,
    context TEXT,
    objective TEXT,
    favorite BOOLEAN DEFAULT FALSE,
    instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for testing/migration session
ALTER TABLE programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
