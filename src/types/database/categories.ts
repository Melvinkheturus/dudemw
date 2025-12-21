import { Json } from './common'

export interface CategoriesTable {
    Row: {
        id: string
        name: string
        slug: string
        description: string | null
        image: string | null
        image_url: string | null
        icon_url: string | null
        homepage_thumbnail_url: string | null
        homepage_video_url: string | null
        plp_square_thumbnail_url: string | null
        parent_id: string | null
        is_active: boolean | null
        status: string | null
        display_order: number | null
        meta_title: string | null
        meta_description: string | null
        selected_banner_id: string | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        name: string
        slug: string
        description?: string | null
        image?: string | null
        image_url?: string | null
        icon_url?: string | null
        homepage_thumbnail_url?: string | null
        homepage_video_url?: string | null
        plp_square_thumbnail_url?: string | null
        parent_id?: string | null
        is_active?: boolean | null
        status?: string | null
        display_order?: number | null
        meta_title?: string | null
        meta_description?: string | null
        selected_banner_id?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        name?: string
        slug?: string
        description?: string | null
        image?: string | null
        image_url?: string | null
        icon_url?: string | null
        homepage_thumbnail_url?: string | null
        homepage_video_url?: string | null
        plp_square_thumbnail_url?: string | null
        parent_id?: string | null
        is_active?: boolean | null
        status?: string | null
        display_order?: number | null
        meta_title?: string | null
        meta_description?: string | null
        selected_banner_id?: string | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: 'categories_parent_id_fkey'
            columns: ['parent_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
        }
    ]
}

export interface CollectionsTable {
    Row: {
        id: string
        title: string
        slug: string
        description: string | null
        type: string
        rule_json: Json | null
        is_active: boolean | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        title: string
        slug: string
        description?: string | null
        type: string
        rule_json?: Json | null
        is_active?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        title?: string
        slug?: string
        description?: string | null
        type?: string
        rule_json?: Json | null
        is_active?: boolean | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface CollectionProductsTable {
    Row: {
        id: string
        collection_id: string | null
        product_id: string
        sort_order: number | null
        created_at: string | null
    }
    Insert: {
        id?: string
        collection_id?: string | null
        product_id: string
        sort_order?: number | null
        created_at?: string | null
    }
    Update: {
        id?: string
        collection_id?: string | null
        product_id?: string
        sort_order?: number | null
        created_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: 'collection_products_collection_id_fkey'
            columns: ['collection_id']
            referencedRelation: 'collections'
            referencedColumns: ['id']
        },
        {
            foreignKeyName: 'collection_products_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
        }
    ]
}
