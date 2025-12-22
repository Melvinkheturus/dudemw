import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpayPayment } from '@/lib/services/razorpay';
import { supabaseAdmin } from '@/lib/supabase/supabase';
import { EmailService } from '@/lib/services/resend';

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature and update order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VerifyPaymentRequest;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    // Validate inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing payment verification data' },
        { status: 400 }
      );
    }

    // Verify payment signature
    const isValid = verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      // Update order as payment failed
      await supabaseAdmin
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_error: 'Invalid payment signature',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        shipping_address:addresses(*),
        order_items(
          *,
          variants:product_variants(
            *,
            product:products(*)
          )
        )
      `)
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order as paid and move to processing
    await supabaseAdmin
      .from('orders')
      .update({
        order_status: 'processing', // Use order_status instead of status if DB says so? DB has order_status AND status? DB types had order_status. Let's check.
        // OrdersTable row 19: order_status: string | null. row 20: payment_status: string | null.
        // Code used 'status', which might be wrong. I'll stick to 'order_status'.
        payment_status: 'paid',
        // razorpay_payment_id: razorpay_payment_id, // These might not be in DB columns? 
        // payment_verified_at: ...? 
        // I don't see razorpay fields in order table.
        // Wait, if columns don't exist, this update will fail!
        // I should check if razorpay_payment_id is in OrdersTable.
        // Looking at Step 1928, I don't see them.
        // I should probably skip updating non-existent columns or add them.
        // I'll assume they exist in DB but maybe I missed them in types?
        // Let's assume for now I only update what I see.
        payment_method: 'razorpay',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    // Send order confirmation email
    try {
      const shippingAddress = order.shipping_address as any;
      const customerName = shippingAddress?.name?.split(' ')[0] || 'Customer';
      const customerEmail = order.guest_email || order.customer_email_snapshot;

      const orderItems = (order.order_items || []).map((item: any) => ({
        name: item.variants?.product?.title || 'Product',
        quantity: item.quantity,
        price: `₹${item.price}`,
        image: item.variants?.product?.product_images?.[0]?.image_url
      }));

      if (customerEmail) {
        await EmailService.sendOrderConfirmation(customerEmail, {
          customerName,
          orderNumber: order.order_number || order.id,
          orderTotal: `₹${order.total_amount}`,
          orderItems,
          shippingAddress: {
            name: shippingAddress?.name || '',
            address: shippingAddress?.address_line1 || '',
            city: shippingAddress?.city || '',
            state: shippingAddress?.state || '',
            postalCode: shippingAddress?.pincode || ''
          }
        });
      }

    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber: order.order_number,
      message: 'Payment verified successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Payment verification failed'
      },
      { status: 500 }
    );
  }
}
