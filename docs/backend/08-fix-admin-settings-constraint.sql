-- ================================================
-- FIX: Admin Settings Single Row Constraint
-- ================================================
-- This migration fixes the incorrect CHECK constraint
-- and implements proper single-row enforcement
-- ================================================

-- Step 1: Drop the broken constraint
ALTER TABLE admin_settings 
DROP CONSTRAINT IF EXISTS single_row_only;

-- Step 2: Add singleton_guard column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admin_settings' 
        AND column_name = 'singleton_guard'
    ) THEN
        ALTER TABLE admin_settings 
        ADD COLUMN singleton_guard BOOLEAN DEFAULT TRUE NOT NULL;
    END IF;
END $$;

-- Step 3: Ensure existing row has singleton_guard = TRUE
UPDATE admin_settings 
SET singleton_guard = TRUE 
WHERE singleton_guard IS NULL OR singleton_guard = FALSE;

-- Step 4: Add the proper UNIQUE constraint
ALTER TABLE admin_settings 
ADD CONSTRAINT single_row_only UNIQUE (singleton_guard);

-- Step 5: Verify the fix
DO $$ 
DECLARE
    row_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO row_count FROM admin_settings;
    
    IF row_count = 0 THEN
        -- Insert initial row if table is empty
        INSERT INTO admin_settings (setup_completed, recovery_key_hash, singleton_guard)
        VALUES (FALSE, NULL, TRUE);
        RAISE NOTICE '✅ Initial admin_settings row created';
    ELSIF row_count = 1 THEN
        RAISE NOTICE '✅ Single row constraint verified - 1 row exists';
    ELSE
        RAISE WARNING '⚠️  Multiple rows detected! Manual cleanup required.';
        RAISE NOTICE 'Current row count: %', row_count;
    END IF;
END $$;

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Admin Settings Constraint Fixed!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Changes applied:';
    RAISE NOTICE '  • Removed broken CHECK constraint';
    RAISE NOTICE '  • Added singleton_guard column';
    RAISE NOTICE '  • Applied UNIQUE constraint';
    RAISE NOTICE '';
    RAISE NOTICE 'The admin_settings table now properly';
    RAISE NOTICE 'enforces a single-row constraint.';
    RAISE NOTICE '========================================';
END $$;
