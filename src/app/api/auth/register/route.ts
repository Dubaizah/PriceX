/**
 * PriceX - Registration API Route
 * User registration with strict validation and GDPR compliance
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

const registerRateLimiter = new SlidingWindowRateLimiter(3600000, 3); // 3 per hour
const mockUsers = new Map();

/**
 * POST /api/auth/register
 * Register new user with strict validation
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

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceId = generateDeviceFingerprint(userAgent, ipAddress);

    // Rate limiting
    const rateLimitKey = `${ipAddress}:register`;
    const rateLimit = registerRateLimiter.isAllowed(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many registration attempts. Please try again later.',
        },
        { status: 429 }
      );
    }

    // Validate required fields
    if (!name || !email || !mobile || !password) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate mobile format (basic - enhance based on region)
    const mobileRegex = /^\+[1-9]\d{1,14}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mobile format. Use international format: +1234567890' },
        { status: 400 }
      );
    }

    // Validate password policy
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password does not meet requirements',
          details: passwordCheck.errors,
        },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = Array.from(mockUsers.values()).find((u: any) => u.email === email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Check if mobile already exists
    const existingMobile = Array.from(mockUsers.values()).find((u: any) => u.mobile === mobile);
    if (existingMobile) {
      return NextResponse.json(
        { success: false, error: 'Mobile number already registered' },
        { status: 409 }
      );
    }

    // Validate GDPR consent
    if (!gdprConsent || typeof gdprConsent !== 'object') {
      return NextResponse.json(
        { success: false, error: 'GDPR consent is required' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);
    const passwordExpiresAt = calculatePasswordExpiry();

    // Create user
    const userId = generateSecureToken(16);
    const emailVerificationToken = generateSecureToken();
    const mobileVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = {
      id: userId,
      email,
      emailVerified: false,
      emailVerificationToken,
      mobile,
      mobileVerified: false,
      mobileVerificationCode,
      name,
      passwordHash,
      role: 'user',
      status: 'pending_verification',
      profile: {
        timezone: 'UTC',
        language: 'en',
        region: 'north-america',
        currency: 'USD',
      },
      security: {
        passwordHistory: [{ passwordHash, changedAt: new Date(), changedBy: 'user' }],
        passwordChangedAt: new Date(),
        passwordExpiresAt,
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
        marketing: gdprConsent.marketing || false,
        analytics: gdprConsent.analytics || false,
        thirdParty: gdprConsent.thirdParty || false,
        consentedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    mockUsers.set(userId, newUser);

    // Send verification emails/SMS
    await sendVerificationEmail(email, emailVerificationToken);
    await sendVerificationSMS(mobile, mobileVerificationCode);

    // Log registration
    console.log('[AUDIT]', {
      action: 'ACCOUNT_CREATE',
      userId,
      email,
      ipAddress,
      userAgent,
      deviceId,
      success: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please verify your email and mobile.',
      userId,
      requiresVerification: true,
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string, token: string) {
  // In production, send actual email
  console.log(`Verification email for ${email}: https://pricex.com/verify-email?token=${token}`);
}

/**
 * Send verification SMS
 */
async function sendVerificationSMS(mobile: string, code: string) {
  // In production, send actual SMS
  console.log(`Verification SMS for ${mobile}: ${code}`);
}
