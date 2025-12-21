// Re-export common types
export type { Json } from './common'

// Import all table types
import {
    ProductsTable,
    ProductVariantsTable,
    ProductImagesTable,
    ProductOptionsTable,
    ProductOptionValuesTable,
    VariantOptionValuesTable,
    ProductCategoriesTable,
    ProductCollectionsTable,
    ProductTagsTable,
    ProductTagAssignmentsTable,
    ProductAnalyticsTable,
    InventoryItemsTable,
} from './products'

import {
    CategoriesTable,
    CollectionsTable,
    CollectionProductsTable,
} from './categories'

import {
    OrdersTable,
    OrderItemsTable,
    ReturnsTable,
    AddressesTable,
    CouponsTable,
} from './orders'

import {
    CustomersTable,
    ProfilesTable,
    AdminProfilesTable,
    AuditLogsTable,
} from './users'

import {
    BannersTable,
    AdvertisementsTable,
} from './banners'

import {
    StoreSettingsTable,
    SystemPreferencesTable,
} from './settings'

// Main Database type for Supabase
export type Database = {
    public: {
        Tables: {
            products: ProductsTable
            product_variants: ProductVariantsTable
            product_images: ProductImagesTable
            product_options: ProductOptionsTable
            product_option_values: ProductOptionValuesTable
            variant_option_values: VariantOptionValuesTable
            product_categories: ProductCategoriesTable
            product_collections: ProductCollectionsTable
            product_tags: ProductTagsTable
            product_tag_assignments: ProductTagAssignmentsTable
            product_analytics: ProductAnalyticsTable
            inventory_items: InventoryItemsTable
            categories: CategoriesTable
            collections: CollectionsTable
            collection_products: CollectionProductsTable
            orders: OrdersTable
            order_items: OrderItemsTable
            returns: ReturnsTable
            addresses: AddressesTable
            coupons: CouponsTable
            customers: CustomersTable
            profiles: ProfilesTable
            admin_profiles: AdminProfilesTable
            audit_logs: AuditLogsTable
            banners: BannersTable
            advertisements: AdvertisementsTable
            store_settings: StoreSettingsTable
            system_preferences: SystemPreferencesTable
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for table access
export type PublicSchema = Database['public']

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions['schema']]['Tables'])[TableName] extends {
        Row: infer R
    }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'])
    ? (PublicSchema['Tables'])[PublicTableNameOrOptions] extends {
        Row: infer R
    }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
