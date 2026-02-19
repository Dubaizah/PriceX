/**
 * PriceX - Authentication & Security Types
 * Strict security protocols implementation
 */

import { Currency, Region, Language } from './index';

// User Role Types
export type UserRole = 'user' | 'admin' | 'master_admin';
export type AccountStatus = 'active' | 'inactive' | 'locked' | 'suspended' | 'pending_verification';
export type TwoFAMethod = 'app' | 'sms' | 'email';
export type AuditAction = 
  | 'LOGIN' 
  | 'LOGOUT' 
  | 'LOGIN_FAILED' 
  | 'PASSWORD_CHANGE'
  | 'PASSWORD_RESET_REQUEST'
  | 'PASSWORD_RESET_COMPLETE'
  | '2FA_SETUP'
  | '2FA_DISABLE'
  | '2FA_VERIFY'
  | 'ACCOUNT_LOCK'
  | 'ACCOUNT_UNLOCK'
  | 'ACCOUNT_CREATE'
  | 'ACCOUNT_UPDATE'
  | 'ACCOUNT_DELETE'
  | 'ADMIN_ACTION'
  | 'USER_BLOCKED'
  | 'USER_UNBLOCKED'
  | 'SESSION_TERMINATED'
  | 'DATA_EXPORT'
  | 'DATA_DELETE';

// Password History Entry
export interface PasswordHistoryEntry {
  passwordHash: string;
  changedAt: Date;
  changedBy: 'user' | 'system';
}

// User Security Profile
export interface UserSecurityProfile {
  passwordHistory: PasswordHistoryEntry[];
  passwordChangedAt: Date;
  passwordExpiresAt: Date;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  lastLoginDevice: string | null;
  lastLoginLocation: string | null;
  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lockReason: string | null;
  twoFactorEnabled: boolean;
  twoFactorMethod: TwoFAMethod | null;
  twoFactorSecret: string | null; // Encrypted
  backupCodes: string[]; // Hashed
  securityQuestions: {
    question: string;
    answerHash: string;
  }[];
  trustedDevices: TrustedDevice[];
  violations: SecurityViolation[];
}

// Trusted Device
export interface TrustedDevice {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  trustedAt: Date;
  lastUsedAt: Date;
  isActive: boolean;
}

// Security Violation
export interface SecurityViolation {
  id: string;
  type: 'suspicious_login' | 'multiple_failed_attempts' | 'unusual_location' | 'unusual_device' | 'password_expired' | 'concurrent_session' | 'brute_force_attempt';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  deviceInfo: string;
  location: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Session
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  refreshToken: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  isActive: boolean;
  isCurrent: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
}

// User
export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  mobile: string;
  mobileVerified: boolean;
  name: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  profile: {
    avatar?: string;
    timezone: string;
    language: Language;
    region: Region;
    currency: Currency;
  };
  security: UserSecurityProfile;
  gdprConsent: {
    marketing: boolean;
    analytics: boolean;
    thirdParty: boolean;
    consentedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

// Admin Permissions
export interface AdminPermissions {
  users: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    block: boolean;
    unblock: boolean;
    resetPassword: boolean;
    viewSecurityLogs: boolean;
  };
  admins: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
    resetPassword: boolean;
  };
  products: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  retailers: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  system: {
    viewLogs: boolean;
    manageSettings: boolean;
    viewAnalytics: boolean;
    exportData: boolean;
  };
  audit: {
    viewLogs: boolean;
    exportLogs: boolean;
  };
}

// Admin
export interface Admin {
  id: string;
  userId: string;
  isMaster: boolean;
  masterKeyHash?: string; // Only for master admin
  masterKeyWords?: string[]; // Only for master admin - 5 unique words
  permissions: AdminPermissions;
  createdBy: string | null; // null for master admin
  createdAt: Date;
  updatedAt: Date;
}

// Audit Log
export interface AuditLog {
  id: string;
  userId: string | null;
  adminId: string | null;
  action: AuditAction;
  resource: string;
  resourceId: string | null;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  deviceId: string | null;
  location: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

// Login Attempt
export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  location: string;
  success: boolean;
  failureReason?: string;
  timestamp: Date;
}

// Password Reset Token
export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  otp: string;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// 2FA Verification
export interface TwoFAVerification {
  id: string;
  userId: string;
  method: TwoFAMethod;
  code: string;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// Fraud Detection Result
export interface FraudCheckResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  recommendations: string[];
  requiresAdditionalVerification: boolean;
}

// Device Fingerprint
export interface DeviceFingerprint {
  deviceId: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  plugins: string[];
  canvas: string;
  webgl: string;
  fonts: string[];
  ipAddress: string;
}

// Compliance & Data Retention
export interface DataRetentionPolicy {
  userId: string;
  dataType: 'activity_logs' | 'search_history' | 'price_alerts' | 'personal_data';
  retentionDays: number;
  createdAt: Date;
  expiresAt: Date;
  deleted: boolean;
  deletedAt?: Date;
}

// Login Response
export interface LoginResponse {
  success: boolean;
  requires2FA: boolean;
  tempToken?: string;
  message: string;
  remainingAttempts?: number;
  lockedUntil?: Date;
}

// Auth State
export interface AuthState {
  user: User | null;
  session: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requires2FA: boolean;
  tempToken: string | null;
}
