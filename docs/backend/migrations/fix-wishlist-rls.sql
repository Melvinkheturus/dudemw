-- ================================================
-- FIX WISHLIST RLS PERMISSION ISSUE
-- ================================================
-- This fixes the "permission denied for table users" error
-- when anonymous users try to access wishlist items
-- ================================================

-- Update the is_admin_user function with proper error handling
-- Using CREATE OR REPLACE to avoid breaking existing policy dependencies
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

-- Update the is_owner_user function with proper error handling
-- Using CREATE OR REPLACE to avoid breaking existing policy dependencies
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
-- Verify the functions have SECURITY DEFINER set correctly
SELECT 
    'Functions updated successfully!' as status,
    'Both is_admin_user() and is_owner_user() now have proper SECURITY DEFINER and search_path' as details;

-- Check the security settings
SELECT 
    proname as function_name, 
    prosecdef as is_security_definer,
    proconfig as function_settings
FROM pg_proc 
WHERE proname IN ('is_admin_user', 'is_owner_user')
ORDER BY proname;
