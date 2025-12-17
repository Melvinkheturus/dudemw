// Order domain types

export interface Order {
    id: string
    user_id?: string
    guest_id?: string
    guest_email?: string
    order_status: OrderStatus
    payment_status: PaymentStatus
    total_amount: number
    shipping_address_id?: string
    created_at: string
    updated_at?: string
    items?: OrderItem[]
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
    id: string
    order_id: string
    product_id?: string
    variant_id: string
    quantity: number
    price: number
    name?: string
    image?: string
}

// Export a placeholder useOrder hook
export function useOrder(orderId?: string) {
    // This is a placeholder - implement actual order fetching logic
    return {
        order: null as Order | null,
        isLoading: false,
        error: null as Error | null,
    }
}
