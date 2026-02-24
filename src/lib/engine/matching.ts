/**
 * PriceX - SKU Matching & Grouping Engine
 * AI-powered product matching using identifiers, NLP, and fuzzy matching
 */

import {
  UnifiedProduct,
  SellerOffer,
  MatchResult,
  MatchGroup,
} from '@/types/engine';

// Fuzzy matching libraries would be installed in production
// For now, using custom implementation

interface MatchCandidate {
  productId: string;
  score: number;
  method: 'identifier' | 'fuzzy' | 'nlp';
  matchedOn: string[];
}

interface MatchThresholds {
  identifier: number;
  fuzzy: number;
  nlp: number;
}

/**
 * SKU Matching Engine
 * Matches products across sellers using multiple strategies
 */
export class SKUMatchingEngine {
  private thresholds: MatchThresholds = {
    identifier: 0.95,  // Exact match on UPC/EAN/ISBN
    fuzzy: 0.85,      // Fuzzy string matching
    nlp: 0.75,        // NLP-based semantic matching
  };

  // Brand name normalizations
  private brandAliases: Map<string, string[]> = new Map([
    ['samsung', ['samsung', 'samsung electronics', 'samsung galaxy']],
    ['apple', ['apple', 'apple inc', 'apple computer', 'iphone', 'ipad', 'macbook']],
    ['sony', ['sony', 'sony corporation', 'sony electronics']],
    ['lg', ['lg', 'lg electronics', 'lg corp']],
    ['dell', ['dell', 'dell technologies', 'dell inc']],
    ['hp', ['hp', 'hewlett packard', 'hp inc', 'hewlett-packard']],
    ['lenovo', ['lenovo', 'lenovo group']],
    ['asus', ['asus', 'asus computer', 'asustek']],
    ['microsoft', ['microsoft', 'microsoft corporation', 'ms']],
    ['google', ['google', 'google llc', 'alphabet']],
  ]);

  constructor(thresholds?: Partial<MatchThresholds>) {
    if (thresholds) {
      this.thresholds = { ...this.thresholds, ...thresholds };
    }
  }

  /**
   * Match a new offer against existing products
   */
  matchOffer(offer: SellerOffer, existingProducts: UnifiedProduct[]): MatchResult | null {
    // Strategy 1: Identifier matching (highest confidence)
    const identifierMatch = this.matchByIdentifier(offer, existingProducts);
    if (identifierMatch && identifierMatch.confidence >= this.thresholds.identifier) {
      return identifierMatch;
    }

    // Strategy 2: Exact title + brand matching
    const exactMatch = this.matchByExactTitle(offer, existingProducts);
    if (exactMatch && exactMatch.confidence >= this.thresholds.fuzzy) {
      return exactMatch;
    }

    // Strategy 3: Fuzzy string matching
    const fuzzyMatch = this.matchByFuzzyTitle(offer, existingProducts);
    if (fuzzyMatch && fuzzyMatch.confidence >= this.thresholds.fuzzy) {
      return fuzzyMatch;
    }

    // Strategy 4: NLP-based semantic matching
    const nlpMatch = this.matchByNLP(offer, existingProducts);
    if (nlpMatch && nlpMatch.confidence >= this.thresholds.nlp) {
      return nlpMatch;
    }

    // No confident match found
    return null;
  }

  /**
   * Match by standard identifiers (UPC, EAN, ISBN, MPN)
   */
  private matchByIdentifier(offer: SellerOffer, products: UnifiedProduct[]): MatchResult | null {
    const identifiers = offer.seller?.id || '';
    
    for (const product of products) {
      const matches: string[] = [];
      let matchScore = 0;
      let matchCount = 0;

      // Check UPC
      if (product.identifiers.upc && identifiers) {
        if (product.identifiers.upc === identifiers) {
          matches.push('upc');
          matchScore += 1;
        }
        matchCount++;
      }

      // Check EAN
      if (product.identifiers.ean && identifiers) {
        if (product.identifiers.ean === identifiers) {
          matches.push('ean');
          matchScore += 1;
        }
        matchCount++;
      }

      // Check ISBN
      if (product.identifiers.isbn && identifiers) {
        if (product.identifiers.isbn === identifiers) {
          matches.push('isbn');
          matchScore += 1;
        }
        matchCount++;
      }

      // Check MPN (Manufacturer Part Number)
      if (product.identifiers.mpn && identifiers) {
        if (this.fuzzyMatch(product.identifiers.mpn, identifiers) >= 0.9) {
          matches.push('mpn');
          matchScore += 1;
        }
        matchCount++;
      }

      if (matches.length > 0) {
        const confidence = matchScore / Math.max(matchCount, 1);
        
        return {
          unifiedProductId: product.id,
          confidence,
          method: 'identifier',
          matchedOn: matches,
          score: confidence * 100,
        };
      }
    }

    return null;
  }

  /**
   * Match by exact title and brand
   */
  private matchByExactTitle(offer: SellerOffer, products: UnifiedProduct[]): MatchResult | null {
    const offerTitle = this.normalizeTitle(offer.seller?.name || '');
    const offerBrand = this.normalizeBrand(offer.seller?.name || '');

    for (const product of products) {
      const productTitle = this.normalizeTitle(product.title);
      const productBrand = this.normalizeBrand(product.identifiers.brand || '');

      // Exact title match
      if (offerTitle === productTitle) {
        return {
          unifiedProductId: product.id,
          confidence: 0.95,
          method: 'fuzzy',
          matchedOn: ['title_exact'],
          score: 95,
        };
      }

      // Brand + title match
      if (offerBrand && productBrand && offerBrand === productBrand) {
        const titleSimilarity = this.fuzzyMatch(offerTitle, productTitle);
        if (titleSimilarity >= 0.8) {
          return {
            unifiedProductId: product.id,
            confidence: titleSimilarity * 0.9,
            method: 'fuzzy',
            matchedOn: ['brand', 'title_similar'],
            score: titleSimilarity * 90,
          };
        }
      }
    }

    return null;
  }

  /**
   * Match using fuzzy string matching
   */
  private matchByFuzzyTitle(offer: SellerOffer, products: UnifiedProduct[]): MatchResult | null {
    const offerTitle = this.normalizeTitle(offer.seller?.name || '');
    const offerBrand = this.normalizeBrand(offer.seller?.name || '');

    let bestMatch: MatchResult | null = null;
    let bestScore = 0;

    for (const product of products) {
      const productTitle = this.normalizeTitle(product.title);
      const productBrand = this.normalizeBrand(product.identifiers.brand || '');

      // Calculate multiple similarity scores
      const titleScore = this.fuzzyMatch(offerTitle, productTitle);
      
      let brandScore = 0;
      if (offerBrand && productBrand) {
        brandScore = this.fuzzyMatch(offerBrand, productBrand);
      }

      // Combined score: title is more important
      const combinedScore = (titleScore * 0.7) + (brandScore * 0.3);

      if (combinedScore > bestScore && combinedScore >= this.thresholds.fuzzy) {
        bestScore = combinedScore;
        
        const matchedOn: string[] = [];
        if (titleScore > 0.8) matchedOn.push('title');
        if (brandScore > 0.8) matchedOn.push('brand');

        bestMatch = {
          unifiedProductId: product.id,
          confidence: combinedScore,
          method: 'fuzzy',
          matchedOn,
          score: combinedScore * 100,
        };
      }
    }

    return bestMatch;
  }

  /**
   * Match using NLP-based semantic analysis
   */
  private matchByNLP(offer: SellerOffer, products: UnifiedProduct[]): MatchResult | null {
    const offerTokens = this.tokenize(offer.seller?.name || '');

    let bestMatch: MatchResult | null = null;
    let bestScore = 0;

    for (const product of products) {
      const productTokens = this.tokenize(product.title);
      
      // Jaccard similarity on tokens
      const similarity = this.jaccardSimilarity(offerTokens, productTokens);
      
      // Also check attribute similarity
      const attrSimilarity = this.attributeSimilarity(
        offer.seller?.id || '',
        product.identifiers
      );

      // Combined NLP score
      const nlpScore = (similarity * 0.6) + (attrSimilarity * 0.4);

      if (nlpScore > bestScore && nlpScore >= this.thresholds.nlp) {
        bestScore = nlpScore;
        
        bestMatch = {
          unifiedProductId: product.id,
          confidence: nlpScore,
          method: 'nlp',
          matchedOn: ['semantic', 'attributes'],
          score: nlpScore * 100,
        };
      }
    }

    return bestMatch;
  }

  /**
   * Normalize product title for comparison
   */
  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove special chars
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  /**
   * Normalize brand name
   */
  private normalizeBrand(brand: string): string {
    if (!brand) return '';
    
    const normalized = brand.toLowerCase().trim();
    
    // Check aliases
    for (const [canonical, aliases] of this.brandAliases) {
      if (aliases.includes(normalized)) {
        return canonical;
      }
    }
    
    return normalized;
  }

  /**
   * Tokenize text for NLP matching
   */
  private tokenize(text: string): Set<string> {
    return new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 2)
    );
  }

  /**
   * Fuzzy string matching using Levenshtein distance
   */
  private fuzzyMatch(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    if (str1 === str2) return 1;

    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    // Quick length-based filter
    const lenDiff = Math.abs(s1.length - s2.length);
    if (lenDiff > Math.max(s1.length, s2.length) * 0.5) {
      return 0;
    }

    const distance = this.levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    
    return 1 - (distance / maxLen);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str1.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str1.length; i++) {
      for (let j = 1; j <= str2.length; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str1.length][str2.length];
  }

  /**
   * Jaccard similarity between two sets
   */
  private jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
    if (set1.size === 0 && set2.size === 0) return 0;
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Compare product attributes
   */
  private attributeSimilarity(
    offerIdentifier: string,
    productIdentifiers: { upc?: string; ean?: string; mpn?: string; model?: string }
  ): number {
    let matches = 0;
    let total = 0;

    const fields = [
      productIdentifiers.upc,
      productIdentifiers.ean,
      productIdentifiers.mpn,
      productIdentifiers.model,
    ].filter(Boolean);

    for (const field of fields) {
      if (field) {
        total++;
        if (this.fuzzyMatch(offerIdentifier, field) > 0.9) {
          matches++;
        }
      }
    }

    return total > 0 ? matches / total : 0;
  }

  /**
   * Group multiple products into a MatchGroup
   */
  createMatchGroup(products: UnifiedProduct[]): MatchGroup {
    const primary = products[0];
    
    const identifiers: Record<string, string> = {};
    for (const product of products) {
      if (product.identifiers.upc) identifiers.upc = product.identifiers.upc;
      if (product.identifiers.ean) identifiers.ean = product.identifiers.ean;
      if (product.identifiers.mpn) identifiers.mpn = product.identifiers.mpn;
      if (product.identifiers.isbn) identifiers.isbn = product.identifiers.isbn;
    }

    return {
      id: `group_${Date.now()}`,
      productIds: products.map(p => p.id),
      primaryProductId: primary.id,
      title: primary.title,
      brand: primary.identifiers.brand,
      identifiers,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Batch match multiple offers
   */
  batchMatch(offers: SellerOffer[], existingProducts: UnifiedProduct[]): Map<string, MatchResult | null> {
    const results = new Map<string, MatchResult | null>();
    
    for (const offer of offers) {
      const match = this.matchOffer(offer, existingProducts);
      results.set(offer.id, match);
    }
    
    return results;
  }
}

// Export singleton
export const skuMatchingEngine = new SKUMatchingEngine();
