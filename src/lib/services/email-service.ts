/**
 * PriceX - Email Service using SendGrid
 * Sends real emails with verification codes
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
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #000; font-size: 28px;">PriceX</h1>
    <p style="margin: 5px 0 0 0; color: #333;">Global Price Comparison</p>
  </div>
  <div style="background: #fff; padding: 40px 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0; text-align: center;">Your Verification Code</h2>
    <p style="color: #666; line-height: 1.6; text-align: center;">Use the code below to complete your ${purpose === 'login' ? 'login' : 'verification'}:</p>
    <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #FFD700; margin: 25px 0; border-radius: 8px;">
      ${code}
    </div>
    <p style="color: #999; font-size: 14px; text-align: center;">This code will expire in <strong>10 minutes</strong>.</p>
    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">If you didn't request this code, please ignore this email or contact support.</p>
  </div>
  <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
    <p>© 2024 PriceX. All rights reserved.</p>
    <p>PriceX - Find the best prices worldwide</p>
  </div>
</body>
</html>
`;

  // If SendGrid API key is not configured, return error to set up
  if (!SENDGRID_API_KEY) {
    return {
      success: false,
      error: 'Email service not configured. Please contact support.',
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
      const errorText = await response.text();
      console.error('SendGrid error:', errorText);
      return {
        success: false,
        error: 'Failed to send email. Please try again.',
      };
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email. Please try again.',
    };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
