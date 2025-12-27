-- ================================================
-- ENHANCE BANNERS TABLE FOR ADVANCED FEATURES
-- ================================================
-- This migration adds fields for:
-- - Scheduling (start_date, end_date)
-- - Analytics (clicks, impressions, ctr)
-- - Action targets (collection, category, product, external)
-- - Enhanced placement and positioning
-- Execute this after initial table creation
-- ================================================

-- Drop existing banners table if you want to recreate
-- DROP TABLE IF EXISTS banners CASCADE;

-- Alter existing banners table to add new columns
ALTER TABLE banners 
  -- Rename title to internal_title for clarity
  RENAME COLUMN title TO internal_title;

-- Add new columns for enhanced functionality
ALTER TABLE banners
  ADD COLUMN IF NOT EXISTS action_type TEXT CHECK (action_type IN ('collection', 'category', 'product', 'external')),
  ADD COLUMN IF NOT EXISTS action_target TEXT, -- ID or URL of the target
  ADD COLUMN IF NOT EXISTS action_name TEXT, -- Display name of the target
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS position INTEGER,
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS cta_text TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'expired', 'disabled')),
  ADD COLUMN IF NOT EXISTS clicks INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS impressions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ctr NUMERIC(5, 2) DEFAULT 0;

-- Update placement column to use new types
ALTER TABLE banners
  DROP CONSTRAINT IF EXISTS banners_placement_check;

ALTER TABLE banners
  ADD CONSTRAINT banners_placement_check 
  CHECK (placement IN ('homepage-carousel', 'product-listing-carousel', 'category-banner', 'top-marquee-banner'));

-- Remove is_active column (replaced by status)
ALTER TABLE banners DROP COLUMN IF EXISTS is_active;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_banners_placement ON banners(placement);
CREATE INDEX IF NOT EXISTS idx_banners_status ON banners(status);
CREATE INDEX IF NOT EXISTS idx_banners_category ON banners(category);
CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(position);
CREATE INDEX IF NOT EXISTS idx_banners_start_date ON banners(start_date);
CREATE INDEX IF NOT EXISTS idx_banners_end_date ON banners(end_date);

-- ================================================
-- CREATE FUNCTIONS FOR ANALYTICS TRACKING
-- ================================================

-- Function to increment banner impressions
CREATE OR REPLACE FUNCTION increment_banner_impressions(banner_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE banners
  SET 
    impressions = impressions + 1,
    ctr = CASE 
      WHEN (impressions + 1) > 0 THEN (clicks::NUMERIC / (impressions + 1)) * 100
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment banner clicks
CREATE OR REPLACE FUNCTION increment_banner_clicks(banner_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE banners
  SET 
    clicks = clicks + 1,
    ctr = CASE 
      WHEN impressions > 0 THEN ((clicks + 1)::NUMERIC / impressions) * 100
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = banner_id;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- CREATE BANNER ANALYTICS TABLE (OPTIONAL)
-- ================================================
-- For detailed analytics tracking over time

CREATE TABLE IF NOT EXISTS banner_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  banner_id UUID NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(banner_id, date)
);

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_banner_analytics_banner_id ON banner_analytics(banner_id);
CREATE INDEX IF NOT EXISTS idx_banner_analytics_date ON banner_analytics(date);

-- ================================================
-- STORAGE BUCKET FOR BANNER IMAGES
-- ================================================
-- Create storage bucket for banner images if it doesn't exist
-- Note: This should be run in Supabase dashboard or using Supabase client

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('banners', 'banners', true)
-- ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for banner images
-- CREATE POLICY "Banner images are publicly accessible"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'banners');

-- CREATE POLICY "Authenticated users can upload banner images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- CREATE POLICY "Authenticated users can delete banner images"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'banners' AND auth.role() = 'authenticated');

-- ================================================
-- SUCCESS MESSAGE
-- ================================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Successfully enhanced banners table!';
  RAISE NOTICE '📊 Added: scheduling, analytics, action targets';
  RAISE NOTICE '🔧 Created: tracking functions and indexes';
  RAISE NOTICE '📝 Next: Run banner creation through BannerService';
END $$;
