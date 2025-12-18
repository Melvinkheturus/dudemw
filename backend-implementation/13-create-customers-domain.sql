-- ================================================
-- CUSTOMER DOMAIN ARCHITECTURE
-- ================================================
-- This implements proper domain-driven design where:
-- - Customers are commercial identities
-- - Auth users are authentication identities  
-- - Admins are never customers
-- ================================================

-- ================================================
-- 1. CREATE CUSTOMERS TABLE
-- ================================================
-- This is the SOURCE OF TRUTH for all customer data
-- Guests and registered users are BOTH customers

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Link to auth (nullable for guests)
    auth_user_id UUID UNIQUE, -- References auth.users, but not FK to avoid cascade
    
    -- Contact information
    email TEXT,
    phone TEXT,
    
    -- Personal information
    first_name TEXT,
    last_name TEXT,
    
    -- Customer classification
    customer_type TEXT NOT NULL CHECK (customer_type IN ('guest', 'registered')),
    
    -- Customer status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_order_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT email_or_phone_required CHECK (email IS NOT NULL OR phone IS NOT NULL),
    CONSTRAINT auth_user_required_for_registered CHECK (
        customer_type = 'guest' OR (customer_type = 'registered' AND auth_user_id IS NOT NULL)
    )
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_auth_user_id ON customers(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);

-- ================================================
-- 2. CREATE CUSTOMER ADDRESSES TABLE
-- ================================================
-- Replaces the old addresses table with proper customer references

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Address details
    name TEXT NOT NULL, -- Recipient name
    phone TEXT NOT NULL,
    email TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'India',
    
    -- Address type and default
    address_type TEXT DEFAULT 'shipping' CHECK (address_type IN ('shipping', 'billing', 'both')),
    is_default BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customer_addresses_customer_id ON customer_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_is_default ON customer_addresses(customer_id, is_default) WHERE is_default = TRUE;

-- ================================================
-- 3. ADD CUSTOMER REFERENCE TO ORDERS
-- ================================================
-- Add customer_id to orders (without dropping existing columns for migration)

DO $$
BEGIN
    -- Add customer_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_id'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT;
        CREATE INDEX idx_orders_customer_id ON orders(customer_id);
    END IF;
    
    -- Add email and phone snapshots if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_email_snapshot'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_email_snapshot TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_phone_snapshot'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_phone_snapshot TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'orders' AND column_name = 'customer_name_snapshot'
    ) THEN
        ALTER TABLE orders ADD COLUMN customer_name_snapshot TEXT;
    END IF;
END $$;

-- ================================================
-- 4. CREATE CUSTOMER ACTIVITY LOG
-- ================================================
-- Track important customer events

CREATE TABLE IF NOT EXISTS customer_activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Activity details
    activity_type TEXT NOT NULL, -- 'order_placed', 'account_created', 'guest_merged', etc.
    description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_activity_customer_id ON customer_activity_log(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_activity_type ON customer_activity_log(activity_type);

-- ================================================
-- 5. CREATE CUSTOMER NOTES (ADMIN ONLY)
-- ================================================
-- For admin to add internal notes about customers

CREATE TABLE IF NOT EXISTS customer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Note content
    note TEXT NOT NULL,
    
    -- Author (admin user)
    created_by UUID NOT NULL, -- References auth.users (admin)
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON customer_notes(customer_id, created_at DESC);

-- ================================================
-- 6. CREATE HELPER FUNCTIONS
-- ================================================

-- Function to check if a user is an admin (not a customer)
CREATE OR REPLACE FUNCTION is_user_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_profiles
        WHERE user_id = $1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create customer for auth user
CREATE OR REPLACE FUNCTION get_or_create_customer_for_user(
    p_auth_user_id UUID,
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
    v_is_admin BOOLEAN;
BEGIN
    -- Check if user is admin
    v_is_admin := is_user_admin(p_auth_user_id);
    
    IF v_is_admin THEN
        RAISE EXCEPTION 'Admins cannot be customers';
    END IF;
    
    -- Try to find existing customer by auth_user_id
    SELECT id INTO v_customer_id
    FROM customers
    WHERE auth_user_id = p_auth_user_id;
    
    IF v_customer_id IS NOT NULL THEN
        RETURN v_customer_id;
    END IF;
    
    -- Try to find guest customer by email to merge
    IF p_email IS NOT NULL THEN
        SELECT id INTO v_customer_id
        FROM customers
        WHERE email = p_email
        AND customer_type = 'guest'
        AND auth_user_id IS NULL
        LIMIT 1;
        
        IF v_customer_id IS NOT NULL THEN
            -- Merge guest to registered
            UPDATE customers
            SET 
                auth_user_id = p_auth_user_id,
                customer_type = 'registered',
                first_name = COALESCE(p_first_name, first_name),
                last_name = COALESCE(p_last_name, last_name),
                phone = COALESCE(p_phone, phone),
                updated_at = NOW()
            WHERE id = v_customer_id;
            
            -- Log the merge activity
            INSERT INTO customer_activity_log (customer_id, activity_type, description)
            VALUES (v_customer_id, 'guest_merged', 'Guest account merged with registered account');
            
            RETURN v_customer_id;
        END IF;
    END IF;
    
    -- Create new registered customer
    INSERT INTO customers (
        auth_user_id,
        email,
        phone,
        first_name,
        last_name,
        customer_type
    ) VALUES (
        p_auth_user_id,
        p_email,
        p_phone,
        p_first_name,
        p_last_name,
        'registered'
    )
    RETURNING id INTO v_customer_id;
    
    -- Log the creation
    INSERT INTO customer_activity_log (customer_id, activity_type, description)
    VALUES (v_customer_id, 'account_created', 'Registered customer account created');
    
    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create or get guest customer
CREATE OR REPLACE FUNCTION get_or_create_guest_customer(
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_customer_id UUID;
BEGIN
    -- Try to find existing guest by email
    SELECT id INTO v_customer_id
    FROM customers
    WHERE email = p_email
    AND customer_type = 'guest'
    LIMIT 1;
    
    IF v_customer_id IS NOT NULL THEN
        -- Update last order time
        UPDATE customers
        SET 
            last_order_at = NOW(),
            phone = COALESCE(p_phone, phone),
            first_name = COALESCE(p_first_name, first_name),
            last_name = COALESCE(p_last_name, last_name),
            updated_at = NOW()
        WHERE id = v_customer_id;
        
        RETURN v_customer_id;
    END IF;
    
    -- Create new guest customer
    INSERT INTO customers (
        email,
        phone,
        first_name,
        last_name,
        customer_type
    ) VALUES (
        p_email,
        p_phone,
        p_first_name,
        p_last_name,
        'guest'
    )
    RETURNING id INTO v_customer_id;
    
    RETURN v_customer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- 7. CREATE RLS POLICIES
-- ================================================

-- Enable RLS on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;

-- Admin can see all customers (except other admins)
CREATE POLICY "Admins can view all customers"
    ON customers FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
        AND NOT is_user_admin(auth_user_id)
    );

-- Customers can view their own data
CREATE POLICY "Customers can view own data"
    ON customers FOR SELECT
    TO authenticated
    USING (auth_user_id = auth.uid());

-- Service role bypasses RLS (for server actions)
CREATE POLICY "Service role full access to customers"
    ON customers
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Customer addresses policies
CREATE POLICY "Admins can view all customer addresses"
    ON customer_addresses FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Customers can view own addresses"
    ON customer_addresses FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE id = customer_id 
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Customers can manage own addresses"
    ON customer_addresses FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE id = customer_id 
            AND auth_user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM customers 
            WHERE id = customer_id 
            AND auth_user_id = auth.uid()
        )
    );

CREATE POLICY "Service role full access to addresses"
    ON customer_addresses
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Customer activity log policies
CREATE POLICY "Admins can view activity logs"
    ON customer_activity_log FOR SELECT
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Service role full access to activity logs"
    ON customer_activity_log
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Customer notes policies (admin only)
CREATE POLICY "Admins can manage customer notes"
    ON customer_notes FOR ALL
    TO authenticated
    USING (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM admin_profiles WHERE user_id = auth.uid())
    );

CREATE POLICY "Service role full access to notes"
    ON customer_notes
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ================================================
-- 8. CREATE TRIGGERS
-- ================================================

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

CREATE TRIGGER customer_addresses_updated_at
    BEFORE UPDATE ON customer_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

CREATE TRIGGER customer_notes_updated_at
    BEFORE UPDATE ON customer_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_customers_updated_at();

-- Trigger to ensure only one default address per customer
CREATE OR REPLACE FUNCTION ensure_single_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = TRUE THEN
        -- Unset other default addresses for this customer
        UPDATE customer_addresses
        SET is_default = FALSE
        WHERE customer_id = NEW.customer_id
        AND id != NEW.id
        AND is_default = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER customer_addresses_default_check
    BEFORE INSERT OR UPDATE ON customer_addresses
    FOR EACH ROW
    WHEN (NEW.is_default = TRUE)
    EXECUTE FUNCTION ensure_single_default_address();

-- ================================================
-- SUCCESS MESSAGE
-- ================================================

DO $$ 
BEGIN
    RAISE NOTICE '✅ Customer Domain Architecture Created Successfully!';
    RAISE NOTICE '📋 Tables Created:';
    RAISE NOTICE '   - customers';
    RAISE NOTICE '   - customer_addresses';
    RAISE NOTICE '   - customer_activity_log';
    RAISE NOTICE '   - customer_notes';
    RAISE NOTICE '🔐 RLS Policies Enabled';
    RAISE NOTICE '⚡ Helper Functions Created';
    RAISE NOTICE '🎯 Triggers Configured';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Run migration script to populate customer data from existing orders';
END $$;
