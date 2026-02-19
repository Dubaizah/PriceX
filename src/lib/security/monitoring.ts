/**
 * PriceX - Fraud Detection & Security Monitoring
 * Anti-fraud detection, device tracking, and location analysis
 */

import { FraudCheckResult, DeviceFingerprint, UserSession, SecurityViolation } from '@/types/auth';

// Risk scoring weights
const RISK_WEIGHTS = {
  NEW_DEVICE: 20,
  NEW_LOCATION: 25,
  SUSPICIOUS_IP: 30,
  MULTIPLE_FAILED_ATTEMPTS: 15,
  UNUSUAL_TIME: 10,
  VPN_TOR: 35,
  KNOWN_MALICIOUS: 100,
};

// Known high-risk countries (for enhanced monitoring)
const HIGH_RISK_COUNTRIES = ['XX', 'YY']; // Placeholder - would use actual risk data

/**
 * Perform comprehensive fraud check
 */
export async function performFraudCheck(
  userId: string,
  deviceInfo: DeviceFingerprint,
  trustedDevices: { deviceId: string }[],
  recentViolations: SecurityViolation[],
  failedAttempts: number,
  isNewDevice: boolean,
  isNewLocation: boolean
): Promise<FraudCheckResult> {
  let riskScore = 0;
  const flags: string[] = [];
  const recommendations: string[] = [];

  // Check for new device
  if (isNewDevice) {
    riskScore += RISK_WEIGHTS.NEW_DEVICE;
    flags.push('New device detected');
    recommendations.push('Send device verification email');
  }

  // Check for new location
  if (isNewLocation) {
    riskScore += RISK_WEIGHTS.NEW_LOCATION;
    flags.push('New location detected');
    recommendations.push('Require additional verification');
  }

  // Check for failed attempts
  if (failedAttempts > 0) {
    riskScore += Math.min(failedAttempts * 5, RISK_WEIGHTS.MULTIPLE_FAILED_ATTEMPTS);
    flags.push(`${failedAttempts} recent failed login attempts`);
  }

  // Check for recent violations
  const criticalViolations = recentViolations.filter(v => v.severity === 'critical');
  if (criticalViolations.length > 0) {
    riskScore += 40;
    flags.push('Recent critical security violations');
    recommendations.push('Force password reset');
  }

  // Check device reputation (would integrate with external service)
  const deviceReputation = await checkDeviceReputation(deviceInfo);
  if (deviceReputation.risky) {
    riskScore += RISK_WEIGHTS.SUSPICIOUS_IP;
    flags.push('Device has poor reputation');
  }

  // Check for VPN/Tor
  if (await isVPNOrTor(deviceInfo.ipAddress)) {
    riskScore += RISK_WEIGHTS.VPN_TOR;
    flags.push('VPN/Tor network detected');
    recommendations.push('Block or require additional verification');
  }

  // Time-based analysis
  const hour = new Date().getHours();
  if (hour < 5 || hour > 23) {
    riskScore += RISK_WEIGHTS.UNUSUAL_TIME;
    flags.push('Unusual login time');
  }

  // Determine risk level
  let riskLevel: FraudCheckResult['riskLevel'] = 'low';
  if (riskScore >= 75) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 25) riskLevel = 'medium';

  return {
    riskScore: Math.min(riskScore, 100),
    riskLevel,
    flags,
    recommendations,
    requiresAdditionalVerification: riskScore >= 30,
  };
}

/**
 * Check device reputation (placeholder - integrate with external service)
 */
async function checkDeviceReputation(
  deviceInfo: DeviceFingerprint
): Promise<{ risky: boolean; score: number }> {
  // In production, integrate with:
  // - MaxMind minFraud
  // - ThreatMetrix
  // - Sift Science
  // - Internal reputation database
  
  return { risky: false, score: 0 };
}

/**
 * Check if IP is from VPN/Tor (placeholder)
 */
async function isVPNOrTor(ipAddress: string): Promise<boolean> {
  // In production, use:
  // - IP quality score APIs
  // - Tor exit node lists
  // - Known VPN IP ranges
  
  return false;
}

/**
 * Get location from IP address
 */
export async function getLocationFromIP(ipAddress: string): Promise<{
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
}> {
  // In production, use MaxMind GeoIP or similar
  return {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
    latitude: 0,
    longitude: 0,
  };
}

/**
 * Calculate distance between two locations
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Check if location jump is suspicious
 */
export function isSuspiciousLocationJump(
  prevLocation: { lat: number; lon: number; time: Date },
  newLocation: { lat: number; lon: number; time: Date }
): boolean {
  const distance = calculateDistance(
    prevLocation.lat,
    prevLocation.lon,
    newLocation.lat,
    newLocation.lon
  );
  
  const timeDiff = (newLocation.time.getTime() - prevLocation.time.getTime()) / 1000 / 60; // minutes
  const maxPossibleDistance = (timeDiff / 60) * 900; // 900 km/h (plane speed)
  
  return distance > maxPossibleDistance;
}

/**
 * Parse user agent string
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  isMobile: boolean;
} {
  // Simple parsing - use a library like 'ua-parser-js' in production
  const ua = userAgent.toLowerCase();
  
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';
  let isMobile = false;
  
  // Browser detection
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  
  // OS detection
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) { os = 'Android'; isMobile = true; }
  else if (ua.includes('iphone') || ua.includes('ipad')) { os = 'iOS'; isMobile = true; }
  
  // Device detection
  if (isMobile) device = 'Mobile';
  else if (ua.includes('tablet')) device = 'Tablet';
  
  return {
    browser,
    browserVersion: '',
    os,
    osVersion: '',
    device,
    isMobile,
  };
}

/**
 * Generate device name from user agent
 */
export function generateDeviceName(userAgent: string): string {
  const parsed = parseUserAgent(userAgent);
  return `${parsed.browser} on ${parsed.os}`;
}

/**
 * Create security violation entry
 */
export function createSecurityViolation(
  type: SecurityViolation['type'],
  severity: SecurityViolation['severity'],
  description: string,
  ipAddress: string,
  deviceInfo: string,
  location: string
): SecurityViolation {
  return {
    id: generateId(),
    type,
    severity,
    description,
    ipAddress,
    deviceInfo,
    location,
    timestamp: new Date(),
    resolved: false,
  };
}

/**
 * Generate unique ID
 */
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Rate limiter using sliding window
 */
export class SlidingWindowRateLimiter {
  private windows: Map<string, number[]> = new Map();
  private windowSize: number;
  private maxRequests: number;

  constructor(windowSizeMs: number = 60000, maxRequests: number = 10) {
    this.windowSize = windowSizeMs;
    this.maxRequests = maxRequests;
  }

  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    
    // Get or create window
    let requests = this.windows.get(key) || [];
    
    // Remove old requests outside window
    requests = requests.filter(timestamp => timestamp > windowStart);
    
    // Check if allowed
    const allowed = requests.length < this.maxRequests;
    
    if (allowed) {
      requests.push(now);
    }
    
    this.windows.set(key, requests);
    
    // Calculate reset time
    const oldestRequest = requests[0] || now;
    const resetTime = oldestRequest + this.windowSize;
    
    return {
      allowed,
      remaining: Math.max(0, this.maxRequests - requests.length),
      resetTime,
    };
  }

  reset(key: string): void {
    this.windows.delete(key);
  }
}

/**
 * Session anomaly detection
 */
export function detectSessionAnomalies(
  sessions: UserSession[],
  currentSession: UserSession
): string[] {
  const anomalies: string[] = [];
  
  // Check for concurrent sessions from different locations
  const activeSessions = sessions.filter(s => s.isActive && s.id !== currentSession.id);
  
  for (const session of activeSessions) {
    if (session.ipAddress !== currentSession.ipAddress) {
      anomalies.push(`Concurrent session from different IP: ${session.ipAddress}`);
    }
    if (session.location !== currentSession.location) {
      anomalies.push(`Concurrent session from different location: ${session.location}`);
    }
  }
  
  // Check for too many concurrent sessions
  if (activeSessions.length >= 3) {
    anomalies.push(`Multiple concurrent sessions (${activeSessions.length + 1}) detected`);
  }
  
  return anomalies;
}

/**
 * Security event types for monitoring
 */
export const SecurityEventType = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE',
  PASSWORD_RESET: 'PASSWORD_RESET',
  '2FA_ENABLED': '2FA_ENABLED',
  '2FA_DISABLED': '2FA_DISABLED',
  '2FA_FAILED': '2FA_FAILED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  SESSION_HIJACKING_ATTEMPT: 'SESSION_HIJACKING_ATTEMPT',
  BRUTE_FORCE_ATTEMPT: 'BRUTE_FORCE_ATTEMPT',
} as const;

export type SecurityEventType = typeof SecurityEventType[keyof typeof SecurityEventType];

/**
 * Log security event
 */
export function logSecurityEvent(
  eventType: SecurityEventType,
  userId: string,
  details: Record<string, any>,
  severity: 'info' | 'warning' | 'critical' = 'info'
): void {
  const event = {
    type: eventType,
    userId,
    details,
    severity,
    timestamp: new Date().toISOString(),
  };
  
  // In production, send to:
  // - Security information and event management (SIEM)
  // - Logging aggregation service
  // - Real-time alerting system
  
  console.log('[SECURITY]', event);
}
