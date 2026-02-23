/**
 * PriceX - Login Page
 * Secure login with mandatory 2FA via SMS
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Phone, ArrowRight, AlertTriangle, Shield, Timer, Send } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

type LoginStep = 'credentials' | '2fa' | 'locked';

export default function LoginPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { login, isLoading } = useAuth();
  const [step, setStep] = useState<LoginStep>('credentials');
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (lockedUntil) {
      const updateCountdown = () => {
        const remaining = Math.max(0, Math.floor((lockedUntil.getTime() - Date.now()) / 1000));
        setCountdown(remaining);
        if (remaining === 0) {
          setLockedUntil(null);
          setStep('credentials');
        }
      };
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [lockedUntil]);

  // Resend countdown timer
  useEffect(() => {
    if (codeSent && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeSent, resendTimer]);

  const handleSendOTP = async () => {
    const targetMobile = loginMethod === 'mobile' ? mobile : localStorage.getItem('pricex-user-mobile') || mobile;
    
    if (!targetMobile) {
      setError('Mobile number not found. Please register with a mobile number.');
      return;
    }

    setSendingCode(true);
    setError('');

    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: targetMobile, purpose: 'login' }),
      });

      const data = await response.json();

      if (data.success) {
        setCodeSent(true);
        setResendTimer(60);
        // In demo mode, show the code
        if (data.demoCode) {
          console.log('Demo OTP:', data.demoCode);
        }
      } else {
        setError(data.error || 'Failed to send code');
      }
    } catch (err) {
      setError('Failed to send verification code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmitCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const identifier = loginMethod === 'email' ? email : mobile;
    
    if (!identifier || !password) {
      setError('Please enter your credentials');
      return;
    }

    // Check for locked account in localStorage
    const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
    const user = users.find((u: any) => 
      loginMethod === 'email' ? u.email === identifier.toLowerCase() : u.mobile === identifier
    );

    if (user?.lockedUntil) {
      const lockTime = new Date(user.lockedUntil);
      if (lockTime > new Date()) {
        setLockedUntil(lockTime);
        setStep('locked');
        return;
      }
    }

    const result = await login(identifier, password);
    
    if (!result.success) {
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
      }
      if (result.lockedUntil) {
        setLockedUntil(new Date(result.lockedUntil));
        setStep('locked');
        
        if (user) {
          user.lockedUntil = result.lockedUntil.toISOString();
          user.failedLoginAttempts = 3;
          localStorage.setItem('pricex-users', JSON.stringify(users));
        }
      }
      setError(result.message || 'Login failed');
    } else {
      // Store mobile for OTP
      if (loginMethod === 'email' && user?.mobile) {
        localStorage.setItem('pricex-user-mobile', user.mobile);
      }
      // Credentials valid, proceed to 2FA
      setStep('2fa');
      // Send OTP automatically
      setTimeout(handleSendOTP, 500);
    }
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (twoFactorCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    // Verify OTP
    const targetMobile = loginMethod === 'mobile' ? mobile : localStorage.getItem('pricex-user-mobile') || mobile;
    
    // Complete login
    const identifier = loginMethod === 'email' ? email : mobile;
    const users = JSON.parse(localStorage.getItem('pricex-users') || '[]');
    const user = users.find((u: any) => 
      u.email === identifier.toLowerCase() || u.mobile === identifier
    );
    
    if (user) {
      // Store session
      const session = {
        id: `session_${Date.now()}`,
        userId: user.id,
        token: `token_${Date.now()}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
      
      localStorage.setItem('pricex-auth-session', JSON.stringify({
        user,
        session,
        expiresAt: session.expiresAt,
      }));
      
      router.push('/profile');
    } else {
      setError('Session error. Please login again.');
      setStep('credentials');
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
                Sign in with mandatory 2FA verification
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-red-500 text-sm">{error}</p>
                    {remainingAttempts < 3 && step !== 'locked' && (
                      <p className="text-red-400 text-xs mt-1">
                        {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step: Credentials */}
            {step === 'credentials' && (
              <form onSubmit={handleSubmitCredentials} className="space-y-6">
                <div className="flex rounded-xl bg-secondary p-1">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('email'); setError(''); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      loginMethod === 'email' ? 'bg-[var(--pricex-yellow)] text-black' : ''
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-1" /> Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('mobile'); setError(''); }}
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
                  disabled={isLoading}
                  className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="w-5 h-5" />}
                </button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Demo accounts:</p>
                  <p className="font-mono text-xs">admin@pricex.com / admin123</p>
                  <p className="font-mono text-xs">user@pricex.com / user123</p>
                </div>
              </form>
            )}

            {/* Step: 2FA */}
            {step === '2fa' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--pricex-yellow)]/20 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-[var(--pricex-yellow)]" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Two-Factor Authentication</h2>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to your mobile
                  </p>
                </div>

                <div>
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full h-14 text-center text-2xl font-mono rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                    autoFocus
                  />
                </div>

                {!codeSent ? (
                  <button
                    onClick={handleSendOTP}
                    disabled={sendingCode}
                    className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {sendingCode ? 'Sending...' : 'Send Code'}
                  </button>
                ) : (
                  <div className="text-center">
                    <p className="text-green-500 text-sm mb-2">Code sent! Check your mobile.</p>
                    {resendTimer > 0 ? (
                      <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
                        <Timer className="w-4 h-4" />
                        Resend in {resendTimer}s
                      </p>
                    ) : (
                      <button
                        onClick={handleSendOTP}
                        disabled={sendingCode}
                        className="text-[var(--pricex-yellow)] hover:underline text-sm"
                      >
                        Resend code
                      </button>
                    )}
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground">
                  Demo mode: Code shown in console or use any 6 digits
                </p>

                <button
                  onClick={handle2FASubmit}
                  disabled={twoFactorCode.length !== 6}
                  className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors disabled:opacity-50"
                >
                  Verify & Sign In
                </button>

                <button
                  type="button"
                  onClick={() => { setStep('credentials'); setTwoFactorCode(''); setCodeSent(false); }}
                  className="w-full text-center text-sm text-muted-foreground hover:text-[var(--pricex-yellow)]"
                >
                  Back to login
                </button>
              </div>
            )}

            {/* Step: Locked */}
            {step === 'locked' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Account Locked</h2>
                <p className="text-muted-foreground mb-4">
                  Too many failed login attempts.
                </p>
                <div className="p-4 rounded-xl bg-secondary mb-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Timer className="w-5 h-5" />
                    <span>Try again in {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}</span>
                  </div>
                </div>
                <Link href="/forgot-password" className="text-[var(--pricex-yellow)] hover:underline">
                  Reset Password to Unlock
                </Link>
              </div>
            )}

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
