-- SQL Script to set up Organizational Settings tables
-- Run this in your Supabase SQL Editor

-- 1. Company Settings
CREATE TABLE IF NOT EXISTS company_settings (
    id UUID PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000000'::uuid,
    name TEXT,
    owner_name TEXT,
    email TEXT,
    phone TEXT,
    industry TEXT,
    team_size TEXT,
    address TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    postal_code TEXT,
    tax_id TEXT,
    timezone TEXT,
    currency TEXT,
    website TEXT,
    logo_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = '00000000-0000-0000-0000-000000000000'::uuid)
);

-- 2. Departments
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    head TEXT,
    budget TEXT,
    members_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Locations
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    type TEXT DEFAULT 'Office',
    employees_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Employee Types
CREATE TABLE IF NOT EXISTS employee_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL,
    color TEXT DEFAULT 'bg-blue-500/10 text-blue-600',
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Holidays
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Row Level Security) - Permissive for development
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow everything for now to avoid auth issues)
CREATE POLICY "Allow all on company_settings" ON company_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on locations" ON locations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on employee_types" ON employee_types FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on holidays" ON holidays FOR ALL USING (true) WITH CHECK (true);

-- Insert initial empty row for company_settings if not exists
INSERT INTO company_settings (id, name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'Your Company')
ON CONFLICT (id) DO NOTHING;
