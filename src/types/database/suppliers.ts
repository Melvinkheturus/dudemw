import type { Json } from './common'

export interface SuppliersTable {
    Row: {
        id: string
        name: string
        contact_person: string | null
        email: string | null
        phone: string | null
        address: string | null
        is_active: boolean | null
        notes: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        name: string
        contact_person?: string | null
        email?: string | null
        phone?: string | null
        address?: string | null
        is_active?: boolean | null
        notes?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        name?: string
        contact_person?: string | null
        email?: string | null
        phone?: string | null
        address?: string | null
        is_active?: boolean | null
        notes?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface SupplierProductsTable {
    Row: {
        id: string
        supplier_id: string
        product_id: string
        variant_id: string | null
        supplier_sku: string | null
        cost: number | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        supplier_id: string
        product_id: string
        variant_id?: string | null
        supplier_sku?: string | null
        cost?: number | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        supplier_id?: string
        product_id?: string
        variant_id?: string | null
        supplier_sku?: string | null
        cost?: number | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: "supplier_products_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "supplier_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "supplier_products_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
        },
    ]
}
