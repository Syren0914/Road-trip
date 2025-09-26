-- Insert sample data for the travel roadmap app
-- This will create the default roadmap that the app expects

-- First, insert the main roadmap
INSERT INTO roadmaps (id, user_id, title, description, budget) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '00000000-0000-0000-0000-000000000000', 'Travel Roadmap', 'Your journey from Sterling, VA to Blacksburg, VA', 500.00)
ON CONFLICT (id) DO NOTHING;

-- Then insert the roadmap items
INSERT INTO roadmap_items (roadmap_id, title, address, description, hours, completed, category, cost, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Air up tires', '21398 Price Cascades Plz, Sterling, VA 20164', 'Costco Sterling gas area - Gas opens 6:00 AM daily (air is by the pumps)', '6:00 AM daily', false, 'stop', 0, 1),
('550e8400-e29b-41d4-a716-446655440000', 'Pick up Diego', '44060 Gala Cir, Ashburn, VA 20147', 'Costco Sterling → Diego ~15 min in normal morning traffic', null, false, 'pickup', 0, 2),
('550e8400-e29b-41d4-a716-446655440000', 'Pick up Esteban', '12666 Willow Spring Ct, Herndon, VA 20170', 'From Diego → Esteban ~13 min per your note; typical Ashburn↔Herndon drive is ~9 miles/15–20 min', null, false, 'pickup', 0, 3),
('550e8400-e29b-41d4-a716-446655440000', 'Breakfast at Panera Bread', '460 Elden St, Herndon, VA 20170', 'Panera Bread (Herndon)', '6:00 AM–9:00 PM', false, 'food', 25, 4),
('550e8400-e29b-41d4-a716-446655440000', 'Fuel & snack stop', '1830 Reservoir St, Harrisonburg, VA 22801', 'Costco Harrisonburg - Gas hours 6:00 AM–10:00 PM (Mon–Fri); warehouse typically 10:00 AM open on weekdays', 'Gas: 6:00 AM–10:00 PM (Mon–Fri)', false, 'fuel', 60, 5),
('550e8400-e29b-41d4-a716-446655440000', 'Hotel Check-in', '2430 Roanoke St, Christiansburg, VA 24073', 'Econo Lodge Christiansburg–Blacksburg I-81 - Check-in 3:00 PM, check-out 11:00 AM', 'Check-in: 3:00 PM', false, 'hotel', 120, 6),
('550e8400-e29b-41d4-a716-446655440000', 'VT Campus Visit (Optional)', '800 Drillfield Dr, Blacksburg, VA 24061', 'Main campus hub near Burruss Hall (≈10–15 min from the hotel)', null, false, 'visit', 0, 7)
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT 'Roadmap inserted:' as status, count(*) as count FROM roadmaps WHERE id = '550e8400-e29b-41d4-a716-446655440000';
SELECT 'Roadmap items inserted:' as status, count(*) as count FROM roadmap_items WHERE roadmap_id = '550e8400-e29b-41d4-a716-446655440000';
