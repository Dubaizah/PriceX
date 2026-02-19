/**
 * PriceX - Categories Page
 * Browse all product categories
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Laptop, 
  Shirt, 
  Home, 
  Dumbbell, 
  Car, 
  Coffee,
  Baby,
  Dog,
  Book,
  Plane,
  Gem,
  Sofa,
  Code,
  Music,
  Hammer,
  Palette,
  Heart,
  Leaf,
  ShoppingBag,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PriceXLogo } from '@/components/ui/PriceXLogo';

const categories = [
  { 
    id: 'electronics', 
    name: 'Electronics', 
    icon: Laptop, 
    count: '2.5M+ products',
    description: 'Phones, laptops, tablets, and more',
    color: 'bg-blue-500',
  },
  { 
    id: 'fashion', 
    name: 'Fashion', 
    icon: Shirt, 
    count: '5M+ products',
    description: 'Clothing, shoes, and accessories',
    color: 'bg-pink-500',
  },
  { 
    id: 'home', 
    name: 'Home & Garden', 
    icon: Home, 
    count: '1.8M+ products',
    description: 'Furniture, decor, and outdoor',
    color: 'bg-amber-500',
  },
  { 
    id: 'sports', 
    name: 'Sports', 
    icon: Dumbbell, 
    count: '900K+ products',
    description: 'Fitness, outdoor sports, and gear',
    color: 'bg-green-500',
  },
  { 
    id: 'beauty', 
    name: 'Beauty', 
    icon: Heart, 
    count: '1.2M+ products',
    description: 'Skincare, makeup, and haircare',
    color: 'bg-rose-500',
  },
  { 
    id: 'automotive', 
    name: 'Automotive', 
    icon: Car, 
    count: '600K+ products',
    description: 'Car parts, accessories, and tools',
    color: 'bg-gray-500',
  },
  { 
    id: 'groceries', 
    name: 'Groceries', 
    icon: Coffee, 
    count: '500K+ products',
    description: 'Food, beverages, and household',
    color: 'bg-orange-500',
  },
  { 
    id: 'kids', 
    name: 'Kids & Toys', 
    icon: Baby, 
    count: '800K+ products',
    description: 'Toys, games, and baby supplies',
    color: 'bg-purple-500',
  },
  { 
    id: 'pets', 
    name: 'Pets', 
    icon: Dog, 
    count: '400K+ products',
    description: 'Pet food, supplies, and toys',
    color: 'bg-amber-600',
  },
  { 
    id: 'office', 
    name: 'Office', 
    icon: Book, 
    count: '350K+ products',
    description: 'Supplies, furniture, and electronics',
    color: 'bg-indigo-500',
  },
  { 
    id: 'travel', 
    name: 'Travel', 
    icon: Plane, 
    count: '200K+ products',
    description: 'Luggage, travel accessories',
    color: 'bg-cyan-500',
  },
  { 
    id: 'luxury', 
    name: 'Luxury', 
    icon: Gem, 
    count: '150K+ products',
    description: 'Watches, jewelry, and designer',
    color: 'bg-yellow-500',
  },
  { 
    id: 'furniture', 
    name: 'Furniture', 
    icon: Sofa, 
    count: '700K+ products',
    description: 'Indoor and outdoor furniture',
    color: 'bg-brown-500',
  },
  { 
    id: 'software', 
    name: 'Software', 
    icon: Code, 
    count: '100K+ products',
    description: 'Software licenses and subscriptions',
    color: 'bg-slate-500',
  },
  { 
    id: 'music', 
    name: 'Musical Instruments', 
    icon: Music, 
    count: '250K+ products',
    description: 'Instruments and audio equipment',
    color: 'bg-red-500',
  },
  { 
    id: 'industrial', 
    name: 'Industrial', 
    icon: Hammer, 
    count: '500K+ products',
    description: 'Tools, machinery, and supplies',
    color: 'bg-zinc-500',
  },
  { 
    id: 'art', 
    name: 'Art & Collectibles', 
    icon: Palette, 
    count: '300K+ products',
    description: 'Art, antiques, and collectibles',
    color: 'bg-fuchsia-500',
  },
  { 
    id: 'health', 
    name: 'Health & Fitness', 
    icon: Dumbbell, 
    count: '600K+ products',
    description: 'Supplements and fitness gear',
    color: 'bg-emerald-500',
  },
  { 
    id: 'eco', 
    name: 'Green & Eco', 
    icon: Leaf, 
    count: '200K+ products',
    description: 'Sustainable and eco-friendly products',
    color: 'bg-green-600',
  },
  { 
    id: 'digital', 
    name: 'Digital Goods', 
    icon: ShoppingBag, 
    count: '150K+ products',
    description: 'Gift cards, e-books, and digital services',
    color: 'bg-violet-500',
  },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Browse Categories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore millions of products across 25+ categories. 
              Compare prices and find the best deals.
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={`/search?category=${category.id}`}
                    className="block p-6 rounded-2xl bg-card border border-border hover:border-[var(--pricex-yellow)] hover:shadow-lg transition-all group"
                  >
                    <div className={`w-14 h-14 rounded-xl ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-[var(--pricex-yellow)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Category Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '25+', label: 'Categories' },
              { value: '50M+', label: 'Products' },
              { value: '10K+', label: 'Retailers' },
              { value: '150+', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border border-border"
              >
                <div className="text-3xl font-bold text-[var(--pricex-yellow)] mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
