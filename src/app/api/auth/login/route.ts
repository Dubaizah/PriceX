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
  isPasswordReused,
  generateDeviceFingerprint,
  calculatePasswordExpiry,
} from '@/lib/security/utils';
import { LOCKOUT_POLICY, SESSION_POLICY } from '@/lib/security/utils';
import { performFraudCheck, parseUserAgent, getLocationFromIP } from '@/lib/security/monitoring';
import { SlidingWindowRateLimiter } from '@/lib/security/monitoring';

// Rate limiters
const loginRateLimiter = new SlidingWindowRateLimiter(60000, 5); // 5 attempts per minute
const registerRateLimiter = new SlidingWindowRateLimiter(3600000, 3); // 3 attempts per hour

// Mock database (replace with real database in production)
const mockUsers = new Map();
const mockSessions = new Map();
const mockAuditLogs = [];

// Demo users for testing
const DEMO_USERS = [
  { email: 'admin@pricex.com', password: 'admin123', role: 'admin', name: 'Admin User' },
  { email: 'user@pricex.com', password: 'user123', role: 'user', name: 'Test User' },
  { email: 'demo@pricex.com', password: 'demo123', role: 'user', name: 'Demo User' },
];

// Initialize demo users
if (mockUsers.size === 0) {
  DEMO_USERS.forEach((user, index) => {
    const userId = `user_${index + 1}`;
    mockUsers.set(userId, {
      id: userId,
      email: user.email,
      mobile: '+971500000000',
      password: user.password, // Plain text for demo (should be hashed in production)
      role: user.role,
      name: user.name,
      status: 'active',
      profile: {
        avatar: null,
        bio: 'Demo user for testing',
        location: 'Dubai, UAE',
        timezone: 'Asia/Dubai',
        language: 'en',
        currency: 'USD',
      },
      subscription: {
        plan: user.role === 'admin' ? 'enterprise' : 'free',
        startedAt: new Date(),
        expiresAt: null,
      },
      security: {
        twoFactorEnabled: false,
        backupCodes: [],
        lastPasswordChange: new Date(),
        passwordHistory: [],
        loginAttempts: 0,
        lockedUntil: null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

/**
 * POST /api/auth/login
 * Authenticate user with email/mobile + password + 2FA
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe = false } = body;

    // Get client info
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const deviceId = generateDeviceFingerprint(userAgent, ipAddress);

    // Rate limiting
    const rateLimitKey = `${ipAddress}:${email}`;
    const rateLimit = loginRateLimiter.isAllowed(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
        },
        { status: 429 }
      );
    }

    // Find user (mock - replace with DB query)
    const user = Array.from(mockUsers.values()).find((u: any) => 
      u.email === email || u.mobile === email
    );

    if (!user) {
      // Log failed attempt
      logAuditEvent({
        action: 'LOGIN_FAILED',
        email,
        ipAddress,
        userAgent,
        deviceId,
        success: false,
        errorMessage: 'User not found',
      });

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (user.status === 'locked') {
      if (user.security.lockedUntil && new Date() < new Date(user.security.lockedUntil)) {
        const remainingTime = Math.ceil(
          (new Date(user.security.lockedUntil).getTime() - Date.now()) / 60000
        );
        
        return NextResponse.json(
          { 
            success: false, 
            error: `Account locked. Try again in ${remainingTime} minutes.`,
            lockedUntil: user.security.lockedUntil,
          },
          { status: 403 }
        );
      } else {
        // Unlock account if lockout period has passed
        user.status = 'active';
        user.security.failedLoginAttempts = 0;
        user.security.lockedUntil = null;
      }
    }

    // Check if password has expired
    if (user.security.passwordExpiresAt && 
        new Date() > new Date(user.security.passwordExpiresAt)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Password has expired. Please reset your password.',
          requiresPasswordReset: true,
        },
        { status: 403 }
      );
    }

    // Verify password - allow plain text for demo users
    const isDemoUser = DEMO_USERS.some(u => u.email === email);
    const passwordValid = isDemoUser 
      ? password === user.password 
      : await verifyPassword(password, user.passwordHash);

    if (!passwordValid) {
      // Increment failed attempts
      user.security.failedLoginAttempts = (user.security.failedLoginAttempts || 0) + 1;
      
      const remainingAttempts = LOCKOUT_POLICY.MAX_ATTEMPTS - user.security.failedLoginAttempts;
      
      // Check if account should be locked
      if (user.security.failedLoginAttempts >= LOCKOUT_POLICY.MAX_ATTEMPTS) {
        user.status = 'locked';
        user.security.lockedUntil = calculateLockoutExpiry();
        
        logAuditEvent({
          action: 'ACCOUNT_LOCK',
          userId: user.id,
          email: user.email,
          ipAddress,
          userAgent,
          deviceId,
          success: false,
          details: { reason: 'Too many failed login attempts' },
        });

        return NextResponse.json(
          { 
            success: false, 
            error: 'Account locked due to too many failed attempts.',
            lockedUntil: user.security.lockedUntil,
          },
          { status: 403 }
        );
      }

      // Warn user on remaining attempts
      logAuditEvent({
        action: 'LOGIN_FAILED',
        userId: user.id,
        email: user.email,
        ipAddress,
        userAgent,
        deviceId,
        success: false,
        errorMessage: 'Invalid password',
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid credentials',
          remainingAttempts,
          warning: remainingAttempts <= 1 ? 'Account will be locked after next failed attempt.' : undefined,
        },
        { status: 401 }
      );
    }

    // Password correct - reset failed attempts
    user.security.failedLoginAttempts = 0;

    // Check for 2FA
    if (user.security.twoFactorEnabled) {
      const tempToken = generateSecureToken();
      
      // Store temp token (with expiry)
      user.temp2FAToken = {
        token: tempToken,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      };

      // Send 2FA code
      await send2FACode(user, user.security.twoFactorMethod);

      return NextResponse.json({
        success: true,
        requires2FA: true,
        tempToken,
        message: 'Please enter your 2FA code',
      });
    }

    // If 2FA is not enabled but required by policy
    if (!user.security.twoFactorEnabled) {
      return NextResponse.json({
        success: false,
        error: '2FA is required. Please set up 2FA to continue.',
        requires2FASetup: true,
      }, { status: 403 });
    }

    // Complete login
    const session = await createSession(user, deviceId, userAgent, ipAddress, rememberMe);
    
    // Update user login info
    user.security.lastLoginAt = new Date();
    user.security.lastLoginIp = ipAddress;
    user.security.lastLoginDevice = deviceId;
    
    const location = await getLocationFromIP(ipAddress);
    user.security.lastLoginLocation = `${location.city}, ${location.country}`;

    // Log successful login
    logAuditEvent({
      action: 'LOGIN',
      userId: user.id,
      email: user.email,
      ipAddress,
      userAgent,
      deviceId,
      success: true,
      details: { sessionId: session.id },
    });

    return NextResponse.json({
      success: true,
      requires2FA: false,
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

/**
 * Create user session
 */
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
    browser: `${parsedUA.browser}`,
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

/**
 * Generate device name
 */
function generateDeviceName(userAgent: string): string {
  const parsed = parseUserAgent(userAgent);
  return `${parsed.browser} on ${parsed.os}`;
}

/**
 * Send 2FA code
 */
async function send2FACode(user: any, method: string) {
  const code = generateOTP();
  
  // Store code
  user.pending2FACode = {
    code: await hashPassword(code), // Hash for storage
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };

  // Send via appropriate method
  switch (method) {
    case 'sms':
      // Send SMS
      console.log(`SMS 2FA code for ${user.mobile}: ${code}`);
      break;
    case 'email':
      // Send email
      console.log(`Email 2FA code for ${user.email}: ${code}`);
      break;
    case 'app':
      // TOTP - code is generated by authenticator app
      break;
  }
}

/**
 * Sanitize user object for response
 */
function sanitizeUser(user: any) {
  const { passwordHash, security, temp2FAToken, pending2FACode, ...safeUser } = user;
  return {
    ...safeUser,
    security: {
      twoFactorEnabled: security.twoFactorEnabled,
      lastLoginAt: security.lastLoginAt,
      lastLoginLocation: security.lastLoginLocation,
    },
  };
}

/**
 * Log audit event
 */
function logAuditEvent(event: any) {
  mockAuditLogs.push({
    ...event,
    timestamp: new Date(),
  });
  console.log('[AUDIT]', event);
}
