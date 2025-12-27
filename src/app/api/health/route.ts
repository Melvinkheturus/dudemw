import { NextResponse } from 'next/server';
import { isRazorpayConfigured } from '@/lib/services/razorpay';

/**
 * GET /api/health
 * Health check endpoint to verify service configuration
 * Useful for debugging deployment issues on Hostinger
 */
export async function GET() {
  const razorpayConfig = isRazorpayConfigured();
  
  // Check Supabase configuration
  const supabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseService = !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
  
  // Check Razorpay configuration (without exposing actual keys)
  const razorpayKeyId = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const razorpaySecret = !!process.env.RAZORPAY_KEY_SECRET;
  
  // Check App URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    configuration: {
      supabase: {
        url: supabaseUrl,
        anonKey: supabaseAnon,
        serviceKey: supabaseService,
        status: supabaseUrl && supabaseAnon ? '✅ Configured' : '❌ Missing'
      },
      razorpay: {
        keyId: razorpayKeyId,
        secret: razorpaySecret,
        configured: razorpayConfig.configured,
        status: razorpayConfig.configured ? '✅ Configured' : '❌ ' + razorpayConfig.error,
        // Show first 8 chars of key ID if present (safe to show partial public key)
        keyIdPreview: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID 
          ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.substring(0, 8) + '...' 
          : null
      },
      appUrl: {
        value: appUrl || 'Not set',
        status: appUrl ? '✅ Set' : '⚠️ Not set'
      }
    },
    checks: {
      paymentGateway: razorpayConfig.configured ? 'ready' : 'not_configured',
      database: supabaseUrl && supabaseAnon ? 'ready' : 'not_configured'
    }
  };
  
  // Set status based on critical services
  if (!razorpayConfig.configured || !supabaseUrl || !supabaseAnon) {
    health.status = 'degraded';
  }
  
  return NextResponse.json(health);
}
