import type { Metadata, Viewport } from "next";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://pricex.com'),
  title: {
    default: "PriceX - Global AI-Powered Pricing Authority",
    template: "%s | PriceX - Global Pricing Authority",
  },
  description: "PriceX - The Global AI-Powered Pricing Authority. Enterprise-grade price intelligence trusted by millions worldwide. Compare prices from millions of products across 50+ retailers with AI-powered predictions.",
  keywords: [
    "price comparison",
    "AI price prediction",
    "best prices",
    "price tracker",
    "price alerts",
    "shopping",
    "deals",
    "discounts",
    "AI shopping assistant",
    "global prices",
    "enterprise pricing",
    "price intelligence",
  ],
  authors: [{ name: "PriceX" }],
  creator: "PriceX",
  publisher: "PriceX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pricex.com",
    siteName: "PriceX",
    title: "PriceX - Global AI-Powered Price Comparison",
    description: "Compare prices from millions of products across thousands of retailers worldwide. Save money with smart alerts and real-time price tracking.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PriceX - Global Price Comparison Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PriceX - Global AI-Powered Price Comparison",
    description: "Compare prices from millions of products across thousands of retailers worldwide.",
    images: ["/og-image.jpg"],
    creator: "@pricex",
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://pricex.com",
    languages: {
      "en": "https://pricex.com/en",
      "ar": "https://pricex.com/ar",
      "es": "https://pricex.com/es",
      "fr": "https://pricex.com/fr",
      "it": "https://pricex.com/it",
      "zh": "https://pricex.com/zh",
      "tr": "https://pricex.com/tr",
      "ru": "https://pricex.com/ru",
      "pt": "https://pricex.com/pt",
      "ur": "https://pricex.com/ur",
      "hi": "https://pricex.com/hi",
      "ko": "https://pricex.com/ko",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFD700" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
