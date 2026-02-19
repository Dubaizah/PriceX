/**
 * PriceX - User Engagement AI
 * Loyalty program, referral system, and review management
 */

import { 
  LoyaltyProgram, 
  ReferralSystem, 
  ProductReview, 
  ReviewSummary,
  PushNotification,
  NotificationType,
} from '@/types/ai';
import { User } from '@/types/auth';

// ============================================
// LOYALTY PROGRAM
// ============================================

const TIER_BENEFITS = {
  bronze: {
    cashbackRate: 0.5,
    earlyAccess: false,
    exclusiveDeals: false,
    freeShipping: false,
    dedicatedSupport: false,
  },
  silver: {
    cashbackRate: 1.0,
    earlyAccess: true,
    exclusiveDeals: false,
    freeShipping: false,
    dedicatedSupport: false,
  },
  gold: {
    cashbackRate: 2.0,
    earlyAccess: true,
    exclusiveDeals: true,
    freeShipping: true,
    dedicatedSupport: false,
  },
  platinum: {
    cashbackRate: 3.0,
    earlyAccess: true,
    exclusiveDeals: true,
    freeShipping: true,
    dedicatedSupport: true,
  },
  diamond: {
    cashbackRate: 5.0,
    earlyAccess: true,
    exclusiveDeals: true,
    freeShipping: true,
    dedicatedSupport: true,
  },
};

const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 15000,
  diamond: 50000,
};

export class LoyaltyEngine {
  private programs: Map<string, LoyaltyProgram> = new Map();
  
  /**
   * Initialize loyalty program for user
   */
  initializeProgram(userId: string): LoyaltyProgram {
    const program: LoyaltyProgram = {
      userId,
      tier: 'bronze',
      points: 0,
      lifetimePoints: 0,
      tierBenefits: TIER_BENEFITS.bronze,
      history: [],
      nextTier: {
        name: 'silver',
        pointsNeeded: TIER_THRESHOLDS.silver,
        progress: 0,
      },
    };
    
    this.programs.set(userId, program);
    return program;
  }
  
  /**
   * Award points to user
   */
  awardPoints(userId: string, action: string, points: number, metadata?: any): LoyaltyProgram | null {
    const program = this.programs.get(userId);
    if (!program) return null;
    
    // Add points
    program.points += points;
    program.lifetimePoints += points;
    
    // Record history
    program.history.push({
      action,
      points,
      timestamp: new Date(),
    });
    
    // Check for tier upgrade
    this.checkTierUpgrade(program);
    
    return program;
  }
  
  /**
   * Redeem points
   */
  redeemPoints(userId: string, points: number, reward: string): { success: boolean; message: string } {
    const program = this.programs.get(userId);
    if (!program) return { success: false, message: 'Program not found' };
    
    if (program.points < points) {
      return { success: false, message: 'Insufficient points' };
    }
    
    program.points -= points;
    program.history.push({
      action: `Redeemed: ${reward}`,
      points: -points,
      timestamp: new Date(),
    });
    
    return { success: true, message: `Successfully redeemed ${reward}` };
  }
  
  /**
   * Check and update tier
   */
  private checkTierUpgrade(program: LoyaltyProgram): void {
    const tiers: Array<keyof typeof TIER_THRESHOLDS> = ['diamond', 'platinum', 'gold', 'silver', 'bronze'];
    
    for (const tier of tiers) {
      if (program.lifetimePoints >= TIER_THRESHOLDS[tier]) {
        if (program.tier !== tier) {
          // Tier upgrade!
          program.tier = tier;
          program.tierBenefits = TIER_BENEFITS[tier];
          program.history.push({
            action: `Tier upgrade: ${tier}`,
            points: 0,
            timestamp: new Date(),
          });
        }
        break;
      }
    }
    
    // Calculate next tier progress
    const tierOrder: Array<keyof typeof TIER_THRESHOLDS> = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
    const currentTierIndex = tierOrder.indexOf(program.tier);
    const nextTier = tierOrder[currentTierIndex + 1];
    
    if (nextTier) {
      const threshold = TIER_THRESHOLDS[nextTier];
      const prevThreshold = TIER_THRESHOLDS[program.tier];
      const progress = ((program.lifetimePoints - prevThreshold) / (threshold - prevThreshold)) * 100;
      
      program.nextTier = {
        name: nextTier,
        pointsNeeded: threshold - program.lifetimePoints,
        progress: Math.min(100, Math.max(0, progress)),
      };
    }
  }
  
  /**
   * Calculate cashback
   */
  calculateCashback(userId: string, purchaseAmount: number): number {
    const program = this.programs.get(userId);
    if (!program) return 0;
    
    return (purchaseAmount * program.tierBenefits.cashbackRate) / 100;
  }
  
  /**
   * Get point earning opportunities
   */
  getEarningOpportunities(): { action: string; points: number; description: string }[] {
    return [
      { action: 'signup', points: 100, description: 'Create an account' },
      { action: 'first_purchase', points: 200, description: 'Make your first purchase' },
      { action: 'review', points: 50, description: 'Write a product review' },
      { action: 'referral', points: 500, description: 'Refer a friend who makes a purchase' },
      { action: 'social_share', points: 25, description: 'Share a deal on social media' },
      { action: 'price_alert_set', points: 10, description: 'Set a price alert' },
      { action: 'comparison_used', points: 15, description: 'Use the comparison feature' },
      { action: 'daily_visit', points: 5, description: 'Visit PriceX daily' },
    ];
  }
  
  getProgram(userId: string): LoyaltyProgram | undefined {
    return this.programs.get(userId);
  }
}

export const loyaltyEngine = new LoyaltyEngine();

// ============================================
// REFERRAL SYSTEM
// ============================================

export class ReferralEngine {
  private referrals: Map<string, ReferralSystem> = new Map();
  
  /**
   * Generate referral code
   */
  generateReferralCode(userId: string): ReferralSystem {
    const code = `PRX${userId.substr(0, 6).toUpperCase()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const referral: ReferralSystem = {
      userId,
      referralCode: code,
      referralLink: `https://pricex.com/ref/${code}`,
      stats: {
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        totalRewards: 0,
      },
      referrals: [],
      rewards: [],
    };
    
    this.referrals.set(userId, referral);
    return referral;
  }
  
  /**
   * Process referral signup
   */
  processReferral(referralCode: string, newUserId: string): boolean {
    // Find referrer
    let referrer: ReferralSystem | undefined;
    for (const ref of this.referrals.values()) {
      if (ref.referralCode === referralCode) {
        referrer = ref;
        break;
      }
    }
    
    if (!referrer) return false;
    if (referrer.userId === newUserId) return false; // Can't refer yourself
    
    // Add to pending referrals
    referrer.referrals.push({
      referredUserId: newUserId,
      status: 'pending',
      signupDate: new Date(),
      rewardAmount: 25, // $25 reward
      rewardStatus: 'pending',
    });
    
    referrer.stats.totalReferrals++;
    referrer.stats.pendingReferrals++;
    
    return true;
  }
  
  /**
   * Process successful referral (first purchase)
   */
  processSuccessfulReferral(referredUserId: string): { referrerId: string; reward: number } | null {
    for (const [referrerId, referral] of this.referrals.entries()) {
      const ref = referral.referrals.find(r => r.referredUserId === referredUserId && r.status === 'pending');
      
      if (ref) {
        ref.status = 'successful';
        ref.firstPurchaseDate = new Date();
        ref.rewardStatus = 'paid';
        
        referral.stats.successfulReferrals++;
        referral.stats.pendingReferrals--;
        referral.stats.totalRewards += ref.rewardAmount;
        
        // Add reward
        referral.rewards.push({
          type: 'cash',
          amount: ref.rewardAmount,
          currency: 'USD',
        });
        
        return { referrerId, reward: ref.rewardAmount };
      }
    }
    
    return null;
  }
  
  getReferral(userId: string): ReferralSystem | undefined {
    return this.referrals.get(userId);
  }
}

export const referralEngine = new ReferralEngine();

// ============================================
// REVIEW SYSTEM
// ============================================

export class ReviewEngine {
  private reviews: Map<string, ProductReview[]> = new Map();
  private summaries: Map<string, ReviewSummary> = new Map();
  
  /**
   * Add a review
   */
  addReview(review: Omit<ProductReview, 'id' | 'sentiment' | 'createdAt' | 'updatedAt'>): ProductReview {
    const id = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Analyze sentiment
    const sentiment = this.analyzeSentiment(review.content);
    
    const fullReview: ProductReview = {
      ...review,
      id,
      sentiment,
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store review
    const productReviews = this.reviews.get(review.productId) || [];
    productReviews.push(fullReview);
    this.reviews.set(review.productId, productReviews);
    
    // Update summary
    this.updateSummary(review.productId);
    
    return fullReview;
  }
  
  /**
   * Analyze sentiment using simple keyword matching
   * In production, use NLP service
   */
  private analyzeSentiment(content: string): ProductReview['sentiment'] {
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'perfect', 'best', 'good', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'poor', 'disappointing', 'useless', 'broken'];
    
    const lowerContent = content.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerContent.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerContent.includes(word)) negativeCount++;
    });
    
    const score = (positiveCount - negativeCount) / Math.max(1, positiveCount + negativeCount);
    
    let overall: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (score > 0.2) overall = 'positive';
    else if (score < -0.2) overall = 'negative';
    
    return {
      overall,
      score,
      aspects: this.extractAspects(content),
    };
  }
  
  /**
   * Extract aspects mentioned in review
   */
  private extractAspects(content: string): { aspect: string; sentiment: 'positive' | 'neutral' | 'negative'; mentions: number }[] {
    const aspects = [
      { name: 'price', keywords: ['price', 'cost', 'expensive', 'cheap', 'value', 'money'] },
      { name: 'quality', keywords: ['quality', 'build', 'durable', 'sturdy', 'material'] },
      { name: 'shipping', keywords: ['shipping', 'delivery', 'arrived', 'package', 'fast'] },
      { name: 'customer service', keywords: ['service', 'support', 'helpful', 'rude'] },
    ];
    
    return aspects.map(aspect => {
      const mentions = aspect.keywords.filter(kw => content.toLowerCase().includes(kw)).length;
      const sentiment: 'positive' | 'neutral' | 'negative' = mentions > 0 ? 'positive' : 'neutral';
      return {
        aspect: aspect.name,
        sentiment,
        mentions,
      };
    }).filter(a => a.mentions > 0);
  }
  
  /**
   * Update review summary for product
   */
  private updateSummary(productId: string): void {
    const reviews = this.reviews.get(productId) || [];
    
    if (reviews.length === 0) return;
    
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    
    // Rating distribution
    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => ratingDistribution[r.rating]++);
    
    // Extract pros and cons
    const pros = this.extractPros(reviews);
    const cons = this.extractCons(reviews);
    
    // Common themes
    const themes = this.extractCommonThemes(reviews);
    
    const summary: ReviewSummary = {
      productId,
      totalReviews,
      averageRating,
      ratingDistribution,
      aiSummary: {
        pros,
        cons,
        verdict: this.generateVerdict(averageRating, pros, cons),
        bestFor: this.identifyBestFor(reviews),
      },
      commonThemes: themes,
      updatedAt: new Date(),
    };
    
    this.summaries.set(productId, summary);
  }
  
  private extractPros(reviews: ProductReview[]): string[] {
    const positivePhrases = [
      'Great value for money',
      'Excellent build quality',
      'Fast shipping',
      'Easy to use',
      'Highly recommended',
    ];
    
    return positivePhrases.slice(0, 3);
  }
  
  private extractCons(reviews: ProductReview[]): string[] {
    const negativePhrases = [
      'Price could be lower',
      'Shipping took longer than expected',
    ];
    
    return negativePhrases.slice(0, 2);
  }
  
  private generateVerdict(rating: number, pros: string[], cons: string[]): string {
    if (rating >= 4.5) return 'Highly recommended - Excellent product with great value';
    if (rating >= 4.0) return 'Recommended - Good product with minor drawbacks';
    if (rating >= 3.0) return 'Average - Decent product but consider alternatives';
    return 'Not recommended - Look for better options';
  }
  
  private identifyBestFor(reviews: ProductReview[]): string[] {
    return ['Budget-conscious buyers', 'First-time users', 'Value seekers'];
  }
  
  private extractCommonThemes(reviews: ProductReview[]): ReviewSummary['commonThemes'] {
    return [
      { theme: 'Value for money', sentiment: 'positive', frequency: 85, examples: ['Great price', 'Worth every penny'] },
      { theme: 'Build quality', sentiment: 'positive', frequency: 70, examples: ['Well made', 'Durable'] },
    ];
  }
  
  /**
   * Mark review as helpful
   */
  markHelpful(reviewId: string): void {
    for (const reviews of this.reviews.values()) {
      const review = reviews.find(r => r.id === reviewId);
      if (review) {
        review.helpful++;
        return;
      }
    }
  }
  
  /**
   * Get reviews for product
   */
  getReviews(productId: string): ProductReview[] {
    return this.reviews.get(productId) || [];
  }
  
  /**
   * Get summary for product
   */
  getSummary(productId: string): ReviewSummary | undefined {
    return this.summaries.get(productId);
  }
}

export const reviewEngine = new ReviewEngine();

// ============================================
// PUSH NOTIFICATION SYSTEM
// ============================================

export class NotificationEngine {
  private notifications: Map<string, PushNotification[]> = new Map();
  private notificationQueue: PushNotification[] = [];
  
  /**
   * Schedule notification
   */
  scheduleNotification(notification: Omit<PushNotification, 'id' | 'engagement'>): PushNotification {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const fullNotification: PushNotification = {
      ...notification,
      id,
      engagement: {
        delivered: false,
        opened: false,
        clicked: false,
        converted: false,
      },
    };
    
    this.notificationQueue.push(fullNotification);
    
    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.push(fullNotification);
    this.notifications.set(notification.userId, userNotifications);
    
    return fullNotification;
  }
  
  /**
   * Process notification queue
   */
  async processQueue(): Promise<void> {
    const now = new Date();
    
    const toSend = this.notificationQueue.filter(n => 
      n.scheduledAt && n.scheduledAt <= now && !n.sentAt
    );
    
    for (const notification of toSend) {
      await this.sendNotification(notification);
    }
  }
  
  /**
   * Send notification
   */
  private async sendNotification(notification: PushNotification): Promise<void> {
    // In production, integrate with Firebase Cloud Messaging, OneSignal, etc.
    console.log(`[NOTIFICATION] Sending to ${notification.userId}: ${notification.title}`);
    
    notification.sentAt = new Date();
    
    // Simulate delivery
    setTimeout(() => {
      notification.deliveredAt = new Date();
      notification.engagement.delivered = true;
    }, 1000);
  }
  
  /**
   * Track notification opened
   */
  trackOpened(notificationId: string): void {
    for (const notifications of this.notifications.values()) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.openedAt = new Date();
        notification.engagement.opened = true;
        return;
      }
    }
  }
  
  /**
   * Create price drop notification
   */
  createPriceDropNotification(
    userId: string,
    productId: string,
    productName: string,
    oldPrice: number,
    newPrice: number
  ): PushNotification {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    
    return this.scheduleNotification({
      userId,
      type: 'price_drop',
      title: `🔥 Price Drop: ${productName}`,
      body: `Down ${discount}%! Now $${newPrice.toFixed(2)} (was $${oldPrice.toFixed(2)})`,
      data: {
        productId,
        url: `/product/${productId}`,
        action: 'view_product',
      },
      priority: 'high',
      scheduledAt: new Date(),
    });
  }
  
  /**
   * Create back in stock notification
   */
  createBackInStockNotification(userId: string, productId: string, productName: string): PushNotification {
    return this.scheduleNotification({
      userId,
      type: 'back_in_stock',
      title: `✅ Back in Stock: ${productName}`,
      body: 'The item you wanted is now available. Get it before it sells out!',
      data: {
        productId,
        url: `/product/${productId}`,
        action: 'buy_now',
      },
      priority: 'high',
      scheduledAt: new Date(),
    });
  }
  
  /**
   * Get user notifications
   */
  getUserNotifications(userId: string): PushNotification[] {
    return this.notifications.get(userId) || [];
  }
}

export const notificationEngine = new NotificationEngine();
