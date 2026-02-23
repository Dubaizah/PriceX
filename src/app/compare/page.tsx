/**
 * PriceX - Compare Products Page
 * Product comparison interface
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus } from 'lucide-react';
import { useProduct } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProductComparisonTable } from '@/components/product/ProductComparisonTable';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ComparePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { 
    comparisonItems, 
    removeFromComparison, 
    clearComparison,
    maxComparisonItems,
  } = useProduct();

  // Redirect if no items to compare
  useEffect(() => {
    if (comparisonItems.length === 0) {
      // Optionally redirect or show empty state
    }
  }, [comparisonItems]);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <span className="text-foreground">{t('compare.title')}</span>
          </nav>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                {t('compare.back')}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{t('compare.title')}</h1>
                <p className="text-muted-foreground">
                  {t('compare.subtitle')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {comparisonItems.length > 0 && (
                  <button
                    onClick={clearComparison}
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t('compare.clearAll')}
                  </button>
                )}
                
                {comparisonItems.length < maxComparisonItems && (
                  <Link
                    href="/search"
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--pricex-yellow)] text-black font-medium rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('compare.addProduct')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>

          {/* Comparison Table */}
          {comparisonItems.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProductComparisonTable 
                products={comparisonItems}
                onRemoveProduct={removeFromComparison}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-card border border-border rounded-xl"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2">{t('compare.noProducts')}</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {t('compare.addProductDesc')}
              </p>
              <Link
                href="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pricex-yellow)] text-black font-semibold rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('compare.startComparing')}
              </Link>
            </motion.div>
          )}

          {/* Tips Section */}
          {comparisonItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 p-6 bg-muted/50 rounded-xl"
            >
              <h3 className="font-semibold mb-4">{t('compare.tips')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--pricex-yellow)]">•</span>
                  <span><strong>{t('compare.bestDeal')}:</strong> {t('compare.bestDealDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--pricex-yellow)]">•</span>
                  <span><strong>{t('compare.storeLocations')}:</strong> {t('compare.storeLocationsDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--pricex-yellow)]">•</span>
                  <span><strong>{t('compare.skuGrouping')}:</strong> {t('compare.skuGroupingDesc')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--pricex-yellow)]">•</span>
                  <span><strong>{t('compare.currencyConversion')}:</strong> {t('compare.currencyConversionDesc')}</span>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
