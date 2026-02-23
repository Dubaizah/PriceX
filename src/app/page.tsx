/**
 * PriceX - Home Page
 * Premium landing page with hero section and features
 */

'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  TrendingDown, 
  Bell, 
  Shield, 
  Zap, 
  Globe,
  ChevronRight,
  Star,
  Check
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PriceXLogo } from '@/components/ui/PriceXLogo';
import { PricingSection } from '@/components/monetization/PricingSection';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [heroSearch, setHeroSearch] = useState('');
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = mounted ? resolvedTheme === 'dark' : true;

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const continentDots = {
    na: Array.from({ length: 25 }, (_, i) => ({ cx: 180 + (i * 3.2) % 80, cy: 100 + (i * 2.4) % 60, delay: `${(i * 0.13) % 2}s` })),
    sa: Array.from({ length: 15 }, (_, i) => ({ cx: 220 + (i * 3.3) % 50, cy: 220 + (i * 5.3) % 80, delay: `${(i * 0.17) % 2}s` })),
    eu: Array.from({ length: 18 }, (_, i) => ({ cx: 380 + (i * 2.8) % 50, cy: 90 + (i * 2.8) % 50, delay: `${(i * 0.11) % 2}s` })),
    af: Array.from({ length: 20 }, (_, i) => ({ cx: 400 + (i * 3) % 60, cy: 180 + (i * 4) % 80, delay: `${(i * 0.15) % 2}s` })),
    as: Array.from({ length: 30 }, (_, i) => ({ cx: 520 + (i * 3.3) % 100, cy: 80 + (i * 3.3) % 100, delay: `${(i * 0.1) % 2}s` })),
    au: Array.from({ length: 10 }, (_, i) => ({ cx: 620 + (i * 5) % 50, cy: 260 + (i * 4) % 40, delay: `${(i * 0.2) % 2}s` })),
  };

  const floatingDots = Array.from({ length: 30 }, (_, i) => ({
    left: `${(i * 3.3) % 100}%`,
    top: `${(i * 3.7) % 100}%`,
    delay: `${(i * 0.17) % 3}s`,
    opacity: 0.3 + ((i * 0.7) % 0.5)
  }));

  const features = [
    {
      icon: Search,
      title: t('home.features.aiSearch'),
      description: t('home.features.aiSearchDesc'),
    },
    {
      icon: TrendingDown,
      title: t('home.features.priceHistory'),
      description: t('home.features.priceHistoryDesc'),
    },
    {
      icon: Bell,
      title: t('home.features.smartAlerts'),
      description: t('home.features.smartAlertsDesc'),
    },
    {
      icon: Shield,
      title: t('home.features.trustedReviews'),
      description: t('home.features.trustedReviewsDesc'),
    },
    {
      icon: Zap,
      title: t('home.features.realTime'),
      description: t('home.features.realTimeDesc'),
    },
    {
      icon: Globe,
      title: t('home.features.global'),
      description: t('home.features.globalDesc'),
    },
  ];

  const stats = [
    { value: '10M+', label: t('home.stats.users') },
    { value: '50M+', label: t('home.stats.products') },
    { value: '10K+', label: t('home.stats.retailers') },
    { value: '150+', label: t('home.stats.countries') },
  ];

  const popularCategories = [
    { id: 'electronics', name: t('categories.electronics'), icon: '💻', count: `2.5M+`, image: '/product-1.svg' },
    { id: 'home-appliances', name: t('categories.homeAppliances'), icon: '🏠', count: `1.8M+`, image: '/product-2.svg' },
    { id: 'fashion', name: t('categories.fashion'), icon: '👕', count: `5M+`, image: '/product-1.svg' },
    { id: 'beauty', name: t('categories.beauty'), icon: '💄', count: `1.2M+`, image: '/product-2.svg' },
    { id: 'groceries', name: t('categories.groceries'), icon: '🛒', count: `900K+`, image: '/product-1.svg' },
    { id: 'automotive', name: t('categories.automotive'), icon: '🚗', count: `600K+`, image: '/product-2.svg' },
    { id: 'health', name: t('categories.health'), icon: '💪', count: `800K+`, image: '/product-1.svg' },
    { id: 'baby', name: t('categories.baby'), icon: '👶', count: `700K+`, image: '/product-2.svg' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        {/* Hero Section - Premium Tech Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background - transparent to show global background */}
          <div className="absolute inset-0">
            
            {/* Layer 1: Elegant Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-blue-500/15 to-transparent rounded-full blur-[100px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-yellow-500/8 via-transparent to-transparent rounded-full blur-[80px]" />
            </div>

            {/* Layer 2: Dotted Grid with Zigzag Lines */}
            <div className="absolute inset-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dotZigzagPattern" width="90" height="90" patternUnits="userSpaceOnUse">
                    {/* Vertical zigzag lines */}
                    <path d="M 22.5 0 L 22.5 45 L 0 90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
                    <path d="M 67.5 0 L 67.5 45 L 45 90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
                    {/* Horizontal zigzag lines */}
                    <path d="M 0 22.5 L 45 45 L 90 22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
                    <path d="M 0 67.5 L 45 90 L 90 67.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
                    {/* Dots at intersections */}
                    <circle cx="22.5" cy="22.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
                    <circle cx="67.5" cy="22.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
                    <circle cx="22.5" cy="67.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
                    <circle cx="67.5" cy="67.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotZigzagPattern)" />
              </svg>
            </div>

            {/* Layer 3: Price Ticker */}
            <div className="absolute top-[10%] left-0 w-[200%] overflow-hidden opacity-[0.05] dark:opacity-[0.07]">
              <div className="flex animate-ticker whitespace-nowrap">
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="text-xs font-mono mx-16 tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    AAPL +2.4% &nbsp;•&nbsp; GOOGL +1.8% &nbsp;•&nbsp; MSFT +3.2% &nbsp;•&nbsp; AMZN +0.9% &nbsp;•&nbsp; TSLA +4.1% &nbsp;•&nbsp; META +2.7% &nbsp;•&nbsp; NVDA +5.3% &nbsp;•&nbsp; BTC $67,234 &nbsp;•&nbsp; ETH $3,456
                  </span>
                ))}
              </div>
            </div>

            {/* Layer 4: Hexagon Data Network */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--pricex-yellow)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Hexagon pattern */}
                <g className="opacity-15 dark:opacity-25">
                  <polygon points="150,50 200,75 200,125 150,150 100,125 100,75" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="250,100 300,125 300,175 250,200 200,175 200,125" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="350,50 400,75 400,125 350,150 300,125 300,75" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="550,80 600,105 600,155 550,180 500,155 500,105" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="700,120 750,145 750,195 700,220 650,195 650,145" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="850,60 900,85 900,135 850,160 800,135 800,85" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                  <polygon points="1000,100 1050,125 1050,175 1000,200 950,175 950,125" fill="none" stroke="url(#hexGrad)" strokeWidth="0.5" />
                </g>
                {/* Connection lines */}
                <g className="opacity-20 dark:opacity-30">
                  <line x1="150" y1="100" x2="250" y2="125" stroke="url(#hexGrad)" strokeWidth="0.3" />
                  <line x1="250" y1="125" x2="350" y2="100" stroke="url(#hexGrad)" strokeWidth="0.3" />
                  <line x1="350" y1="100" x2="450" y2="125" stroke="url(#hexGrad)" strokeWidth="0.3" />
                  <line x1="550" y1="130" x2="650" y2="155" stroke="url(#hexGrad)" strokeWidth="0.3" />
                  <line x1="700" y1="170" x2="800" y2="130" stroke="url(#hexGrad)" strokeWidth="0.3" />
                </g>
                {/* Data points */}
                <g className="opacity-40 dark:opacity-60">
                  <circle cx="150" cy="100" r="2" fill="var(--pricex-yellow)" />
                  <circle cx="250" cy="125" r="2" fill="#3B82F6" />
                  <circle cx="350" cy="100" r="2" fill="var(--pricex-yellow)" />
                  <circle cx="450" cy="125" r="2" fill="#3B82F6" />
                  <circle cx="550" cy="130" r="2" fill="var(--pricex-yellow)" />
                  <circle cx="650" cy="155" r="2" fill="#3B82F6" />
                  <circle cx="700" cy="170" r="2" fill="var(--pricex-yellow)" />
                  <circle cx="800" cy="130" r="2" fill="#3B82F6" />
                  <circle cx="900" cy="110" r="2" fill="var(--pricex-yellow)" />
                  <circle cx="1000" cy="150" r="2" fill="#3B82F6" />
                </g>
              </svg>
            </div>

            {/* Layer 5: Animated Wave Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--pricex-yellow)" stopOpacity="0" />
                    <stop offset="50%" stopColor="var(--pricex-yellow)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="var(--pricex-yellow)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 0 450 Q 300 350 600 450 T 1200 450" fill="none" stroke="url(#waveGrad1)" strokeWidth="1" className="animate-pulse" />
                <path d="M 0 500 Q 400 400 800 500 T 1200 500" fill="none" stroke="url(#waveGrad1)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '1s' }} />
                <path d="M 0 400 Q 200 500 400 400 T 800 400" fill="none" stroke="url(#waveGrad1)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
              </svg>
            </div>

            {/* Layer 6: Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
                  style={{
                    left: `${5 + (i * 19) % 90}%`,
                    top: `${15 + (i * 17) % 70}%`,
                    animationName: 'floatParticle',
                    animationDuration: `${4 + i * 0.5}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </div>
          
          {/* Floating particles - static to avoid hydration mismatch */}
          {[
            { left: '5%', top: '15%', delay: '0s', duration: '4s', opacity: 0.5 },
            { left: '15%', top: '35%', delay: '0.5s', duration: '5s', opacity: 0.3 },
            { left: '25%', top: '55%', delay: '1s', duration: '4.5s', opacity: 0.4 },
            { left: '35%', top: '25%', delay: '1.5s', duration: '5.5s', opacity: 0.6 },
            { left: '45%', top: '65%', delay: '2s', duration: '4s', opacity: 0.35 },
            { left: '55%', top: '45%', delay: '0.3s', duration: '6s', opacity: 0.45 },
            { left: '65%', top: '75%', delay: '0.8s', duration: '4.2s', opacity: 0.55 },
            { left: '75%', top: '35%', delay: '1.2s', duration: '5.2s', opacity: 0.4 },
            { left: '85%', top: '55%', delay: '1.8s', duration: '4.8s', opacity: 0.5 },
            { left: '95%', top: '25%', delay: '0.2s', duration: '5s', opacity: 0.35 },
            { left: '10%', top: '75%', delay: '0.7s', duration: '4.6s', opacity: 0.45 },
            { left: '20%', top: '85%', delay: '1.3s', duration: '5.3s', opacity: 0.55 },
            { left: '30%', top: '15%', delay: '0.4s', duration: '4.4s', opacity: 0.4 },
            { left: '40%', top: '45%', delay: '1.1s', duration: '5.1s', opacity: 0.5 },
            { left: '50%', top: '85%', delay: '1.6s', duration: '4.7s', opacity: 0.35 },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full dark:bg-[#FADF2E] bg-gray-800"
              style={{
                left: p.left,
                top: p.top,
                animation: `float ${p.duration} ease-in-out infinite`,
                animationDelay: p.delay,
                opacity: p.opacity
              }}
            />
          ))}
          
          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 flex justify-center"
              >
                <PriceXLogo size="xl" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              >
                {t('home.hero.title')}
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-white/80 max-w-2xl mx-auto mb-8"
              >
                {t('home.hero.subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="max-w-2xl mx-auto"
              >
                <form onSubmit={handleHeroSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={(e) => setHeroSearch(e.target.value)}
                      placeholder={t('search.placeholder')}
                      className="w-full h-14 pl-12 pr-32 rounded-full bg-white border-2 border-white/20 focus:border-[var(--pricex-yellow)] focus:ring-4 focus:ring-[var(--pricex-yellow)]/20 transition-all outline-none text-lg shadow-xl text-black"
                    />
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 ${isRTL ? 'right-4' : 'left-4'}`} />
                    <button type="submit" className={`absolute top-1/2 -translate-y-1/2 h-10 px-6 bg-[var(--pricex-yellow)] text-black font-semibold rounded-full hover:bg-[var(--pricex-yellow-dark)] transition-colors ${isRTL ? 'left-2' : 'right-2'}`}>
                      {t('search.button')}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-[var(--pricex-yellow)]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl sm:text-4xl font-bold text-[var(--pricex-yellow)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {t('home.features.title')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-[var(--pricex-yellow)] transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[var(--pricex-yellow)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                {t('home.categories.title')}
              </h2>
              <a href="/categories" className="flex items-center gap-2 text-[var(--pricex-yellow)] hover:underline">
                {t('home.categories.viewAll')}
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularCategories.map((category, index) => (
                <motion.a
                  key={category.id}
                  href={`/search?category=${category.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative rounded-xl overflow-hidden bg-card border border-border hover:border-[var(--pricex-yellow)] hover:shadow-xl hover:shadow-[var(--pricex-yellow)]/10 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-4xl">${category.icon}</span>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl">
                      {category.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="font-bold text-sm text-white mb-0.5 group-hover:text-[var(--pricex-yellow)] transition-colors line-clamp-1">{category.name}</h3>
                      <p className="text-xs text-white/70">{category.count} {t('categories.products', 'products')}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-[var(--pricex-yellow)] to-yellow-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              {t('common.getStarted')} {t('app.name')} {t('common.today')}!
            </h2>
            <p className="text-lg text-black/80 mb-8">
              {t('app.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="px-8 py-3 bg-black text-[var(--pricex-yellow)] font-semibold rounded-full hover:bg-gray-900 transition-colors"
              >
                {t('nav.register')}
              </a>
              <a
                href="/search"
                className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
              >
                {t('common.learnMore')}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
