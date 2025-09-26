-- Fix RLS policy to allow roadmap updates for demo user
-- Run this in your Supabase SQL Editor

-- Drop existing roadmap update policy
DROP POLICY IF EXISTS "Users can update their own roadmaps" ON roadmaps;

-- Create updated policy that allows updates for demo roadmap
CREATE POLICY "Users can update their own roadmaps and demo" ON roadmaps
    FOR UPDATE USING (auth.uid() = user_id OR id = '550e8400-e29b-41d4-a716-446655440000');

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'roadmaps' AND cmd = 'UPDATE';
