-- Migration: Fix Banner Action Type Constraint
-- The current constraint "banners_action_type_check" is too strict and fails when action_type is NULL or empty
-- This migration updates the constraint to allow NULL values

ALTER TABLE banners DROP CONSTRAINT IF EXISTS banners_action_type_check;

ALTER TABLE banners ADD CONSTRAINT banners_action_type_check 
CHECK (
  action_type IS NULL OR 
  action_type = '' OR 
  action_type IN ('collection', 'category', 'product', 'external')
);

-- Also fix placement check just in case
ALTER TABLE banners DROP CONSTRAINT IF EXISTS banners_placement_check;

ALTER TABLE banners ADD CONSTRAINT banners_placement_check
CHECK (
  placement IN ('homepage-carousel', 'product-listing-carousel', 'category-banner', 'top-marquee-banner')
);

DO $$ 
BEGIN
    RAISE NOTICE 'Successfully updated banner constraints!';
END $$;
