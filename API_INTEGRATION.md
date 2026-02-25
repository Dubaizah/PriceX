# PriceX - Global Seller Integration Guide

## Current Status

| Source | Status | Products |
|--------|--------|----------|
| Local Seed | ✅ Working | 50 products |
| Amazon API | ❌ Needs credentials | - |
| eBay API | ❌ Needs credentials | - |
| Walmart API | ❌ Needs credentials | - |
| Best Buy API | ❌ Needs credentials | - |

## How to Connect Real APIs

### 1. Amazon Product Advertising API
1. Sign up at [Amazon Associates](https://affiliate-program.amazon.com/)
2. Apply for Product Advertising API access
3. Add credentials to `.env.local`:
```
AMAZON_ACCESS_KEY=your_access_key
AMAZON_SECRET_KEY=your_secret_key
AMAZON_TAG=your_tag-20
```

### 2. eBay Browse API
1. Sign up at [eBay Developers](https://developer.ebay.com/)
2. Create an application
3. Add credentials:
```
EBAY_APP_ID=your_app_id
EBAY_CERT_ID=your_cert_id
```

### 3. Walmart API
1. Sign up at [Walmart Developers](https://developer.walmart.com/)
2. Get API key
3. Add:
```
WALMART_API_KEY=your_key
```

### 4. Best Buy API
1. Sign up at [Best Buy Developers](https://developer.bestbuy.com/)
2. Get API key (free tier available)
3. Add:
```
BESTBUY_API_KEY=your_key
```

### 5. RapidAPI (Alternative)
Use RapidAPI to access multiple shopping APIs:
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to shopping APIs (Amazon, eBay, etc.)
3. Add:
```
RAPIDAPI_KEY=your_key
RAPIDAPI_HOST=host_name
```

## Adding More Global Retailers

Edit `src/lib/services/retailer-config.ts` to add more retailers.

## Testing

After adding API keys:
```bash
npm run build
npm start
```

The system will automatically use live data when available.
