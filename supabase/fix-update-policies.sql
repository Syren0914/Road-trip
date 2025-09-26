-- Fix RLS policies to allow updates for demo user
-- Run this in your Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update roadmap items for their roadmaps" ON roadmap_items;
DROP POLICY IF EXISTS "Users can insert roadmap items for their roadmaps" ON roadmap_items;
DROP POLICY IF EXISTS "Users can delete roadmap items for their roadmaps" ON roadmap_items;

-- Create updated policies that allow full access to demo user
CREATE POLICY "Users can update roadmap items for their roadmaps" ON roadmap_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

CREATE POLICY "Users can insert roadmap items for their roadmaps" ON roadmap_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

CREATE POLICY "Users can delete roadmap items for their roadmaps" ON roadmap_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

-- Also fix expenses policies
DROP POLICY IF EXISTS "Users can update expenses for their roadmaps" ON expenses;
DROP POLICY IF EXISTS "Users can insert expenses for their roadmaps" ON expenses;
DROP POLICY IF EXISTS "Users can delete expenses for their roadmaps" ON expenses;

CREATE POLICY "Users can update expenses for their roadmaps" ON expenses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

CREATE POLICY "Users can insert expenses for their roadmaps" ON expenses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

CREATE POLICY "Users can delete expenses for their roadmaps" ON expenses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND (roadmaps.user_id = auth.uid() OR roadmaps.id = '550e8400-e29b-41d4-a716-446655440000')
        )
    );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('roadmap_items', 'expenses')
ORDER BY tablename, policyname;
