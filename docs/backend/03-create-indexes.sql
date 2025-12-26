-- ================================================
-- CREATE PERFORMANCE INDEXES
-- ================================================
-- This script creates comprehensive indexes for optimal query performance
-- Execute this THIRD after creating tables
-- ================================================

-- ================================================
-- PRODUCTS TABLE INDEXES
-- ================================================

-- Primary query indexes
CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Badge and feature flags
CREATE INDEX idx_products_is_featured ON products(is_bestseller) WHERE is_bestseller = true;
CREATE INDEX idx_products_is_new_drop ON products(is_new_drop) WHERE is_new_drop = true;

-- Composite index for product listing with filters
CREATE INDEX idx_products_status_category ON products(status, category_id);

-- Text search index for product search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ================================================
-- CATEGORIES TABLE INDEXES
-- ================================================

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);

-- Hierarchical queries
CREATE INDEX idx_categories_parent_name ON categories(parent_id, name);

-- ================================================
-- COLLECTIONS TABLE INDEXES
-- ================================================

CREATE INDEX idx_collections_slug ON collections(slug);
CREATE INDEX idx_collections_is_active ON collections(is_active) WHERE is_active = true;
CREATE INDEX idx_collections_type ON collections(type);

-- ================================================
-- PRODUCT VARIANTS TABLE INDEXES
-- ================================================

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_active ON product_variants(active) WHERE active = true;

-- Composite index for variant lookups
CREATE INDEX idx_product_variants_product_active ON product_variants(product_id, active);

-- ================================================
-- PRODUCT IMAGES TABLE INDEXES
-- ================================================

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_is_primary ON product_images(product_id, is_primary) WHERE is_primary = true;
CREATE INDEX idx_product_images_sort_order ON product_images(product_id, sort_order);

-- ================================================
-- PRODUCT OPTIONS & VALUES INDEXES
-- ================================================

CREATE INDEX idx_product_options_product_id ON product_options(product_id);
CREATE INDEX idx_product_option_values_option_id ON product_option_values(option_id);
CREATE INDEX idx_product_option_values_position ON product_option_values(option_id, position);

-- ================================================
-- VARIANT RELATIONSHIPS INDEXES
-- ================================================

CREATE INDEX idx_variant_option_values_variant_id ON variant_option_values(variant_id);
CREATE INDEX idx_variant_option_values_option_value_id ON variant_option_values(option_value_id);

-- Composite for variant option lookups
CREATE INDEX idx_variant_options_lookup ON variant_option_values(variant_id, option_value_id);

CREATE INDEX idx_variant_prices_variant_id ON variant_prices(variant_id);
CREATE INDEX idx_variant_prices_type ON variant_prices(variant_id, price_type);

-- ================================================
-- INVENTORY TABLE INDEXES
-- ================================================

CREATE INDEX idx_inventory_items_variant_id ON inventory_items(variant_id);
CREATE INDEX idx_inventory_items_sku ON inventory_items(sku);

-- Low stock alerts
CREATE INDEX idx_inventory_items_low_stock ON inventory_items(quantity) 
    WHERE track_quantity = true AND quantity <= low_stock_threshold;

CREATE INDEX idx_inventory_logs_variant_id ON inventory_logs(variant_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);

-- ================================================
-- PRODUCT RELATIONSHIPS INDEXES
-- ================================================

CREATE INDEX idx_product_categories_product_id ON product_categories(product_id);
CREATE INDEX idx_product_categories_category_id ON product_categories(category_id);

-- Composite for junction queries
CREATE INDEX idx_product_categories_both ON product_categories(product_id, category_id);

CREATE INDEX idx_product_collections_product_id ON product_collections(product_id);
CREATE INDEX idx_product_collections_collection_id ON product_collections(collection_id);
CREATE INDEX idx_product_collections_position ON product_collections(collection_id, position);

-- Composite for junction queries
CREATE INDEX idx_product_collections_both ON product_collections(product_id, collection_id);

CREATE INDEX idx_collection_products_collection_id ON collection_products(collection_id);
CREATE INDEX idx_collection_products_product_id ON collection_products(product_id);
CREATE INDEX idx_collection_products_sort_order ON collection_products(collection_id, sort_order);

-- ================================================
-- PRODUCT TAGS INDEXES
-- ================================================

CREATE INDEX idx_product_tags_slug ON product_tags(slug);
CREATE INDEX idx_product_tags_name ON product_tags(name);

CREATE INDEX idx_product_tag_assignments_product_id ON product_tag_assignments(product_id);
CREATE INDEX idx_product_tag_assignments_tag_id ON product_tag_assignments(tag_id);

-- Composite for junction queries
CREATE INDEX idx_product_tag_assignments_both ON product_tag_assignments(product_id, tag_id);

-- ================================================
-- TAX TABLES INDEXES (NEW)
-- ================================================

CREATE INDEX idx_category_tax_rules_category_id ON category_tax_rules(category_id);
CREATE INDEX idx_product_tax_rules_product_id ON product_tax_rules(product_id);
CREATE INDEX idx_order_taxes_order_id ON order_taxes(order_id);

-- ================================================
-- CART & WISHLIST INDEXES
-- ================================================

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_guest_id ON cart_items(guest_id);
CREATE INDEX idx_cart_items_variant_id ON cart_items(variant_id);

-- Composite for user cart lookups
CREATE INDEX idx_cart_items_user_variant ON cart_items(user_id, variant_id);
CREATE INDEX idx_cart_items_guest_variant ON cart_items(guest_id, variant_id);

CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_guest_id ON wishlist_items(guest_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);

-- Composite for user wishlist lookups
CREATE INDEX idx_wishlist_items_user_product ON wishlist_items(user_id, product_id);
CREATE INDEX idx_wishlist_items_guest_product ON wishlist_items(guest_id, product_id);

-- ================================================
-- ORDERS TABLE INDEXES
-- ================================================

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_guest_id ON orders(guest_id);
CREATE INDEX idx_orders_guest_email ON orders(guest_email);
CREATE INDEX idx_orders_order_status ON orders(order_status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);

-- Razorpay tracking
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);

-- ================================================
-- ORDER ITEMS TABLE INDEXES
-- ================================================

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_variant_id ON order_items(variant_id);

-- Composite for order details
CREATE INDEX idx_order_items_order_variant ON order_items(order_id, variant_id);

-- ================================================
-- PAYMENTS TABLE INDEXES
-- ================================================

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_payment_id ON payments(payment_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Payment tracking
CREATE INDEX idx_payments_provider_status ON payments(provider, status);

-- ================================================
-- ADDRESSES TABLE INDEXES
-- ================================================

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_guest_id ON addresses(guest_id);

-- Location-based queries
CREATE INDEX idx_addresses_state ON addresses(state);
CREATE INDEX idx_addresses_pincode ON addresses(pincode);

-- ================================================
-- BANNERS TABLE INDEXES
-- ================================================

CREATE INDEX idx_banners_is_active ON banners(is_active) WHERE is_active = true;
CREATE INDEX idx_banners_placement ON banners(placement);
CREATE INDEX idx_banners_placement_active ON banners(placement, is_active) WHERE is_active = true;

-- ================================================
-- HOMEPAGE SECTIONS TABLE INDEXES
-- ================================================

CREATE INDEX idx_homepage_sections_position ON homepage_sections(position);
CREATE INDEX idx_homepage_sections_is_active ON homepage_sections(is_active) WHERE is_active = true;
CREATE INDEX idx_homepage_sections_collection_id ON homepage_sections(collection_id);

-- Active sections in order
CREATE INDEX idx_homepage_sections_active_position ON homepage_sections(position) 
    WHERE is_active = true;

-- ================================================
-- COUPONS TABLE INDEXES
-- ================================================

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active) WHERE is_active = true;
CREATE INDEX idx_coupons_expires_at ON coupons(expires_at);

-- Active, non-expired coupons
CREATE INDEX idx_coupons_active_valid ON coupons(code, is_active, expires_at) 
    WHERE is_active = true;

-- ================================================
-- STORE LOCATIONS TABLE INDEXES
-- ================================================

CREATE INDEX idx_store_locations_is_active ON store_locations(is_active) WHERE is_active = true;
CREATE INDEX idx_store_locations_is_primary ON store_locations(is_primary) WHERE is_primary = true;
CREATE INDEX idx_store_locations_state ON store_locations(state);

-- ================================================
-- SHIPPING RULES TABLE INDEXES
-- ================================================

CREATE INDEX idx_shipping_rules_zone ON shipping_rules(zone);
CREATE INDEX idx_shipping_rules_is_active ON shipping_rules(is_active) WHERE is_active = true;
CREATE INDEX idx_shipping_rules_zone_active ON shipping_rules(zone, is_active) WHERE is_active = true;

-- ================================================
-- TIMESTAMP INDEXES (for audit trails)
-- ================================================

-- Useful for "recently updated" queries
CREATE INDEX idx_products_updated_at ON products(updated_at DESC);
CREATE INDEX idx_categories_updated_at ON categories(updated_at DESC);
CREATE INDEX idx_collections_updated_at ON collections(updated_at DESC);
CREATE INDEX idx_orders_updated_at ON orders(updated_at DESC);

-- ================================================
-- PARTIAL INDEXES (for specific conditions)
-- ================================================

-- Active products only
CREATE INDEX idx_products_active_only ON products(id, title, price, slug) 
    WHERE status = 'active';

-- In-stock products only
CREATE INDEX idx_products_in_stock ON products(id, title) 
    WHERE in_stock = true AND status = 'active';

-- Active variants with stock
CREATE INDEX idx_variants_available ON product_variants(id, product_id, price) 
    WHERE active = true AND stock > 0;

-- ================================================
-- VERIFICATION & SUCCESS MESSAGE
-- ================================================

DO $$ 
DECLARE
    index_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO index_count
    FROM pg_indexes
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'Successfully created comprehensive performance indexes!';
    RAISE NOTICE 'Total indexes created: %', index_count;
    RAISE NOTICE 'Next step: Execute 04-create-rls-policies.sql';
END $$;
