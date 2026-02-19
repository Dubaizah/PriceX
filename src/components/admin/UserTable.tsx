/**
 * PriceX - Admin User Management Table
 * User table with status, last login, violation history
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Lock, 
  Unlock, 
  UserX, 
  UserCheck,
  RefreshCw,
  Download,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { User } from '@/types/auth';

interface UserTableProps {
  onUserSelect?: (user: User) => void;
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  locked: 'bg-red-500/10 text-red-500 border-red-500/20',
  suspended: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  pending_verification: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-3 h-3" />,
  inactive: <Clock className="w-3 h-3" />,
  locked: <Lock className="w-3 h-3" />,
  suspended: <AlertTriangle className="w-3 h-3" />,
  pending_verification: <Clock className="w-3 h-3" />,
};

export function UserTable({ onUserSelect }: UserTableProps) {
  const { users, getUsers, updateUserStatus, blockUser, unblockUser, isLoading } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [actionMenuUser, setActionMenuUser] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    getUsers({ 
      search: searchQuery,
      status: statusFilter !== 'all' ? (statusFilter as User['status']) : undefined,
      page: currentPage,
      limit: itemsPerPage,
    });
  }, [searchQuery, statusFilter, currentPage]);

  const handleToggleStatus = async (userId: string, currentStatus: User['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateUserStatus(userId, newStatus);
  };

  const handleBlock = async (userId: string) => {
    await blockUser(userId, 'Manual block by admin');
    setActionMenuUser(null);
  };

  const handleUnblock = async (userId: string) => {
    await unblockUser(userId);
    setActionMenuUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Users</h2>
          <span className="text-sm text-muted-foreground">
            {filteredUsers.length} total
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-9 w-64 rounded-lg bg-secondary border-0 text-sm focus:ring-2 focus:ring-[var(--pricex-yellow)]"
            />
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-secondary border-0 text-sm focus:ring-2 focus:ring-[var(--pricex-yellow)]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="locked">Locked</option>
            <option value="suspended">Suspended</option>
            <option value="pending_verification">Pending</option>
          </select>

          <button
            onClick={() => getUsers()}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            title="Export"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-border"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(new Set(paginatedUsers.map(u => u.id)));
                    } else {
                      setSelectedUsers(new Set());
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Violations
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                2FA
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onUserSelect?.(user)}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="rounded border-border"
                    checked={selectedUsers.has(user.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedUsers);
                      if (e.target.checked) {
                        newSelected.add(user.id);
                      } else {
                        newSelected.delete(user.id);
                      }
                      setSelectedUsers(newSelected);
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-[var(--pricex-yellow)]">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[user.status]}`}>
                    {statusIcons[user.status]}
                    {user.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm">
                    {formatDate(user.security?.lastLoginAt || null)}
                  </div>
                  {user.security?.lastLoginLocation && (
                    <p className="text-xs text-muted-foreground">
                      {user.security.lastLoginLocation}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.security?.violations && user.security.violations.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium text-orange-500">
                        {user.security.violations.length}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">None</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {user.security?.twoFactorEnabled ? (
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-500">Enabled</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">Disabled</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuUser(actionMenuUser === user.id ? null : user.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {actionMenuUser === user.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                        >
                          <button
                            onClick={() => handleToggleStatus(user.id, user.status)}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            {user.status === 'active' ? (
                              <>
                                <XCircle className="w-4 h-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Activate
                              </>
                            )}
                          </button>
                          
                          {user.status === 'locked' || user.status === 'suspended' ? (
                            <button
                              onClick={() => handleUnblock(user.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-green-600"
                            >
                              <Unlock className="w-4 h-4" />
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBlock(user.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors text-red-600"
                            >
                              <Lock className="w-4 h-4" />
                              Block
                            </button>
                          )}
                          
                          <button
                            onClick={() => {/* Reset password */}}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Reset Password
                          </button>
                          
                          <button
                            onClick={() => {/* View details */}}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                          >
                            <UserCheck className="w-4 h-4" />
                            View Details
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
            {filteredUsers.length} users
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
