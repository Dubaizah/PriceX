"use client";

import { useEffect, useRef } from "react";
import { adManager, AD_PLACEMENTS } from "@/lib/monetization/config";

interface AdDisplayProps {
  placementId: string;
  className?: string;
}

export function AdDisplay({ placementId, className = "" }: AdDisplayProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const placement = AD_PLACEMENTS.find((p) => p.id === placementId);
    if (!placement) return;

    adManager.lazyLoadAd(placementId, adRef.current);
  }, [placementId]);

  const placement = AD_PLACEMENTS.find((p) => p.id === placementId);
  if (!placement) return null;

  const sizeClasses = getSizeClasses(placement.size);

  return (
    <div
      ref={adRef}
      className={`ad-container ${sizeClasses} ${className}`}
      data-placement={placementId}
      data-format={placement.format}
    >
      <div className="ad-label text-xs text-gray-500 mb-1">Advertisement</div>
      <div
        className="ad-slot bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
        style={{
          minHeight: placement.format.includes("banner") ? "90px" : "250px",
        }}
      >
        <span className="text-gray-400 text-sm">
          {placement.format.replace("_", " ").toUpperCase()}
        </span>
      </div>
    </div>
  );
}

function getSizeClasses(size: string): string {
  if (size.includes("970x250")) return "w-full max-w-[970px]";
  if (size.includes("728x90")) return "w-full max-w-[728px]";
  if (size.includes("300x600")) return "w-[300px]";
  if (size.includes("300x250")) return "w-[300px]";
  if (size.includes("320x50")) return "w-[320px]";
  if (size === "responsive") return "w-full";
  return "w-full";
}

export function StickyFooterAd() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <AdDisplay placementId="mobile_sticky_bottom" />
    </div>
  );
}

export function SearchAds() {
  return (
    <div className="space-y-4">
      <AdDisplay placementId="search_top_banner" />
      <AdDisplay placementId="search_sidebar_skyscraper" />
    </div>
  );
}

export function NativeFeedAds({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {Array.from({ length: count }).map((_, i) => (
        <AdDisplay key={i} placementId="search_native_inline" />
      ))}
    </div>
  );
}
