-- Create custom types
CREATE TYPE roadmap_category AS ENUM ('pickup', 'stop', 'fuel', 'food', 'hotel', 'visit');
CREATE TYPE expense_category AS ENUM ('fuel', 'food', 'hotel', 'misc', 'emergency');

-- Create roadmaps table
CREATE TABLE IF NOT EXISTS roadmaps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    budget DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roadmap_items table
CREATE TABLE IF NOT EXISTS roadmap_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    hours TEXT,
    completed BOOLEAN DEFAULT FALSE,
    category roadmap_category NOT NULL,
    cost DECIMAL(10,2) DEFAULT 0,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category expense_category NOT NULL,
    date DATE NOT NULL,
    completed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_items_order ON roadmap_items(roadmap_id, order_index);
CREATE INDEX IF NOT EXISTS idx_expenses_roadmap_id ON expenses(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Enable Row Level Security
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for roadmaps
CREATE POLICY "Users can view their own roadmaps" ON roadmaps
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps" ON roadmaps
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmaps" ON roadmaps
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" ON roadmaps
    FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for roadmap_items
CREATE POLICY "Users can view roadmap items for their roadmaps" ON roadmap_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert roadmap items for their roadmaps" ON roadmap_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update roadmap items for their roadmaps" ON roadmap_items
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete roadmap items for their roadmaps" ON roadmap_items
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = roadmap_items.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

-- Create RLS policies for expenses
CREATE POLICY "Users can view expenses for their roadmaps" ON expenses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert expenses for their roadmaps" ON expenses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update expenses for their roadmaps" ON expenses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete expenses for their roadmaps" ON expenses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM roadmaps 
            WHERE roadmaps.id = expenses.roadmap_id 
            AND roadmaps.user_id = auth.uid()
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roadmap_items_updated_at BEFORE UPDATE ON roadmap_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - for development)
INSERT INTO roadmaps (id, user_id, title, description, budget) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '00000000-0000-0000-0000-000000000000', 'Travel Roadmap', 'Your journey from Sterling, VA to Blacksburg, VA', 500.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO roadmap_items (roadmap_id, title, address, description, hours, completed, category, cost, order_index) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Air up tires', '21398 Price Cascades Plz, Sterling, VA 20164', 'Costco Sterling gas area - Gas opens 6:00 AM daily (air is by the pumps)', '6:00 AM daily', false, 'stop', 0, 1),
('550e8400-e29b-41d4-a716-446655440000', 'Pick up Diego', '44060 Gala Cir, Ashburn, VA 20147', 'Costco Sterling → Diego ~15 min in normal morning traffic', null, false, 'pickup', 0, 2),
('550e8400-e29b-41d4-a716-446655440000', 'Pick up Esteban', '12666 Willow Spring Ct, Herndon, VA 20170', 'From Diego → Esteban ~13 min per your note; typical Ashburn↔Herndon drive is ~9 miles/15–20 min', null, false, 'pickup', 0, 3),
('550e8400-e29b-41d4-a716-446655440000', 'Breakfast at Panera Bread', '460 Elden St, Herndon, VA 20170', 'Panera Bread (Herndon)', '6:00 AM–9:00 PM', false, 'food', 25, 4),
('550e8400-e29b-41d4-a716-446655440000', 'Fuel & snack stop', '1830 Reservoir St, Harrisonburg, VA 22801', 'Costco Harrisonburg - Gas hours 6:00 AM–10:00 PM (Mon–Fri); warehouse typically 10:00 AM open on weekdays', 'Gas: 6:00 AM–10:00 PM (Mon–Fri)', false, 'fuel', 60, 5),
('550e8400-e29b-41d4-a716-446655440000', 'Hotel Check-in', '2430 Roanoke St, Christiansburg, VA 24073', 'Econo Lodge Christiansburg–Blacksburg I-81 - Check-in 3:00 PM, check-out 11:00 AM', 'Check-in: 3:00 PM', false, 'hotel', 120, 6),
('550e8400-e29b-41d4-a716-446655440000', 'VT Campus Visit (Optional)', '800 Drillfield Dr, Blacksburg, VA 24061', 'Main campus hub near Burruss Hall (≈10–15 min from the hotel)', null, false, 'visit', 0, 7)
ON CONFLICT DO NOTHING;
