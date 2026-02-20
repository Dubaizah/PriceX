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
  updateProfile: (data: Partial<User['profile']>) => Promise<{ success: boolean; error?: string }>;
  
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

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return {
          success: false,
          requires2FA: false,
          message: data.error || 'Login failed',
          remainingAttempts: data.remainingAttempts,
          lockedUntil: data.lockedUntil ? new Date(data.lockedUntil) : undefined,
        };
      }

      // If 2FA is required
      if (data.requires2FA) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          requires2FA: true,
          tempToken: data.tempToken,
        }));
        return {
          success: true,
          requires2FA: true,
          tempToken: data.tempToken,
          message: 'Please enter your 2FA code',
        };
      }

      // Login successful
      const { user, session } = data;
      
      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
        tempToken: null,
      });

      // Store session
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          user,
          session,
          expiresAt: session.expiresAt,
        }));
      }

      return {
        success: true,
        requires2FA: false,
        message: 'Login successful',
      };
    } catch (err) {
      setError('Network error. Please try again.');
      return {
        success: false,
        requires2FA: false,
        message: 'Network error',
      };
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const verify2FA = async (code: string, method: TwoFAMethod): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          method,
          tempToken: state.tempToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Invalid 2FA code');
        return false;
      }

      const { user, session } = data;
      
      setState({
        user,
        session,
        isAuthenticated: true,
        isLoading: false,
        requires2FA: false,
        tempToken: null,
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        user,
        session,
        expiresAt: session.expiresAt,
      }));

      return true;
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
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

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (err) {
      setError('Network error. Please try again.');
      return { success: false, error: 'Network error' };
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

  // Placeholder implementations for remaining methods
  const verifyEmail = async (): Promise<boolean> => true;
  const verifyMobile = async (): Promise<boolean> => true;
  const resetPassword = async (): Promise<{ success: boolean; error?: string }> => ({ success: true });
  const setup2FA = async (): Promise<any> => ({ success: true });
  const disable2FA = async (): Promise<any> => ({ success: true });
  const generateBackupCodes = async (): Promise<any> => ({ success: true });
  const updateProfile = async (): Promise<any> => ({ success: true });

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
