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
import { formatCurrency } from '@/lib/utils';

export default function AlertsPage() {
  const { priceAlerts, createPriceAlert, removePriceAlert, isLoading } = useProduct();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
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
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center">
                  <Bell className="w-7 h-7 text-[var(--pricex-yellow)]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Price Alerts</h1>
                  <p className="text-muted-foreground">
                    Get notified when prices drop
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="h-12 px-6 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Alert
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Bell className="w-5 h-5 text-[var(--pricex-yellow)]" />
                <span className="text-sm text-muted-foreground">Total Alerts</span>
              </div>
              <p className="text-2xl font-bold">{priceAlerts?.length || 0}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <TrendingDown className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Price Drops</span>
              </div>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Back in Stock</span>
              </div>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>

          {/* Alerts List */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {priceAlerts && priceAlerts.length > 0 ? (
              <div className="divide-y divide-border">
                {priceAlerts.map((alert, index) => (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-xl bg-secondary flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{alert.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Target: {formatCurrency(alert.targetPrice, 'USD')}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.isActive 
                            ? 'bg-green-500/10 text-green-500' 
                            : 'bg-gray-500/10 text-gray-500'
                        }`}>
                          {alert.isActive ? 'Active' : 'Triggered'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 rounded-xl hover:bg-secondary transition-colors">
                        <Edit className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => removePriceAlert(alert.id)}
                        className="p-3 rounded-xl hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Bell className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No price alerts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first price alert to get notified when prices drop
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create Alert
                </button>
              </div>
            )}
          </div>

          {/* How it works */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">How Price Alerts Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                  <span className="text-[var(--pricex-yellow)] font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Set Your Target Price</h3>
                <p className="text-sm text-muted-foreground">
                  Choose any product and set the price you want to pay
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                  <span className="text-[var(--pricex-yellow)] font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">We Monitor Prices</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI tracks prices from thousands of retailers 24/7
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="w-10 h-10 rounded-xl bg-[var(--pricex-yellow)]/10 flex items-center justify-center mb-4">
                  <span className="text-[var(--pricex-yellow)] font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Get Instant Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Receive email or push notifications when prices drop
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
