-- ================================================
-- SETUP ALL STORAGE BUCKETS - ONE SCRIPT
-- ================================================
-- This script creates ALL storage buckets needed for the admin dashboard
-- Execute this ONCE in Supabase SQL Editor to set up everything
-- ================================================

-- ================================================
-- STEP 1: CREATE ALL BUCKETS
-- ================================================

-- Note: product-images should already exist, but we'll ensure it
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  -- Product Images (10MB)
  ('product-images', 'product-images', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']),
  
  -- Banners (10MB)
  ('banners', 'banners', true, 10485760, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  
  -- Categories (5MB - smaller images)
  ('categories', 'categories', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']),
  
  -- Collections (5MB)
  ('collections', 'collections', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  
  -- Avatars (2MB - profile pictures)
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- STEP 2: DROP EXISTING POLICIES (CLEAN SLATE)
-- ================================================

-- Product Images Policies
DROP POLICY IF EXISTS "Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;

-- Banners Policies
DROP POLICY IF EXISTS "Admins can upload banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update banners" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete banners" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view banners" ON storage.objects;

-- Categories Policies
DROP POLICY IF EXISTS "Admins can upload categories" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update categories" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete categories" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view categories" ON storage.objects;

-- Collections Policies
DROP POLICY IF EXISTS "Admins can upload collections" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update collections" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete collections" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view collections" ON storage.objects;

-- Avatars Policies
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- ================================================
-- STEP 3: CREATE ADMIN UPLOAD POLICIES
-- ================================================
-- Policies for buckets where only admins can upload

-- Product Images - Admin Upload
CREATE POLICY "Admins can upload product images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Banners - Admin Upload
CREATE POLICY "Admins can upload banners"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'banners' 
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Categories - Admin Upload
CREATE POLICY "Admins can upload categories"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'categories' 
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Collections - Admin Upload
CREATE POLICY "Admins can upload collections"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'collections' 
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- ================================================
-- STEP 4: CREATE ADMIN UPDATE POLICIES
-- ================================================

-- Product Images - Admin Update
CREATE POLICY "Admins can update product images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Banners - Admin Update
CREATE POLICY "Admins can update banners"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'banners'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Categories - Admin Update
CREATE POLICY "Admins can update categories"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Collections - Admin Update
CREATE POLICY "Admins can update collections"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'collections'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- ================================================
-- STEP 5: CREATE ADMIN DELETE POLICIES
-- ================================================

-- Product Images - Admin Delete
CREATE POLICY "Admins can delete product images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'product-images'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Banners - Admin Delete
CREATE POLICY "Admins can delete banners"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'banners'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Categories - Admin Delete
CREATE POLICY "Admins can delete categories"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- Collections - Admin Delete
CREATE POLICY "Admins can delete collections"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'collections'
  AND EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'owner')
  )
);

-- ================================================
-- STEP 6: CREATE AVATAR POLICIES (USER-SPECIFIC)
-- ================================================
-- Avatars have different permissions - users can manage their own

-- Avatars - User Upload (own folder only)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Avatars - User Update (own folder only)
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Avatars - User Delete (own folder only)
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ================================================
-- STEP 7: CREATE PUBLIC READ POLICIES
-- ================================================
-- Allow anyone to view all images (required for e-commerce)

CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Anyone can view banners"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'banners');

CREATE POLICY "Anyone can view categories"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'categories');

CREATE POLICY "Anyone can view collections"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'collections');

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'avatars');

-- ================================================
-- STEP 8: VERIFICATION & SUMMARY
-- ================================================

DO $$ 
DECLARE
    bucket_count INTEGER;
    policy_count INTEGER;
    product_images_exists BOOLEAN;
    banners_exists BOOLEAN;
    categories_exists BOOLEAN;
    collections_exists BOOLEAN;
    avatars_exists BOOLEAN;
BEGIN
    -- Count buckets
    SELECT COUNT(*) INTO bucket_count
    FROM storage.buckets
    WHERE id IN ('product-images', 'banners', 'categories', 'collections', 'avatars');
    
    -- Count policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects';
    
    -- Check individual buckets
    SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'product-images') INTO product_images_exists;
    SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'banners') INTO banners_exists;
    SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'categories') INTO categories_exists;
    SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'collections') INTO collections_exists;
    SELECT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars') INTO avatars_exists;
    
    -- Display results
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '   ALL STORAGE BUCKETS SETUP COMPLETE!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Buckets Created: % / 5', bucket_count;
    RAISE NOTICE 'Total Policies: %', policy_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Bucket Status:';
    RAISE NOTICE '  % product-images (10MB) - Products', CASE WHEN product_images_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '  % banners (10MB) - Homepage banners', CASE WHEN banners_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '  % categories (5MB) - Category images', CASE WHEN categories_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '  % collections (5MB) - Collections', CASE WHEN collections_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '  % avatars (2MB) - Profile pictures', CASE WHEN avatars_exists THEN '✅' ELSE '❌' END;
    RAISE NOTICE '';
    RAISE NOTICE 'Permissions Summary:';
    RAISE NOTICE '  - Admins: Upload/Update/Delete (products, banners, categories, collections)';
    RAISE NOTICE '  - Users: Upload/Update/Delete own avatar only';
    RAISE NOTICE '  - Public: View/Read all images';
    RAISE NOTICE '';
    RAISE NOTICE 'Security:';
    RAISE NOTICE '  - All buckets are PUBLIC (required for e-commerce)';
    RAISE NOTICE '  - Only admins can modify product/banner/category/collection images';
    RAISE NOTICE '  - Users can only modify their own avatars';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '  1. ✅ Try uploading images in admin dashboard';
    RAISE NOTICE '  2. ✅ Update categories service to use \"categories\" bucket';
    RAISE NOTICE '  3. ✅ Verify your user has admin role';
    RAISE NOTICE '';
    RAISE NOTICE 'Code Updates Required:';
    RAISE NOTICE '  - src/lib/services/categories.ts: Change \"public-assets\" to \"categories\"';
    RAISE NOTICE '';
END $$;

-- ================================================
-- VERIFY YOUR ADMIN ROLE
-- ================================================
-- Check if you have admin permissions
SELECT 
    id,
    email,
    raw_user_meta_data->>'role' as user_role,
    created_at
FROM auth.users
WHERE id = auth.uid();

-- If your role is NULL, uncomment and run this (replace with your email):
-- UPDATE auth.users
-- SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-email@example.com';
