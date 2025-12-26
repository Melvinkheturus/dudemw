-- ================================================
-- SETUP STORAGE BUCKET FOR BANNERS
-- ================================================
-- This script creates the banners storage bucket with proper RLS policies
-- Execute this in Supabase SQL Editor
-- ================================================

-- ================================================
-- STEP 1: DROP EXISTING BUCKET (Clean Setup)
-- ================================================

-- Drop the existing bucket if it exists (optional - remove if you have existing banners)
DELETE FROM storage.buckets WHERE id = 'banners';

-- ================================================
-- STEP 2: CREATE NEW BUCKET
-- ================================================

-- Create the banners bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'banners',
  'banners',
  true,  -- Public bucket (files are publicly accessible via URL)
  10485760,  -- 10MB file size limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']  -- Allowed image types
)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- STEP 3: CREATE STORAGE RLS POLICIES
-- ================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view banners" ON storage.objects;

-- Policy 1: Allow authenticated admin users to upload (INSERT)
CREATE POLICY "Admins can upload banners"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'banners' 
  AND (
    -- Check if user is admin
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
    )
  )
);

-- Policy 2: Allow authenticated admin users to update
CREATE POLICY "Admins can update banners"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'banners'
  AND (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
    )
  )
);

-- Policy 3: Allow authenticated admin users to delete
CREATE POLICY "Admins can delete banners"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'banners'
  AND (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
    )
  )
);

-- Policy 4: Allow everyone to view/read banners (Public access)
CREATE POLICY "Anyone can view banners"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'banners');

-- ================================================
-- STEP 4: VERIFICATION
-- ================================================

-- Check if bucket was created successfully
DO $$ 
DECLARE
    bucket_exists BOOLEAN;
    policy_count INTEGER;
BEGIN
    -- Check bucket
    SELECT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'banners'
    ) INTO bucket_exists;
    
    -- Count policies for this bucket
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'storage'
    AND tablename = 'objects'
    AND policyname LIKE '%banners%';
    
    -- Display results
    IF bucket_exists THEN
        RAISE NOTICE '✅ Bucket "banners" created successfully!';
    ELSE
        RAISE NOTICE '❌ Bucket creation failed!';
    END IF;
    
    RAISE NOTICE '✅ Created % storage policies for banners', policy_count;
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'BANNERS STORAGE SETUP COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Bucket Configuration:';
    RAISE NOTICE '  - Name: banners';
    RAISE NOTICE '  - Public: Yes (files are publicly accessible)';
    RAISE NOTICE '  - Max File Size: 10MB';
    RAISE NOTICE '  - Allowed Types: JPEG, PNG, WebP';
    RAISE NOTICE '';
    RAISE NOTICE 'Permissions:';
    RAISE NOTICE '  - Admins: Can upload, update, delete';
    RAISE NOTICE '  - Public: Can view/download';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '  1. Verify your user has admin role';
    RAISE NOTICE '  2. Try uploading a banner image';
    RAISE NOTICE '  3. Check /admin/banners page';
    RAISE NOTICE '';
END $$;

-- ================================================
-- STEP 5: VERIFY YOUR USER ROLE
-- ================================================

-- Check your current user role
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as user_role,
    created_at
FROM auth.users
WHERE id = auth.uid();

-- ================================================
-- TROUBLESHOOTING
-- ================================================

-- If your role is NULL or not 'admin'/'owner', update it:
-- Uncomment and run the query below, replacing with your email

-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-email@example.com';

-- ================================================
-- ADDITIONAL BUCKETS (OPTIONAL)
-- ================================================

-- If you want to create all storage buckets at once, uncomment below:

/*
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('products', 'products', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('categories', 'categories', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('collections', 'collections', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Create policies for all buckets
CREATE POLICY "Public read for all buckets" ON storage.objects FOR SELECT TO public
USING (bucket_id IN ('products', 'categories', 'collections', 'avatars'));

CREATE POLICY "Admin upload for all buckets" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('products', 'categories', 'collections', 'avatars')
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

CREATE POLICY "Admin update for all buckets" ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('products', 'categories', 'collections', 'avatars')
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

CREATE POLICY "Admin delete for all buckets" ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('products', 'categories', 'collections', 'avatars')
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);
*/
