import { Json } from './common'

export interface CustomersTable {
    Row: {
        id: string
        auth_user_id: string | null
        email: string | null
        phone: string | null
        first_name: string | null
        last_name: string | null
        customer_type: string
        status: string | null
        metadata: Json | null
        last_order_at: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        auth_user_id?: string | null
        email?: string | null
        phone?: string | null
        first_name?: string | null
        last_name?: string | null
        customer_type?: string
        status?: string | null
        metadata?: Json | null
        last_order_at?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        auth_user_id?: string | null
        email?: string | null
        phone?: string | null
        first_name?: string | null
        last_name?: string | null
        customer_type?: string
        status?: string | null
        metadata?: Json | null
        last_order_at?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface ProfilesTable {
    Row: {
        id: string
        full_name: string | null
        phone: string | null
        avatar_url: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id: string
        full_name?: string | null
        phone?: string | null
        avatar_url?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        full_name?: string | null
        phone?: string | null
        avatar_url?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface AdminProfilesTable {
    Row: {
        id: string
        user_id: string
        role: string
        is_active: boolean | null
        approved_by: string | null
        approved_at: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        user_id: string
        role: string
        is_active?: boolean | null
        approved_by?: string | null
        approved_at?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        user_id?: string
        role?: string
        is_active?: boolean | null
        approved_by?: string | null
        approved_at?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface AuditLogsTable {
    Row: {
        id: string
        admin_id: string | null
        action: string
        entity_type: string
        entity_id: string | null
        details: Json | null
        created_at: string | null
    }
    Insert: {
        id?: string
        admin_id?: string | null
        action: string
        entity_type: string
        entity_id?: string | null
        details?: Json | null
        created_at?: string | null
    }
    Update: {
        id?: string
        admin_id?: string | null
        action?: string
        entity_type?: string
        entity_id?: string | null
        details?: Json | null
        created_at?: string | null
    }
    Relationships: []
}
