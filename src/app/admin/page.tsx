/**
 * PriceX - Admin Dashboard Page
 * Master/Sub-admin dashboard with user management and audit logs
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Shield, 
  FileText, 
  Settings, 
  LogOut,
  Crown,
  UserPlus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Lock,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { UserTable } from '@/components/admin/UserTable';
import { PriceXLogoCompact } from '@/components/ui/PriceXLogo';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'admins', label: 'Admins', icon: Shield },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const { 
    isMasterAdmin, 
    getSystemStats, 
    getUsers, 
    users,
    getAuditLogs,
    auditLogs,
    currentAdmin,
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    lockedUsers: 0,
    newUsersToday: 0,
    loginAttemptsToday: 0,
    failedAttemptsToday: 0,
    securityViolationsToday: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const systemStats = await getSystemStats();
      setStats(systemStats);
    };
    loadStats();
    getUsers();
    getAuditLogs();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} users={users} auditLogs={auditLogs} />;
      case 'users':
        return <UserTable />;
      case 'admins':
        return isMasterAdmin ? <AdminsContent /> : <AccessDenied />;
      case 'audit':
        return <AuditLogsContent logs={auditLogs} />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent stats={stats} users={users} auditLogs={auditLogs} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <PriceXLogoCompact />
            <span className="text-sm text-muted-foreground">Admin Panel</span>
            {isMasterAdmin && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)] text-xs font-medium rounded-full">
                <Crown className="w-3 h-3" />
                Master
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="pt-16 flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 fixed left-0 top-16 bottom-0 bg-card border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)]'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 p-8">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Dashboard Content
function DashboardContent({ stats, users, auditLogs }: { 
  stats: any; 
  users: any[]; 
  auditLogs: any[];
}) {
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
    { label: 'Active Users', value: stats.activeUsers, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Locked Accounts', value: stats.lockedUsers, icon: Lock, color: 'text-red-500' },
    { label: 'New Today', value: stats.newUsersToday, icon: UserPlus, color: 'text-purple-500' },
    { label: 'Login Attempts', value: stats.loginAttemptsToday, icon: Activity, color: 'text-orange-500' },
    { label: 'Security Violations', value: stats.securityViolationsToday, icon: AlertTriangle, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of system activity and security metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="p-6 bg-card border border-border rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-opacity-10 ${stat.color}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recent Users</h3>
          <div className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-[var(--pricex-yellow)]">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Recent Security Events</h3>
          <div className="space-y-3">
            {auditLogs.slice(0, 5).map((log, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  log.success ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admins Content
function AdminsContent() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Admin Management</h1>
          <p className="text-muted-foreground">Manage sub-admin accounts and permissions.</p>
        </div>
        <button className="px-4 py-2 bg-[var(--pricex-yellow)] text-black font-medium rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors">
          Create Sub-Admin
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Sub-admin management interface coming soon.</p>
      </div>
    </div>
  );
}

// Audit Logs Content
function AuditLogsContent({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Audit Logs</h1>
        <p className="text-muted-foreground">Complete history of all admin and user actions.</p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">IP Address</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Timestamp</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-sm">{log.action}</td>
                <td className="px-4 py-3 text-sm">{log.userId || 'System'}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{log.ipAddress}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  }`}>
                    {log.success ? 'Success' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Settings Content
function SettingsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure system settings and security policies.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Settings interface coming soon.</p>
      </div>
    </div>
  );
}

// Access Denied
function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Lock className="w-16 h-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
      <p className="text-muted-foreground">Only Master Admin can access this section.</p>
    </div>
  );
}
