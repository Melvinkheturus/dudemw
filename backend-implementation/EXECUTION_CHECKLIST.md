# Database Reset Execution Checklist

## Pre-Execution Checklist

- [ ] **Backup Current Database** (if you have important data)
  - Go to Supabase Dashboard → Database → Backups
  - Create a manual backup or export data
  
- [ ] **Test on Development/Staging First**
  - Never run on production without testing
  
- [ ] **Have Admin Credentials Ready**
  - You'll need service_role key or database password

- [ ] **Review All SQL Files**
  - Ensure you understand what each script does
  - Check table names match your requirements

## Execution Steps

### Step 1: Drop Existing Objects
```bash
# File: 01-drop-existing.sql
# Purpose: Removes all existing tables, indexes, policies, functions
# Estimated time: 1-2 minutes
```

**Execute in Supabase SQL Editor:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Copy contents of `01-drop-existing.sql`
5. Click **Run**
6. ✅ Verify: Should see "Successfully dropped all existing database objects!"

**Expected Output:**
- No errors
- All tables, indexes, policies dropped
- Database is clean

**Troubleshooting:**
- If you get "permission denied": Use service_role connection
- If some tables remain: Check for external dependencies

---

### Step 2: Create Tables
```bash
# File: 02-create-tables.sql
# Purpose: Creates all 36 tables with proper constraints
# Estimated time: 2-3 minutes
```

**Execute in Supabase SQL Editor:**
1. Create new query
2. Copy contents of `02-create-tables.sql`
3. Click **Run**
4. ✅ Verify: Should see "Successfully created all 36 database tables!"

**Verification Query:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Result:** 36 tables listed

**Tables Created:**
- ✅ Store Configuration (6 tables)
- ✅ Tax Management (4 tables)
- ✅ Product Catalog (14 tables)
- ✅ Inventory (2 tables)
- ✅ Collections & Banners (4 tables)
- ✅ Shopping (3 tables)
- ✅ Orders (3 tables)

**Troubleshooting:**
- If foreign key errors: Check table creation order
- If duplicate errors: Re-run step 1 first

---

### Step 3: Create Indexes
```bash
# File: 03-create-indexes.sql
# Purpose: Creates comprehensive performance indexes
# Estimated time: 2-4 minutes
```

**Execute in Supabase SQL Editor:**
1. Create new query
2. Copy contents of `03-create-indexes.sql`
3. Click **Run**
4. ✅ Verify: Should see "Successfully created comprehensive performance indexes!"

**Verification Query:**
```sql
SELECT 
    tablename, 
    indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;
```

**Expected Result:** 100+ indexes created

**Index Categories:**
- ✅ Primary query indexes (slug, status, etc.)
- ✅ Foreign key indexes
- ✅ Composite indexes for common queries
- ✅ Partial indexes for filtered queries
- ✅ Text search indexes

**Troubleshooting:**
- If index creation fails: Check if table exists
- If "already exists" error: Skip that index or re-run step 1

---

### Step 4: Create RLS Policies
```bash
# File: 04-create-rls-policies.sql
# Purpose: Sets up Row Level Security policies
# Estimated time: 3-5 minutes
```

**Execute in Supabase SQL Editor:**
1. Create new query
2. Copy contents of `04-create-rls-policies.sql`
3. Click **Run**
4. ✅ Verify: Should see "Successfully created RLS policies!"

**Verification Query:**
```sql
SELECT 
    schemaname, 
    tablename, 
    policyname 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

**Expected Result:** 80+ policies created

**Policy Categories:**
- ✅ Public read policies (products, categories, etc.)
- ✅ User policies (cart, wishlist, orders)
- ✅ Admin policies (full access)

**Troubleshooting:**
- If policy creation fails: Ensure Step 2 completed successfully
- If "function does not exist": Continue to Step 5, then re-run this step

---

### Step 5: Create Functions
```bash
# File: 05-create-functions.sql
# Purpose: Creates helper functions and triggers
# Estimated time: 2-3 minutes
```

**Execute in Supabase SQL Editor:**
1. Create new query
2. Copy contents of `05-create-functions.sql`
3. Click **Run**
4. ✅ Verify: Should see "DATABASE SETUP COMPLETE!"

**Verification Query:**
```sql
-- List all functions
SELECT 
    proname as function_name,
    pg_get_function_arguments(oid) as arguments
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
ORDER BY proname;
```

**Expected Functions:**
- ✅ `is_admin_user()` - Admin check
- ✅ `is_owner_user()` - Owner check
- ✅ `update_updated_at_column()` - Auto timestamp
- ✅ `reserve_inventory()` - Inventory management
- ✅ `release_inventory()` - Inventory management
- ✅ `confirm_inventory()` - Inventory management
- ✅ `generate_slug()` - Slug generation
- ✅ `generate_order_number()` - Order numbering
- ✅ `validate_coupon()` - Coupon validation
- ✅ `check_product_stock()` - Stock checking

**Test Functions:**
```sql
-- Test admin function (will return false if not admin)
SELECT is_admin_user();

-- Test slug generation
SELECT generate_slug('My Product Name');

-- Test order number generation
SELECT generate_order_number();
```

---

## Post-Execution Steps

### 1. Regenerate TypeScript Types

**Important:** Your current `database.types.ts` is outdated!

```bash
# Using Supabase CLI
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts

# Or using API
curl "https://api.supabase.com/v1/projects/YOUR_PROJECT_ID/types/typescript" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  > src/types/database.types.ts
```

- [ ] Types regenerated
- [ ] No TypeScript compilation errors
- [ ] All imports working

### 2. Create Initial Admin User

**In Supabase Dashboard:**
1. Go to Authentication → Users
2. Create a new user (or use existing)
3. Click on the user → Edit User
4. Add to `raw_user_meta_data`:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save

**Verify:**
```sql
-- Check if admin user exists
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' IN ('admin', 'owner');
```

### 3. Insert Initial Settings Data

```sql
-- Insert default store settings
INSERT INTO store_settings (
    store_name, 
    currency, 
    timezone
) VALUES (
    'Dude Men''s Wears',
    'INR',
    'Asia/Kolkata'
);

-- Insert default tax settings
INSERT INTO tax_settings (
    tax_enabled,
    price_includes_tax,
    default_gst_rate,
    store_state
) VALUES (
    true,
    true,
    18.00,
    'Maharashtra'
);

-- Insert default notification settings
INSERT INTO notification_settings DEFAULT VALUES;

-- Insert default shipping settings
INSERT INTO shipping_settings (
    flat_rate,
    free_shipping_min,
    cod_enabled
) VALUES (
    50.00,
    999.00,
    true
);
```

### 4. Test Application

**Test Cases:**

- [ ] **Public Access**
  - Browse products without login
  - View categories and collections
  - Add items to cart (as guest)

- [ ] **User Access**
  - Login as regular user
  - Add to cart and wishlist
  - Create address
  - Place order

- [ ] **Admin Access**
  - Login as admin user
  - Access admin dashboard
  - Create product
  - View all orders
  - Manage inventory

### 5. Monitor for Issues

**Check Logs:**
```sql
-- Check for RLS policy violations
SELECT * FROM postgres_logs 
WHERE message LIKE '%policy%' 
ORDER BY timestamp DESC 
LIMIT 20;

-- Check for constraint violations
SELECT * FROM postgres_logs 
WHERE message LIKE '%constraint%' 
ORDER BY timestamp DESC 
LIMIT 20;
```

**Common Issues:**
- ❌ "new row violates row-level security policy"
  - Solution: Check if user has proper role in metadata
  - Solution: Verify policy logic in step 4

- ❌ "permission denied for table"
  - Solution: Grant proper permissions or use service_role

- ❌ "function is_admin_user() does not exist"
  - Solution: Re-run step 5

---

## Rollback Plan

If something goes wrong:

### Option 1: Restore from Backup
1. Go to Supabase Dashboard → Database → Backups
2. Select backup
3. Click Restore

### Option 2: Re-run Specific Steps
1. If indexes failed: Re-run step 3 only
2. If policies failed: Re-run step 4 only
3. If functions failed: Re-run step 5 only

### Option 3: Complete Reset
1. Re-run all steps 1-5 in order
2. Database will be completely rebuilt

---

## Success Criteria

✅ **All Steps Completed Successfully**
- All 36 tables created
- 100+ indexes created
- 80+ RLS policies created
- 10+ functions created

✅ **No Errors in Logs**
- Check Supabase Dashboard → Logs
- No RLS violations
- No constraint violations

✅ **Application Works**
- Public pages load
- Users can register and login
- Admin dashboard accessible
- Cart and wishlist functional
- Orders can be placed

✅ **TypeScript Types Updated**
- No compilation errors
- All table types available
- Proper type inference

---

## Support & Troubleshooting

**Error: "relation already exists"**
- You skipped step 1 or it didn't complete
- Solution: Re-run step 1, then continue

**Error: "permission denied"**
- Using wrong credentials
- Solution: Use service_role key or postgres user

**Error: "function does not exist"**
- Step 5 not run yet
- Solution: Complete step 5, then re-run step 4

**RLS blocking legitimate access**
- Policy logic may be incorrect
- Solution: Temporarily disable RLS for debugging:
  ```sql
  ALTER TABLE tablename DISABLE ROW LEVEL SECURITY;
  ```
- After debugging, re-enable and fix policies

**Performance issues**
- Indexes may not be created
- Solution: Verify step 3 completed successfully

---

## Final Checklist

- [ ] All 5 SQL files executed in order
- [ ] No errors in execution
- [ ] TypeScript types regenerated
- [ ] Admin user created with proper role
- [ ] Initial settings data inserted
- [ ] Application tested and working
- [ ] Documentation updated
- [ ] Team notified of database changes

---

**Estimated Total Time:** 15-20 minutes

**Recommended Execution Time:** During low-traffic period or maintenance window

**Post-Execution:** Monitor application logs for 24 hours for any issues

---

✨ **Your database is now clean, optimized, and ready for production!**
