/**
 * PriceX - Register Page
 * User registration with strong password requirements
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Captcha } from '@/components/auth/Captcha';

export default function RegisterPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  
  const criteriaCount = [hasLowercase, hasUppercase, hasNumbers, hasSpecial].filter(Boolean).length;
  const passwordValid = hasMinLength && criteriaCount >= 3;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const allValid = name && email && mobile && passwordValid && passwordsMatch && agreedToTerms && captchaVerified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!allValid) {
      setError('Please complete all fields correctly');
      return;
    }

    const result = await register({ 
      name, 
      email, 
      mobile, 
      password, 
      gdprConsent: { marketing: true, analytics: true, thirdParty: true } 
    });
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || 'Registration failed');
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
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">
                Join PriceX and start saving
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
                <p className="text-muted-foreground mb-6">
                  You can now sign in with your account.
                </p>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors"
                >
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+971500000000"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                    </button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className={`flex items-center gap-2 text-sm ${hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {hasMinLength ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                      At least 8 characters
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      At least 3 of the following:
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 ml-4">
                      <div className={`flex items-center gap-2 text-sm ${hasLowercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {hasLowercase ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                        Lower case (a-z)
                      </div>
                      
                      <div className={`flex items-center gap-2 text-sm ${hasUppercase ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {hasUppercase ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                        Upper case (A-Z)
                      </div>
                      
                      <div className={`flex items-center gap-2 text-sm ${hasNumbers ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {hasNumbers ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                        Numbers (0-9)
                      </div>
                      
                      <div className={`flex items-center gap-2 text-sm ${hasSpecial ? 'text-green-500' : 'text-muted-foreground'}`}>
                        {hasSpecial ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                        Special chars
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full h-12 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                      required
                    />
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CAPTCHA Verification *</label>
                  <Captcha onVerify={setCaptchaVerified} />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded"
                    required
                  />
                  <span className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[var(--pricex-yellow)] hover:underline">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-[var(--pricex-yellow)] hover:underline">Privacy Policy</Link>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={!allValid || isLoading}
                  className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[var(--pricex-yellow)] font-medium hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
