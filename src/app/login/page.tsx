/**
 * PriceX - Login Page
 * Secure login with password only
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, AlertTriangle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { login, isLoading } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const identifier = loginMethod === 'email' ? email : mobile;
    
    if (!identifier || !password) {
      setError('Please enter your credentials');
      return;
    }

    const result = await login(identifier, password);
    
    if (result.success) {
      setSuccess(true);
      setTimeout(() => router.push('/profile'), 1000);
    } else {
      setError(result.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
              <p className="text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                <p className="text-green-500 text-sm">Login successful! Redirecting...</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex rounded-xl bg-secondary p-1">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    loginMethod === 'email' ? 'bg-[var(--pricex-yellow)] text-black' : ''
                  }`}
                >
                  <Mail className="w-4 h-4 inline mr-1" /> Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    loginMethod === 'mobile' ? 'bg-[var(--pricex-yellow)] text-black' : ''
                  }`}
                >
                  <Phone className="w-4 h-4 inline mr-1" /> Mobile
                </button>
              </div>

              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+971500000000"
                      className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-12'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-[var(--pricex-yellow)] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading || success}
                className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/register" className="text-[var(--pricex-yellow)] font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
