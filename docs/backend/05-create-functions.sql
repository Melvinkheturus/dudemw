-- ================================================
-- CREATE HELPER FUNCTIONS
-- ================================================
-- This script creates utility functions for authentication and permissions
-- Execute this FIFTH and LAST after creating RLS policies
-- ================================================

-- ================================================
-- ADMIN CHECK FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get user role from auth.users metadata
    SELECT raw_user_meta_data->>'role' INTO user_role
    FROM auth.users
    WHERE id = auth.uid();
    
    -- Return true if user is admin or owner
    RETURN user_role IN ('admin', 'owner');
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION is_admin_user() IS 
'Returns true if the current user has admin or owner role. Used in RLS policies to grant admin access.';

-- ================================================
-- OWNER CHECK FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION is_owner_user()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Get user role from auth.users metadata
    SELECT raw_user_meta_data->>'role' INTO user_role
    FROM auth.users
    WHERE id = auth.uid();
    
    -- Return true only if user is owner (highest privilege)
    RETURN user_role = 'owner';
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comment for documentation
COMMENT ON FUNCTION is_owner_user() IS 
'Returns true if the current user has owner role (highest privilege). Used for sensitive operations.';

-- ================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comment for documentation
COMMENT ON FUNCTION update_updated_at_column() IS 
'Automatically updates the updated_at timestamp when a row is modified.';

-- ================================================
-- APPLY UPDATED_AT TRIGGERS TO TABLES
-- ================================================

-- Store Configuration
CREATE TRIGGER update_store_settings_updated_at
    BEFORE UPDATE ON store_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_locations_updated_at
    BEFORE UPDATE ON store_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_settings_updated_at
    BEFORE UPDATE ON notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at
    BEFORE UPDATE ON payment_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_settings_updated_at
    BEFORE UPDATE ON shipping_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_rules_updated_at
    BEFORE UPDATE ON shipping_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Tax Settings
CREATE TRIGGER update_tax_settings_updated_at
    BEFORE UPDATE ON tax_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_tax_rules_updated_at
    BEFORE UPDATE ON category_tax_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_tax_rules_updated_at
    BEFORE UPDATE ON product_tax_rules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Categories
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Collections
CREATE TRIGGER update_collections_updated_at
    BEFORE UPDATE ON collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Products
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_options_updated_at
    BEFORE UPDATE ON product_options
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
    BEFORE UPDATE ON product_variants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variant_prices_updated_at
    BEFORE UPDATE ON variant_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inventory
CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Banners & Homepage
CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homepage_sections_updated_at
    BEFORE UPDATE ON homepage_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Coupons
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Orders
CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- INVENTORY MANAGEMENT FUNCTIONS
-- ================================================

-- Function to reserve inventory when order is placed
CREATE OR REPLACE FUNCTION reserve_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available INTEGER;
BEGIN
    -- Get current available quantity
    SELECT available_quantity INTO v_available
    FROM inventory_items
    WHERE variant_id = p_variant_id;
    
    -- Check if enough stock is available
    IF v_available < p_quantity THEN
        RETURN FALSE;
    END IF;
    
    -- Reserve the inventory
    UPDATE inventory_items
    SET 
        available_quantity = available_quantity - p_quantity,
        reserved_quantity = reserved_quantity + p_quantity
    WHERE variant_id = p_variant_id;
    
    -- Log the inventory change
    INSERT INTO inventory_logs (variant_id, change_amount, reason)
    VALUES (p_variant_id, -p_quantity, 'Reserved for order');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reserve_inventory(UUID, INTEGER) IS 
'Reserves inventory for an order. Returns false if insufficient stock.';

-- Function to release reserved inventory (e.g., when order is cancelled)
CREATE OR REPLACE FUNCTION release_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Release the reserved inventory
    UPDATE inventory_items
    SET 
        available_quantity = available_quantity + p_quantity,
        reserved_quantity = reserved_quantity - p_quantity
    WHERE variant_id = p_variant_id;
    
    -- Log the inventory change
    INSERT INTO inventory_logs (variant_id, change_amount, reason)
    VALUES (p_variant_id, p_quantity, 'Released from cancelled order');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION release_inventory(UUID, INTEGER) IS 
'Releases reserved inventory back to available stock.';

-- Function to confirm inventory (when order is shipped)
CREATE OR REPLACE FUNCTION confirm_inventory(
    p_variant_id UUID,
    p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    -- Reduce reserved and total quantity
    UPDATE inventory_items
    SET 
        quantity = quantity - p_quantity,
        reserved_quantity = reserved_quantity - p_quantity
    WHERE variant_id = p_variant_id;
    
    -- Log the inventory change
    INSERT INTO inventory_logs (variant_id, change_amount, reason)
    VALUES (p_variant_id, -p_quantity, 'Order shipped');
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION confirm_inventory(UUID, INTEGER) IS 
'Confirms inventory reduction when order is shipped. Removes from reserved and total quantity.';

-- ================================================
-- SLUG GENERATION FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(text_input, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            ),
            '-+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION generate_slug(TEXT) IS 
'Generates a URL-friendly slug from text input.';

-- ================================================
-- ORDER NUMBER GENERATION FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    order_count INTEGER;
    order_number TEXT;
BEGIN
    -- Get count of orders today
    SELECT COUNT(*) INTO order_count
    FROM orders
    WHERE DATE(created_at) = CURRENT_DATE;
    
    -- Generate order number: DMW-YYYYMMDD-XXXX
    order_number := 'DMW-' || 
                   TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' ||
                   LPAD((order_count + 1)::TEXT, 4, '0');
    
    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_order_number() IS 
'Generates a unique order number for each order.';

-- ================================================
-- COUPON VALIDATION FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    order_amount NUMERIC
)
RETURNS TABLE(
    is_valid BOOLEAN,
    discount_amount NUMERIC,
    message TEXT
) AS $$
DECLARE
    v_coupon RECORD;
    v_discount NUMERIC;
BEGIN
    -- Get coupon details
    SELECT * INTO v_coupon
    FROM coupons
    WHERE code = coupon_code AND is_active = true;
    
    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 0::NUMERIC, 'Invalid coupon code'::TEXT;
        RETURN;
    END IF;
    
    -- Check if expired
    IF v_coupon.expires_at IS NOT NULL AND v_coupon.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, 0::NUMERIC, 'Coupon has expired'::TEXT;
        RETURN;
    END IF;
    
    -- Check usage limit
    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
        RETURN QUERY SELECT FALSE, 0::NUMERIC, 'Coupon usage limit reached'::TEXT;
        RETURN;
    END IF;
    
    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount := (order_amount * v_coupon.discount_value / 100);
    ELSE
        v_discount := v_coupon.discount_value;
    END IF;
    
    -- Ensure discount doesn't exceed order amount
    IF v_discount > order_amount THEN
        v_discount := order_amount;
    END IF;
    
    RETURN QUERY SELECT TRUE, v_discount, 'Coupon applied successfully'::TEXT;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION validate_coupon(TEXT, NUMERIC) IS 
'Validates a coupon code and returns discount amount if valid.';

-- ================================================
-- PRODUCT STOCK CHECK FUNCTION
-- ================================================

CREATE OR REPLACE FUNCTION check_product_stock(p_variant_id UUID)
RETURNS TABLE(
    in_stock BOOLEAN,
    available_quantity INTEGER,
    is_low_stock BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (i.available_quantity > 0) AS in_stock,
        i.available_quantity,
        (i.track_quantity AND i.available_quantity <= i.low_stock_threshold) AS is_low_stock
    FROM inventory_items i
    WHERE i.variant_id = p_variant_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_product_stock(UUID) IS 
'Checks stock availability for a product variant.';

-- ================================================
-- VERIFICATION & SUCCESS MESSAGE
-- ================================================

DO $$ 
DECLARE
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO function_count
    FROM pg_proc
    WHERE pronamespace = 'public'::regnamespace;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'DATABASE SETUP COMPLETE!';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Successfully created all helper functions and triggers!';
    RAISE NOTICE 'Total functions created: %', function_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Regenerate TypeScript types:';
    RAISE NOTICE '   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts';
    RAISE NOTICE '2. Verify all tables: SELECT table_name FROM information_schema.tables WHERE table_schema = ''public'';';
    RAISE NOTICE '3. Test admin function: SELECT is_admin_user();';
    RAISE NOTICE '4. Insert initial data as needed';
    RAISE NOTICE '';
    RAISE NOTICE 'Your database is now ready for use!';
    RAISE NOTICE '================================================';
END $$;
