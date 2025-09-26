-- Insert sample expenses for the travel roadmap
-- Run this in your Supabase SQL Editor

-- Insert sample expenses for the demo roadmap
INSERT INTO expenses (roadmap_id, title, amount, category, date, completed) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Gas Station Snacks', 15.50, 'food', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Toll Road Fees', 8.75, 'misc', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Parking at VT Campus', 5.00, 'misc', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Coffee Break', 12.30, 'food', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Emergency Tire Repair', 45.00, 'emergency', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Hotel WiFi Upgrade', 10.00, 'hotel', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Road Trip Souvenirs', 25.00, 'misc', '2024-01-15', true),
('550e8400-e29b-41d4-a716-446655440000', 'Extra Gas Fill-up', 35.20, 'fuel', '2024-01-15', true)
ON CONFLICT DO NOTHING;

-- Verify the expenses were inserted
SELECT 'Expenses inserted:' as status, count(*) as count FROM expenses WHERE roadmap_id = '550e8400-e29b-41d4-a716-446655440000';

-- Show the inserted expenses
SELECT title, amount, category, date, completed 
FROM expenses 
WHERE roadmap_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY date DESC, created_at DESC;
