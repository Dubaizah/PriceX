/**
 * PriceX - Authentication API Routes
 * Login, Register, 2FA, Password Management
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  validatePassword, 
  hashPassword, 
  verifyPassword, 
  generateSecureToken,
  generateOTP,
  calculateLockoutExpiry,
  calculatePasswordExpiry,
} from '@/lib/security/utils';
import { LOCKOUT_POLICY, SESSION_POLICY } from '@/lib/security/utils';
import { performFraudCheck, parseUserAgent, getLocationFromIP } from '@/lib/security/monitoring';
import { SlidingWindowRateLimiter } from '@/lib/security/monitoring';
import { findUserByEmail, findUserByMobile, findUserById, updateUser } from '@/lib/database/mock-db';

const loginRateLimiter = new SlidingWindowRateLimiter(60000, 10);

const mockSessions = new Map();
const mockAuditLogs = [];

/**
 * POST /api/auth/login
 * Authenticate user with email/mobile + password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceId = generateDeviceFingerprint(userAgent, ipAddress);

    const rateLimitKey = `${ipAddress}:${email}`;
    const rateLimit = loginRateLimiter.isAllowed(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const user = findUserByEmail(email) || findUserByMobile(email);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (user.status === 'locked') {
      if (user.security.lockedUntil && new Date(user.security.lockedUntil) > new Date()) {
        const remainingTime = Math.ceil(
          (new Date(user.security.lockedUntil).getTime() - Date.now()) / 60000
        );
        return NextResponse.json(
          { success: false, error: `Account locked. Try again in ${remainingTime} minutes.` },
          { status: 403 }
        );
      }
      updateUser(user.id, { 
        status: 'active',
        security: { ...user.security, failedLoginAttempts: 0, lockedUntil: null }
      });
    }

    if (user.security.passwordExpiresAt && new Date(user.security.passwordExpiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Password has expired. Please reset your password.' },
        { status: 403 }
      );
    }

    const passwordValid = await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      const failedAttempts = (user.security.failedLoginAttempts || 0) + 1;
      const updatedSecurity = { ...user.security, failedLoginAttempts: failedAttempts };
      
      if (failedAttempts >= LOCKOUT_POLICY.MAX_ATTEMPTS) {
        updatedSecurity.lockedUntil = calculateLockoutExpiry();
        updateUser(user.id, { status: 'locked', security: updatedSecurity });
        return NextResponse.json(
          { success: false, error: 'Account locked due to too many failed attempts.' },
          { status: 403 }
        );
      }
      
      updateUser(user.id, { security: updatedSecurity });
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid credentials',
          remainingAttempts: LOCKOUT_POLICY.MAX_ATTEMPTS - failedAttempts,
        },
        { status: 401 }
      );
    }

    const session = await createSession(user, deviceId, userAgent, ipAddress, rememberMe);
    
    const updatedSecurity = {
      ...user.security,
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
      lastLoginDevice: deviceId,
      failedLoginAttempts: 0,
    };
    
    updateUser(user.id, { security: updatedSecurity });

    return NextResponse.json({
      success: true,
      user: sanitizeUser(user),
      session,
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createSession(
  user: any,
  deviceId: string,
  userAgent: string,
  ipAddress: string,
  rememberMe: boolean
) {
  const parsedUA = parseUserAgent(userAgent);
  const location = await getLocationFromIP(ipAddress);
  
  const session = {
    id: generateSecureToken(),
    userId: user.id,
    token: generateSecureToken(64),
    refreshToken: generateSecureToken(64),
    deviceId,
    deviceName: generateDeviceName(userAgent),
    deviceType: parsedUA.device,
    browser: parsedUA.browser,
    os: parsedUA.os,
    ipAddress,
    location: `${location.city}, ${location.country}`,
    isActive: true,
    isCurrent: true,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + (rememberMe ? SESSION_POLICY.REFRESH_TOKEN_EXPIRY : SESSION_POLICY.ACCESS_TOKEN_EXPIRY) * 1000),
    lastActivityAt: new Date(),
  };

  mockSessions.set(session.id, session);
  
  return session;
}

function generateDeviceName(userAgent: string): string {
  const parsed = parseUserAgent(userAgent);
  return `${parsed.browser} on ${parsed.os}`;
}

function sanitizeUser(user: any) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  return `device_${Buffer.from(userAgent + ipAddress).toString('base64').slice(0, 32)}`;
}
