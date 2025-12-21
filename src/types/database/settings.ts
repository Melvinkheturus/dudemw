export interface StoreSettingsTable {
    Row: {
        id: string
        store_name: string
        legal_name: string | null
        description: string | null
        logo_url: string | null
        support_email: string | null
        support_phone: string | null
        address: string | null
        city: string | null
        state: string | null
        postal_code: string | null
        country: string
        currency: string
        timezone: string
        gst_number: string | null
        invoice_prefix: string
        terms_url: string | null
        privacy_url: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        store_name?: string
        legal_name?: string | null
        description?: string | null
        logo_url?: string | null
        support_email?: string | null
        support_phone?: string | null
        address?: string | null
        city?: string | null
        state?: string | null
        postal_code?: string | null
        country?: string
        currency?: string
        timezone?: string
        gst_number?: string | null
        invoice_prefix?: string
        terms_url?: string | null
        privacy_url?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        store_name?: string
        legal_name?: string | null
        description?: string | null
        logo_url?: string | null
        support_email?: string | null
        support_phone?: string | null
        address?: string | null
        city?: string | null
        state?: string | null
        postal_code?: string | null
        country?: string
        currency?: string
        timezone?: string
        gst_number?: string | null
        invoice_prefix?: string
        terms_url?: string | null
        privacy_url?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface SystemPreferencesTable {
    Row: {
        id: string
        low_stock_threshold: number | null
        low_stock_alert: boolean | null
        allow_backorders: boolean | null
        free_shipping_enabled: boolean | null
        free_shipping_threshold: number | null
        guest_checkout_enabled: boolean | null
        auto_cancel_enabled: boolean | null
        auto_cancel_minutes: number | null
        order_placed_email: boolean | null
        order_shipped_email: boolean | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        low_stock_threshold?: number | null
        low_stock_alert?: boolean | null
        allow_backorders?: boolean | null
        free_shipping_enabled?: boolean | null
        free_shipping_threshold?: number | null
        guest_checkout_enabled?: boolean | null
        auto_cancel_enabled?: boolean | null
        auto_cancel_minutes?: number | null
        order_placed_email?: boolean | null
        order_shipped_email?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        low_stock_threshold?: number | null
        low_stock_alert?: boolean | null
        allow_backorders?: boolean | null
        free_shipping_enabled?: boolean | null
        free_shipping_threshold?: number | null
        guest_checkout_enabled?: boolean | null
        auto_cancel_enabled?: boolean | null
        auto_cancel_minutes?: number | null
        order_placed_email?: boolean | null
        order_shipped_email?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}
