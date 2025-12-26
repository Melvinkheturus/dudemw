-- ================================================
-- FIX CATEGORIES TABLE - ADD MISSING COLUMNS
-- ================================================
-- This migration adds missing columns to the categories table
-- that are required by the application code
-- ================================================

-- Add status column (active/inactive)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'));

-- Add image_url column (replaces 'image' column)
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add icon_url column for category icons
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS icon_url TEXT;

-- Add SEO meta fields
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS meta_title TEXT;

ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Add display_order for sorting
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Migrate data from 'image' to 'image_url' if the old column exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'categories' AND column_name = 'image'
    ) THEN
        UPDATE categories SET image_url = image WHERE image IS NOT NULL AND image_url IS NULL;
    END IF;
END $$;

-- Update all existing categories to have active status if NULL
UPDATE categories SET status = 'active' WHERE status IS NULL;

-- Create index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);

-- Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Create index on parent_id for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Add comment to document the status column
COMMENT ON COLUMN categories.status IS 'Category visibility status: active or inactive';
COMMENT ON COLUMN categories.display_order IS 'Order for displaying categories (lower numbers first)';
COMMENT ON COLUMN categories.meta_title IS 'SEO meta title for category page';
COMMENT ON COLUMN categories.meta_description IS 'SEO meta description for category page';
