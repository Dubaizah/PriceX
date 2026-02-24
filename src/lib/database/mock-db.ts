/**
 * PriceX - Shared Mock Database
 * In-memory storage for users (for demo purposes)
 */

import { User } from '@/types/auth';

// In-memory user store
export const mockUsers = new Map<string, User>();

// Demo users for testing (plain text passwords for demo)
const DEMO_USERS: User[] = [
  {
    id: 'user_1',
    email: 'admin@pricex.com',
    emailVerified: true,
    mobile: '+971500000000',
    mobileVerified: true,
    name: 'Admin User',
    passwordHash: 'admin123',
    role: 'admin',
    status: 'active',
    profile: {
      timezone: 'Asia/Dubai',
      language: 'en',
      region: 'middle-east',
      currency: 'USD',
    },
    security: {
      passwordHistory: [],
      passwordChangedAt: new Date(),
      passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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
      marketing: true,
      analytics: true,
      thirdParty: true,
      consentedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: 'user_2',
    email: 'user@pricex.com',
    emailVerified: true,
    mobile: '+971500000001',
    mobileVerified: true,
    name: 'Test User',
    passwordHash: 'user123', // user123
    role: 'user',
    status: 'active',
    profile: {
      timezone: 'Asia/Dubai',
      language: 'en',
      region: 'middle-east',
      currency: 'USD',
    },
    security: {
      passwordHistory: [],
      passwordChangedAt: new Date(),
      passwordExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
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
      marketing: true,
      analytics: true,
      thirdParty: true,
      consentedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

// Initialize with demo users
export function initializeMockUsers() {
  if (mockUsers.size === 0) {
    DEMO_USERS.forEach((user) => {
      mockUsers.set(user.id, user);
    });
  }
}

// Initialize on import
initializeMockUsers();

// Helper functions
export function findUserByEmail(email: string): User | undefined {
  return Array.from(mockUsers.values()).find((u) => u.email === email);
}

export function findUserByMobile(mobile: string): User | undefined {
  return Array.from(mockUsers.values()).find((u) => u.mobile === mobile);
}

export function findUserById(id: string): User | undefined {
  return mockUsers.get(id);
}

export function createUser(user: User): User {
  mockUsers.set(user.id, user);
  return user;
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const user = mockUsers.get(id);
  if (!user) return undefined;
  
  const updatedUser = { ...user, ...updates, updatedAt: new Date() };
  mockUsers.set(id, updatedUser);
  return updatedUser;
}
