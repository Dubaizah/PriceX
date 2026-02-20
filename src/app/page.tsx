/**
 * PriceX - Home Page
 * Premium landing page with hero section and features
 */

'use client';

import { motion } from 'framer-motion';
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

  const features = [
    {
      icon: Search,
      title: 'AI-Powered Search',
      description: 'Smart product matching across millions of items from thousands of retailers worldwide.',
    },
    {
      icon: TrendingDown,
      title: 'Price History',
      description: 'Track price trends over time and identify the best moment to buy.',
    },
    {
      icon: Bell,
      title: 'Smart Alerts',
      description: 'Get notified instantly when prices drop to your target level.',
    },
    {
      icon: Shield,
      title: 'Trusted Reviews',
      description: 'Verified user reviews and ratings to help you make informed decisions.',
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Live price tracking with updates every few minutes.',
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Compare prices across 8 regions and 18 currencies instantly.',
    },
  ];

  const stats = [
    { value: '10M+', label: 'Active Users' },
    { value: '50M+', label: 'Products Tracked' },
    { value: '10K+', label: 'Retailers' },
    { value: '150+', label: 'Countries' },
  ];

  const popularCategories = [
    { name: 'Electronics', icon: '💻', count: '2.5M+ products' },
    { name: 'Fashion', icon: '👕', count: '5M+ products' },
    { name: 'Home & Garden', icon: '🏠', count: '1.8M+ products' },
    { name: 'Sports', icon: '⚽', count: '900K+ products' },
    { name: 'Beauty', icon: '💄', count: '1.2M+ products' },
    { name: 'Automotive', icon: '🚗', count: '600K+ products' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--pricex-yellow)]/5 to-transparent pointer-events-none" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--pricex-yellow)]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--pricex-yellow)]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <div className={`text-center ${isRTL ? 'text-right' : ''}`}>
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="mb-8 flex justify-center"
              >
                <PriceXLogo size="xl" />
              </motion.div>

              {/* Tagline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              >
                <span className="text-[var(--pricex-yellow)]">Global AI-Powered</span> Pricing Authority
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
              >
                Enterprise-grade price intelligence trusted by millions worldwide. 
                AI predictions, real-time tracking, and the most comprehensive price database on the planet.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="max-w-3xl mx-auto mb-12"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className={`w-full h-14 md:h-16 pl-14 md:pl-16 pr-32 md:pr-40 rounded-2xl bg-card border-2 border-border focus:border-[var(--pricex-yellow)] focus:ring-4 focus:ring-[var(--pricex-yellow)]/20 transition-all outline-none text-base md:text-lg shadow-xl ${isRTL ? 'text-right pr-14 pl-32' : ''}`}
                  />
                  <Search className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground ${isRTL ? 'right-5' : 'left-5'}`} />
                  <button className={`absolute top-1.5 bottom-1.5 ${isRTL ? 'left-1.5' : 'right-1.5'} px-6 md:px-8 bg-[var(--pricex-yellow)] text-black font-bold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-all hover:scale-105 active:scale-95 shadow-lg`}>
                    <span className="hidden md:inline">{t('search.button')}</span>
                    <Search className="md:hidden w-5 h-5" />
                  </button>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4 md:gap-8"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center px-4">
                    <div className="text-2xl md:text-3xl font-bold text-[var(--pricex-yellow)]">{stat.value}</div>
                    <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PriceX?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The most advanced price comparison platform with AI-driven insights and global coverage.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="card-hover p-6 rounded-2xl bg-card border border-border"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[var(--pricex-yellow)]" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Categories</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse millions of products across top categories.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularCategories.map((category, index) => (
                <motion.a
                  key={index}
                  href="#"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="card-hover p-6 rounded-2xl bg-card border border-border text-center group"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[var(--pricex-yellow)]/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Never Miss a Deal Again
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join millions of smart shoppers who save money with PriceX price alerts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="h-14 px-8 bg-[var(--pricex-yellow)] text-black font-bold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2">
                  Create Free Account
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button className="h-14 px-8 bg-card border-2 border-border font-semibold rounded-xl hover:border-[var(--pricex-yellow)] transition-all flex items-center justify-center">
                  Learn More
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cancel Anytime</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Preview */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Millions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See what our users are saying about PriceX.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  quote: "PriceX saved me over $200 on my new laptop. The price alerts are incredibly accurate!",
                  author: "Sarah M.",
                  role: "Tech Enthusiast",
                  rating: 5,
                },
                {
                  quote: "I use PriceX for all my shopping. It's amazing how much money I've saved over the years.",
                  author: "James K.",
                  role: "Bargain Hunter",
                  rating: 5,
                },
                {
                  quote: "The global coverage is fantastic. I can compare prices from retailers all over the world.",
                  author: "Maria L.",
                  role: "International Shopper",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--pricex-yellow)] text-[var(--pricex-yellow)]" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
