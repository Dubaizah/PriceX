/**
 * PriceX - Register Page
 * User registration
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const passwordRequirements = [
    { met: password.length >= 8, text: t('auth.atLeast8', 'At least 8 characters') },
    { met: /[A-Z]/.test(password), text: t('auth.oneUppercase', 'One uppercase letter') },
    { met: /[0-9]/.test(password), text: t('auth.oneNumber', 'One number') },
    { met: /[!@#$%^&*]/.test(password), text: t('auth.oneSpecial', 'One special character') },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError(t('auth.fillAllFields', 'Please fill in all fields'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.passwordsNotMatch', 'Passwords do not match'));
      return;
    }

    if (!agreedToTerms) {
      setError(t('auth.agreeTerms', 'Please agree to the terms and conditions'));
      return;
    }

    const result = await register({ name, email, password, mobile: '', gdprConsent: { marketing: true, analytics: true, thirdParty: true } });
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || t('auth.registerFailed', 'Registration failed'));
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
              <h1 className="text-3xl font-bold mb-2">{t('auth.createAccount', 'Create Account')}</h1>
              <p className="text-muted-foreground">
                {t('auth.registerDesc', 'Join PriceX and start saving')}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.name', 'Full Name')}</label>
                <div className="relative">
                  <User className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('auth.namePlaceholder', 'Enter your full name')}
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.email', 'Email')}</label>
                <div className="relative">
                  <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.password', 'Password')}</label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder', 'Create a password')}
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-12'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'}`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Eye className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
                
                {/* Password Requirements */}
                {password.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500' : 'bg-gray-300'}`}>
                          {req.met && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className={req.met ? 'text-green-500' : 'text-muted-foreground'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{t('auth.confirmPassword', 'Confirm Password')}</label>
                <div className="relative">
                  <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                    className={`w-full h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none`}
                  />
                </div>
              </div>

              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 mt-1 rounded"
                />
                <span className="text-sm text-muted-foreground">
                  {t('auth.agreeTermsText', 'I agree to the')}{' '}
                  <Link href="/terms" className="text-[var(--pricex-yellow)] hover:underline">{t('footer.terms', 'Terms of Service')}</Link>
                  {' '}{t('common.and', 'and')}{' '}
                  <Link href="/privacy" className="text-[var(--pricex-yellow)] hover:underline">{t('footer.privacy', 'Privacy Policy')}</Link>
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? t('auth.creating', 'Creating account...') : t('auth.register', 'Create Account')}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t('auth.hasAccount', 'Already have an account?')}{' '}
                <Link href="/login" className="text-[var(--pricex-yellow)] font-medium hover:underline">
                  {t('auth.login', 'Sign In')}
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
