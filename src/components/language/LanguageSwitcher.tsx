/**
 * PriceX - Language Switcher Component
 * 12 languages with instant switching and RTL support
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageConfig } from '@/types';

export function LanguageSwitcher() {
  const { 
    currentLanguage, 
    currentLanguageConfig, 
    setLanguage, 
    availableLanguages,
    t 
  } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as any);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-all duration-200"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('language.select')}
      >
        <Languages className="w-4 h-4 text-[var(--pricex-yellow)]" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguageConfig?.nativeName}
        </span>
        <span className="text-sm font-medium sm:hidden uppercase">
          {currentLanguage}
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
              className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              role="listbox"
              aria-label={t('language.select')}
            >
              <div className="p-3 border-b border-border">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[var(--pricex-yellow)]" />
                  {t('language.select')}
                </h3>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {availableLanguages.map((lang: LanguageConfig) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                      currentLanguage === lang.code
                        ? 'bg-[var(--pricex-yellow)]/10 text-[var(--pricex-yellow)]'
                        : 'hover:bg-secondary'
                    }`}
                    role="option"
                    aria-selected={currentLanguage === lang.code}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex flex-col items-start">
                        <span className="font-medium">{lang.nativeName}</span>
                        <span className="text-xs text-muted-foreground">{lang.name}</span>
                      </span>
                    </span>
                    {currentLanguage === lang.code && (
                      <Check className="w-4 h-4 text-[var(--pricex-yellow)]" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
