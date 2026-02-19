/**
 * PriceX - Security Utilities
 * Password policy, encryption, and security validations
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Password Policy Constants
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 32,
  MIN_UPPERCASE: 1,
  MIN_LOWERCASE: 1,
  MIN_NUMBERS: 1,
  MIN_SYMBOLS: 1,
  HISTORY_COUNT: 5, // Cannot reuse last 5 passwords
  EXPIRY_DAYS: 90, // 3 months
};

// Account Lockout Constants
export const LOCKOUT_POLICY = {
  MAX_ATTEMPTS: 3,
  LOCKOUT_DURATION_MINUTES: 30,
  WARNING_THRESHOLD: 2, // Warn on 2nd failed attempt
};

// Session Constants
export const SESSION_POLICY = {
  ACCESS_TOKEN_EXPIRY: 15 * 60, // 15 minutes
  REFRESH_TOKEN_EXPIRY: 7 * 24 * 60 * 60, // 7 days
  MAX_CONCURRENT_SESSIONS: 3,
  INACTIVITY_TIMEOUT: 30 * 60, // 30 minutes
  ABSOLUTE_TIMEOUT: 8 * 60 * 60, // 8 hours
};

// Master Admin Recovery Words (for generation)
const RECOVERY_WORD_LIST = [
  'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
  'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
  'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray',
  'yankee', 'zulu', 'apollo', 'atlas', 'falcon', 'hawk', 'phoenix', 'raven',
  'storm', 'thunder', 'lightning', 'avalanche', 'blizzard', 'cyclone', 'tornado',
  'comet', 'meteor', 'nebula', 'quasar', 'pulsar', 'solaris', 'lunar', 'stellar'
];

/**
 * Validate password against strict policy
 */
export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Length check
  if (password.length < PASSWORD_POLICY.MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_POLICY.MIN_LENGTH} characters`);
  }
  if (password.length > PASSWORD_POLICY.MAX_LENGTH) {
    errors.push(`Password must be no more than ${PASSWORD_POLICY.MAX_LENGTH} characters`);
  }

  // Character requirements
  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  const lowercaseCount = (password.match(/[a-z]/g) || []).length;
  const numberCount = (password.match(/[0-9]/g) || []).length;
  const symbolCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;

  if (uppercaseCount < PASSWORD_POLICY.MIN_UPPERCASE) {
    errors.push(`Password must contain at least ${PASSWORD_POLICY.MIN_UPPERCASE} uppercase letter`);
  }
  if (lowercaseCount < PASSWORD_POLICY.MIN_LOWERCASE) {
    errors.push(`Password must contain at least ${PASSWORD_POLICY.MIN_LOWERCASE} lowercase letter`);
  }
  if (numberCount < PASSWORD_POLICY.MIN_NUMBERS) {
    errors.push(`Password must contain at least ${PASSWORD_POLICY.MIN_NUMBERS} number`);
  }
  if (symbolCount < PASSWORD_POLICY.MIN_SYMBOLS) {
    errors.push(`Password must contain at least ${PASSWORD_POLICY.MIN_SYMBOLS} special character (!@#$%^&* etc.)`);
  }

  // Common password check (simplified - use a comprehensive list in production)
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123', 'admin123'];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password.');
  }

  // Sequential character check
  if (/^(.)\1{2,}$/.test(password)) {
    errors.push('Password cannot contain repeating characters (e.g., "aaa")');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if password was previously used
 */
export async function isPasswordReused(
  password: string,
  passwordHistory: { passwordHash: string }[]
): Promise<boolean> {
  for (const entry of passwordHistory.slice(0, PASSWORD_POLICY.HISTORY_COUNT)) {
    const isMatch = await bcrypt.compare(password, entry.passwordHash);
    if (isMatch) return true;
  }
  return false;
}

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

/**
 * Generate backup codes for 2FA
 */
export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

/**
 * Hash backup codes (for storage)
 */
export async function hashBackupCodes(codes: string[]): Promise<string[]> {
  return Promise.all(codes.map(code => bcrypt.hash(code, 10)));
}

/**
 * Verify backup code
 */
export async function verifyBackupCode(code: string, hashedCodes: string[]): Promise<boolean> {
  for (const hashedCode of hashedCodes) {
    if (await bcrypt.compare(code, hashedCode)) {
      return true;
    }
  }
  return false;
}

/**
 * Generate Master Admin recovery words
 */
export function generateMasterRecoveryWords(): string[] {
  const words: string[] = [];
  const shuffled = [...RECOVERY_WORD_LIST].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < 5; i++) {
    words.push(shuffled[i]);
  }
  
  return words;
}

/**
 * Hash recovery words for storage
 */
export async function hashRecoveryWords(words: string[]): Promise<string> {
  const combined = words.join('|');
  return bcrypt.hash(combined, 12);
}

/**
 * Verify recovery words
 */
export async function verifyRecoveryWords(
  inputWords: string[],
  storedHash: string
): Promise<boolean> {
  const combined = inputWords.join('|');
  return bcrypt.compare(combined, storedHash);
}

/**
 * Calculate password expiry date
 */
export function calculatePasswordExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + PASSWORD_POLICY.EXPIRY_DAYS);
  return expiry;
}

/**
 * Check if password has expired
 */
export function isPasswordExpired(expiresAt: Date): boolean {
  return new Date() > new Date(expiresAt);
}

/**
 * Calculate lockout expiry
 */
export function calculateLockoutExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + LOCKOUT_POLICY.LOCKOUT_DURATION_MINUTES);
  return expiry;
}

/**
 * Generate JWT token payload
 */
export function generateTokenPayload(
  userId: string,
  sessionId: string,
  role: string
): Record<string, any> {
  return {
    sub: userId,
    sid: sessionId,
    role,
    iat: Math.floor(Date.now() / 1000),
    type: 'access',
  };
}

/**
 * Generate refresh token payload
 */
export function generateRefreshTokenPayload(
  userId: string,
  sessionId: string
): Record<string, any> {
  return {
    sub: userId,
    sid: sessionId,
    iat: Math.floor(Date.now() / 1000),
    type: 'refresh',
  };
}

/**
 * Encrypt sensitive data
 */
export function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    'aes-256-gcm',
    Buffer.from(key.padEnd(32).slice(0, 32)),
    iv
  );
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decrypt(encryptedText: string, key: string): string {
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key.padEnd(32).slice(0, 32)),
    iv
  );
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Generate device fingerprint
 */
export function generateDeviceFingerprint(
  userAgent: string,
  ipAddress: string
): string {
  const data = `${userAgent}:${ipAddress}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000); // Max length
}

/**
 * Check for suspicious patterns
 */
export function detectSuspiciousActivity(
  ipAddress: string,
  userAgent: string,
  recentAttempts: number
): { suspicious: boolean; reason?: string } {
  // Check for bot patterns
  const botPatterns = /bot|crawler|spider|crawling/i;
  if (botPatterns.test(userAgent)) {
    return { suspicious: true, reason: 'Bot detected' };
  }

  // Check for rapid attempts
  if (recentAttempts > 5) {
    return { suspicious: true, reason: 'Too many rapid attempts' };
  }

  // Check for suspicious IPs (would integrate with threat intel in production)
  // This is a placeholder

  return { suspicious: false };
}
