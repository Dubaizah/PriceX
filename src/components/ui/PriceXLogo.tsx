/**
 * PriceX - Logo Component
 * Premium branding with custom fonts
 * Light BG: "Price" (Imprint MT Shadow, 80px, Black) | "X" (Forte, 120px, Yellow)
 * Dark BG: "Price" (Imprint MT Shadow, 80px, White) | "X" (Forte, 120px, Yellow)
 */

'use client';

import { motion } from 'framer-motion';

interface PriceXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { price: 'text-2xl', x: 'text-3xl' },
  md: { price: 'text-4xl', x: 'text-5xl' },
  lg: { price: 'text-6xl', x: 'text-7xl' },
  xl: { price: 'text-8xl', x: 'text-9xl' },
};

export function PriceXLogo({ size = 'lg', animated = true, className = '' }: PriceXLogoProps) {
  const { price: priceSize, x: xSize } = sizeConfig[size];

  const LogoContent = (
    <span className={`inline-flex items-baseline leading-none select-none ${className}`}>
      <span 
        className={`pricex-logo-price ${priceSize}`}
        style={{ fontFamily: "'Imprint MT Shadow', Georgia, serif" }}
      >
        Price
      </span>
      <span 
        className={`pricex-logo-x ${xSize} text-[var(--pricex-yellow)]`}
        style={{ fontFamily: "'Forte', cursive" }}
      >
        X
      </span>
    </span>
  );

  if (!animated) {
    return LogoContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1 
      }}
      className="inline-block"
    >
      <motion.span
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className={`inline-flex items-baseline leading-none select-none ${className}`}
      >
        <span 
          className={`pricex-logo-price ${priceSize}`}
          style={{ fontFamily: "'Imprint MT Shadow', Georgia, serif" }}
        >
          Price
        </span>
        <motion.span 
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.4, 
            duration: 0.6,
            type: "spring",
            stiffness: 200,
            damping: 15
          }}
          className={`pricex-logo-x ${xSize} text-[var(--pricex-yellow)]`}
          style={{ fontFamily: "'Forte', cursive" }}
        >
          X
        </motion.span>
      </motion.span>
    </motion.div>
  );
}

// Compact version for header/navbar
export function PriceXLogoCompact({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline leading-none select-none ${className}`}>
      <span 
        className="text-2xl md:text-3xl"
        style={{ fontFamily: "'Imprint MT Shadow', Georgia, serif" }}
      >
        Price
      </span>
      <span 
        className="text-3xl md:text-4xl text-[var(--pricex-yellow)]"
        style={{ fontFamily: "'Forte', cursive" }}
      >
        X
      </span>
    </span>
  );
}
