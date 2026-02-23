-- PriceX Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(500) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    category_id VARCHAR(50),
    images JSONB DEFAULT '[]',
    specifications JSONB DEFAULT '{}',
    attributes JSONB DEFAULT '{}',
    price_range JSONB DEFAULT '{"min": 0, "max": 0, "currency": "USD"}',
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    availability VARCHAR(50) DEFAULT 'in_stock',
    condition VARCHAR(50) DEFAULT 'new',
    features TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    seo JSONB DEFAULT '{"title": "", "description": "", "keywords": []}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    logo VARCHAR(500),
    website VARCHAR(500),
    region VARCHAR(50),
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_official_store BOOLEAN DEFAULT false,
    shipping_info JSONB DEFAULT '{}',
    return_policy JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price points table
CREATE TABLE IF NOT EXISTS price_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    availability VARCHAR(50) DEFAULT 'in_stock',
    condition VARCHAR(50) DEFAULT 'new',
    url VARCHAR(1000),
    sku VARCHAR(100),
    offer_expiry TIMESTAMP WITH TIME ZONE,
    discount_percent INTEGER,
    coupon_code VARCHAR(50),
    coupon_discount DECIMAL(10,2),
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    shipping_time VARCHAR(100),
    is_official_store BOOLEAN DEFAULT false,
    warranty VARCHAR(500),
    in_stock BOOLEAN DEFAULT true,
    stock_quantity INTEGER,
    stock_status VARCHAR(50) DEFAULT 'in_stock',
    is_lightning_deal BOOLEAN DEFAULT false,
    is_deal_of_the_day BOOLEAN DEFAULT false,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user',
    region VARCHAR(50),
    currency VARCHAR(10) DEFAULT 'USD',
    language VARCHAR(10) DEFAULT 'en',
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    target_price DECIMAL(10,2),
    current_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active',
    notified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    price_point_id UUID REFERENCES price_points(id) ON DELETE CASCADE,
    price DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_price_points_product ON price_points(product_id);
CREATE INDEX IF NOT EXISTS idx_price_points_retailer ON price_points(retailer_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);

-- Insert sample retailers
INSERT INTO retailers (name, logo, website, region, rating, review_count, is_verified, is_official_store, shipping_info, return_policy) VALUES
('Amazon', '/retailers/amazon.svg', 'https://www.amazon.com', 'north-america', 4.5, 50000000, true, false, '{"freeShippingThreshold": 35, "standardShipping": 0}', '{"allowed": true, "days": 30}'),
('Best Buy', '/retailers/bestbuy.svg', 'https://www.bestbuy.com', 'north-america', 4.3, 25000000, true, false, '{"freeShippingThreshold": 35, "standardShipping": 5.99}', '{"allowed": true, "days": 15}'),
('Walmart', '/retailers/walmart.svg', 'https://www.walmart.com', 'north-america', 4.2, 30000000, true, false, '{"freeShippingThreshold": 35, "standardShipping": 0}', '{"allowed": true, "days": 90}'),
('Target', '/retailers/target.svg', 'https://www.target.com', 'north-america', 4.4, 20000000, true, false, '{"freeShippingThreshold": 35, "standardShipping": 0}', '{"allowed": true, "days": 90}'),
('eBay', '/retailers/ebay.svg', 'https://www.ebay.com', 'global', 4.3, 40000000, true, false, '{"standardShipping": 0}', '{"allowed": true, "days": 30}')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, description, brand, model, sku, category_id, images, specifications, attributes, price_range, rating, review_count, availability, features, tags, is_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'iPhone 15 Pro Max', 'The most advanced iPhone with A17 Pro chip, titanium design, and 48MP camera system.', 'Apple', 'iPhone 15 Pro Max', 'B0CHX1W1XY', 'electronics', '[{"id": "1", "url": "/product-1.jpg", "thumbnail": "/product-1.jpg", "alt": "iPhone 15 Pro Max", "type": "main", "order": 1}]', '[{"attributeId": "display", "name": "Display", "value": "6.7 Super Retina XDR", "group": "Display"}, {"attributeId": "chip", "name": "Chip", "value": "A17 Pro", "group": "Performance"}]', '{"screen_size": 6.7, "storage": "256GB", "color": "Natural Titanium"}', '{"min": 1149, "max": 1299, "currency": "USD"}', 4.8, 2543, 'in_stock', ARRAY['A17 Pro chip', 'Titanium design', '48MP camera'], ARRAY['smartphone', 'flagship', 'ios'], true),
('22222222-2222-2222-2222-222222222222', 'Samsung Galaxy S24 Ultra', 'Premium Android smartphone with S Pen, 200MP camera, and AI features.', 'Samsung', 'Galaxy S24 Ultra', 'B0CQJJBDW5', 'electronics', '[{"id": "1", "url": "/product-2.jpg", "thumbnail": "/product-2.jpg", "alt": "Samsung Galaxy S24 Ultra", "type": "main", "order": 1}]', '[{"attributeId": "display", "name": "Display", "value": "6.8 Dynamic AMOLED", "group": "Display"}]', '{"screen_size": 6.8, "storage": "512GB", "color": "Titanium Black"}', '{"min": 1249, "max": 1399, "currency": "USD"}', 4.7, 1823, 'in_stock', ARRAY['S Pen', '200MP camera', 'AI features'], ARRAY['smartphone', 'android'], true),
('33333333-3333-3333-3333-333333333333', 'MacBook Pro 16" M3 Max', 'Powerful laptop with M3 Max chip, Liquid Retina XDR display, up to 22 hours battery.', 'Apple', 'MacBook Pro 16"', 'B0CM5JV268', 'electronics', '[{"id": "1", "url": "/product-3.jpg", "thumbnail": "/product-3.jpg", "alt": "MacBook Pro 16", "type": "main", "order": 1}]', '[{"attributeId": "display", "name": "Display", "value": "16.2 Liquid Retina XDR", "group": "Display"}]', '{"screen_size": 16.2, "storage": "1TB", "color": "Space Black"}', '{"min": 3499, "max": 3499, "currency": "USD"}', 4.9, 956, 'in_stock', ARRAY['M3 Max chip', 'Liquid Retina XDR'], ARRAY['laptop', 'apple'], true);

-- Insert sample price points
INSERT INTO price_points (product_id, retailer_id, price, original_price, currency, availability, url, sku, discount_percent, shipping_cost, shipping_time, is_official_store, in_stock, stock_quantity) VALUES
('11111111-1111-1111-1111-111111111111', (SELECT id FROM retailers WHERE name = 'Amazon'), 1199, 1299, 'USD', 'in_stock', 'https://amazon.com/iphone15pro', 'B0CHX1W1XY', 8, 0, '1-2 days', false, true, 150),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM retailers WHERE name = 'Best Buy'), 1199, 1299, 'USD', 'in_stock', 'https://bestbuy.com/iphone15pro', '6418599', 8, 0, 'Same day', false, true, 89),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM retailers WHERE name = 'Walmart'), 1149, 1299, 'USD', 'in_stock', 'https://walmart.com/iphone15pro', 'WAL-12345', 12, 0, '2-5 days', false, true, 75),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM retailers WHERE name = 'Amazon'), 1299, 1399, 'USD', 'in_stock', 'https://amazon.com/galaxy-s24', 'B0CQJJBDW5', 7, 0, '1-2 days', false, true, 200),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM retailers WHERE name = 'Best Buy'), 1299, 1399, 'USD', 'in_stock', 'https://bestbuy.com/galaxy-s24', 'BB-S24ULTRA', 7, 0, 'Same day', false, true, 120),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM retailers WHERE name = 'Amazon'), 3499, 3499, 'USD', 'in_stock', 'https://amazon.com/macbook-pro', 'B0CM5JV268', 0, 0, '2-3 days', false, true, 50);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;

-- Make all tables publicly readable
CREATE POLICY "Enable read access for all users" ON products FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON retailers FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON price_points FOR SELECT USING (true);

SELECT 'Database schema created successfully!' as status;
