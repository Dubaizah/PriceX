/**
 * PriceX - Email Service
 * Send OTP via email
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@pricex.com';

export async function sendOTPEmail(to: string, code: string, purpose: string = 'verification'): Promise<EmailResponse> {
  // In production, use a real email service like SendGrid, Mailgun, etc.
  // For now, log the email and return success
  
  console.log(`[EMAIL DEMO] Sending ${purpose} code to ${to}: ${code}`);
  console.log(`[EMAIL] To: ${to}`);
  console.log(`[EMAIL] Subject: PriceX - Your Verification Code`);
  console.log(`[EMAIL] Body: Your verification code is: ${code}. Valid for 10 minutes.`);
  
  // In production, integrate with SendGrid/Mailgun/AWS SES here
  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  
  const msg = {
    to,
    from: EMAIL_FROM,
    subject: 'PriceX - Your Verification Code',
    html: `<p>Your verification code is: <strong>${code}</strong></p><p>Valid for 10 minutes.</p>`,
  };
  
  await sgMail.send(msg);
  */
  
  return {
    success: true,
    messageId: `email_${Date.now()}`,
  };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
