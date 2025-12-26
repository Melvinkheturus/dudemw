-- ================================================
-- Add Missing Columns to store_settings Table
-- ================================================
-- This migration ensures the store_settings table has all required columns
-- including address fields and description that may be missing

-- Add address column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'address'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN address TEXT;
  END IF;
END $$;

-- Add city column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'city'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN city TEXT;
  END IF;
END $$;

-- Add state column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'state'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN state TEXT;
  END IF;
END $$;

-- Add postal_code column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'postal_code'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN postal_code TEXT;
  END IF;
END $$;

-- Add country column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'country'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN country TEXT NOT NULL DEFAULT 'India';
  END IF;
END $$;

-- Add description column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'store_settings' AND column_name = 'description'
  ) THEN
    ALTER TABLE store_settings ADD COLUMN description TEXT;
  END IF;
END $$;

-- Ensure invoice_prefix is NOT NULL with default
DO $$ 
BEGIN
  ALTER TABLE store_settings 
    ALTER COLUMN invoice_prefix SET DEFAULT 'DMW',
    ALTER COLUMN invoice_prefix SET NOT NULL;
EXCEPTION
  WHEN others THEN
    -- Column may already have constraints, update default value
    ALTER TABLE store_settings 
      ALTER COLUMN invoice_prefix SET DEFAULT 'DMW';
    
    -- Update any null values
    UPDATE store_settings SET invoice_prefix = 'DMW' WHERE invoice_prefix IS NULL;
    
    -- Set NOT NULL
    ALTER TABLE store_settings 
      ALTER COLUMN invoice_prefix SET NOT NULL;
END $$;

-- Refresh Supabase schema cache
-- Run this in Supabase SQL Editor after migration:
-- NOTIFY pgrst, 'reload schema';

COMMENT ON TABLE store_settings IS 'Store identity and basic configuration with address fields';
