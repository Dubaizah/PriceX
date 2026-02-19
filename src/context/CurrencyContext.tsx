/**
 * PriceX - Currency Context Provider
 * Manages currency selection and real-time FX conversion
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Currency, CurrencyConfig, CURRENCIES, FXRate } from '@/types';

interface CurrencyContextType {
  currentCurrency: Currency;
  currentCurrencyConfig: CurrencyConfig;
  setCurrency: (currency: Currency) => void;
  availableCurrencies: CurrencyConfig[];
  convertPrice: (amount: number, fromCurrency: Currency) => number;
  formatPrice: (amount: number, currency?: Currency) => string;
  fxRates: Record<string, number>;
  isLoading: boolean;
  lastUpdated: Date | null;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'pricex-currency-prefs';
const DEFAULT_CURRENCY: Currency = 'USD';
const FX_API_ENDPOINT = '/api/fx-rates'; // Backend endpoint for FX rates

// Fallback FX rates (base: USD) - in production, fetch from API
const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CNY: 7.19,
  AED: 3.67,
  SAR: 3.75,
  TRY: 30.50,
  RUB: 92.50,
  INR: 83.12,
  PKR: 279.50,
  KRW: 1330.50,
  BRL: 4.95,
  MXN: 17.05,
  CAD: 1.35,
  AUD: 1.52,
  ZAR: 19.05,
  EGP: 30.90,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const [fxRates, setFxRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const currentCurrencyConfig = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];

  // Load currency preference from localStorage
  useEffect(() => {
    const loadCurrency = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const curr = stored as Currency;
          if (CURRENCIES.some(c => c.code === curr)) {
            setCurrentCurrency(curr);
          }
        }
      } catch (error) {
        console.error('Error loading currency preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrency();
  }, []);

  // Fetch FX rates from backend
  const refreshRates = useCallback(async () => {
    try {
      setIsLoading(true);
      // In production, replace with actual API call
      // const response = await fetch(FX_API_ENDPOINT);
      // const data = await response.json();
      // setFxRates(data.rates);
      
      // For now, use fallback rates
      setFxRates(FALLBACK_RATES);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching FX rates:', error);
      setFxRates(FALLBACK_RATES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and periodic refresh
  useEffect(() => {
    refreshRates();
    
    // Refresh rates every 5 minutes
    const interval = setInterval(refreshRates, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refreshRates]);

  const setCurrency = useCallback((currency: Currency) => {
    setCurrentCurrency(currency);
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch (error) {
      console.error('Error saving currency preference:', error);
    }
  }, []);

  const convertPrice = useCallback((amount: number, fromCurrency: Currency): number => {
    if (fromCurrency === currentCurrency) return amount;
    
    const fromRate = fxRates[fromCurrency] || 1;
    const toRate = fxRates[currentCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const inUSD = amount / fromRate;
    return inUSD * toRate;
  }, [currentCurrency, fxRates]);

  const formatPrice = useCallback((amount: number, currency?: Currency): string => {
    const targetCurrency = currency || currentCurrency;
    const config = CURRENCIES.find(c => c.code === targetCurrency);
    
    if (!config) return `${amount}`;

    // Determine decimal places based on currency
    const decimalPlaces = ['JPY', 'KRW', 'CNY'].includes(targetCurrency) ? 0 : 2;
    
    // Format number
    const formatted = amount.toLocaleString(
      typeof navigator !== 'undefined' ? navigator.language : 'en-US',
      {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces,
      }
    );

    // Position symbol based on currency
    if (['USD', 'AUD', 'CAD', 'MXN'].includes(targetCurrency)) {
      return `${config.symbol}${formatted}`;
    } else if (targetCurrency === 'EUR') {
      return `${formatted} ${config.symbol}`;
    } else if (['GBP', 'JPY', 'INR', 'PKR', 'ZAR', 'RUB'].includes(targetCurrency)) {
      return `${config.symbol}${formatted}`;
    } else {
      return `${formatted} ${config.symbol}`;
    }
  }, [currentCurrency]);

  const value: CurrencyContextType = {
    currentCurrency,
    currentCurrencyConfig,
    setCurrency,
    availableCurrencies: CURRENCIES,
    convertPrice,
    formatPrice,
    fxRates,
    isLoading,
    lastUpdated,
    refreshRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

// Hook for converting and formatting prices in components
export function usePriceConverter() {
  const { convertPrice, formatPrice, currentCurrency } = useCurrency();

  return useMemo(() => ({
    convert: convertPrice,
    format: formatPrice,
    display: (amount: number, fromCurrency: Currency) => {
      const converted = convertPrice(amount, fromCurrency);
      return formatPrice(converted);
    },
    currentCurrency,
  }), [convertPrice, formatPrice, currentCurrency]);
}
