# Database Schema Diagram

## Visual Overview of Database Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DUDE MEN'S WEARS DATABASE                            │
│                         36 Tables, 100+ Indexes                              │
└─────────────────────────────────────────────────────────────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ STORE CONFIGURATION                                                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐
    │ store_settings      │
    ├─────────────────────┤
    │ • store_name        │
    │ • currency          │
    │ • gst_number        │
    │ • support_email     │
    └─────────────────────┘

    ┌─────────────────────┐       ┌──────────────────────┐
    │ store_locations     │       │ notification_settings │
    ├─────────────────────┤       ├──────────────────────┤
    │ • name              │       │ • order_confirmation │
    │ • address           │       │ • low_stock_alert    │
    │ • is_primary        │       │ • shipment_update    │
    └─────────────────────┘       └──────────────────────┘

    ┌─────────────────────┐       ┌──────────────────────┐
    │ payment_settings    │       │ shipping_settings    │
    ├─────────────────────┤       ├──────────────────────┤
    │ • provider          │       │ • flat_rate          │
    │ • is_enabled        │       │ • free_shipping_min  │
    │ • display_name      │       │ • cod_enabled        │
    └─────────────────────┘       └──────────────────────┘

    ┌─────────────────────┐
    │ shipping_rules      │
    ├─────────────────────┤
    │ • zone              │
    │ • price             │
    │ • max_quantity      │
    └─────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ TAX MANAGEMENT (GST Compliant)                                             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐
    │ tax_settings        │
    ├─────────────────────┤
    │ • tax_enabled       │
    │ • default_gst_rate  │
    │ • store_state       │
    │ • gstin             │
    │ • price_includes_tax│
    └─────────────────────┘
            │
            ├─────────────────┐
            │                 │
    ┌───────▼────────┐   ┌───▼──────────────┐
    │ category_tax   │   │ product_tax_rules│
    │    _rules      │   ├──────────────────┤
    ├────────────────┤   │ FK: product_id   │
    │ FK: category_id│   │ • gst_rate       │
    │ • gst_rate     │   └──────────────────┘
    └────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ PRODUCT CATALOG (Core E-commerce)                                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐
    │ categories          │◄──┐ (Self-referencing)
    ├─────────────────────┤   │
    │ PK: id              │   │
    │ • name              │   │
    │ • slug (UNIQUE)     │   │
    │ • parent_id ────────┴───┘
    │ • description       │
    └──────────┬──────────┘
               │
               │ FK
               │
    ┌──────────▼──────────┐
    │ products            │
    ├─────────────────────┤
    │ PK: id              │
    │ • title             │
    │ • slug (UNIQUE)     │
    │ • price             │
    │ • description       │
    │ • status            │
    │ • is_bestseller     │
    │ • is_new_drop       │
    │ FK: category_id     │
    └──────────┬──────────┘
               │
       ┌───────┼───────┬───────────┬──────────┐
       │       │       │           │          │
  ┌────▼───┐ ┌▼─────┐ ┌▼────────┐ ┌▼───────┐ ┌▼─────────┐
  │product_│ │prod  │ │product_ │ │product_│ │ product_ │
  │images  │ │opts  │ │variants │ │categ   │ │ collect  │
  ├────────┤ ├──────┤ ├─────────┤ ├────────┤ ├──────────┤
  │FK: pid │ │FK:pid│ │FK: pid  │ │FK: pid │ │FK: pid   │
  │• url   │ │•name │ │• sku    │ │FK: cid │ │FK: coid  │
  │•is_prim│ │•pos  │ │• price  │ └────────┘ └──────────┘
  └────────┘ └──┬───┘ │• stock  │
                │     └────┬────┘
                │          │
         ┌──────▼──┐  ┌────▼──────────┐
         │prod_opt │  │variant_option │
         │_values  │  │    _values    │
         ├─────────┤  ├───────────────┤
         │FK:opt_id│  │FK: variant_id │
         │• name   │◄─┤FK: opt_val_id │
         │• hex    │  └───────────────┘
         └─────────┘

    ┌──────────────────┐         ┌──────────────────┐
    │ product_tags     │         │ variant_prices   │
    ├──────────────────┤         ├──────────────────┤
    │ • name           │         │ FK: variant_id   │
    │ • slug (UNIQUE)  │         │ • amount         │
    └────────┬─────────┘         │ • price_type     │
             │                   └──────────────────┘
    ┌────────▼─────────┐
    │ product_tag_     │
    │   assignments    │
    ├──────────────────┤
    │ FK: product_id   │
    │ FK: tag_id       │
    └──────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ INVENTORY MANAGEMENT                                                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌──────────────────────┐
    │ inventory_items      │
    ├──────────────────────┤
    │ FK: variant_id       │
    │ • quantity           │
    │ • available_quantity │
    │ • reserved_quantity  │
    │ • low_stock_threshold│
    │ • track_quantity     │
    │ • allow_backorders   │
    └──────────┬───────────┘
               │
               │ (Audit Trail)
               │
    ┌──────────▼───────────┐
    │ inventory_logs       │
    ├──────────────────────┤
    │ FK: variant_id       │
    │ • change_amount      │
    │ • reason             │
    │ • created_at         │
    └──────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ COLLECTIONS & MARKETING                                                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐
    │ collections         │
    ├─────────────────────┤
    │ PK: id              │
    │ • title             │
    │ • slug (UNIQUE)     │
    │ • type              │
    │ • is_active         │
    │ • rule_json         │
    └──────────┬──────────┘
               │
       ┌───────┼────────┐
       │                │
  ┌────▼──────┐   ┌─────▼─────────┐
  │collection │   │ homepage_     │
  │_products  │   │  sections     │
  ├───────────┤   ├───────────────┤
  │FK: coll_id│   │ FK: coll_id   │
  │FK: prod_id│   │ • title       │
  │•sort_order│   │ • position    │
  └───────────┘   │ • is_active   │
                  └───────────────┘

    ┌─────────────────────┐
    │ banners             │
    ├─────────────────────┤
    │ • title             │
    │ • image_url         │
    │ • link_url          │
    │ • placement         │
    │ • is_active         │
    └─────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ SHOPPING CART & WISHLIST                                                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐         ┌──────────────────┐
    │ cart_items          │         │ wishlist_items   │
    ├─────────────────────┤         ├──────────────────┤
    │ • user_id (nullable)│         │ • user_id        │
    │ • guest_id          │         │ • guest_id       │
    │ FK: variant_id      │         │ FK: product_id   │
    │ • quantity          │         └──────────────────┘
    └─────────────────────┘
    
    (Supports both authenticated users and guests)

    ┌─────────────────────┐
    │ coupons             │
    ├─────────────────────┤
    │ • code (UNIQUE)     │
    │ • discount_type     │
    │ • discount_value    │
    │ • usage_limit       │
    │ • usage_count       │
    │ • is_active         │
    │ • expires_at        │
    └─────────────────────┘

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ORDERS & PAYMENTS                                                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

    ┌─────────────────────┐
    │ addresses           │
    ├─────────────────────┤
    │ PK: id              │
    │ • user_id           │
    │ • guest_id          │
    │ • name              │
    │ • phone             │
    │ • address_line1     │
    │ • city              │
    │ • state             │
    │ • pincode           │
    └──────────┬──────────┘
               │
               │ FK
               │
    ┌──────────▼──────────┐
    │ orders              │
    ├─────────────────────┤
    │ PK: id              │
    │ • user_id           │
    │ • guest_id          │
    │ • guest_email       │
    │ FK: shipping_addr_id│
    │ • total_amount      │
    │ • shipping_amount   │
    │ • order_status      │
    │ • payment_status    │
    │ • razorpay_order_id │
    └──────────┬──────────┘
               │
       ┌───────┼───────┬──────────┐
       │       │       │          │
  ┌────▼───┐ ┌▼─────┐ ┌▼────────┐│
  │order_  │ │order_│ │payments ││
  │items   │ │taxes │ ├─────────┤│
  ├────────┤ ├──────┤ │FK:ord_id││
  │FK:o_id │ │FK:oid│ │•pay_id  ││
  │FK:v_id │ │•cgst │ │•provider││
  │•qty    │ │•sgst │ │•status  ││
  │•price  │ │•igst │ │•raw_resp││
  └────────┘ │•total│ └─────────┘│
             │•rate │            │
             │•type │            │
             └──────┘            │
                                 │
    (GST Compliant Tax Records) │
                                 │
    ┌────────────────────────────┘
    │
    └──► Razorpay Integration

```

## Table Relationships Summary

### One-to-Many Relationships

```
categories (1) ─────► products (∞)
products (1) ───────► product_images (∞)
products (1) ───────► product_options (∞)
products (1) ───────► product_variants (∞)
product_options (1) ─► product_option_values (∞)
product_variants (1) ► inventory_items (1)
product_variants (1) ► variant_prices (∞)
orders (1) ─────────► order_items (∞)
collections (1) ────► homepage_sections (∞)
```

### Many-to-Many Relationships (Junction Tables)

```
products ◄──────► categories
    via product_categories

products ◄──────► collections
    via product_collections

products ◄──────► tags
    via product_tag_assignments

variants ◄──────► option_values
    via variant_option_values

collections ◄───► products
    via collection_products
```

### Self-Referencing Relationships

```
categories (parent_id) ──► categories (id)
    (Hierarchical category tree)
```

## Key Indexes by Use Case

### Product Browsing
- `idx_products_status` - Active products
- `idx_products_slug` - Product page URLs
- `idx_products_category_id` - Category filtering
- `idx_products_search` - Full-text search

### Shopping Cart
- `idx_cart_items_user_id` - User cart lookup
- `idx_cart_items_guest_id` - Guest cart lookup
- `idx_cart_items_variant_id` - Product availability

### Order Management
- `idx_orders_user_id` - User order history
- `idx_orders_order_status` - Status filtering
- `idx_orders_created_at` - Recent orders

### Inventory
- `idx_inventory_items_variant_id` - Stock lookup
- `idx_inventory_items_low_stock` - Alerts

### Admin Operations
- All foreign key indexes for join performance
- Timestamp indexes for audit trails

## Security Model (RLS)

```
┌─────────────────────────────────────────────────┐
│              SECURITY LAYERS                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  PUBLIC (No Auth Required)                      │
│  ├─ Read: products, categories, collections    │
│  ├─ Read: banners, store_settings              │
│  └─ Read: inventory (stock availability)       │
│                                                 │
│  USERS (Authenticated)                          │
│  ├─ Full CRUD: own cart, wishlist, addresses   │
│  ├─ Read: own orders, payments                 │
│  └─ Create: new orders                         │
│                                                 │
│  GUESTS (Via guest_id)                          │
│  ├─ Full CRUD: cart, wishlist                  │
│  ├─ Create: addresses, orders                  │
│  └─ Read: own orders via guest_id              │
│                                                 │
│  ADMINS (role='admin' or 'owner')              │
│  └─ Full access to ALL tables                  │
│                                                 │
│  SERVICE ROLE (Backend)                         │
│  └─ Bypasses RLS (use for webhooks)            │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Functions & Triggers

### Authentication Functions
- `is_admin_user()` - Check admin/owner role
- `is_owner_user()` - Check owner role only

### Inventory Functions
- `reserve_inventory(variant_id, quantity)` - Reserve stock
- `release_inventory(variant_id, quantity)` - Release reserved
- `confirm_inventory(variant_id, quantity)` - Confirm shipment
- `check_product_stock(variant_id)` - Stock availability

### Utility Functions
- `generate_slug(text)` - Create URL-friendly slugs
- `generate_order_number()` - Unique order numbers
- `validate_coupon(code, amount)` - Coupon validation

### Automatic Triggers
- `update_updated_at_column()` - Auto-update timestamps
  - Applied to: All tables with updated_at column

## Performance Optimizations

### Composite Indexes
```sql
-- Common query patterns
(status, category_id)     -- Filtered product listing
(user_id, created_at)     -- User's recent orders
(collection_id, position)  -- Ordered collection items
(zone, is_active)         -- Active shipping rules
```

### Partial Indexes
```sql
-- Only index active records
WHERE status = 'active'
WHERE is_active = true
WHERE in_stock = true
```

### Text Search
```sql
-- Full-text search on products
to_tsvector('english', title || ' ' || description)
```

## Data Integrity

### Constraints
- ✅ Foreign keys with appropriate CASCADE rules
- ✅ UNIQUE constraints on slugs, SKUs, codes
- ✅ CHECK constraints on enums and logic
- ✅ NOT NULL on required fields

### Cascade Rules
- `ON DELETE CASCADE` - Related data deleted
- `ON DELETE SET NULL` - Reference nullified
- `ON DELETE RESTRICT` - Prevent deletion

### Business Logic
- Cart items: Require user_id OR guest_id
- Addresses: Require user_id OR guest_id
- Orders: Require user_id OR guest_id
- Inventory: Track available vs reserved quantities

---

**Total Statistics:**
- **36 Tables** across 8 major domains
- **100+ Indexes** for query optimization
- **80+ RLS Policies** for security
- **10+ Functions** for business logic
- **20+ Triggers** for automation

**Architecture Pattern:** Domain-Driven Design (DDD)  
**Database:** PostgreSQL via Supabase  
**Security:** Row Level Security (RLS)  
**Compliance:** GST/Indian Tax Compliant
