import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailTemplate {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface OrderConfirmationData {
  customerName: string;
  orderNumber: string;
  orderTotal: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: string;
    image?: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  trackingUrl?: string;
}

export interface WelcomeEmailData {
  customerName: string;
  loginUrl: string;
}

/**
 * Email service for e-commerce operations
 */
export class EmailService {
  private static readonly FROM_EMAIL = 'Dude Menswear <orders@dudemenswear.com>';
  private static readonly SUPPORT_EMAIL = 'support@dudemenswear.com';

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmation(
    email: string,
    data: OrderConfirmationData
  ) {
    try {
      const html = this.generateOrderConfirmationHTML(data);
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: `Order Confirmation - ${data.orderNumber}`,
        html,
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Failed to send order confirmation:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email send failed',
      };
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(email: string, data: WelcomeEmailData) {
    try {
      const html = this.generateWelcomeHTML(data);
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: 'Welcome to Dude Menswear!',
        html,
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email send failed',
      };
    }
  }

  /**
   * Send order shipped notification
   */
  static async sendOrderShipped(
    email: string,
    orderNumber: string,
    trackingNumber: string,
    trackingUrl: string
  ) {
    try {
      const html = this.generateShippedHTML(orderNumber, trackingNumber, trackingUrl);
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: `Your Order ${orderNumber} Has Shipped!`,
        html,
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Failed to send shipping notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email send failed',
      };
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(email: string, resetUrl: string) {
    try {
      const html = this.generatePasswordResetHTML(resetUrl);
      
      const result = await resend.emails.send({
        from: this.FROM_EMAIL,
        to: email,
        subject: 'Reset Your Password - Dude Menswear',
        html,
      });

      return {
        success: true,
        messageId: result.data?.id,
      };
    } catch (error) {
      console.error('Failed to send password reset:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email send failed',
      };
    }
  }

  /**
   * Generate order confirmation HTML
   */
  private static generateOrderConfirmationHTML(data: OrderConfirmationData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">Dude Menswear</h1>
            <h2 style="color: #666; font-weight: normal;">Order Confirmation</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-top: 0;">Hi ${data.customerName},</h3>
            <p>Thank you for your order! We've received your order <strong>${data.orderNumber}</strong> and we're preparing it for shipment.</p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3>Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 1px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #ddd;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${data.orderItems.map(item => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eee;">${item.price}</td>
                  </tr>
                `).join('')}
                <tr style="font-weight: bold; background: #f8f9fa;">
                  <td colspan="2" style="padding: 12px;">Total</td>
                  <td style="padding: 12px; text-align: right;">${data.orderTotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-bottom: 30px;">
            <h3>Shipping Address</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <p style="margin: 0;">
                ${data.shippingAddress.name}<br>
                ${data.shippingAddress.address}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin-bottom: 10px;">Questions about your order?</p>
            <p style="margin: 0;">
              <a href="mailto:${this.SUPPORT_EMAIL}" style="color: #000; text-decoration: none;">${this.SUPPORT_EMAIL}</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate welcome email HTML
   */
  private static generateWelcomeHTML(data: WelcomeEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Dude Menswear</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">Welcome to Dude Menswear!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-top: 0;">Hi ${data.customerName},</h3>
            <p>Welcome to the Dude Menswear family! We're excited to have you join our community of style-conscious men.</p>
            <p>Explore our latest collections and discover premium streetwear that defines your unique style.</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Shopping
            </a>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin-bottom: 10px;">Need help getting started?</p>
            <p style="margin: 0;">
              <a href="mailto:${this.SUPPORT_EMAIL}" style="color: #000; text-decoration: none;">${this.SUPPORT_EMAIL}</a>
            </p>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate shipped notification HTML
   */
  private static generateShippedHTML(orderNumber: string, trackingNumber: string, trackingUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Shipped</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">Your Order Has Shipped!</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p>Great news! Your order <strong>${orderNumber}</strong> is on its way to you.</p>
            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${trackingUrl}" style="background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Track Your Order
            </a>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Generate password reset HTML
   */
  private static generatePasswordResetHTML(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #000; margin-bottom: 10px;">Reset Your Password</h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0; color: #856404;"><strong>Security Note:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.</p>
          </div>
        </body>
      </html>
    `;
  }
}
