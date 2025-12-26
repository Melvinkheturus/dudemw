-- Migration: Update Banners Table Schema
-- This migration updates the banners table to match the latest application schema
-- Run this to fix homepage hero carousel display issues

-- Drop the old banners table (backup data first if needed!)
DROP TABLE IF EXISTS banners CASCADE;

-- Create the new banners table with correct schema
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    internal_title TEXT NOT NULL,
    image_url TEXT,
    link_url TEXT,
    cta_text TEXT,
    
    -- Action/Navigation
    action_type TEXT CHECK (action_type IN ('collection', 'category', 'product', 'external')),
    action_target TEXT,
    action_name TEXT,
    
    -- Placement & Organization
    category TEXT,
    placement TEXT NOT NULL CHECK (placement IN ('homepage-carousel', 'product-listing-carousel', 'category-banner', 'top-marquee-banner')),
    position INTEGER,
    
    -- Status & Scheduling
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'expired', 'disabled')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Analytics
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    ctr NUMERIC(5, 2) DEFAULT 0,
    
    -- Complex Banner Data (JSON)
    carousel_data JSONB,
    marquee_data JSONB,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_banners_placement ON banners(placement);
CREATE INDEX idx_banners_status ON banners(status);
CREATE INDEX idx_banners_position ON banners(position);
CREATE INDEX idx_banners_category ON banners(category);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Successfully updated banners table schema!';
    RAISE NOTICE 'You can now add banner data via the Admin Panel or directly via SQL.';
END $$;
