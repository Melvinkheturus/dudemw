import { Json } from './common'

export interface OrdersTable {
    Row: {
        id: string
        user_id: string | null
        guest_id: string | null
        customer_id: string | null
        guest_email: string | null
        customer_name_snapshot: string | null
        customer_email_snapshot: string | null
        customer_phone_snapshot: string | null
        shipping_address_id: string | null
        shipping_zone: string | null
        shipping_amount: number | null
        shipping_tracking_number: string | null
        shipping_provider: string | null
        total_amount: number
        order_status: string | null
        payment_status: string | null
        payment_method: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        user_id?: string | null
        guest_id?: string | null
        customer_id?: string | null
        guest_email?: string | null
        customer_name_snapshot?: string | null
        customer_email_snapshot?: string | null
        customer_phone_snapshot?: string | null
        shipping_address_id?: string | null
        shipping_zone?: string | null
        shipping_amount?: number | null
        shipping_tracking_number?: string | null
        shipping_provider?: string | null
        total_amount: number
        order_status?: string | null
        payment_status?: string | null
        payment_method?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        user_id?: string | null
        guest_id?: string | null
        customer_id?: string | null
        guest_email?: string | null
        customer_name_snapshot?: string | null
        customer_email_snapshot?: string | null
        customer_phone_snapshot?: string | null
        shipping_address_id?: string | null
        shipping_zone?: string | null
        shipping_amount?: number | null
        shipping_tracking_number?: string | null
        shipping_provider?: string | null
        total_amount?: number
        order_status?: string | null
        payment_status?: string | null
        payment_method?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface OrderItemsTable {
    Row: {
        id: string
        order_id: string
        variant_id: string
        quantity: number
        price: number
        created_at: string | null
    }
    Insert: {
        id?: string
        order_id: string
        variant_id: string
        quantity: number
        price: number
        created_at?: string | null
    }
    Update: {
        id?: string
        order_id?: string
        variant_id?: string
        quantity?: number
        price?: number
        created_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
        },
        {
            foreignKeyName: 'order_items_variant_id_fkey'
            columns: ['variant_id']
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
        }
    ]
}

export interface ReturnsTable {
    Row: {
        id: string
        order_id: string | null
        customer_id: string | null
        status: string | null
        reason: string | null
        refund_amount: number | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        order_id?: string | null
        customer_id?: string | null
        status?: string | null
        reason?: string | null
        refund_amount?: number | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        order_id?: string | null
        customer_id?: string | null
        status?: string | null
        reason?: string | null
        refund_amount?: number | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: 'returns_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
        }
    ]
}

export interface AddressesTable {
    Row: {
        id: string
        user_id: string | null
        guest_id: string | null
        name: string
        phone: string
        address_line1: string
        city: string
        state: string
        pincode: string
        created_at: string | null
    }
    Insert: {
        id?: string
        user_id?: string | null
        guest_id?: string | null
        name: string
        phone: string
        address_line1: string
        city: string
        state: string
        pincode: string
        created_at?: string | null
    }
    Update: {
        id?: string
        user_id?: string | null
        guest_id?: string | null
        name?: string
        phone?: string
        address_line1?: string
        city?: string
        state?: string
        pincode?: string
        created_at?: string | null
    }
    Relationships: []
}

export interface CouponsTable {
    Row: {
        id: string
        code: string
        description: string | null
        type: string
        value: number
        min_purchase_amount: number | null
        max_uses: number | null
        current_uses: number | null
        start_date: string | null
        end_date: string | null
        is_active: boolean | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        code: string
        description?: string | null
        type: string
        value: number
        min_purchase_amount?: number | null
        max_uses?: number | null
        current_uses?: number | null
        start_date?: string | null
        end_date?: string | null
        is_active?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        code?: string
        description?: string | null
        type?: string
        value?: number
        min_purchase_amount?: number | null
        max_uses?: number | null
        current_uses?: number | null
        start_date?: string | null
        end_date?: string | null
        is_active?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}
