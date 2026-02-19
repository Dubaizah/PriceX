/**
 * PriceX - Cashback & Rewards Page
 * Earn money back on purchases
 */

'use client';

import { motion } from 'framer-motion';
import { 
  Gift, 
  TrendingUp, 
  CreditCard,
  ArrowRight,
  Star,
  Shield,
  Zap,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const cashbackStores = [
  { name: 'Amazon', cashback: '2.5%', logo: '📦', color: 'bg-orange-500' },
  { name: 'Walmart', cashback: '3.0%', logo: '🛒', color: 'bg-blue-500' },
  { name: 'Target', cashback: '4.0%', logo: '🎯', color: 'bg-red-500' },
  { name: 'Best Buy', cashback: '1.5%', logo: '💻', color: 'bg-blue-600' },
  { name: 'Home Depot', cashback: '2.0%', logo: '🏠', color: 'bg-orange-600' },
  { name: 'Nike', cashback: '5.0%', logo: '👟', color: 'bg-black' },
  { name: 'Adidas', cashback: '4.5%', logo: '🏃', color: 'bg-gray-600' },
  { name: 'Apple', cashback: '1.0%', logo: '🍎', color: 'bg-gray-400' },
];

const howItWorks = [
  {
    icon: Zap,
    title: 'Activate Cashback',
    description: 'Browse deals and activate cashback before shopping',
  },
  {
    icon: Shopping,
    title: 'Shop Normally',
    description: 'Make your purchase as usual on the retailer site',
  },
  {
    icon: CreditCard,
    title: 'Earn Rewards',
    description: 'Get cashback credited to your account within 24 hours',
  },
  {
    icon: Gift,
    title: 'Get Paid',
    description: 'Withdraw via PayPal, gift card, or donate to charity',
  },
];

function Shopping(props: any) {
  return <Zap {...props} />;
}

export default function CashbackPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pricex-yellow)]/10 rounded-full text-[var(--pricex-yellow)] font-medium mb-6">
              <Gift className="w-5 h-5" />
              Earn Money Back on Every Purchase
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Get Paid to Shop with <span className="text-[var(--pricex-yellow)]">PriceX Cashback</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Activate cashback at 10,000+ stores and earn up to 40% back on every purchase. 
              It&apos;s free money - why leave it on the table?
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="h-14 px-8 bg-[var(--pricex-yellow)] text-black font-bold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center gap-2">
                Start Earning
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="h-14 px-8 border-2 border-border font-semibold rounded-xl hover:border-[var(--pricex-yellow)] transition-colors">
                How It Works
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <p className="text-3xl font-bold text-[var(--pricex-yellow)]">$50M+</p>
              <p className="text-muted-foreground">Cashback Paid</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <p className="text-3xl font-bold text-[var(--pricex-yellow)]">10K+</p>
              <p className="text-muted-foreground">Partner Stores</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <p className="text-3xl font-bold text-[var(--pricex-yellow)]">5M+</p>
              <p className="text-muted-foreground">Members</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border text-center">
              <p className="text-3xl font-bold text-[var(--pricex-yellow)]">40%</p>
              <p className="text-muted-foreground">Highest Cashback</p>
            </div>
          </div>

          {/* Top Stores */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Top Cashback Stores</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cashbackStores.map((store, index) => (
                <motion.div
                  key={store.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-[var(--pricex-yellow)] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${store.color} flex items-center justify-center text-2xl`}>
                      {store.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-green-500 font-bold">{store.cashback} cashback</p>
                    </div>
                  </div>
                  <button className="w-full py-2 rounded-lg bg-secondary group-hover:bg-[var(--pricex-yellow)]/10 text-sm font-medium transition-colors">
                    Activate
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <a href="/cashback/stores" className="text-[var(--pricex-yellow)] font-medium hover:underline flex items-center justify-center gap-2">
                View All 10,000+ Stores <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How PriceX Cashback Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-[var(--pricex-yellow)]" />
                    </div>
                    <div className="relative mb-4">
                      <div className="w-8 h-8 rounded-full bg-[var(--pricex-yellow)] text-black font-bold flex items-center justify-center mx-auto">
                        {index + 1}
                      </div>
                      {index < howItWorks.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 left-1/2 w-full h-0.5 bg-border -z-10" />
                      )}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <Shield className="w-10 h-10 text-[var(--pricex-yellow)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Shop Safely</h3>
              <p className="text-muted-foreground">
                All purchases are protected. If cashback doesn&apos;t track, we&apos;ll refund you.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <Zap className="w-10 h-10 text-[var(--pricex-yellow)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Fast Payouts</h3>
              <p className="text-muted-foreground">
                Cashback posts within 24 hours. Withdraw anytime via PayPal or gift card.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <TrendingUp className="w-10 h-10 text-[var(--pricex-yellow)] mb-4" />
              <h3 className="text-lg font-semibold mb-2">Stack Rewards</h3>
              <p className="text-muted-foreground">
                Combine with credit card points, coupon codes, and loyalty programs for maximum savings.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
