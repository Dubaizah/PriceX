/**
 * PriceX - Email Service using Resend
 * No domain verification needed!
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function sendOTPEmail(to: string, code: string, purpose: string = 'verification'): Promise<EmailResponse> {
  const subject = purpose === 'login' ? 'PriceX - Your Login Verification Code' : 'PriceX - Your Verification Code';
  
  if (!RESEND_API_KEY) {
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PriceX <onboarding@resend.dev>',
        to: [to],
        subject: subject,
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #FFD700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #000;">PriceX</h1>
  </div>
  <div style="background: #fff; padding: 40px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
    <p style="color: #666; text-align: center;">Your verification code is:</p>
    <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #FFD700; margin: 25px 0; border-radius: 8px;">
      ${code}
    </div>
    <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
  </div>
</body>
</html>`,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, messageId: data.id };
    } else {
      const error = await response.text();
      return { success: false, error: error };
    }
  } catch (err) {
    return { success: false, error: 'Failed to send email' };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
