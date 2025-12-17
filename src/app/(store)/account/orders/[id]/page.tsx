'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Package, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function OrderDetailPage() {
    const params = useParams()
    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true)
                
                // Fetch order from Supabase
                const { data: orderData, error: orderError } = await supabase
                    .from('orders')
                    .select(`
                        *,
                        order_items (
                            *,
                            product_variants (
                                *,
                                products (
                                    name,
                                    product_images (
                                        image_url
                                    )
                                )
                            )
                        ),
                        addresses (*)
                    `)
                    .eq('id', params.id as string)
                    .single()

                if (orderError || !orderData) {
                    console.error('Error fetching order:', orderError)
                    setOrder(null)
                    return
                }

                // Transform data to match expected format
                const shippingAddress = orderData.addresses;
                const transformedOrder = {
                    id: orderData.id,
                    display_id: orderData.id,
                    status: orderData.order_status || 'pending',
                    created_at: orderData.created_at,
                    items: orderData.order_items?.map((item: any) => ({
                        id: item.id,
                        title: item.product_variants?.products?.name || 'Product',
                        quantity: item.quantity,
                        unit_price: item.unit_price * 100, // Convert to paise for display
                        thumbnail: item.product_variants?.products?.product_images?.[0]?.image_url || '/images/placeholder.jpg',
                        variant: {
                            title: `${item.product_variants?.size || ''} / ${item.product_variants?.color || ''}`.trim().replace(/^\/|\/$/g, '') || 'Standard'
                        }
                    })) || [],
                    subtotal: orderData.total_amount * 100, // Convert to paise for display
                    shipping_total: orderData.shipping_amount ? orderData.shipping_amount * 100 : 0,
                    tax_total: 0, // Assuming no tax for now
                    total: orderData.total_amount * 100, // Convert to paise for display
                    shipping_address: shippingAddress ? {
                        first_name: shippingAddress.name?.split(' ')[0] || '',
                        last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
                        address_1: shippingAddress.address_line1,
                        address_2: '',
                        city: shippingAddress.city,
                        province: shippingAddress.state,
                        postal_code: shippingAddress.pincode,
                        phone: shippingAddress.phone
                    } : null,
                    billing_address: shippingAddress ? {
                        first_name: shippingAddress.name?.split(' ')[0] || '',
                        last_name: shippingAddress.name?.split(' ').slice(1).join(' ') || '',
                        address_1: shippingAddress.address_line1,
                        address_2: '',
                        city: shippingAddress.city,
                        province: shippingAddress.state,
                        postal_code: shippingAddress.pincode
                    } : null
                }
                
                setOrder(transformedOrder)
            } catch (error) {
                console.error('Failed to fetch order:', error)
                setOrder(null)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchOrder()
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading order details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto text-center">
                    <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                    <Link
                        href="/account/orders"
                        className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800"
                    >
                        Back to Orders
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/account/orders"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Order #{order.display_id}</h1>
                            <p className="text-gray-600">
                                Placed on {new Date(order.created_at).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-600" />
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'shipped'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{item.title}</h3>
                                            {item.variant && (
                                                <p className="text-sm text-gray-600">{item.variant.title}</p>
                                            )}
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">₹{(item.unit_price / 100).toFixed(0)}</p>
                                            <p className="text-sm text-gray-600">each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{(order.subtotal / 100).toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{order.shipping_total === 0 ? 'Free' : `₹${(order.shipping_total / 100).toFixed(0)}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span>₹{(order.tax_total / 100).toFixed(0)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{(order.total / 100).toFixed(0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="font-medium">
                                        {order.shipping_address.first_name} {order.shipping_address.last_name}
                                    </p>
                                    <p>{order.shipping_address.address_1}</p>
                                    {order.shipping_address.address_2 && (
                                        <p>{order.shipping_address.address_2}</p>
                                    )}
                                    <p>
                                        {order.shipping_address.city}, {order.shipping_address.province} {order.shipping_address.postal_code}
                                    </p>
                                    {order.shipping_address.phone && (
                                        <p className="mt-2 text-gray-600">{order.shipping_address.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4">Billing Address</h2>
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p className="font-medium">
                                        {order.billing_address.first_name} {order.billing_address.last_name}
                                    </p>
                                    <p>{order.billing_address.address_1}</p>
                                    {order.billing_address.address_2 && (
                                        <p>{order.billing_address.address_2}</p>
                                    )}
                                    <p>
                                        {order.billing_address.city}, {order.billing_address.province} {order.billing_address.postal_code}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-gray-600 text-sm">
                        Need help with your order? Contact our support team for assistance.
                    </p>
                </div>
            </div>
        </div>
    )
}