/**
 * PriceX - Header Component
 * Premium navigation with localization controls
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Bell, User, Heart } from 'lucide-react';
import Link from 'next/link';
import { PriceXLogoCompact } from '@/components/ui/PriceXLogo';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { RegionSelector } from '@/components/region/RegionSelector';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { CurrencySelector } from '@/components/currency/CurrencySelector';
import { useLanguage } from '@/context/LanguageContext';

export function Header() {
  const { t, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/categories', label: t('nav.categories') },
    { href: '/deals', label: t('nav.deals') },
    { href: '/alerts', label: t('nav.alerts') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
            : 'bg-background'
        }`}
      >
        {/* Top Bar - Localization Controls */}
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex items-center justify-between py-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <RegionSelector />
                <div className="w-px h-4 bg-border hidden sm:block" />
                <LanguageSwitcher />
                <div className="w-px h-4 bg-border hidden sm:block" />
                <CurrencySelector />
              </div>
              <div className="hidden md:flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
              <PriceXLogoCompact />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full h-10 pl-10 pr-4 rounded-full bg-secondary border border-border focus:border-[var(--pricex-yellow)] focus:ring-2 focus:ring-[var(--pricex-yellow)]/20 transition-all outline-none text-sm"
                />
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 px-4 bg-[var(--pricex-yellow)] text-black text-xs font-semibold rounded-full hover:bg-[var(--pricex-yellow-dark)] transition-colors">
                  {t('search.button')}
                </button>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className={`hidden md:flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--pricex-yellow)] rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className={`hidden md:flex items-center gap-1 pb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[120px] z-40 md:hidden bg-background border-b border-border shadow-xl"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  className="w-full h-12 pl-10 pr-20 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
                />
                <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3.5' : 'left-3.5'}`} />
                <button className={`absolute right-1.5 top-1/2 -translate-y-1/2 h-9 px-4 bg-[var(--pricex-yellow)] text-black text-sm font-semibold rounded-lg`}>
                  {t('search.button')}
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-3 text-base font-medium rounded-xl hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Theme Toggle */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-[120px]" />
    </>
  );
}
