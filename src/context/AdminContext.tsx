/**
 * PriceX - Admin Context
 * Master/Sub-admin role management and permissions
 */

'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Admin, AdminPermissions, User, AuditLog, UserRole } from '@/types/auth';

interface AdminContextType {
  // Admin state
  currentAdmin: Admin | null;
  isMasterAdmin: boolean;
  admins: Admin[];
  users: User[];
  auditLogs: AuditLog[];
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // User management
  getUsers: (filters?: UserFilters) => Promise<void>;
  getUserById: (userId: string) => Promise<User | null>;
  updateUserStatus: (userId: string, status: User['status']) => Promise<boolean>;
  blockUser: (userId: string, reason: string) => Promise<boolean>;
  unblockUser: (userId: string) => Promise<boolean>;
  resetUserPassword: (userId: string) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  exportUserData: (userId: string) => Promise<any>;
  
  // Admin management (Master only)
  getAdmins: () => Promise<void>;
  createSubAdmin: (data: CreateAdminData) => Promise<{ success: boolean; recoveryWords?: string[]; error?: string }>;
  updateAdminPermissions: (adminId: string, permissions: Partial<AdminPermissions>) => Promise<boolean>;
  deleteAdmin: (adminId: string) => Promise<boolean>;
  resetAdminPassword: (adminId: string) => Promise<boolean>;
  
  // Master key recovery
  verifyMasterKey: (words: string[]) => Promise<boolean>;
  regenerateMasterKey: () => Promise<{ success: boolean; words?: string[]; error?: string }>;
  
  // Audit logs
  getAuditLogs: (filters?: AuditFilters) => Promise<void>;
  exportAuditLogs: (filters?: AuditFilters) => Promise<any>;
  
  // System
  getSystemStats: () => Promise<SystemStats>;
  clearError: () => void;
}

interface UserFilters {
  status?: User['status'];
  role?: UserRole;
  search?: string;
  page?: number;
  limit?: number;
}

interface AuditFilters {
  action?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

interface CreateAdminData {
  name: string;
  email: string;
  mobile: string;
  permissions: Partial<AdminPermissions>;
}

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  lockedUsers: number;
  newUsersToday: number;
  loginAttemptsToday: number;
  failedAttemptsToday: number;
  securityViolationsToday: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMasterAdmin = currentAdmin?.isMaster || false;

  // User Management
  const getUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/users?' + new URLSearchParams(filters as any));
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userId: string): Promise<User | null> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();
      return response.ok ? data.user : null;
    } catch (err) {
      return null;
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: User['status']): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const blockUser = useCallback(async (userId: string, reason: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const unblockUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/unblock`, {
        method: 'POST',
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const resetUserPassword = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const exportUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/export`);
      return response.ok ? await response.json() : null;
    } catch (err) {
      return null;
    }
  }, []);

  // Admin Management (Master only)
  const getAdmins = useCallback(async () => {
    if (!isMasterAdmin) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/admins');
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins);
      }
    } catch (err) {
      setError('Failed to fetch admins');
    } finally {
      setIsLoading(false);
    }
  }, [isMasterAdmin]);

  const createSubAdmin = useCallback(async (data: CreateAdminData): Promise<any> => {
    if (!isMasterAdmin) {
      return { success: false, error: 'Only Master Admin can create sub-admins' };
    }
    
    try {
      const response = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, [isMasterAdmin]);

  const updateAdminPermissions = useCallback(async (
    adminId: string, 
    permissions: Partial<AdminPermissions>
  ): Promise<boolean> => {
    if (!isMasterAdmin) return false;
    
    try {
      const response = await fetch(`/api/admin/admins/${adminId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, [isMasterAdmin]);

  const deleteAdmin = useCallback(async (adminId: string): Promise<boolean> => {
    if (!isMasterAdmin) return false;
    
    try {
      const response = await fetch(`/api/admin/admins/${adminId}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, [isMasterAdmin]);

  // Master Key Recovery
  const verifyMasterKey = useCallback(async (words: string[]): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/verify-master-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words }),
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, []);

  const regenerateMasterKey = useCallback(async (): Promise<any> => {
    if (!isMasterAdmin) {
      return { success: false, error: 'Only Master Admin can regenerate master key' };
    }
    
    try {
      const response = await fetch('/api/admin/regenerate-master-key', {
        method: 'POST',
      });
      return await response.json();
    } catch (err) {
      return { success: false, error: 'Network error' };
    }
  }, [isMasterAdmin]);

  // Audit Logs
  const getAuditLogs = useCallback(async (filters?: AuditFilters) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/audit-logs?' + new URLSearchParams(filters as any));
      const data = await response.json();
      
      if (response.ok) {
        setAuditLogs(data.logs);
      }
    } catch (err) {
      setError('Failed to fetch audit logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportAuditLogs = useCallback(async (filters?: AuditFilters) => {
    try {
      const response = await fetch('/api/admin/audit-logs/export?' + new URLSearchParams(filters as any));
      return response.ok ? await response.json() : null;
    } catch (err) {
      return null;
    }
  }, []);

  // System Stats
  const getSystemStats = useCallback(async (): Promise<SystemStats> => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      return data.stats || {
        totalUsers: 0,
        activeUsers: 0,
        lockedUsers: 0,
        newUsersToday: 0,
        loginAttemptsToday: 0,
        failedAttemptsToday: 0,
        securityViolationsToday: 0,
      };
    } catch (err) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        lockedUsers: 0,
        newUsersToday: 0,
        loginAttemptsToday: 0,
        failedAttemptsToday: 0,
        securityViolationsToday: 0,
      };
    }
  }, []);

  const clearError = () => setError(null);

  const resetAdminPassword = useCallback(async (adminId: string): Promise<boolean> => {
    if (!isMasterAdmin) return false;
    
    try {
      const response = await fetch(`/api/admin/admins/${adminId}/reset-password`, {
        method: 'POST',
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  }, [isMasterAdmin]);

  const value: AdminContextType = {
    currentAdmin,
    isMasterAdmin,
    admins,
    users,
    auditLogs,
    isLoading,
    error,
    getUsers,
    getUserById,
    updateUserStatus,
    blockUser,
    unblockUser,
    resetUserPassword,
    deleteUser,
    exportUserData,
    getAdmins,
    createSubAdmin,
    updateAdminPermissions,
    deleteAdmin,
    resetAdminPassword,
    verifyMasterKey,
    regenerateMasterKey,
    getAuditLogs,
    exportAuditLogs,
    getSystemStats,
    clearError,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
