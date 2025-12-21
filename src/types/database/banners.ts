import { Json } from './common'

export interface BannersTable {
    Row: {
        id: string
        internal_title: string
        image_url: string | null
        link_url: string | null
        cta_text: string | null
        action_type: string | null
        action_target: string | null
        action_name: string | null
        category: string | null
        placement: string | null
        position: number | null
        status: string | null
        start_date: string | null
        end_date: string | null
        impressions: number | null
        clicks: number | null
        ctr: number | null
        carousel_data: Json | null
        marquee_data: Json | null
        created_at: string | null
        updated_at: string | null
    }
    Insert: {
        id?: string
        internal_title: string
        image_url?: string | null
        link_url?: string | null
        cta_text?: string | null
        action_type?: string | null
        action_target?: string | null
        action_name?: string | null
        category?: string | null
        placement?: string | null
        position?: number | null
        status?: string | null
        start_date?: string | null
        end_date?: string | null
        impressions?: number | null
        clicks?: number | null
        ctr?: number | null
        carousel_data?: Json | null
        marquee_data?: Json | null
        created_at?: string | null
        updated_at?: string | null
    }
    Update: {
        id?: string
        internal_title?: string
        image_url?: string | null
        link_url?: string | null
        cta_text?: string | null
        action_type?: string | null
        action_target?: string | null
        action_name?: string | null
        category?: string | null
        placement?: string | null
        position?: number | null
        status?: string | null
        start_date?: string | null
        end_date?: string | null
        impressions?: number | null
        clicks?: number | null
        ctr?: number | null
        carousel_data?: Json | null
        marquee_data?: Json | null
        created_at?: string | null
        updated_at?: string | null
    }
    Relationships: []
}

export interface AdvertisementsTable {
    Row: {
        id: string
        title: string
        image_url: string
        link: string | null
        count: number | null
        is_active: boolean | null
        created_at: string
        updated_at: string
    }
    Insert: {
        id?: string
        title: string
        image_url: string
        link?: string | null
        count?: number | null
        is_active?: boolean | null
        created_at?: string
        updated_at?: string
    }
    Update: {
        id?: string
        title?: string
        image_url?: string
        link?: string | null
        count?: number | null
        is_active?: boolean | null
        created_at?: string
        updated_at?: string
    }
    Relationships: []
}
