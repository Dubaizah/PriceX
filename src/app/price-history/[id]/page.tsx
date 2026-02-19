/**
 * PriceX - Price History Page
 * Historical price tracking and charts
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { formatCurrency } from '@/lib/utils';

interface PricePoint {
  date: string;
  price: number;
  retailer: string;
}

export default function PriceHistoryPage() {
  const params = useParams();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('90d');
  const [loading, setLoading] = useState(true);
  
  // Mock price history data
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([
    { date: '2024-01-01', price: 1299, retailer: 'Amazon' },
    { date: '2024-01-15', price: 1249, retailer: 'Best Buy' },
    { date: '2024-02-01', price: 1199, retailer: 'Amazon' },
    { date: '2024-02-15', price: 1199, retailer: 'Walmart' },
    { date: '2024-03-01', price: 1149, retailer: 'Amazon' },
    { date: '2024-03-15', price: 1099, retailer: 'Best Buy' },
    { date: '2024-04-01', price: 1199, retailer: 'Amazon' },
    { date: '2024-04-15', price: 1249, retailer: 'Target' },
  ]);

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, [params.id]);

  const currentPrice = priceHistory[priceHistory.length - 1]?.price || 0;
  const lowestPrice = Math.min(...priceHistory.map(p => p.price));
  const highestPrice = Math.max(...priceHistory.map(p => p.price));
  const averagePrice = priceHistory.reduce((sum, p) => sum + p.price, 0) / priceHistory.length;
  const priceChange = currentPrice - priceHistory[0].price;
  const priceChangePercent = ((priceChange / priceHistory[0].price) * 100).toFixed(1);

  const timeRanges = [
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-[120px] pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <a href="/" className="hover:text-foreground">Home</a>
            <span>/</span>
            <a href="/search" className="hover:text-foreground">Electronics</a>
            <span>/</span>
            <span className="text-foreground">iPhone 15 Pro Max</span>
          </nav>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Price History</h1>
            <p className="text-muted-foreground">
              Track price trends and find the best time to buy
            </p>
          </motion.div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value as typeof timeRange)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeRange === range.value
                      ? 'bg-[var(--pricex-yellow)] text-black'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* Price Chart */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Price Trend</h2>
              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg hover:bg-secondary">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="font-medium">Jan 2024 - Present</span>
                <button className="p-2 rounded-lg hover:bg-secondary">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="h-64 flex items-end justify-between gap-2">
              {priceHistory.map((point, index) => {
                const height = ((point.price - lowestPrice) / (highestPrice - lowestPrice)) * 100;
                const isHighest = point.price === highestPrice;
                const isLowest = point.price === lowestPrice;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={`w-full rounded-t transition-all ${
                        isHighest ? 'bg-red-500' : isLowest ? 'bg-green-500' : 'bg-[var(--pricex-yellow)]'
                      }`}
                      style={{ height: `${Math.max(height, 10)}%` }}
                      title={`${point.date}: $${point.price}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(point.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Lowest: {formatCurrency(lowestPrice)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Highest: {formatCurrency(highestPrice)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--pricex-yellow)]" />
                <span className="text-sm">Average: {formatCurrency(averagePrice)}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-2">Current Price</p>
              <p className="text-2xl font-bold">{formatCurrency(currentPrice)}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-2">Lowest Ever</p>
              <p className="text-2xl font-bold text-green-500">{formatCurrency(lowestPrice)}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-2">Highest Ever</p>
              <p className="text-2xl font-bold text-red-500">{formatCurrency(highestPrice)}</p>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-2">Change</p>
              <div className={`flex items-center gap-2 ${priceChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange <= 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                <p className="text-2xl font-bold">{priceChangePercent}%</p>
              </div>
            </div>
          </div>

          {/* Best Time to Buy */}
          <div className="bg-gradient-to-br from-[var(--pricex-yellow)]/10 to-[var(--pricex-yellow)]/5 border border-[var(--pricex-yellow)]/20 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--pricex-yellow)] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-7 h-7 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Price Prediction</h3>
                <p className="text-muted-foreground mb-4">
                  Based on historical data and market trends, prices are expected to 
                  <span className="text-green-500 font-semibold"> decrease by 5-10% </span> 
                  in the next 30 days. Consider waiting to make your purchase.
                </p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors">
                    Set Price Alert
                  </button>
                  <button className="px-6 py-3 border-2 border-border font-semibold rounded-xl hover:border-[var(--pricex-yellow)] transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price History Table */}
          <div className="mt-8 bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Price History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Price</th>
                    <th className="text-left p-4 font-medium">Retailer</th>
                    <th className="text-left p-4 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {priceHistory.map((point, index) => {
                    const prevPrice = index > 0 ? priceHistory[index - 1].price : point.price;
                    const change = point.price - prevPrice;
                    
                    return (
                      <tr key={index} className="hover:bg-secondary/30">
                        <td className="p-4">{new Date(point.date).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold">{formatCurrency(point.price)}</td>
                        <td className="p-4">{point.retailer}</td>
                        <td className="p-4">
                          <span className={`text-sm ${change < 0 ? 'text-green-500' : change > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                            {change > 0 ? '+' : ''}{change === 0 ? '—' : change}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
