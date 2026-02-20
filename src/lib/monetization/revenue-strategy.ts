/**
 * PriceX - Complete Revenue Strategy
 * Target: $10M/month
 */

// ============================================
// REVENUE STREAMS (8 Streams)
// ============================================

export const REVENUE_STREAMS = {
  // 1. ADVERTISING (50% = $5M/month)
  advertising: {
    target: 5000000,
    percentage: 50,
    streams: {
      displayAds: { target: 2500000, rpm: 12, pageViews: 208333333 },
      nativeAds: { target: 1500000, rpm: 15, pageViews: 100000000 },
      videoAds: { target: 1000000, rpm: 25, pageViews: 40000000 },
    }
  },
  
  // 2. B2B API SUBSCRIPTIONS (25% = $2.5M/month)
  b2b: {
    target: 2500000,
    percentage: 25,
    tiers: {
      starter: { price: 299, customers: 2000, revenue: 598000 },
      growth: { price: 999, customers: 1000, revenue: 999000 },
      enterprise: { price: 4999, customers: 200, revenue: 999800 },
      custom: { price: 15000, customers: 10, revenue: 150000 },
    }
  },
  
  // 3. AFFILIATE COMMISSIONS (15% = $1.5M/month)
  affiliate: {
    target: 1500000,
    percentage: 15,
    categories: {
      electronics: { commission: 4, sales: 15000000 },
      fashion: { commission: 10, sales: 5000000 },
      home: { commission: 8, sales: 5000000 },
      general: { commission: 3, sales: 10000000 },
    }
  },
  
  // 4. PREMIUM SUBSCRIPTIONS (5% = $500K/month)
  premium: {
    target: 500000,
    percentage: 5,
    plans: {
      monthly: { price: 9.99, customers: 30000 },
      yearly: { price: 79.99, customers: 2000 },
    }
  },
  
  // 5. DATA LICENSING (3% = $300K/month)
  dataLicensing: {
    target: 300000,
    percentage: 3,
    packages: {
      basic: { price: 999, customers: 100 },
      professional: { price: 4999, customers: 40 },
      enterprise: { price: 25000, customers: 4 },
    }
  },
  
  // 6. SPONSORED LISTINGS (1% = $100K/month)
  sponsored: {
    target: 100000,
    percentage: 1,
    options: {
      featured: { price: 5000, slots: 10 },
      sponsored: { price: 1000, slots: 50 },
      badges: { price: 99, slots: 500 },
    }
  },
  
  // 7. WHITE-LABEL / API ENTERPRISE (0.5% = $50K/month)
  whiteLabel: {
    target: 50000,
    percentage: 0.5,
    contracts: {
      small: { price: 10000, customers: 3 },
      medium: { price: 50000, customers: 1 },
    }
  },
  
  // 8. REFERRAL / PARTNERSHIPS (0.5% = $50K/month)
  referral: {
    target: 50000,
    percentage: 0.5,
    channels: {
      influencer: { target: 20000 },
      partnership: { target: 20000 },
      reseller: { target: 10000 },
    }
  }
};

// ============================================
// TRAFFIC REQUIREMENTS
// ============================================

export const TRAFFIC_REQUIREMENTS = {
  monthlyPageViews: 500000000, // 500M page views
  dailyPageViews: 16666667,    // 16.7M daily
  monthlyUsers: 50000000,      // 50M monthly users
  dailyUsers: 10000000,        // 10M daily users
  
  // Traffic sources target
  sources: {
    seo: 40,        // 40% from search
    social: 25,      // 25% from social
    direct: 20,      // 20% direct
    referral: 10,   // 10% referrals
    paid: 5,        // 5% paid ads
  },
  
  // Geographic distribution
  regions: {
    northAmerica: 35,
    europe: 30,
    asia: 25,
    other: 10,
  }
};

// ============================================
// KEY METRICS FOR $10M/MONTH
// ============================================

export const KEY_METRICS = {
  // Revenue per user
  arpu: 0.20, // $0.20 per user per month
  
  // Conversion rates
  adViewRate: 0.65,
  clickThroughRate: 0.03,
  affiliateConversionRate: 0.02,
  premiumConversionRate: 0.005,
  b2bConversionRate: 0.001,
  
  // Engagement metrics
  pagesPerSession: 3.5,
  avgSessionDuration: 180, // seconds
  bounceRate: 0.35,
  
  // Revenue metrics
  avgRpm: 10, // $10 RPM
  avgRpc: 0.15, // $0.15 revenue per click
};

// ============================================
// SCALING TIMELINE
// ============================================

export const SCALING_TIMELINE = [
  { month: 1, revenue: 10000, users: 50000, pageViews: 5000000 },
  { month: 3, revenue: 50000, users: 200000, pageViews: 20000000 },
  { month: 6, revenue: 250000, users: 1000000, pageViews: 100000000 },
  { month: 12, revenue: 1000000, users: 5000000, pageViews: 250000000 },
  { month: 18, revenue: 3000000, users: 15000000, pageViews: 400000000 },
  { month: 24, revenue: 10000000, users: 50000000, pageViews: 500000000 },
];
