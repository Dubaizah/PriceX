/**
 * PriceX - Region Selector Component
 * 8-region selector with country filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, MapPin, Check } from 'lucide-react';
import { useRegion } from '@/context/RegionContext';
import { useLanguage } from '@/context/LanguageContext';
import { Region } from '@/types';

export function RegionSelector() {
  const { 
    selectedRegion, 
    selectedCountry, 
    setRegion, 
    setCountry, 
    getCountriesByRegion,
    availableRegions,
    isLoading 
  } = useRegion();
  const { t, currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState<Region | null>(selectedRegion);

  const countriesInRegion = useMemo(() => {
    if (!activeRegion) return [];
    return getCountriesByRegion(activeRegion);
  }, [activeRegion, getCountriesByRegion]);

  const handleRegionSelect = (region: Region) => {
    setActiveRegion(region);
    setRegion(region);
  };

  const handleCountrySelect = (countryCode: string) => {
    setCountry(countryCode);
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted animate-pulse">
        <Globe className="w-4 h-4" />
        <span className="w-20 h-4 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200 group"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('region.select')}
      >
        <Globe className="w-4 h-4 text-[var(--pricex-yellow)]" />
        <span className="text-sm font-medium hidden sm:inline">
          {selectedCountry ? (
            <span className="flex items-center gap-1.5">
              <span className="text-base">{selectedCountry.flag}</span>
              <span>{selectedCountry.code}</span>
            </span>
          ) : (
            t('region.select')
          )}
        </span>
        <span className="text-sm font-medium sm:hidden">
          {selectedCountry?.flag || '🌍'}
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
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              role="listbox"
              aria-label={t('region.select')}
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[var(--pricex-yellow)]" />
                  {t('region.select')}
                </h3>
              </div>

              {/* Regions Grid */}
              <div className="p-4 border-b border-border">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
                  {t('region.current')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {availableRegions.map((region) => (
                    <button
                      key={region.id}
                      onClick={() => handleRegionSelect(region.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                        activeRegion === region.id
                          ? 'bg-[var(--pricex-yellow)] text-black'
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {currentLanguage === 'ar' ? region.nameAr : region.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries List */}
              {activeRegion && (
                <div className="p-4 max-h-60 overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider font-medium">
                    {t('country.select')}
                  </p>
                  <div className="space-y-1">
                    {countriesInRegion.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountrySelect(country.code)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                          selectedCountry?.code === country.code
                            ? 'bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)]'
                            : 'hover:bg-secondary'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xl">{country.flag}</span>
                          <span>{country.name}</span>
                        </span>
                        {selectedCountry?.code === country.code && (
                          <Check className="w-4 h-4 text-[var(--pricex-yellow)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
