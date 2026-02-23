/**
 * PriceX - Send OTP via Email API
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOTPEmail, generateOTP } from '@/lib/services/email-service';

const pendingOTPs = new Map<string, { code: string; email: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    pendingOTPs.set(email.toLowerCase(), { code, email: email.toLowerCase(), expiresAt });

    // Send email
    const result = await sendOTPEmail(email, code, purpose || 'verification');

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Verification code sent to your email',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send OTP email error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: 'Email and code are required' },
        { status: 400 }
      );
    }

    const key = email.toLowerCase();
    const pending = pendingOTPs.get(key);

    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'No code requested or code expired' },
        { status: 400 }
      );
    }

    if (Date.now() > pending.expiresAt) {
      pendingOTPs.delete(key);
      return NextResponse.json(
        { success: false, error: 'Code has expired' },
        { status: 400 }
      );
    }

    if (pending.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid code' },
        { status: 400 }
      );
    }

    // OTP verified - delete from pending
    pendingOTPs.delete(key);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP email error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
