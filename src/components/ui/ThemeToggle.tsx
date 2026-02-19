/**
 * PriceX - Theme Toggle Component
 * Light/Dark mode switcher with persistence
 */

'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary w-[120px] h-9 animate-pulse">
        <div className="w-8 h-7 bg-muted rounded" />
        <div className="w-8 h-7 bg-muted rounded" />
        <div className="w-8 h-7 bg-muted rounded" />
      </div>
    );
  }

  const options = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'Auto' },
  ] as const;

  return (
    <div 
      className="flex items-center gap-1 p-1 rounded-lg bg-secondary border border-border"
      role="radiogroup"
      aria-label="Select theme"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;
        
        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={`relative flex items-center justify-center w-8 h-7 rounded-md transition-all duration-200 ${
              isActive 
                ? 'bg-[var(--pricex-yellow)] text-black shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
            role="radio"
            aria-checked={isActive}
            title={option.label}
          >
            <Icon className="w-4 h-4" />
            {isActive && (
              <motion.div
                layoutId="theme-active"
                className="absolute inset-0 bg-[var(--pricex-yellow)] rounded-md -z-10"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
