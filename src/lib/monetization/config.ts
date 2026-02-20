/**
 * PriceX - Monetization Configuration
 * Multi-network ad integration and revenue optimization
 */

// ============================================
// AD NETWORK CONFIGURATION
// ============================================

export interface AdNetworkConfig {
  id: string;
  name: string;
  enabled: boolean;
  priority: number; // 1-10, higher =优先
  revenueShare: number; // PriceX's share %
  rpmTarget: number; // Target Revenue Per Mille
  paymentTerms: {
    minPayout: number;
    frequency: 'net30' | 'net60' | 'net90';
    method: string[];
  };
  supportedFormats: AdFormat[];
  geographicCoverage: string[];
  categoryRestrictions: string[];
}

export type AdFormat = 
  | 'display_banner'
  | 'display_skyscraper'
  | 'native_feed'
  | 'native_sidebar'
  | 'video_instream'
  | 'video_outstream'
  | 'popunder'
  | 'push_notification'
  | 'interstitial'
  | 'sticky_footer';

export const AD_NETWORKS: AdNetworkConfig[] = [
  // Premium Tier - High RPM, Brand Safe
  {
    id: 'adsense',
    name: 'Google AdSense',
    enabled: true,
    priority: 9,
    revenueShare: 68, // Google's standard split
    rpmTarget: 8.50,
    paymentTerms: {
      minPayout: 100,
      frequency: 'net30',
      method: ['wire', 'check', 'western_union'],
    },
    supportedFormats: ['display_banner', 'native_feed', 'video_instream'],
    geographicCoverage: ['global'],
    categoryRestrictions: [],
  },
  {
    id: 'revcontent',
    name: 'Revcontent',
    enabled: true,
    priority: 8,
    revenueShare: 80,
    rpmTarget: 12.00,
    paymentTerms: {
      minPayout: 50,
      frequency: 'net30',
      method: ['wire', 'paypal', 'payoneer'],
    },
    supportedFormats: ['native_feed', 'native_sidebar'],
    geographicCoverage: ['US', 'CA', 'UK', 'AU', 'EU'],
    categoryRestrictions: ['adult', 'gambling'],
  },
  
  // High Performance Tier
  {
    id: 'adsterra',
    name: 'Adsterra',
    enabled: true,
    priority: 7,
    revenueShare: 85,
    rpmTarget: 15.00,
    paymentTerms: {
      minPayout: 5,
      frequency: 'net30',
      method: ['wire', 'paypal', 'bitcoin', 'webmoney'],
    },
    supportedFormats: ['popunder', 'push_notification', 'native_feed', 'interstitial'],
    geographicCoverage: ['global'],
    categoryRestrictions: [],
  },
  {
    id: 'propellerads',
    name: 'PropellerAds',
    enabled: true,
    priority: 7,
    revenueShare: 80,
    rpmTarget: 14.00,
    paymentTerms: {
      minPayout: 5,
      frequency: 'net30',
      method: ['wire', 'paypal', 'payoneer', 'webmoney'],
    },
    supportedFormats: ['popunder', 'push_notification', 'interstitial', 'native_feed'],
    geographicCoverage: ['global'],
    categoryRestrictions: [],
  },
  
  // Content Discovery Tier
  {
    id: 'taboola',
    name: 'Taboola',
    enabled: true,
    priority: 6,
    revenueShare: 50,
    rpmTarget: 6.00,
    paymentTerms: {
      minPayout: 100,
      frequency: 'net30',
      method: ['wire', 'paypal'],
    },
    supportedFormats: ['native_feed'],
    geographicCoverage: ['US', 'CA', 'UK', 'AU', 'EU', 'LATAM'],
    categoryRestrictions: ['adult', 'gambling', 'pharma'],
  },
  {
    id: 'mgid',
    name: 'MGID',
    enabled: true,
    priority: 6,
    revenueShare: 75,
    rpmTarget: 5.50,
    paymentTerms: {
      minPayout: 100,
      frequency: 'net30',
      method: ['wire', 'paypal', 'payoneer'],
    },
    supportedFormats: ['native_feed', 'native_sidebar'],
    geographicCoverage: ['global'],
    categoryRestrictions: [],
  },
];

// ============================================
// AD PLACEMENT STRATEGY
// ============================================

export interface AdPlacement {
  id: string;
  name: string;
  pageTypes: string[];
  format: AdFormat;
  position: string;
  size: string;
  minViewability: number; // %
  targetRpm: number;
  frequencyCap: number; // per session
  priority: number;
  networks: string[]; // network IDs in priority order
  responsive: boolean;
  lazyLoad: boolean;
  viewabilityThreshold: number; // pixels from viewport
}

export const AD_PLACEMENTS: AdPlacement[] = [
  // Homepage
  {
    id: 'home_hero_banner',
    name: 'Homepage Hero Banner',
    pageTypes: ['home'],
    format: 'display_banner',
    position: 'below_hero',
    size: '728x90,970x90,970x250',
    minViewability: 70,
    targetRpm: 12.00,
    frequencyCap: 1,
    priority: 10,
    networks: ['adsense', 'revcontent'],
    responsive: true,
    lazyLoad: false,
    viewabilityThreshold: 0,
  },
  {
    id: 'home_native_grid',
    name: 'Homepage Native Grid',
    pageTypes: ['home'],
    format: 'native_feed',
    position: 'product_grid',
    size: 'responsive',
    minViewability: 60,
    targetRpm: 15.00,
    frequencyCap: 3,
    priority: 9,
    networks: ['adsterra', 'revcontent', 'taboola'],
    responsive: true,
    lazyLoad: true,
    viewabilityThreshold: 200,
  },
  
  // Search Results
  {
    id: 'search_top_banner',
    name: 'Search Top Banner',
    pageTypes: ['search'],
    format: 'display_banner',
    position: 'above_results',
    size: '728x90,970x90',
    minViewability: 80,
    targetRpm: 18.00,
    frequencyCap: 1,
    priority: 10,
    networks: ['adsense', 'adsterra'],
    responsive: true,
    lazyLoad: false,
    viewabilityThreshold: 0,
  },
  {
    id: 'search_sidebar_skyscraper',
    name: 'Search Sidebar Skyscraper',
    pageTypes: ['search'],
    format: 'display_skyscraper',
    position: 'sidebar',
    size: '300x600,160x600',
    minViewability: 65,
    targetRpm: 10.00,
    frequencyCap: 1,
    priority: 8,
    networks: ['adsense', 'mgid'],
    responsive: true,
    lazyLoad: true,
    viewabilityThreshold: 100,
  },
  {
    id: 'search_native_inline',
    name: 'Search Native Inline',
    pageTypes: ['search'],
    format: 'native_feed',
    position: 'between_results',
    size: 'responsive',
    minViewability: 55,
    targetRpm: 16.00,
    frequencyCap: 4,
    priority: 9,
    networks: ['revcontent', 'taboola', 'adsterra'],
    responsive: true,
    lazyLoad: true,
    viewabilityThreshold: 150,
  },
  
  // Product Pages
  {
    id: 'product_comparison_sticky',
    name: 'Product Comparison Sticky',
    pageTypes: ['compare'],
    format: 'sticky_footer',
    position: 'bottom',
    size: '728x90,320x50',
    minViewability: 90,
    targetRpm: 14.00,
    frequencyCap: 1,
    priority: 8,
    networks: ['adsense', 'propellerads'],
    responsive: true,
    lazyLoad: false,
    viewabilityThreshold: 0,
  },
  {
    id: 'product_sidebar_native',
    name: 'Product Sidebar Native',
    pageTypes: ['product'],
    format: 'native_sidebar',
    position: 'sidebar',
    size: '300x250,300x600',
    minViewability: 60,
    targetRpm: 11.00,
    frequencyCap: 2,
    priority: 7,
    networks: ['mgid', 'revcontent'],
    responsive: true,
    lazyLoad: true,
    viewabilityThreshold: 100,
  },
  
  // Mobile Specific
  {
    id: 'mobile_interstitial',
    name: 'Mobile Interstitial',
    pageTypes: ['home', 'search', 'product'],
    format: 'interstitial',
    position: 'between_pages',
    size: 'fullscreen',
    minViewability: 100,
    targetRpm: 25.00,
    frequencyCap: 1,
    priority: 6,
    networks: ['propellerads', 'adsterra'],
    responsive: true,
    lazyLoad: false,
    viewabilityThreshold: 0,
  },
  {
    id: 'mobile_sticky_bottom',
    name: 'Mobile Sticky Bottom',
    pageTypes: ['all'],
    format: 'sticky_footer',
    position: 'bottom',
    size: '320x50,320x100',
    minViewability: 95,
    targetRpm: 8.00,
    frequencyCap: 1,
    priority: 10,
    networks: ['adsense', 'propellerads'],
    responsive: true,
    lazyLoad: false,
    viewabilityThreshold: 0,
  },
];

// ============================================
// B2B DATA MONETIZATION
// ============================================

export interface B2BSubscriptionTier {
  id: string;
  name: string;
  monthlyPrice: number;
  annualDiscount: number; // %
  features: {
    apiCalls: number;
    endpoints: string[];
    historicalDataDays: number;
    realTimeUpdates: boolean;
    webhookSupport: boolean;
    dedicatedSupport: boolean;
    customReports: boolean;
    sla: string;
  };
  targetMarket: string;
}

export const B2B_TIERS: B2BSubscriptionTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 299,
    annualDiscount: 20,
    features: {
      apiCalls: 10000,
      endpoints: ['pricing_index', 'trends'],
      historicalDataDays: 30,
      realTimeUpdates: false,
      webhookSupport: false,
      dedicatedSupport: false,
      customReports: false,
      sla: '99%',
    },
    targetMarket: 'Small retailers, startups',
  },
  {
    id: 'growth',
    name: 'Growth',
    monthlyPrice: 999,
    annualDiscount: 25,
    features: {
      apiCalls: 100000,
      endpoints: ['pricing_index', 'predictions', 'trends', 'volatility'],
      historicalDataDays: 90,
      realTimeUpdates: true,
      webhookSupport: true,
      dedicatedSupport: false,
      customReports: false,
      sla: '99.5%',
    },
    targetMarket: 'Medium retailers, e-commerce platforms',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: 4999,
    annualDiscount: 30,
    features: {
      apiCalls: 1000000,
      endpoints: ['all'],
      historicalDataDays: 365,
      realTimeUpdates: true,
      webhookSupport: true,
      dedicatedSupport: true,
      customReports: true,
      sla: '99.9%',
    },
    targetMarket: 'Large retailers, market research firms',
  },
  {
    id: 'custom',
    name: 'Custom',
    monthlyPrice: 0, // Contact sales
    annualDiscount: 0,
    features: {
      apiCalls: -1, // Unlimited
      endpoints: ['all', 'custom_endpoints'],
      historicalDataDays: -1, // Unlimited
      realTimeUpdates: true,
      webhookSupport: true,
      dedicatedSupport: true,
      customReports: true,
      sla: '99.99%',
    },
    targetMarket: 'Fortune 500, investment firms',
  },
];

// ============================================
// AFFILIATE PROGRAM
// ============================================

export interface AffiliateNetwork {
  id: string;
  name: string;
  commissionType: 'cpa' | 'cps' | 'cpl';
  commissionRate: number; // % or fixed amount
  cookieDuration: number; // days
  supportedRegions: string[];
  autoLinkEnabled: boolean;
  apiIntegration: boolean;
}

export const AFFILIATE_NETWORKS: AffiliateNetwork[] = [
  {
    id: 'amazon_associates',
    name: 'Amazon Associates',
    commissionType: 'cps',
    commissionRate: 3, // 1-10% depending on category
    cookieDuration: 24, // hours
    supportedRegions: ['US', 'CA', 'UK', 'DE', 'FR', 'IT', 'ES', 'JP', 'IN', 'BR', 'MX', 'AU'],
    autoLinkEnabled: true,
    apiIntegration: true,
  },
  {
    id: 'cj_affiliate',
    name: 'CJ Affiliate',
    commissionType: 'cps',
    commissionRate: 5, // varies by advertiser
    cookieDuration: 30,
    supportedRegions: ['global'],
    autoLinkEnabled: true,
    apiIntegration: true,
  },
  {
    id: 'rakuten',
    name: 'Rakuten Advertising',
    commissionType: 'cps',
    commissionRate: 4,
    cookieDuration: 30,
    supportedRegions: ['US', 'UK', 'EU', 'JP'],
    autoLinkEnabled: true,
    apiIntegration: true,
  },
  {
    id: 'impact',
    name: 'Impact',
    commissionType: 'cps',
    commissionRate: 6,
    cookieDuration: 30,
    supportedRegions: ['global'],
    autoLinkEnabled: true,
    apiIntegration: true,
  },
  {
    id: 'awin',
    name: 'Awin',
    commissionType: 'cps',
    commissionRate: 5,
    cookieDuration: 30,
    supportedRegions: ['EU', 'UK', 'US'],
    autoLinkEnabled: true,
    apiIntegration: true,
  },
];

// ============================================
// REVENUE PROJECTIONS
// ============================================

export interface RevenueProjection {
  month: number;
  adRevenue: number;
  b2bRevenue: number;
  affiliateRevenue: number;
  totalRevenue: number;
  assumptions: {
    pageViews: number;
    rpm: number;
    b2bCustomers: number;
    affiliateConversion: number;
  };
}

// Target: $10M/month at scale
export const REVENUE_TARGETS = {
  monthly: {
    adRevenue: 5000000, // 50% - $5M
    b2bRevenue: 3000000, // 30% - $3M
    affiliateRevenue: 2000000, // 20% - $2M
    total: 10000000, // $10M
  },
  
  // Required metrics to achieve targets
  required: {
    monthlyPageViews: 500000000, // 500M PV for $5M at $10 RPM
    b2bSubscriptions: {
      starter: 2000, // 2,000 × $299 = $598K
      growth: 1000, // 1,000 × $999 = $999K
      enterprise: 200, // 200 × $4,999 = $999.8K
      custom: 50, // 50 × $10,000 = $500K
    },
    affiliateSales: 50000000, // $50M GMV at 4% = $2M
  },
};

// ============================================
// AD LOADING OPTIMIZATION
// ============================================

export class AdManager {
  private loadedAds: Map<string, boolean> = new Map();
  private revenueTracker: Map<string, number> = new Map();
  
  /**
   * Select best ad network for placement based on performance
   */
  selectBestNetwork(placementId: string, userRegion: string): string {
    const placement = AD_PLACEMENTS.find(p => p.id === placementId);
    if (!placement) return AD_NETWORKS[0].id;
    
    // Filter networks by geography and format
    const eligibleNetworks = placement.networks
      .map(id => AD_NETWORKS.find(n => n.id === id))
      .filter(n => n && n.enabled)
      .filter(n => n!.geographicCoverage.includes(userRegion) || n!.geographicCoverage.includes('global'));
    
    if (eligibleNetworks.length === 0) return '';
    
    // Sort by RPM performance
    eligibleNetworks.sort((a, b) => b!.rpmTarget - a!.rpmTarget);
    
    return eligibleNetworks[0]!.id;
  }
  
  /**
   * Lazy load ad when entering viewport
   */
  lazyLoadAd(placementId: string, element: HTMLElement): void {
    const placement = AD_PLACEMENTS.find(p => p.id === placementId);
    if (!placement || !placement.lazyLoad) {
      this.loadAd(placementId);
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadAd(placementId);
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: `${placement.viewabilityThreshold}px`,
    });
    
    observer.observe(element);
  }
  
  /**
   * Load ad from selected network
   */
  private loadAd(placementId: string): void {
    if (this.loadedAds.has(placementId)) return;
    
    // Implementation would load actual ad code
    console.log(`[AD] Loading ad for placement: ${placementId}`);
    this.loadedAds.set(placementId, true);
  }
  
  /**
   * Track ad impression revenue
   */
  trackImpression(placementId: string, networkId: string, rpm: number): void {
    const key = `${placementId}_${networkId}`;
    const current = this.revenueTracker.get(key) || 0;
    this.revenueTracker.set(key, current + rpm / 1000);
  }
  
  /**
   * Get revenue report
   */
  getRevenueReport(): { total: number; byNetwork: Record<string, number>; byPlacement: Record<string, number> } {
    let total = 0;
    const byNetwork: Record<string, number> = {};
    const byPlacement: Record<string, number> = {};
    
    this.revenueTracker.forEach((revenue, key) => {
      total += revenue;
      const [placementId, networkId] = key.split('_');
      
      byNetwork[networkId] = (byNetwork[networkId] || 0) + revenue;
      byPlacement[placementId] = (byPlacement[placementId] || 0) + revenue;
    });
    
    return { total, byNetwork, byPlacement };
  }
}

export const adManager = new AdManager();

// ============================================
// AUTO-LINK GENERATION
// ============================================

export class AffiliateLinkGenerator {
  /**
   * Generate affiliate link for product
   */
  generateLink(productId: string, retailerId: string, userId?: string): string {
    const network = AFFILIATE_NETWORKS.find(n => 
      n.supportedRegions.includes('global') || n.supportedRegions.includes('US')
    );
    
    if (!network) return '';
    
    const baseUrl = `https://pricex.com/go/${productId}/${retailerId}`;
    const params = new URLSearchParams();
    
    if (userId) {
      params.set('ref', userId);
    }
    
    params.set('network', network.id);
    params.set('track', `px_${Date.now()}`);
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  /**
   * Auto-detect and convert product URLs to affiliate links
   */
  convertUrls(content: string, userId?: string): string {
    // Pattern matching for major retailers
    const patterns = [
      { regex: /amazon\.com\/dp\/(\w+)/g, network: 'amazon_associates' },
      { regex: /walmart\.com\/ip\/(\d+)/g, network: 'impact' },
      { regex: /bestbuy\.com\/site\/[\w-]+\/(\d+)\.p/g, network: 'cj_affiliate' },
    ];
    
    let converted = content;
    
    patterns.forEach(({ regex, network }) => {
      converted = converted.replace(regex, (match, productId) => {
        const affiliateUrl = this.generateLink(productId, network, userId);
        return affiliateUrl || match;
      });
    });
    
    return converted;
  }
}

export const affiliateGenerator = new AffiliateLinkGenerator();
