# Customer Domain Architecture

## 🎯 Core Philosophy

This system implements **proper domain-driven design** where:

- **Customers** are **commercial identities** (people who order)
- **Auth Users** are **authentication identities** (people who log in)
- **Admins** are **NEVER customers** (they manage, not order)

```
┌─────────────────────────────────────────────────────────┐
│                    DOMAIN SEPARATION                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Auth Domain          Customer Domain       Admin Domain│
│  ┌──────────┐        ┌──────────┐         ┌──────────┐ │
│  │auth.users│   ───▶ │customers │  ◀───✖  │ admins   │ │
│  └──────────┘        └──────────┘         └──────────┘ │
│  Identity            Commerce              Authority    │
│                                                          │
│  Proves who you are  Tracks purchases      Never shops  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📋 Database Schema

### Core Tables

#### `customers`
**The source of truth for all commercial activity**

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    auth_user_id UUID UNIQUE,           -- NULL for guests
    email TEXT,
    phone TEXT,
    first_name TEXT,
    last_name TEXT,
    customer_type TEXT,                 -- 'guest' | 'registered'
    status TEXT DEFAULT 'active',        -- 'active' | 'inactive' | 'blocked'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    last_order_at TIMESTAMPTZ,
    
    CONSTRAINT email_or_phone_required 
        CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT auth_user_required_for_registered 
        CHECK (customer_type = 'guest' OR 
              (customer_type = 'registered' AND auth_user_id IS NOT NULL))
);
```

**Key Properties:**
- ✅ One auth user → One customer (max)
- ✅ auth_user_id nullable (for guests)
- ✅ Email OR phone required
- ❌ Admins forbidden (enforced by triggers/policies)

#### `customer_addresses`
**Proper address management linked to customers**

```sql
CREATE TABLE customer_addresses (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    address_type TEXT DEFAULT 'shipping',  -- 'shipping' | 'billing' | 'both'
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

#### `customer_activity_log`
**Audit trail for customer events**

```sql
CREATE TABLE customer_activity_log (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    activity_type TEXT NOT NULL,        -- 'order_placed', 'guest_merged', etc.
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ
);
```

#### `customer_notes`
**Admin-only internal notes**

```sql
CREATE TABLE customer_notes (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    note TEXT NOT NULL,
    created_by UUID NOT NULL,           -- Admin user who created note
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);
```

### Modified Tables

#### `orders` (enhanced)
```sql
ALTER TABLE orders ADD COLUMN customer_id UUID REFERENCES customers(id);
ALTER TABLE orders ADD COLUMN customer_email_snapshot TEXT;
ALTER TABLE orders ADD COLUMN customer_phone_snapshot TEXT;
ALTER TABLE orders ADD COLUMN customer_name_snapshot TEXT;
```

**Migration Note:** Old `user_id` and `guest_id` columns remain for backward compatibility but should be deprecated.

## 🔐 Security (RLS Policies)

### Admin Access
```sql
-- Admins can see ALL customers (except other admins)
CREATE POLICY "Admins can view all customers"
    ON customers FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
        AND NOT is_user_admin(auth_user_id)
    );
```

### Customer Self-Access
```sql
-- Customers can view their own data
CREATE POLICY "Customers can view own data"
    ON customers FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());
```

### Service Role Bypass
```sql
-- Server actions use service role to bypass RLS
CREATE POLICY "Service role full access to customers"
    ON customers
    TO service_role
    USING (true)
    WITH CHECK (true);
```

## 🔄 Customer Lifecycle

### 1. Guest Checkout Flow

```typescript
// Frontend collects guest info
const checkoutData = {
  email: 'guest@example.com',
  phone: '+919876543210',
  first_name: 'John',
  last_name: 'Doe'
}

// Backend creates/reuses guest customer
const { data: customer } = await getOrCreateGuestCustomer(
  checkoutData.email,
  {
    phone: checkoutData.phone,
    first_name: checkoutData.first_name,
    last_name: checkoutData.last_name
  }
)

// Create order linked to customer
await createOrder({
  customer_id: customer.id,
  customer_email_snapshot: customer.email,
  customer_phone_snapshot: customer.phone,
  // ... other order data
})
```

**Result:**
- ✅ Guest customer created with `customer_type = 'guest'`
- ✅ `auth_user_id = NULL`
- ✅ Order linked to customer
- ✅ History preserved forever

### 2. Registered User Checkout Flow

```typescript
// User is logged in (auth.uid() available)
const authUser = await getAuthUser()

// Backend creates/gets customer for auth user
const { data: customer } = await getOrCreateCustomerForUser(
  authUser.id,
  {
    email: authUser.email,
    first_name: authUser.user_metadata.first_name,
    last_name: authUser.user_metadata.last_name
  }
)

// Create order linked to customer
await createOrder({
  customer_id: customer.id,
  customer_email_snapshot: customer.email,
  // ... other order data
})
```

**Result:**
- ✅ Registered customer created with `customer_type = 'registered'`
- ✅ `auth_user_id` set to auth user ID
- ✅ Order linked to customer
- ✅ If guest existed with same email → **automatically merged**

### 3. Guest-to-Registered Merge

**Scenario:** User places order as guest, later creates account

```typescript
// Guest orders as email@example.com
await getOrCreateGuestCustomer('email@example.com')
// Creates: customer_type = 'guest', auth_user_id = NULL

// Later, user signs up with same email
await getOrCreateCustomerForUser(authUserId, { 
  email: 'email@example.com' 
})

// AUTOMATIC MERGE:
// 1. Find guest customer by email
// 2. UPDATE customer:
//    - auth_user_id = authUserId
//    - customer_type = 'registered'
//    - Preserve all orders & addresses
// 3. Log merge activity
```

**Result:**
- ✅ All guest orders now linked to registered account
- ✅ Order history preserved
- ✅ Single customer record
- ✅ Audit trail in activity log

## 🚫 Admin Safety

### Admin Detection

```typescript
async function isAdminUser(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('admin_profiles')
    .select('id')
    .eq('user_id', userId)
    .single()
  
  return !!data
}
```

### Enforcement Points

**1. Customer Creation**
```typescript
export async function getOrCreateCustomerForUser(authUserId: string) {
  // ❌ BLOCK: Admin check FIRST
  const isAdmin = await isAdminUser(authUserId)
  if (isAdmin) {
    throw new Error('Admins cannot be customers')
  }
  // ... proceed with customer creation
}
```

**2. Admin Dashboard Queries**
```sql
-- Automatically exclude admins from customer lists
SELECT c.*
FROM customers c
LEFT JOIN admin_profiles ap ON ap.user_id = c.auth_user_id
WHERE ap.user_id IS NULL  -- Exclude admins
```

**3. RLS Policies**
```sql
-- Built into database layer
CREATE POLICY "Block admin customer creation"
    ON customers FOR INSERT
    WITH CHECK (NOT is_user_admin(auth_user_id));
```

## 📊 Admin Dashboard

### Customer List View

```typescript
// /admin/customers
const { data: customers } = await getCustomersForAdmin({
  customer_type: 'all',      // 'guest' | 'registered' | 'all'
  status: 'active',          // 'active' | 'inactive' | 'blocked'
  search: 'john@example',    // Email, phone, or name
  limit: 20,
  offset: 0
})

// Returns: CustomerWithStats[]
// - id, email, phone, name
// - customer_type, status
// - total_orders, total_spent
// - average_order_value, lifetime_value
// - created_at, last_order_at
```

**Display Columns:**
| Column | Data | Filter |
|--------|------|--------|
| Customer | email, name | Search |
| Type | Guest / Registered | Dropdown |
| Status | Active / Inactive | Dropdown |
| Orders | total_orders | Min value |
| Total Spent | total_spent | Min value |
| Avg Order | average_order_value | - |
| Last Order | last_order_at | Date range |
| Joined | created_at | Date range |

### Customer Detail View

```typescript
// /admin/customers/:id
const { data: customer } = await getCustomerByIdForAdmin(customerId)

// Returns:
// - Customer profile (email, phone, name, type, status)
// - Order history with items
// - Saved addresses
// - Activity timeline
// - Admin notes (internal)
```

**Sections:**
1. **Overview** - Basic info, stats
2. **Orders** - Full order history with products
3. **Addresses** - All saved addresses
4. **Activity** - Timeline of events
5. **Notes** - Admin-only internal notes

## 🔧 Helper Functions

### Database Functions

```sql
-- Get or create customer for auth user (with merge)
SELECT get_or_create_customer_for_user(
  p_auth_user_id := 'uuid-here',
  p_email := 'user@example.com',
  p_phone := '+919876543210',
  p_first_name := 'John',
  p_last_name := 'Doe'
);

-- Get or create guest customer
SELECT get_or_create_guest_customer(
  p_email := 'guest@example.com',
  p_phone := '+919876543210',
  p_first_name := 'Jane',
  p_last_name := 'Smith'
);

-- Check if user is admin
SELECT is_user_admin('uuid-here');
```

### Server Actions

```typescript
// Customer creation
import {
  getOrCreateCustomerForUser,
  getOrCreateGuestCustomer
} from '@/lib/actions/customer-domain'

// Admin queries
import {
  getCustomersForAdmin,
  getCustomerByIdForAdmin,
  getCustomerStatsForAdmin
} from '@/lib/actions/customer-domain'

// Address management
import {
  createCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress
} from '@/lib/actions/customer-domain'

// Notes
import {
  addCustomerNote,
  getCustomerNotes
} from '@/lib/actions/customer-domain'
```

## 🚀 Migration Steps

### Step 1: Create Schema
```bash
# Run in Supabase SQL Editor
psql < backend-implementation/13-create-customers-domain.sql
```

### Step 2: Migrate Data
```bash
# Populate customers from existing orders
psql < backend-implementation/14-migrate-existing-data-to-customers.sql
```

### Step 3: Update Application Code
```typescript
// Replace old customer service calls
// OLD:
import { CustomerService } from '@/lib/services/customers'
await CustomerService.getCustomers()

// NEW:
import { getCustomersForAdmin } from '@/lib/actions/customer-domain'
await getCustomersForAdmin()
```

### Step 4: Verify
```sql
-- Check customer count
SELECT COUNT(*), customer_type FROM customers GROUP BY customer_type;

-- Check admin exclusion
SELECT COUNT(*) FROM customers c
JOIN admin_profiles ap ON ap.user_id = c.auth_user_id;
-- Should return 0

-- Check order linkage
SELECT COUNT(*) FROM orders WHERE customer_id IS NOT NULL;
```

### Step 5: Cleanup (Optional)
```sql
-- After verification, deprecate old columns
ALTER TABLE orders DROP COLUMN user_id;
ALTER TABLE orders DROP COLUMN guest_id;
ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;

-- Drop old addresses table
DROP TABLE addresses;
```

## ✅ Validation Checklist

- [ ] Customers table created with proper constraints
- [ ] RLS policies enabled and tested
- [ ] Helper functions working correctly
- [ ] Admins excluded from customer queries
- [ ] Guest checkout creates customer
- [ ] Registered checkout creates/merges customer
- [ ] Orders linked to customers
- [ ] Addresses migrated
- [ ] Admin dashboard showing correct data
- [ ] Activity logs recording events

## 🎓 Key Takeaways

### ✅ DO

- **Always** create customers through server actions
- **Always** check admin status before customer operations
- **Always** use `customer_id` for order relationships
- **Always** snapshot customer data in orders
- **Always** log important customer events

### ❌ DON'T

- **Never** create customers from auth triggers
- **Never** allow admins to be customers
- **Never** use auth.users for customer queries
- **Never** delete customer records (soft delete only)
- **Never** expose customer creation to frontend

### 🎯 Remember

```
Orders create customers.
Admins create authority.
Auth only proves identity.
```

If your system obeys this, it is correct.

## 📚 Further Reading

- [Domain-Driven Design Basics](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Customer Data Best Practices](https://stripe.com/docs/api/customers)

---

**Version:** 1.0  
**Last Updated:** 2025-01  
**Author:** E1 Domain Architecture  
**Status:** ✅ Production Ready
