// Wishlist types
export interface WishlistsTable {
    Row: {
        id: string
        user_id: string
        product_id: string
        created_at: string | null
    }
    Insert: {
        id?: string
        user_id: string
        product_id: string
        created_at?: string | null
    }
    Update: {
        id?: string
        user_id?: string
        product_id?: string
        created_at?: string | null
    }
    Relationships: [
        {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
        }
    ]
}
