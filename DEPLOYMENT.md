# PriceX Deployment Guide

## FREE Services for PriceX

### 1. Free Hosting (Choose One)

| Platform | Free Tier | SSL | Bandwidth |
|---------|-----------|-----|-----------|
| **Vercel** | ✅ Yes | ✅ Free | 100GB/month |
| **Cloudflare Pages** | ✅ Yes | ✅ Free | Unlimited |
| **Netlify** | ✅ Yes | ✅ Free | 100GB/month |

### 2. Free Database

| Service | Free Storage | Best For |
|---------|--------------|----------|
| **Supabase** | 500MB | Full-stack apps |
| **Neon** | 256MB | PostgreSQL |
| **PlanetScale** | 500MB | MySQL |

### 3. Getting PriceX.com Domain

**Option A: Buy Domain (~$12/year)**
- Namecheap, Cloudflare, or GoDaddy
- Then connect to free hosting

**Option B: Free Subdomain**
- `pricex.vercel.app` (free)
- `pricex.pages.dev` (free)

---

## Quick Deploy Steps

### Step 1: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

Or connect your GitHub repo at: https://vercel.com

### Step 2: Add Free Database (Optional)

1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Get connection string
5. Add to Vercel Environment Variables

### Step 3: Get Domain (Optional)

1. Buy from Namecheap (~$12/year)
2. In Vercel: Settings → Domains
3. Add your domain
4. SSL is automatic!

---

## Environment Variables

Create `.env` file:

```env
# Database (when using Supabase/Neon)
DATABASE_URL=postgresql://...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## Build Status

✅ Build: PASSING
✅ Pages: 21 routes
✅ API Routes: 8 endpoints
✅ Ready for production!
