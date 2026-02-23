# PriceX - Supabase Database Setup

## Step 1: Run SQL in Supabase

Copy the contents of `supabase/schema.sql` and run it in your Supabase **SQL Editor**:

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New query**
4. Paste the schema.sql content
5. Click **Run**

---

## Step 2: Get Connection String

After running the SQL, go to:
**Settings → Database → Connection string**

Copy this URI format:
```
postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

---

## Step 3: Add to Vercel

1. Go to Vercel Dashboard
2. Select your PriceX project
3. Go to **Settings → Environment Variables**
4. Add:
   - Name: `DATABASE_URL`
   - Value: (your Supabase connection string)
5. Click **Deploy** to rebuild with the new database

---

## What's Created:

✅ `products` - Product data
✅ `retailers` - Retailer information  
✅ `price_points` - Prices from different retailers
✅ `users` - User accounts
✅ `price_alerts` - Price alert subscriptions
✅ `price_history` - Historical price tracking

---

## Done!

Once you've:
1. Run the SQL in Supabase
2. Added DATABASE_URL to Vercel

Your PriceX will have a real database! 🎉
