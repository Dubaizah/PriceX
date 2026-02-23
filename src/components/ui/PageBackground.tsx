/**
 * PriceX - Page Background Component
 * Dotted grid with zigzag lines pattern
 */

'use client';

export function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Base background color */}
      <div className="absolute inset-0 bg-white dark:bg-black" />
      
      {/* Gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-yellow-400/15 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-500/5 to-transparent rounded-full blur-[60px]" />
      </div>

      {/* Dotted Grid with Zigzag Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotZigzagPattern" width="90" height="90" patternUnits="userSpaceOnUse">
              {/* Vertical zigzag lines */}
              <path d="M 22.5 0 L 22.5 45 L 0 90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
              <path d="M 67.5 0 L 67.5 45 L 45 90" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
              {/* Horizontal zigzag lines */}
              <path d="M 0 22.5 L 45 45 L 90 22.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
              <path d="M 0 67.5 L 45 90 L 90 67.5" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-400 dark:text-yellow-500" opacity="0.15"/>
              {/* Dots at intersections */}
              <circle cx="22.5" cy="22.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
              <circle cx="67.5" cy="22.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
              <circle cx="22.5" cy="67.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
              <circle cx="67.5" cy="67.5" r="2.5" fill="currentColor" className="text-yellow-400 dark:text-yellow-500" opacity="0.35"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotZigzagPattern)" />
        </svg>
      </div>
    </div>
  );
}
