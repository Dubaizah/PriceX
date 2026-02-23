/**
 * PriceX - Email Service (Demo Mode)
 * Shows code on screen instead of sending real email
 */

interface EmailResponse {
  success: boolean;
  messageId?: string;
  demoCode?: string;
  error?: string;
}

export async function sendOTPEmail(to: string, code: string, purpose: string = 'verification'): Promise<EmailResponse> {
  console.log(`[EMAIL] Sending ${purpose} code to ${to}: ${code}`);
  
  // Always return success with demo code (code shown on screen)
  return {
    success: true,
    messageId: `demo_${Date.now()}`,
    demoCode: code,
  };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
