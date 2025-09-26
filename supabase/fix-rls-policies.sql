-- Fix RLS policies to allow access to sample data
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Users can view roadmap items for their roadmaps" ON roadmap_items;
DROP POLICY IF EXISTS "Users can view expenses for their roadmaps" ON expenses;

-- Create updated policies that allow access to sample data
CREATE POLICY "Users can view their own roadmaps and sample" ON roadmaps
    FOR SELECT USING (auth.uid() = user_id OR id = '550e8400-e29b-41d4-a716-446655440000');

CREATE POLICY "Users can view roadmap items for their roadmaps" ON roadmap_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

CREATE POLICY "Users can view expenses for their roadmaps" ON expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('roadmaps', 'roadmap_items', 'expenses')
ORDER BY tablename, policyname;
