/**
 * PriceX - SMS Service
 * Twilio integration for sending OTP via SMS
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendOTP(to: string, code: string): Promise<SMSResponse> {
  // If Twilio is not configured, use demo mode
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    console.log(`[SMS DEMO] Code ${code} would be sent to ${to}`);
    return {
      success: true,
      messageId: `demo_${Date.now()}`,
    };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        },
        body: new URLSearchParams({
          To: to,
          From: TWILIO_PHONE_NUMBER,
          Body: `Your PriceX verification code is: ${code}. Valid for 10 minutes.`,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        messageId: data.sid,
      };
    } else {
      console.error('Twilio error:', data);
      return {
        success: false,
        error: data.message || 'Failed to send SMS',
      };
    }
  } catch (error) {
    console.error('SMS sending error:', error);
    return {
      success: false,
      error: 'Failed to send SMS',
    };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
