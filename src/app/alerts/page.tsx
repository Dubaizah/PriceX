/**
 * PriceX - Price Alerts Page
 * User's price drop and back-in-stock alerts
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Trash2, 
  Plus, 
  TrendingDown, 
  Package,
  Mail,
  Edit,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useProduct } from '@/context/ProductContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';

export default function AlertsPage() {
  const { t, isRTL } = useLanguage();
  const { formatPrice } = useCurrency();
  const { priceAlerts, createPriceAlert, removePriceAlert, isLoading } = useProduct();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-[var(--pricex-yellow)]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{t('alerts.title', 'Price Alerts')}</h1>
                  <p className="text-muted-foreground">{t('alerts.subtitle', 'Get notified when prices drop')}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--pricex-yellow)] text-black font-medium rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('alerts.create', 'Create Alert')}
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-sm text-muted-foreground">{t('alerts.totalAlerts', 'Total Alerts')}</span>
              <p className="text-2xl font-bold">{priceAlerts.length}</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-sm text-muted-foreground">{t('alerts.priceDrops', 'Price Drops')}</span>
              <p className="text-2xl font-bold text-green-500">0</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <span className="text-sm text-muted-foreground">{t('alerts.backInStock', 'Back in Stock')}</span>
              <p className="text-2xl font-bold text-blue-500">0</p>
            </div>
          </div>

          {/* Alerts List */}
          {priceAlerts.length > 0 ? (
            <div className="space-y-4">
              {priceAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-card border border-border flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                      <Package className="w-6 h-6 text-[var(--pricex-yellow)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{alert.product?.name || 'Product'}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t('alerts.targetPrice', 'Target')}: {formatPrice(alert.targetPrice || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-secondary transition-colors">
                      <Edit className="w-5 h-5 text-muted-foreground" />
                    </button>
                    <button 
                      onClick={() => removePriceAlert(alert.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card border border-border rounded-xl">
              <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('alerts.noAlerts', 'No price alerts yet')}</h3>
              <p className="text-muted-foreground mb-6">{t('alerts.createFirst', 'Create your first price alert')}</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pricex-yellow)] text-black font-medium rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors"
              >
                <Plus className="w-5 h-5" />
                {t('alerts.create', 'Create Alert')}
              </button>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-16">
            <h2 className="text-xl font-bold mb-6">{t('alerts.howItWorks', 'How Price Alerts Work')}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--pricex-yellow)]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-[var(--pricex-yellow)]">1</span>
                </div>
                <h3 className="font-semibold mb-2">{t('alerts.setTarget', 'Set Your Target Price')}</h3>
                <p className="text-sm text-muted-foreground">{t('alerts.setTargetDesc', 'Choose the price you want to pay')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--pricex-yellow)]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-[var(--pricex-yellow)]">2</span>
                </div>
                <h3 className="font-semibold mb-2">{t('alerts.weMonitor', 'We Monitor Prices')}</h3>
                <p className="text-sm text-muted-foreground">{t('alerts.weMonitorDesc', 'Our AI tracks prices 24/7')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--pricex-yellow)]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-[var(--pricex-yellow)]">3</span>
                </div>
                <h3 className="font-semibold mb-2">{t('alerts.getNotified', 'Get Instant Notifications')}</h3>
                <p className="text-sm text-muted-foreground">{t('alerts.getNotifiedDesc', 'Get notified when prices drop')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
