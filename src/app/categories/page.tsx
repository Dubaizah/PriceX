/**
 * PriceX - Categories Page
 * Browse all product categories
 */

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesPage() {
  const { t, isRTL } = useLanguage();

  const categories = [
    { id: 'electronics', nameKey: 'categories.electronics', icon: '💻', count: '2.5M+', color: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop&q=80' },
    { id: 'home-appliances', nameKey: 'categories.homeAppliances', icon: '🏠', count: '1.8M+', color: 'bg-amber-500', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80' },
    { id: 'fashion', nameKey: 'categories.fashion', icon: '👕', count: '5M+', color: 'bg-pink-500', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop&q=80' },
    { id: 'beauty', nameKey: 'categories.beauty', icon: '💄', count: '1.2M+', color: 'bg-rose-500', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop&q=80' },
    { id: 'groceries', nameKey: 'categories.groceries', icon: '🛒', count: '900K+', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop&q=80' },
    { id: 'automotive', nameKey: 'categories.automotive', icon: '🚗', count: '600K+', color: 'bg-gray-500', image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop&q=80' },
    { id: 'health', nameKey: 'categories.health', icon: '💪', count: '800K+', color: 'bg-red-500', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&q=80' },
    { id: 'baby', nameKey: 'categories.baby', icon: '👶', count: '700K+', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1587653915936-5623ea0b949a?w=600&h=400&fit=crop&q=80' },
    { id: 'office', nameKey: 'categories.office', icon: '📎', count: '500K+', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=80' },
    { id: 'sports', nameKey: 'categories.sports', icon: '⚽', count: '900K+', color: 'bg-green-600', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop&q=80' },
    { id: 'books', nameKey: 'categories.books', icon: '📚', count: '1M+', color: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop&q=80' },
    { id: 'pets', nameKey: 'categories.pets', icon: '🐕', count: '400K+', color: 'bg-amber-600', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop&q=80' },
    { id: 'garden', nameKey: 'categories.garden', icon: '🌿', count: '350K+', color: 'bg-green-500', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop&q=80' },
    { id: 'travel', nameKey: 'categories.travel', icon: '✈️', count: '300K+', color: 'bg-sky-500', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&q=80' },
    { id: 'luxury', nameKey: 'categories.luxury', icon: '💎', count: '250K+', color: 'bg-yellow-500', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop&q=80' },
    { id: 'software', nameKey: 'categories.software', icon: '💻', count: '200K+', color: 'bg-indigo-500', image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop&q=80' },
    { id: 'furniture', nameKey: 'categories.furniture', icon: '🛋️', count: '450K+', color: 'bg-amber-700', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop&q=80' },
    { id: 'pharmacy', nameKey: 'categories.pharmacy', icon: '💊', count: '300K+', color: 'bg-teal-500', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=400&fit=crop&q=80' },
    { id: 'new-arrivals', nameKey: 'categories.newArrivals', icon: '🆕', count: '100K+', color: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80' },
    { id: 'art', nameKey: 'categories.art', icon: '🎨', count: '150K+', color: 'bg-pink-400', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop&q=80' },
    { id: 'music', nameKey: 'categories.music', icon: '🎸', count: '200K+', color: 'bg-red-600', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop&q=80' },
    { id: 'industrial', nameKey: 'categories.industrial', icon: '🏭', count: '180K+', color: 'bg-gray-600', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80' },
    { id: 'smart-home', nameKey: 'categories.smartHome', icon: '🏠', count: '120K+', color: 'bg-cyan-500', image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&h=400&fit=crop&q=80' },
    { id: 'digital', nameKey: 'categories.digital', icon: '📱', count: '90K+', color: 'bg-blue-600', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=400&fit=crop&q=80' },
    { id: 'finance', nameKey: 'categories.finance', icon: '💰', count: '80K+', color: 'bg-green-700', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&q=80' },
    { id: 'eco', nameKey: 'categories.eco', icon: '🌱', count: '70K+', color: 'bg-emerald-500', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop&q=80' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">{t('categories.title', 'Browse Categories')}</h1>
            <p className="text-muted-foreground text-lg">
              {t('categories.subtitle', 'Browse by category')}
            </p>
          </motion.div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/search?category=${category.id}`}
                  className="block rounded-2xl bg-card border border-border hover:border-[var(--pricex-yellow)] hover:shadow-xl hover:shadow-[var(--pricex-yellow)]/10 transition-all duration-300 group overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img 
                      src={category.image} 
                      alt={t(category.nameKey)}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                        e.currentTarget.parentElement!.innerHTML = `<span class="text-4xl">${category.icon}</span>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-3 right-3 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                      {category.icon}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-lg text-white mb-1 group-hover:text-[var(--pricex-yellow)] transition-colors">{t(category.nameKey)}</h3>
                      <p className="text-sm text-white/70">{category.count} {t('categories.products', 'products')}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
