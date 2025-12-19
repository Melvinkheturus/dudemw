import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Test email using Resend
    const result = await resend.emails.send({
      from: 'Dude Menswear <onboarding@resend.dev>',
      to: email,
      subject: 'Resend Configuration Test - Dude Menswear',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin-bottom: 10px;">🎉 Resend is Working!</h1>
            <h2 style="color: #666; font-weight: normal;">Dude Menswear Email Test</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <p>Congratulations! Your Resend email configuration is working perfectly.</p>
            <p>This test email confirms that:</p>
            <ul>
              <li>✅ Resend API key is valid</li>
              <li>✅ SMTP configuration is correct</li>
              <li>✅ Email delivery is functional</li>
              <li>✅ Ready for production use</li>
            </ul>
          </div>

          <div style="background: #dcfce7; border: 1px solid #16a34a; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #15803d;">
              <strong>✅ Success:</strong> Your email system is now ready for user authentication, order confirmations, and notifications.
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; margin: 0;">
              Dude Menswear - Your Style, Our Pride<br>
              <a href="mailto:support@dudemw.com" style="color: #dc2626;">support@dudemw.com</a>
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully!',
      messageId: result.data?.id,
      details: result
    })

  } catch (error: any) {
    console.error('Resend test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to send test email',
      details: error
    }, { status: 500 })
  }
}