/**
 * PriceX - User Profile Page
 * User account management, settings, and security
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, Shield, Bell, Globe, 
  CreditCard, Heart, Search, History, Settings,
  LogOut, ChevronRight, Check, AlertTriangle,
  Key, Smartphone, Monitor, Trash2, Edit
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { DeviceMonitoring } from '@/components/auth/DeviceMonitoring';

type TabType = 'profile' | 'settings' | 'security' | 'activity';

export default function ProfilePage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربية' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
  ];

  const regions = [
    { code: 'global', name: 'Global' },
    { code: 'north-america', name: 'North America' },
    { code: 'europe', name: 'Europe' },
    { code: 'asia-pacific', name: 'Asia Pacific' },
    { code: 'middle-east', name: 'Middle East' },
    { code: 'africa', name: 'Africa' },
    { code: 'south-america', name: 'South America' },
  ];

  const currencies = [
    { code: 'USD', name: 'USD ($)' },
    { code: 'EUR', name: 'EUR (€)' },
    { code: 'GBP', name: 'GBP (£)' },
    { code: 'AED', name: 'AED (د.إ)' },
    { code: 'SAR', name: 'SAR (﷼)' },
    { code: 'CNY', name: 'CNY (¥)' },
    { code: 'INR', name: 'INR (₹)' },
  ];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setEditedName(user.name);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const updateUserSetting = (key: string, value: string) => {
    const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('pricex-auth-session') || '{}');
    
    const userIndex = users.findIndex((u: any) => u.id === currentUser.user?.id);
    if (userIndex !== -1) {
      if (!users[userIndex].profile) users[userIndex].profile = {};
      users[userIndex].profile[key] = value;
      localStorage.setItem('pricex-users', JSON.stringify(users));
      
      // Update session
      currentUser.user.profile[key] = value;
      localStorage.setItem('pricex-auth-session', JSON.stringify(currentUser));
      
      // Force refresh
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--pricex-yellow)]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: t('profile.myProfile', 'My Profile'), icon: User },
    { id: 'settings', label: t('profile.settings', 'Settings'), icon: Settings },
    { id: 'security', label: t('profile.security', 'Security'), icon: Shield },
    { id: 'activity', label: t('profile.activity', 'Activity'), icon: History },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{t('profile.myAccount', 'My Account')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('profile.manageAccount', 'Manage your account settings and preferences')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-4 sticky top-24">
                {/* User Info Card */}
                <div className="text-center pb-4 border-b border-border mb-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-[var(--pricex-yellow)] flex items-center justify-center text-2xl font-bold text-black mb-3">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {user.status}
                  </span>
                </div>

                {/* Navigation Tabs */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[var(--pricex-yellow)] text-black'
                          : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors hover:bg-red-500/10 text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('auth.logout', 'Logout')}</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{t('profile.personalInfo', 'Personal Information')}</h2>
                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
                      >
                        {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                        {isEditing ? t('common.save', 'Save') : t('common.edit', 'Edit')}
                      </button>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{t('auth.name', 'Full Name')}</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              className="w-full bg-transparent border-b border-border focus:border-[var(--pricex-yellow)] outline-none mt-1"
                            />
                          ) : (
                            <p className="font-medium">{user.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{t('auth.email', 'Email')}</p>
                          <p className="font-medium">{user.email}</p>
                          {user.emailVerified && (
                            <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                              <Check className="w-3 h-3" /> {t('profile.verified', 'Verified')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">{t('auth.mobile', 'Mobile Number')}</p>
                          <p className="font-medium">{user.mobile || t('profile.notSet', 'Not set')}</p>
                          {user.mobileVerified && (
                            <span className="text-xs text-green-500 flex items-center gap-1 mt-1">
                              <Check className="w-3 h-3" /> {t('profile.verified', 'Verified')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                      <Link href="/alerts" className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                        <Bell className="w-6 h-6 mx-auto mb-2 text-[var(--pricex-yellow)]" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">{t('profile.alerts', 'Alerts')}</p>
                      </Link>
                      <Link href="/compare" className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                        <CreditCard className="w-6 h-6 mx-auto mb-2 text-[var(--pricex-yellow)]" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">{t('profile.comparisons', 'Comparisons')}</p>
                      </Link>
                      <Link href="/favorites" className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                        <Heart className="w-6 h-6 mx-auto mb-2 text-[var(--pricex-yellow)]" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">{t('profile.favorites', 'Favorites')}</p>
                      </Link>
                      <Link href="/search-history" className="p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center">
                        <History className="w-6 h-6 mx-auto mb-2 text-[var(--pricex-yellow)]" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">{t('profile.searches', 'Searches')}</p>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Account Settings</h2>

                    <div className="space-y-4">
                      {/* Language */}
                      <div className="relative">
                        <div 
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary"
                          onClick={() => { setShowLanguageDropdown(!showLanguageDropdown); setShowRegionDropdown(false); setShowCurrencyDropdown(false); }}
                        >
                          <div className="flex items-center gap-4">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Language</p>
                              <p className="text-sm text-muted-foreground">{languages.find(l => l.code === user.profile?.language)?.name || 'English'}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {showLanguageDropdown && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                            {languages.map(lang => (
                              <div 
                                key={lang.code}
                                className="p-3 hover:bg-secondary cursor-pointer flex items-center justify-between"
                                onClick={() => { updateUserSetting('language', lang.code); setShowLanguageDropdown(false); }}
                              >
                                <span>{lang.name}</span>
                                {user.profile?.language === lang.code && <Check className="w-4 h-4 text-green-500" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Region */}
                      <div className="relative">
                        <div 
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary"
                          onClick={() => { setShowRegionDropdown(!showRegionDropdown); setShowLanguageDropdown(false); setShowCurrencyDropdown(false); }}
                        >
                          <div className="flex items-center gap-4">
                            <Globe className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Region</p>
                              <p className="text-sm text-muted-foreground">{regions.find(r => r.code === user.profile?.region)?.name || 'Global'}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {showRegionDropdown && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                            {regions.map(region => (
                              <div 
                                key={region.code}
                                className="p-3 hover:bg-secondary cursor-pointer flex items-center justify-between"
                                onClick={() => { updateUserSetting('region', region.code); setShowRegionDropdown(false); }}
                              >
                                <span>{region.name}</span>
                                {user.profile?.region === region.code && <Check className="w-4 h-4 text-green-500" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Currency */}
                      <div className="relative">
                        <div 
                          className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer hover:bg-secondary"
                          onClick={() => { setShowCurrencyDropdown(!showCurrencyDropdown); setShowLanguageDropdown(false); setShowRegionDropdown(false); }}
                        >
                          <div className="flex items-center gap-4">
                            <CreditCard className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Currency</p>
                              <p className="text-sm text-muted-foreground">{currencies.find(c => c.code === user.profile?.currency)?.name || 'USD ($)'}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                        {showCurrencyDropdown && (
                          <div className="absolute z-50 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
                            {currencies.map(currency => (
                              <div 
                                key={currency.code}
                                className="p-3 hover:bg-secondary cursor-pointer flex items-center justify-between"
                                onClick={() => { updateUserSetting('currency', currency.code); setShowCurrencyDropdown(false); }}
                              >
                                <span>{currency.name}</span>
                                {user.profile?.currency === currency.code && <Check className="w-4 h-4 text-green-500" />}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notifications */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{t('profile.notifications', 'Notifications')}</p>
                          <p className="text-sm text-muted-foreground">{t('profile.manageNotifications', 'Manage notification preferences')}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* GDPR Consent */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4">{t('profile.privacyConsent', 'Privacy & Consent')}</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer">
                          <div>
                            <p className="font-medium">{t('profile.marketingEmails', 'Marketing Emails')}</p>
                            <p className="text-sm text-muted-foreground">{t('profile.marketingEmailsDesc', 'Receive promotional offers and updates')}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            defaultChecked={user.gdprConsent?.marketing}
                            className="w-5 h-5 rounded accent-[var(--pricex-yellow)]" 
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer">
                          <div>
                            <p className="font-medium">{t('profile.analytics', 'Analytics')}</p>
                            <p className="text-sm text-muted-foreground">{t('profile.analyticsDesc', 'Help us improve by sharing usage data')}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            defaultChecked={user.gdprConsent?.analytics}
                            className="w-5 h-5 rounded accent-[var(--pricex-yellow)]" 
                          />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 cursor-pointer">
                          <div>
                            <p className="font-medium">{t('profile.thirdParty', 'Third-Party Sharing')}</p>
                            <p className="text-sm text-muted-foreground">{t('profile.thirdPartyDesc', 'Allow sharing with partner retailers')}</p>
                          </div>
                          <input 
                            type="checkbox" 
                            defaultChecked={user.gdprConsent?.thirdParty}
                            className="w-5 h-5 rounded accent-[var(--pricex-yellow)]" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">{t('profile.securitySettings', 'Security Settings')}</h2>

                    {/* Password Section */}
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[var(--pricex-yellow)]/20 flex items-center justify-center">
                          <Lock className="w-6 h-6 text-[var(--pricex-yellow)]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{t('profile.password', 'Password')}</h3>
                          <p className="text-sm text-muted-foreground">
                            {t('profile.lastPasswordChange', 'Last changed')}: {user.security?.passwordChangedAt 
                              ? new Date(user.security.passwordChangedAt).toLocaleDateString() 
                              : t('profile.never', 'Never')}
                          </p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-[var(--pricex-yellow)] text-black font-medium hover:bg-[var(--pricex-yellow-dark)] transition-colors">
                          {t('profile.change', 'Change')}
                        </button>
                      </div>
                    </div>

                    {/* 2FA Section */}
                    <div className="p-4 rounded-xl bg-secondary/50">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          user.security?.twoFactorEnabled ? 'bg-green-500/20' : 'bg-secondary'
                        }`}>
                          <Shield className={`w-6 h-6 ${user.security?.twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{t('profile.twoFactor', 'Two-Factor Authentication')}</h3>
                          <p className="text-sm text-muted-foreground">
                            {user.security?.twoFactorEnabled 
                              ? `${t('profile.enabled', 'Enabled')} - ${user.security.twoFactorMethod?.toUpperCase()}`
                              : t('profile.addExtraSecurity', 'Add an extra layer of security')}
                          </p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-[var(--pricex-yellow)] text-black font-medium hover:bg-[var(--pricex-yellow-dark)] transition-colors">
                          {user.security?.twoFactorEnabled ? t('profile.manage', 'Manage') : t('profile.setup', 'Setup')}
                        </button>
                      </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4">{t('profile.activeSessions', 'Active Sessions')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-green-500/30">
                          <div className="flex items-center gap-4">
                            <Monitor className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="font-medium">{t('profile.currentSession', 'Current Session')}</p>
                              <p className="text-sm text-muted-foreground">Chrome on Windows • {t('profile.now', 'Now')}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                            {t('profile.active', 'Active')}
                          </span>
                        </div>
                      </div>
                      <button className="mt-4 text-red-500 text-sm hover:underline flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        {t('profile.logoutAllDevices', 'Logout from all devices')}
                      </button>
                    </div>

                    {/* Security Info */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4">{t('profile.securityInfo', 'Security Information')}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground">{t('profile.failedAttempts', 'Failed Login Attempts')}</p>
                          <p className="text-2xl font-bold">{user.security?.failedLoginAttempts || 0}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-secondary/50">
                          <p className="text-sm text-muted-foreground">{t('profile.accountCreated', 'Account Created')}</p>
                          <p className="text-2xl font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Device Monitoring */}
                    <div className="pt-4 border-t border-border">
                      <DeviceMonitoring />
                    </div>

                    {/* Danger Zone */}
                    <div className="pt-4 border-t border-border">
                      <h3 className="font-medium mb-4 text-red-500">{t('profile.dangerZone', 'Danger Zone')}</h3>
                      <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-4">
                          <Trash2 className="w-5 h-5 text-red-500" />
                          <div className="flex-1">
                            <p className="font-medium">{t('profile.deleteAccount', 'Delete Account')}</p>
                            <p className="text-sm text-muted-foreground">
                              {t('profile.deleteAccountDesc', 'Permanently delete your account and all data')}
                            </p>
                          </div>
                          <button className="px-4 py-2 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                            {t('profile.delete', 'Delete')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Activity Tab */}
                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">{t('profile.recentActivity', 'Recent Activity')}</h2>

                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{t('profile.login', 'Logged in')}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.security?.lastLoginAt 
                              ? new Date(user.security.lastLoginAt).toLocaleString() 
                              : 'Just now'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Search className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{t('profile.searchHistory', 'Search History')}</p>
                          <p className="text-sm text-muted-foreground">{t('profile.viewSearches', 'View your search history')}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Heart className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{t('profile.favoriteProducts', 'Favorite Products')}</p>
                          <p className="text-sm text-muted-foreground">{t('profile.viewFavorites', 'View your saved products')}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>

                      <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                        <div className="w-10 h-10 rounded-full bg-[var(--pricex-yellow)]/20 flex items-center justify-center">
                          <Bell className="w-5 h-5 text-[var(--pricex-yellow)]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{t('profile.priceAlerts', 'Price Alerts')}</p>
                          <p className="text-sm text-muted-foreground">{t('profile.viewAlerts', 'View your price alerts')}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
