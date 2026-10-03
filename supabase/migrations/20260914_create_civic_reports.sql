-- Migration: 20260914_create_civic_reports.sql
-- Table: civic_reports
-- Description: Civic complaint reports with Supabase Auth user_id linkage, AI vision descriptions, and RLS.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.civic_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    mobile_number TEXT NOT NULL,
    image_url TEXT,
    ai_description TEXT,
    user_description TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address TEXT,
    department TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted' CHECK (status IN (
        'Submitted',
        'Assigned',
        'In Progress',
        'Work Completed',
        'Awaiting User Confirmation',
        'Resolved'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_civic_reports_user_id ON public.civic_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_civic_reports_status ON public.civic_reports(status);
CREATE INDEX IF NOT EXISTS idx_civic_reports_created_at ON public.civic_reports(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.civic_reports ENABLE ROW LEVEL SECURITY;

-- Policy 1: Authenticated users can insert their own reports
DROP POLICY IF EXISTS "Users can insert their own reports" ON public.civic_reports;
CREATE POLICY "Users can insert their own reports"
ON public.civic_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy 2: Users can only read their own reports
DROP POLICY IF EXISTS "Users can view their own reports" ON public.civic_reports;
CREATE POLICY "Users can view their own reports"
ON public.civic_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy 3: Users can update their own reports (e.g., Awaiting User Confirmation -> Resolved)
DROP POLICY IF EXISTS "Users can update their own reports" ON public.civic_reports;
CREATE POLICY "Users can update their own reports"
ON public.civic_reports
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Municipal back-office service role full access
-- Supabase service_role key automatically bypasses RLS
