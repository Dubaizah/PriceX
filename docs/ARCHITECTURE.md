# PriceX - Global Aggregation & Comparison Engine

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            PRICEX ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (Next.js 16)                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │   Web   │  │ Mobile  │  │  PWA   │  │  Admin  │  │  API    │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘           │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────────────┘
        │            │            │            │            │
        └────────────┴────────────┴────────────┴────────────┘
                                     │
                              ┌──────▼──────┐
                              │   Vercel    │
                              │   (CDN)     │
                              └──────┬──────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                               API LAYER                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ /api/search │  │/api/products│  │ /api/fx    │  │  /api/auth  │       │
│  │    /v2      │  │    /search  │  │   -rates   │  │             │       │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │
└─────────┼─────────────────┼─────────────────┼─────────────────┼──────────────┘
          │                 │                 │                 │
┌─────────▼─────────────────▼─────────────────▼─────────────────▼──────────────┐
│                        ENGINE LAYER (Node.js)                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     DATA AGGREGATION SERVICE                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │ API Connectors│  │   Scrapers   │  │  Feed Parser │             │    │
│  │  │(Amazon PA-API)│  │ (Playwright) │  │   (CSV/JSON) │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  │         │                 │                 │                       │    │
│  │         └─────────────────┼─────────────────┘                       │    │
│  │                           ▼                                         │    │
│  │                  ┌──────────────┐                                   │    │
│  │                  │ Rate Limiter│                                   │    │
│  │                  │  (Queue)    │                                   │    │
│  │                  └──────────────┘                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     SKU MATCHING ENGINE                              │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │  Identifiers │  │    Fuzzy     │  │  NLP Match  │             │    │
│  │  │ (UPC/EAN/MPN)│  │  Matching    │  │  Semantic   │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   COMPARISON & RANKING ENGINE                        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │    │
│  │  │    FX Rate   │  │    Total     │  │   Deal      │             │    │
│  │  │  Converter   │  │Landed Cost   │  │   Score     │             │    │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        CACHE LAYER                                  │    │
│  │  ┌──────────────────────────────────────────────────────────┐      │    │
│  │  │              Redis / In-Memory Cache                      │      │    │
│  │  │  • Product Search: 1-4 hours                              │      │    │
│  │  │  • Price History: 1 hour                                  │      │    │
│  │  │  • FX Rates: 1 hour                                      │      │    │
│  │  └──────────────────────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                            DATA LAYER                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│  │   PostgreSQL     │  │   Elasticsearch  │  │      Redis       │         │
│  │  (Products,      │  │   (Search Index) │  │    (Cache)       │         │
│  │   Users, Logs)   │  │                  │  │                  │         │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     SUPABASE (Cloud Database)                        │   │
│  │  • Products Table                                                    │   │
│  │  • SellerOffers Table                                                │   │
│  │  • PriceHistory Table                                               │   │
│  │  • UserAccounts Table                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                                    │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Amazon    │  │    eBay     │  │  AliExpress │  │   Walmart   │       │
│  │  PA-API 5.0 │  │  Commerce   │  │  Affiliate  │  │    API      │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   BrightData│  │   Oxylabs   │  │  FX Rate    │  │   Cloudflare│       │
│  │ (Proxies)   │  │ (Proxies)   │  │    API      │  │    (WAF)    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Database Schemas

### UnifiedProduct Table

```sql
CREATE TABLE unified_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(100) UNIQUE NOT NULL,
    
    -- Identifiers
    upc VARCHAR(20),
    ean VARCHAR(14),
    isbn VARCHAR(13),
    mpn VARCHAR(100),
    gtin VARCHAR(14),
    brand VARCHAR(100),
    model VARCHAR(100),
    
    -- Core Info
    title TEXT NOT NULL,
    title_normalized TEXT,
    description TEXT,
    description_html TEXT,
    
    -- Category
    category_id VARCHAR(50),
    category_path TEXT[],
    
    -- Media
    images JSONB,
    videos JSONB,
    
    -- Specifications
    specifications JSONB,
    attributes JSONB,
    
    -- Match Group
    match_group_id UUID,
    match_confidence DECIMAL(3,2),
    match_method VARCHAR(20),
    
    -- SEO
    slug VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    is_verified BOOLEAN DEFAULT false,
    verification_source VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_price_update TIMESTAMP,
    
    -- Indexes
    INDEX idx_title_normalized (title_normalized),
    INDEX idx_upc (upc),
    INDEX idx_ean (ean),
    INDEX idx_mpn (mpn),
    INDEX idx_brand (brand),
    INDEX idx_category (category_id),
    INDEX idx_match_group (match_group_id)
);
```

### SellerOffer Table

```sql
CREATE TABLE seller_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    unified_product_id UUID REFERENCES unified_products(id),
    
    -- Seller Info
    seller_id VARCHAR(50) NOT NULL,
    seller_name VARCHAR(100),
    seller_domain VARCHAR(255),
    seller_logo VARCHAR(500),
    is_verified BOOLEAN DEFAULT false,
    is_official_store BOOLEAN DEFAULT false,
    rating DECIMAL(3,2),
    review_count INTEGER,
    region VARCHAR(50),
    country VARCHAR(50),
    
    -- Pricing
    base_price DECIMAL(12,2) NOT NULL,
    original_price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'USD',
    currency_converted DECIMAL(12,2),
    base_currency VARCHAR(3),
    
    -- Discount
    discount_percent DECIMAL(5,2),
    discount_amount DECIMAL(12,2),
    is_on_sale BOOLEAN DEFAULT false,
    
    -- Fees
    processing_fee DECIMAL(8,2),
    tax_rate DECIMAL(5,4),
    tax_amount DECIMAL(12,2),
    
    -- Total Landed Cost
    total_landed_cost DECIMAL(12,2),
    
    -- Availability
    availability_status VARCHAR(20),
    quantity INTEGER,
    stock_level VARCHAR(10),
    restock_date TIMESTAMP,
    
    -- Condition
    condition_type VARCHAR(20),
    condition_grade VARCHAR(5),
    warranty VARCHAR(255),
    original_packaging BOOLEAN,
    
    -- Shipping
    shipping_cost DECIMAL(8,2),
    shipping_is_free BOOLEAN DEFAULT false,
    shipping_method VARCHAR(20),
    estimated_delivery VARCHAR(100),
    delivery_type VARCHAR(10),
    import_duty DECIMAL(8,2),
    vat DECIMAL(8,2),
    
    -- Fulfillment
    fulfillment_type VARCHAR(30),
    is_prime BOOLEAN,
    is_fba BOOLEAN,
    store_pickup BOOLEAN,
    
    -- Source
    source_url VARCHAR(500),
    source_type VARCHAR(20),
    scraped_at TIMESTAMP,
    expires_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_product_id (unified_product_id),
    INDEX idx_seller_id (seller_id),
    INDEX idx_total_cost (total_landed_cost),
    INDEX idx_currency (currency),
    INDEX idx_availability (availability_status),
    INDEX idx_scraped_at (scraped_at)
);
```

### PriceHistory Table

```sql
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES seller_offers(id),
    product_id UUID REFERENCES unified_products(id),
    
    price DECIMAL(12,2) NOT NULL,
    shipping_cost DECIMAL(8,2),
    currency VARCHAR(3) DEFAULT 'USD',
    total_cost DECIMAL(12,2),
    
    recorded_at TIMESTAMP DEFAULT NOW(),
    
    -- Indexes
    INDEX idx_offer_id (offer_id),
    INDEX idx_product_id (product_id),
    INDEX idx_recorded_at (recorded_at)
);
```

## API Endpoints

### Search & Compare

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search?q=iphone+15` | Basic search |
| GET | `/api/search/v2?q=iphone+15` | Enhanced search with comparison |
| GET | `/api/products/[id]` | Get product details |
| GET | `/api/products/search` | Advanced product search |
| GET | `/api/fx-rates` | Get FX rates |

### User Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/alerts` | Get price alerts |

## Core Algorithm: Total Landed Cost

```
Total Landed Cost = Base Price 
                  + Shipping Cost 
                  + Import Duty (if DDP)
                  + VAT 
                  + Processing Fee
                  - Discounts
```

## Ranking Algorithm

Sellers are ranked by `Total Landed Cost` in ascending order. The lowest-priced seller receives `cheapest_flag: true`.

Deal Score Calculation (0-100):
- Base Score: 50 points
- Price vs Average: Up to +30 points
- Availability: Up to +10 points
- Free Shipping: +10 points
- Seller Rating: Up to +10 points
- Verified Seller: +5 points
- Official Store: +5 points

## Caching Strategy

| Data Type | Cache TTL | Invalidation |
|-----------|----------|--------------|
| Product Search | 1-4 hours | On new scrape |
| Product Details | 1 hour | On price update |
| FX Rates | 1 hour | Hourly refresh |
| Price History | 24 hours | Daily update |

## Rate Limiting

- API Requests: 100 requests/minute per IP
- Scraping: 1 request/second per retailer
- Queue System: RabbitMQ/Kafka for background jobs

## Production Deployment

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION STACK                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend:        Vercel (Next.js)                         │
│  API:             Vercel Serverless Functions              │
│  Database:        Supabase (PostgreSQL)                     │
│  Search:          Algolia / Elasticsearch                   │
│  Cache:           Upstash (Redis)                           │
│  Monitoring:      Vercel Analytics + Sentry                │
│  CDN:             Vercel Edge Network                      │
│  SSL:             Automatic (Let's Encrypt)               │
└─────────────────────────────────────────────────────────────┘
```
