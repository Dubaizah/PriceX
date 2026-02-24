/**
 * PriceX - Authentication Context
 * Manages user authentication state, login, logout, 2FA
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, UserSession, AuthState, LoginResponse, TwoFAMethod } from '@/types/auth';

interface AuthContextType extends AuthState {
  // Auth actions
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  verify2FA: (code: string, method: TwoFAMethod) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAllDevices: () => Promise<void>;
  
  // Registration
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (token: string) => Promise<boolean>;
  verifyMobile: (code: string) => Promise<boolean>;
  
  // Password management
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // 2FA management
  setup2FA: (method: TwoFAMethod) => Promise<{ success: boolean; qrCode?: string; secret?: string; error?: string }>;
  disable2FA: (password: string) => Promise<{ success: boolean; error?: string }>;
  generateBackupCodes: () => Promise<{ success: boolean; codes?: string[]; error?: string }>;
  
  // Session management
  getActiveSessions: () => Promise<UserSession[]>;
  terminateSession: (sessionId: string) => Promise<void>;
  
  // User profile
  updateProfile: (data: Partial<User['profile']>) => Promise<{ success: boolean; error: string }>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  gdprConsent: {
    marketing: boolean;
    analytics: boolean;
    thirdParty: boolean;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'pricex-auth-session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    requires2FA: false,
    tempToken: null,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const { user, session, expiresAt } = JSON.parse(stored);
          
          // Check if session is expired
          if (new Date(expiresAt) > new Date()) {
            setState({
              user,
              session,
              isAuthenticated: true,
              isLoading: false,
              requires2FA: false,
              tempToken: null,
            });
            
            // Validate session with backend
            const response = await fetch('/api/auth/validate-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: session.id }),
            });
            
            if (!response.ok) {
              // Session invalid, clear storage
              localStorage.removeItem(STORAGE_KEY);
              setState({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
                requires2FA: false,
                tempToken: null,
              });
            }
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  // Auto-logout on inactivity
  const resetActivityTimer = useCallback(() => {
    // We'll use a ref to avoid the dependency issue
  }, []);

  // Track user activity - simplified
  useEffect(() => {
    // Activity tracking disabled for demo
  }, [state.isAuthenticated, state.requires2FA]);

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<LoginResponse> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      // Check localStorage first for registered users
      const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
      const localUser = users.find((u: any) => 
        u.email === email.toLowerCase() || u.mobile === email
      );
      
      if (localUser) {
        // Check if account is locked
        if (localUser.lockedUntil && new Date(localUser.lockedUntil) > new Date()) {
          return {
            success: false,
            message: 'Account is locked. Too many failed attempts.',
            lockedUntil: new Date(localUser.lockedUntil),
          };
        }

        if (localUser.passwordHash === password) {
          // Reset failed attempts on successful password
          localUser.failedLoginAttempts = 0;
          localUser.lockedUntil = null;
          localStorage.setItem('pricex-users', JSON.stringify(users));

          // Update last login
          localUser.security = localUser.security || {};
          localUser.security.lastLoginAt = new Date().toISOString();
          localStorage.setItem('pricex-users', JSON.stringify(users));

          // Create user session - use saved profile settings
          const user = {
            id: localUser.id,
            email: localUser.email,
            name: localUser.name,
            role: localUser.role || 'user',
            status: 'active',
            profile: localUser.profile || {
              timezone: 'UTC',
              language: 'en',
              region: 'global',
              currency: 'USD',
            },
            security: {
              twoFactorEnabled: localUser.security?.twoFactorEnabled || false,
              lastLoginAt: new Date(),
              lastLoginLocation: null,
            },
            createdAt: localUser.createdAt,
            gdprConsent: localUser.gdprConsent,
          };

          const session = {
            id: `session_${Date.now()}`,
            userId: user.id,
            token: `token_${Date.now()}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          };

          setState({
            user,
            session,
            isAuthenticated: true,
            isLoading: false,
            requires2FA: false,
            tempToken: null,
          });

          if (rememberMe) {
            localStorage.setItem('pricex-auth-session', JSON.stringify({
              user,
              session,
              expiresAt: session.expiresAt,
            }));
          }

          return {
            success: true,
            message: 'Login successful',
          };
        } else {
          // Increment failed attempts
          localUser.failedLoginAttempts = (localUser.failedLoginAttempts || 0) + 1;
          
          if (localUser.failedLoginAttempts >= 3) {
            localUser.lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
            localStorage.setItem('pricex-users', JSON.stringify(users));
            
            return {
              success: false,
              message: 'Account locked due to too many failed attempts.',
              remainingAttempts: 0,
              lockedUntil: new Date(Date.now() + 30 * 60 * 1000),
            };
          }
          
          localStorage.setItem('pricex-users', JSON.stringify(users));
          
          return {
            success: false,
            message: 'Invalid credentials',
            remainingAttempts: 3 - localUser.failedLoginAttempts,
          };
        }
      }

      // Demo users fallback
      const demoUsers: Record<string, { password: string; name: string; role: string }> = {
        'admin@pricex.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
        'user@pricex.com': { password: 'user123', name: 'Test User', role: 'user' },
        'demo@pricex.com': { password: 'demo123', name: 'Demo User', role: 'user' },
      };

      const demoUser = demoUsers[email.toLowerCase()];
      if (demoUser && demoUser.password === password) {
        // Check if demo user already exists in localStorage (with saved settings)
        let localUser = users.find((u: any) => u.email === email.toLowerCase());
        
        if (!localUser) {
          // Create demo user in localStorage so settings can be saved
          localUser = {
            id: `demo_${Date.now()}`,
            email: email.toLowerCase(),
            name: demoUser.name,
            mobile: '',
            passwordHash: demoUser.password,
            role: demoUser.role,
            status: 'active',
            emailVerified: true,
            mobileVerified: false,
            twoFactorEnabled: false,
            profile: {
              timezone: 'Asia/Dubai',
              language: 'en',
              region: 'middle-east',
              currency: 'USD',
            },
            security: {
              passwordHistory: [],
              passwordChangedAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              lastLoginIp: null,
              lastLoginDevice: null,
              lastLoginLocation: null,
              failedLoginAttempts: 0,
              lockedUntil: null,
              twoFactorEnabled: false,
              twoFactorMethod: null,
              twoFactorSecret: null,
              backupCodes: [],
            },
            gdprConsent: { marketing: true, analytics: true, thirdParty: true },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          users.push(localUser);
          localStorage.setItem('pricex-users', JSON.stringify(users));
        }

        const user = {
          id: localUser.id,
          email: localUser.email,
          name: localUser.name,
          role: localUser.role,
          status: 'active',
          profile: localUser.profile || {
            timezone: 'Asia/Dubai',
            language: 'en',
            region: 'middle-east',
            currency: 'USD',
          },
          security: {
            twoFactorEnabled: false,
            lastLoginAt: new Date(),
            lastLoginLocation: null,
          },
          createdAt: localUser.createdAt,
        };

        const session = {
          id: `session_${Date.now()}`,
          userId: user.id,
          token: `token_${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        };

        setState({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
          requires2FA: false,
          tempToken: null,
        });

        if (rememberMe) {
          localStorage.setItem('pricex-auth-session', JSON.stringify({
            user,
            session,
            expiresAt: session.expiresAt,
          }));
        }

        return {
          success: true,
          message: 'Login successful',
        };
      }

      setError('Invalid credentials');
      return {
        success: false,
        message: 'Invalid credentials',
      };
    } catch (err) {
      setError('Network error. Please try again.');
      return {
        success: false,
        message: 'Network error',
      };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (state.session?.id) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: state.session.id }),
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        requires2FA: false,
        tempToken: null,
      });
    }
  };

  const logoutAllDevices = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.user?.id }),
      });
    } catch (err) {
      console.error('Logout all error:', err);
    } finally {
      localStorage.removeItem(STORAGE_KEY);
      setState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        requires2FA: false,
        tempToken: null,
      });
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      setError(null);

      // Validate required fields
      if (!data.name || !data.email || !data.password) {
        setError('Name, email, and password are required');
        return { success: false, error: 'Name, email, and password are required' };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        setError('Invalid email format');
        return { success: false, error: 'Invalid email format' };
      }

      // Validate password (8-32 chars, 1 uppercase, 1 number)
      if (data.password.length < 8 || data.password.length > 32) {
        setError('Password must be 8-32 characters');
        return { success: false, error: 'Password must be 8-32 characters' };
      }
      if (!/[A-Z]/.test(data.password)) {
        setError('Password must contain at least 1 uppercase letter');
        return { success: false, error: 'Password must contain at least 1 uppercase letter' };
      }
      if (!/[0-9]/.test(data.password)) {
        setError('Password must contain at least 1 number');
        return { success: false, error: 'Password must contain at least 1 number' };
      }

      // Get existing users
      const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
      
      // Check if email already exists
      if (users.some((u: any) => u.email === data.email.toLowerCase())) {
        setError('Email already registered');
        return { success: false, error: 'Email already registered' };
      }

      // Check if mobile already exists
      if (data.mobile && users.some((u: any) => u.mobile === data.mobile)) {
        setError('Mobile number already registered');
        return { success: false, error: 'Mobile number already registered' };
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email: data.email.toLowerCase(),
        name: data.name,
        mobile: data.mobile || '',
        passwordHash: data.password, // Plain for demo
        role: 'user',
        status: 'active',
        emailVerified: false,
        mobileVerified: false,
        twoFactorEnabled: true,
        profile: {
          timezone: 'UTC',
          language: 'en',
          region: 'global',
          currency: 'USD',
        },
        security: {
          passwordHistory: [],
          passwordChangedAt: new Date().toISOString(),
          passwordExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastLoginAt: null,
          lastLoginIp: null,
          lastLoginDevice: null,
          lastLoginLocation: null,
          failedLoginAttempts: 0,
          lockedUntil: null,
          lockReason: null,
          twoFactorEnabled: true,
          twoFactorMethod: 'sms',
          twoFactorSecret: null,
          backupCodes: [],
          securityQuestions: [],
          trustedDevices: [],
          violations: [],
        },
        gdprConsent: data.gdprConsent || { marketing: true, analytics: true, thirdParty: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('pricex-users', JSON.stringify(users));

      console.log('[REGISTER] User created:', newUser.email);

      return { success: true };
    } catch (err) {
      setError('Registration failed. Please try again.');
      return { success: false, error: 'Registration failed' };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error };
      }

      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      return {
        success: response.ok,
        message: data.message || (response.ok ? 'Reset link sent' : 'Failed to send reset link'),
      };
    } catch (err) {
      return { success: false, message: 'Network error' };
    }
  };

  const getActiveSessions = async (): Promise<UserSession[]> => {
    try {
      const response = await fetch('/api/auth/sessions');
      const data = await response.json();
      return data.sessions || [];
    } catch (err) {
      return [];
    }
  };

  const terminateSession = async (sessionId: string): Promise<void> => {
    try {
      await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Terminate session error:', err);
    }
  };

  const clearError = () => setError(null);

  // Update user profile
  const updateProfile = async (data: Partial<User['profile']>): Promise<{ success: boolean; error: string }> => {
    try {
      if (!state.user) {
        return { success: false, error: 'Not authenticated' };
      }

      // Update in localStorage users
      const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === state.user?.id);
      
      if (userIndex !== -1) {
        users[userIndex].profile = { ...users[userIndex].profile, ...data };
        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('pricex-users', JSON.stringify(users));
      }

      // Update current session
      const updatedUser = { ...state.user, profile: { ...state.user.profile, ...data } };
      setState(prev => ({ ...prev, user: updatedUser }));

      // Update localStorage session
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const sessionData = JSON.parse(stored);
        sessionData.user = updatedUser;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
      }

      return { success: true, error: '' };
    } catch (err) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  // Placeholder implementations for remaining methods
  const verifyEmail = async (): Promise<boolean> => true;
  const verifyMobile = async (): Promise<boolean> => true;
  const verify2FA = async (): Promise<boolean> => true;
  const resetPassword = async (): Promise<{ success: boolean; error?: string }> => ({ success: true });
  const setup2FA = async (): Promise<any> => ({ success: true });
  const disable2FA = async (): Promise<any> => ({ success: true });
  const generateBackupCodes = async (): Promise<any> => ({ success: true });

  const value: AuthContextType = {
    ...state,
    error,
    login,
    verify2FA,
    logout,
    logoutAllDevices,
    register,
    verifyEmail,
    verifyMobile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    setup2FA,
    disable2FA,
    generateBackupCodes,
    getActiveSessions,
    terminateSession,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
