-- ================================================
-- Settings Tables for Admin Panel
-- ================================================

-- Store Settings Table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL,
  legal_name TEXT,
  description TEXT,
  logo_url TEXT,
  support_email TEXT,
  support_phone TEXT,
  gst_number TEXT,
  invoice_prefix TEXT NOT NULL DEFAULT 'DMW',
  currency TEXT NOT NULL DEFAULT 'INR',
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'India',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  razorpay_enabled BOOLEAN DEFAULT FALSE,
  razorpay_key_id TEXT,
  razorpay_key_secret TEXT,
  razorpay_test_mode BOOLEAN DEFAULT TRUE,
  cod_enabled BOOLEAN DEFAULT TRUE,
  cod_max_amount NUMERIC(10,2),
  payment_methods TEXT[] DEFAULT ARRAY['cod', 'razorpay']::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  countries TEXT[] DEFAULT ARRAY['India']::TEXT[],
  states TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Rates Table
CREATE TABLE IF NOT EXISTS shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat', 'weight_based', 'price_based')),
  base_rate NUMERIC(10,2) NOT NULL,
  min_weight NUMERIC(10,2),
  max_weight NUMERIC(10,2),
  min_price NUMERIC(10,2),
  max_price NUMERIC(10,2),
  free_shipping_threshold NUMERIC(10,2),
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tax Settings Table
CREATE TABLE IF NOT EXISTS tax_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tax_name TEXT NOT NULL DEFAULT 'GST',
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 18.00,
  is_inclusive BOOLEAN DEFAULT TRUE,
  apply_to_shipping BOOLEAN DEFAULT FALSE,
  tax_id_required BOOLEAN DEFAULT FALSE,
  region_specific_rates JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_notifications_enabled BOOLEAN DEFAULT TRUE,
  order_number_format TEXT DEFAULT 'DMW-{YYYY}{MM}{DD}-{XXXX}',
  low_stock_threshold INTEGER DEFAULT 5,
  analytics_enabled BOOLEAN DEFAULT TRUE,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  website TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Supplier Products Table (links products to suppliers)
CREATE TABLE IF NOT EXISTS supplier_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  supplier_sku TEXT,
  cost_price NUMERIC(10,2),
  lead_time_days INTEGER,
  min_order_quantity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Logs Table (if not exists)
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  previous_quantity INTEGER,
  new_quantity INTEGER,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone_id ON shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier_id ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product_id ON supplier_products(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_variant_id ON inventory_logs(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_logs_created_at ON inventory_logs(created_at DESC);

-- Add comments
COMMENT ON TABLE store_settings IS 'Store identity and basic configuration';
COMMENT ON TABLE payment_settings IS 'Payment gateway and method configuration';
COMMENT ON TABLE shipping_zones IS 'Geographic shipping zones';
COMMENT ON TABLE shipping_rates IS 'Shipping rates per zone';
COMMENT ON TABLE tax_settings IS 'Tax configuration and rates';
COMMENT ON TABLE system_settings IS 'System-wide settings';
COMMENT ON TABLE suppliers IS 'Supplier information';
COMMENT ON TABLE supplier_products IS 'Product-supplier relationships';
COMMENT ON TABLE inventory_logs IS 'Inventory adjustment history';
