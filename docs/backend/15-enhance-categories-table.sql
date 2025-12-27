-- ================================================
-- ENHANCE CATEGORIES TABLE
-- Add new fields for homepage thumbnails, videos, PLP square thumbnails, and banner management
-- ================================================

-- Add new columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS homepage_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS homepage_video_url TEXT,
ADD COLUMN IF NOT EXISTS plp_square_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS selected_banner_id UUID REFERENCES banners(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_categories_status ON categories(status);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Update existing categories to have default status if null
UPDATE categories SET status = 'active' WHERE status IS NULL;

-- Add comment to table
COMMENT ON TABLE categories IS 'Product categories with enhanced media support for homepage and PLP display';
COMMENT ON COLUMN categories.homepage_thumbnail_url IS 'Thumbnail image URL for homepage category display';
COMMENT ON COLUMN categories.homepage_video_url IS 'Optional video URL for homepage category display';
COMMENT ON COLUMN categories.plp_square_thumbnail_url IS 'Square thumbnail URL for product listing page display';
COMMENT ON COLUMN categories.selected_banner_id IS 'Reference to banner used for this category';
COMMENT ON COLUMN categories.meta_title IS 'SEO meta title for category page';
COMMENT ON COLUMN categories.meta_description IS 'SEO meta description for category page';
COMMENT ON COLUMN categories.status IS 'Category status: active or inactive';
COMMENT ON COLUMN categories.display_order IS 'Order for displaying categories (lower numbers first)';