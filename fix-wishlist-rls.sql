-- ================================================
-- FIX WISHLIST RLS PERMISSION ISSUE
-- ================================================
-- This fixes the "permission denied for table users" error
-- when anonymous users try to access wishlist items
-- ================================================

-- Drop and recreate the is_admin_user function with proper error handling
DROP FUNCTION IF EXISTS is_admin_user();

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Safely get user role from auth.users metadata
    -- Using SECURITY DEFINER allows this function to read auth.users
    BEGIN
        SELECT raw_user_meta_data->>'role' INTO user_role
        FROM auth.users
        WHERE id = auth.uid();
    EXCEPTION
        WHEN insufficient_privilege THEN
            RETURN FALSE;
        WHEN OTHERS THEN
            RETURN FALSE;
    END;
    
    -- Return true if user is admin or owner
    RETURN COALESCE(user_role IN ('admin', 'owner'), FALSE);
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth;

COMMENT ON FUNCTION is_admin_user() IS 
'Returns true if the current user has admin or owner role. Used in RLS policies to grant admin access. SECURITY DEFINER allows reading auth.users.';

-- Drop and recreate the is_owner_user function with proper error handling
DROP FUNCTION IF EXISTS is_owner_user();

CREATE OR REPLACE FUNCTION is_owner_user()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Safely get user role from auth.users metadata
    BEGIN
        SELECT raw_user_meta_data->>'role' INTO user_role
        FROM auth.users
        WHERE id = auth.uid();
    EXCEPTION
        WHEN insufficient_privilege THEN
            RETURN FALSE;
        WHEN OTHERS THEN
            RETURN FALSE;
    END;
    
    -- Return true only if user is owner (highest privilege)
    RETURN COALESCE(user_role = 'owner', FALSE);
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, auth;

COMMENT ON FUNCTION is_owner_user() IS 
'Returns true if the current user has owner role (highest privilege). Used for sensitive operations. SECURITY DEFINER allows reading auth.users.';

-- ================================================
-- VERIFICATION
-- ================================================
SELECT 'Functions updated successfully!' as status;
SELECT 'is_admin_user()' as function_name, prosecdef as is_security_definer 
FROM pg_proc 
WHERE proname = 'is_admin_user';
