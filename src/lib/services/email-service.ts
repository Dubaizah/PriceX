/**
 * PriceX - Email Service
 * Send OTP via email using SendGrid
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@pricex.com';

export async function sendOTPEmail(to: string, code: string, purpose: string = 'verification'): Promise<EmailResponse> {
  const subject = purpose === 'login' ? 'PriceX - Your Login Verification Code' : 'PriceX - Your Verification Code';
  
  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; color: #000;">PriceX</h1>
      </div>
      <div style="background: #fff; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Your Verification Code</h2>
        <p style="color: #666; line-height: 1.6;">Your verification code is:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #FFD700; margin: 20px 0;">
          ${code}
        </div>
        <p style="color: #999; font-size: 12px;">This code will expire in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
      </div>
      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>© 2024 PriceX. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  // If SendGrid is not configured, log and return success (demo mode)
  if (!SENDGRID_API_KEY) {
    console.log(`[EMAIL DEMO] To: ${to}`);
    console.log(`[EMAIL DEMO] Code: ${code}`);
    return {
      success: true,
      messageId: `demo_${Date.now()}`,
    };
  }

  try {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
        }],
        from: { email: EMAIL_FROM, name: 'PriceX' },
        subject: subject,
        content: [{
          type: 'text/html',
          value: emailHtml,
        }],
      }),
    });

    if (response.ok || response.status === 202) {
      return {
        success: true,
        messageId: `sg_${Date.now()}`,
      };
    } else {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return {
        success: false,
        error: 'Failed to send email',
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email',
    };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
