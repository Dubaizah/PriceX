/**
 * PriceX - Currency Selector Component
 * Real-time currency switching with FX rate display
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ChevronDown, Check, TrendingUp, RefreshCw } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';
import { useLanguage } from '@/context/LanguageContext';
import { Currency, CurrencyConfig } from '@/types';

export function CurrencySelector() {
  const { 
    currentCurrency, 
    currentCurrencyConfig, 
    setCurrency, 
    availableCurrencies,
    lastUpdated,
    refreshRates,
    isLoading
  } = useCurrency();
  const { t: translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currencyCode: Currency) => {
    setCurrency(currencyCode);
    setIsOpen(false);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={translate('currency.select')}
      >
        <DollarSign className="w-4 h-4 text-[var(--pricex-yellow)]" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentCurrencyConfig?.code} ({currentCurrencyConfig?.symbol})
        </span>
        <span className="text-sm font-medium sm:hidden">
          {currentCurrencyConfig?.symbol}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              role="listbox"
              aria-label={translate('currency.select')}
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[var(--pricex-yellow)]" />
                  {translate('currency.select')}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    refreshRates();
                  }}
                  className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  title="Refresh rates"
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {availableCurrencies.map((currency: CurrencyConfig) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      currentCurrency === currency.code
                        ? 'bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)]'
                        : 'hover:bg-secondary'
                    }`}
                    role="option"
                    aria-selected={currentCurrency === currency.code}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{currency.flag}</span>
                      <span className="flex flex-col items-start">
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-xs text-muted-foreground">{currency.name}</span>
                      </span>
                    </span>
                    <span className="text-sm font-semibold">{currency.symbol}</span>
                    {currentCurrency === currency.code && (
                      <Check className="w-4 h-4 text-[var(--pricex-yellow)]" />
                    )}
                  </button>
                ))}
              </div>

              {lastUpdated && (
                <div className="p-3 border-t border-border bg-muted/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    Rates updated at {formatLastUpdated()}
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
