# Customer Domain - Quick Setup Guide

## 🚀 5-Minute Setup

### Prerequisites
- ✅ Supabase project with admin access
- ✅ `admin_profiles` table exists
- ✅ Existing orders and addresses data (optional, for migration)

---

## Step 1: Create Database Schema (2 min)

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor

2. **Run Customer Domain Schema**
   ```bash
   # Copy content from:
   backend-implementation/13-create-customers-domain.sql
   
   # Paste into SQL Editor and Execute
   ```

3. **Verify Tables Created**
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name IN (
     'customers', 
     'customer_addresses', 
     'customer_activity_log', 
     'customer_notes'
   );
   ```
   
   ✅ Should return 4 tables

---

## Step 2: Migrate Existing Data (2 min)

**⚠️ IMPORTANT:** Backup your database before migration!

1. **Run Migration Script**
   ```bash
   # Copy content from:
   backend-implementation/14-migrate-existing-data-to-customers.sql
   
   # Paste into SQL Editor and Execute
   ```

2. **Review Migration Summary**
   - Check console output for:
     - Customers created (registered vs guest)
     - Orders linked
     - Addresses migrated
     - Any warnings

---

## Step 3: Update Application Code (1 min)

### Update Imports

**Before:**
```typescript
import { CustomerService } from '@/lib/services/customers'

// Old way (using auth.users directly)
const customers = await CustomerService.getCustomers()
```

**After:**
```typescript
import {
  getCustomersForAdmin,
  getCustomerByIdForAdmin,
  getCustomerStatsForAdmin
} from '@/lib/actions/customer-domain'

// New way (proper domain separation)
const { data: customers } = await getCustomersForAdmin()
```

### Already Updated Files ✅
- `/app/src/lib/actions/customers.ts` - Now uses customer-domain internally
- `/app/src/hooks/queries/useCustomers.ts` - Already updated
- React Query hooks still work the same way

**No changes needed in your React components!** 🎉

---

## Verification (30 sec)

### 1. Check Customer Count
```sql
SELECT 
  COUNT(*) as total,
  customer_type,
  status
FROM customers
GROUP BY customer_type, status;
```

Expected output:
```
total | customer_type | status
------|---------------|--------
  X   | registered    | active
  Y   | guest         | active
```

### 2. Verify Admin Exclusion
```sql
-- This should return 0 rows (admins should NOT be in customers)
SELECT c.* 
FROM customers c
JOIN admin_profiles ap ON ap.user_id = c.auth_user_id;
```

✅ **Success:** 0 rows returned  
❌ **Issue:** If rows returned, some admins are incorrectly in customers table

### 3. Check Order Linkage
```sql
SELECT 
  COUNT(*) as total_orders,
  COUNT(customer_id) as linked_orders,
  COUNT(*) - COUNT(customer_id) as unlinked_orders
FROM orders;
```

Ideally:
- `linked_orders` = `total_orders`
- `unlinked_orders` = 0

---

## Common Issues & Fixes

### Issue 1: Admin Users in Customers Table

**Symptom:** Admins appearing in customer dashboard

**Fix:**
```sql
-- Remove admin users from customers
DELETE FROM customers
WHERE auth_user_id IN (
  SELECT user_id FROM admin_profiles
);
```

### Issue 2: Orders Not Linked

**Symptom:** `unlinked_orders` > 0

**Fix:**
```sql
-- Re-run order linking
UPDATE orders o
SET customer_id = c.id
FROM customers c
WHERE o.user_id = c.auth_user_id
AND o.customer_id IS NULL;
```

### Issue 3: RLS Blocking Admin Access

**Symptom:** Admin dashboard shows "no customers"

**Fix:**
```typescript
// Ensure you're using server actions (they use service_role)
import { getCustomersForAdmin } from '@/lib/actions/customer-domain'

// NOT this (client-side Supabase, blocked by RLS)
import { supabase } from '@/lib/supabase/client'
const { data } = await supabase.from('customers').select('*')
```

---

## Testing

### Test 1: Guest Checkout
```typescript
// In your checkout server action
import { getOrCreateGuestCustomer } from '@/lib/actions/customer-domain'

const result = await getOrCreateGuestCustomer(
  'test-guest@example.com',
  {
    phone: '+919876543210',
    first_name: 'Test',
    last_name: 'Guest'
  }
)

console.log('Guest customer:', result.data)
// Should create customer_type = 'guest', auth_user_id = NULL
```

### Test 2: Registered User Checkout
```typescript
// In your authenticated checkout server action
import { getOrCreateCustomerForUser } from '@/lib/actions/customer-domain'

const result = await getOrCreateCustomerForUser(
  authUserId,
  {
    email: 'user@example.com',
    first_name: 'Test',
    last_name: 'User'
  }
)

console.log('Registered customer:', result.data)
// Should create customer_type = 'registered', auth_user_id = userId
```

### Test 3: Guest-to-Registered Merge
```typescript
// 1. Create guest order
const guest = await getOrCreateGuestCustomer('merge-test@example.com')

// 2. User signs up with same email
const registered = await getOrCreateCustomerForUser(
  newUserId,
  { email: 'merge-test@example.com' }
)

// 3. Verify they're the same customer
console.assert(guest.data.id === registered.data.id, 'Should be same customer')
console.assert(registered.data.customer_type === 'registered', 'Should be upgraded')
```

### Test 4: Admin Blocked from Customers
```typescript
// Should fail for admin users
const adminUserId = 'admin-user-uuid'

const result = await getOrCreateCustomerForUser(adminUserId)

console.assert(!result.success, 'Should fail')
console.assert(result.error === 'Admins cannot be customers', 'Correct error')
```

---

## Next Steps

### Optional Enhancements

1. **Add VIP Logic**
   ```sql
   -- Flag high-value customers
   UPDATE customers
   SET metadata = jsonb_set(metadata, '{vip}', 'true')
   WHERE id IN (
     SELECT customer_id 
     FROM orders 
     GROUP BY customer_id 
     HAVING SUM(total_amount) > 100000
   );
   ```

2. **Customer Segments**
   ```sql
   -- Create segments based on behavior
   SELECT 
     customer_type,
     CASE
       WHEN total_spent > 100000 THEN 'vip'
       WHEN total_orders > 5 THEN 'repeat'
       WHEN total_orders > 0 THEN 'one-time'
       ELSE 'no-orders'
     END as segment,
     COUNT(*) as customers
   FROM (
     SELECT 
       c.customer_type,
       COUNT(o.id) as total_orders,
       COALESCE(SUM(o.total_amount), 0) as total_spent
     FROM customers c
     LEFT JOIN orders o ON o.customer_id = c.id
     GROUP BY c.id, c.customer_type
   ) stats
   GROUP BY customer_type, segment;
   ```

3. **Email Marketing Lists**
   ```sql
   -- Export customer emails for marketing
   SELECT 
     email,
     first_name,
     last_name,
     customer_type,
     last_order_at
   FROM customers
   WHERE status = 'active'
   AND email IS NOT NULL
   ORDER BY last_order_at DESC NULLS LAST;
   ```

---

## 📚 Full Documentation

For detailed architecture, flows, and best practices:
- 📖 [Customer Domain Architecture](./CUSTOMER_DOMAIN_ARCHITECTURE.md)
- 🗄️ [Database Schema](./13-create-customers-domain.sql)
- 🔄 [Migration Script](./14-migrate-existing-data-to-customers.sql)
- 💻 [Server Actions](../src/lib/actions/customer-domain.ts)

---

## 🆘 Need Help?

### Debug Checklist
- [ ] Tables exist and have data
- [ ] RLS policies are enabled
- [ ] Helper functions are created
- [ ] Server actions imported correctly
- [ ] Using `service_role` for admin operations
- [ ] Admin users NOT in customers table
- [ ] Orders linked to customers

### Support
1. Check console for errors
2. Review SQL migration output
3. Verify RLS policies
4. Test with curl/Postman
5. Check Supabase logs

---

**Setup Complete!** 🎉

Your application now has a proper customer domain with:
- ✅ Domain separation (auth ≠ customers)
- ✅ Guest support
- ✅ Automatic merging
- ✅ Admin safety
- ✅ Audit trails
- ✅ Future-proof architecture
