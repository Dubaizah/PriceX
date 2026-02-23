/**
 * PriceX - Registration API Route
 * User registration with localStorage persistence for Vercel compatibility
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  validatePassword, 
  hashPassword, 
  calculatePasswordExpiry,
  generateSecureToken,
} from '@/lib/security/utils';
import { generateDeviceFingerprint } from '@/lib/security/utils';
import { SlidingWindowRateLimiter } from '@/lib/security/monitoring';

const registerRateLimiter = new SlidingWindowRateLimiter(3600000, 10);

/**
 * POST /api/auth/register
 * Register new user - stores in localStorage via client
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      mobile, 
      password, 
      gdprConsent,
    } = body;

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceId = generateDeviceFingerprint(userAgent, ipAddress);

    const rateLimitKey = `${ipAddress}:register`;
    const rateLimit = registerRateLimiter.isAllowed(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      );
    }

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (mobile && !/^\+[1-9]\d{1,14}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mobile format. Use international format: +1234567890' },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { success: false, error: 'Password does not meet requirements', details: passwordCheck.errors },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);
    const passwordExpiresAt = calculatePasswordExpiry();

    const userId = generateSecureToken(16);

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      emailVerified: true,
      mobile: mobile || '',
      mobileVerified: false,
      name,
      passwordHash,
      role: 'user',
      status: 'active',
      profile: {
        timezone: 'UTC',
        language: 'en',
        region: 'global',
        currency: 'USD',
      },
      security: {
        passwordHistory: [],
        passwordChangedAt: new Date().toISOString(),
        passwordExpiresAt: passwordExpiresAt.toISOString(),
        lastLoginAt: null,
        lastLoginIp: null,
        lastLoginDevice: null,
        lastLoginLocation: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
        lockReason: null,
        twoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null,
        backupCodes: [],
        securityQuestions: [],
        trustedDevices: [],
        violations: [],
      },
      gdprConsent: {
        marketing: gdprConsent?.marketing ?? true,
        analytics: gdprConsent?.analytics ?? true,
        thirdParty: gdprConsent?.thirdParty ?? true,
        consentedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };

    // Return the user data so client can store it
    // In production, this would save to a database
    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      },
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
