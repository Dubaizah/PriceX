/**
 * PriceX - Email Service using SendGrid
 * Sends verification codes via email
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  demoCode?: string;
  error?: string;
}

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@price-x.vercel.app';

export async function sendOTPEmail(to: string, code: string, purpose: string = 'verification'): Promise<EmailResponse> {
  const subject = purpose === 'login' ? 'PriceX - Your Login Verification Code' : 'PriceX - Your Verification Code';
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: #FFD700; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; color: #000;">PriceX</h1>
  </div>
  <div style="background: #fff; padding: 40px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; text-align: center;">Your Verification Code</h2>
    <p style="color: #666; text-align: center;">Use the code below to complete your ${purpose}:</p>
    <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #FFD700; margin: 25px 0; border-radius: 8px;">
      ${code}
    </div>
    <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
  </div>
</body>
</html>`;

  // Check if SendGrid is configured
  if (!SENDGRID_API_KEY) {
    console.log('[EMAIL] No SendGrid API key - showing code on screen');
    return {
      success: true,
      demoCode: code,
      messageId: 'demo_mode',
    };
  }

  try {
    console.log('[EMAIL] Sending email via SendGrid to:', to);

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
      console.log('[EMAIL] SendGrid success!');
      return {
        success: true,
        messageId: 'sent_via_sendgrid',
      };
    } else {
      const errorText = await response.text();
      console.error('[EMAIL] SendGrid failed:', response.status, errorText);
      // Return demo code as fallback so user can still login
      return {
        success: true,
        demoCode: code,
        messageId: 'fallback_demo',
      };
    }
  } catch (error) {
    console.error('[EMAIL] Exception:', error);
    // Return demo code as fallback
    return {
      success: true,
      demoCode: code,
      messageId: 'fallback_exception',
    };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
