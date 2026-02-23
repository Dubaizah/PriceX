/**
 * PriceX - Send OTP API
 * Send 2FA code via SMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendOTP, generateOTP } from '@/lib/services/sms-service';

const pendingOTPs = new Map<string, { code: string; expiresAt: number }>();

export async function POST(request: NextRequest) {
  try {
    const { mobile, purpose } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const code = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP (in production, use Redis or database)
    pendingOTPs.set(mobile, { code, expiresAt });

    // Send SMS
    const result = await sendOTP(mobile, code);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'OTP sent successfully',
        // In demo mode, return the code for testing
        ...(process.env.NODE_ENV !== 'production' && { demoCode: code }),
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to send OTP' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { mobile, code } = await request.json();

    if (!mobile || !code) {
      return NextResponse.json(
        { success: false, error: 'Mobile and code are required' },
        { status: 400 }
      );
    }

    const pending = pendingOTPs.get(mobile);

    if (!pending) {
      return NextResponse.json(
        { success: false, error: 'No OTP requested or OTP expired' },
        { status: 400 }
      );
    }

    if (Date.now() > pending.expiresAt) {
      pendingOTPs.delete(mobile);
      return NextResponse.json(
        { success: false, error: 'OTP has expired' },
        { status: 400 }
      );
    }

    if (pending.code !== code) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // OTP verified - delete from pending
    pendingOTPs.delete(mobile);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
