/**
 * PriceX - Footer Component
 * Premium footer with localization and legal links
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Twitter, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube,
  Mail,
  MapPin,
  Phone
} from 'lucide-react';
import { PriceXLogoCompact } from '@/components/ui/PriceXLogo';
import { useLanguage } from '@/context/LanguageContext';
import { useRegion } from '@/context/RegionContext';

export function Footer() {
  const { t, isRTL } = useLanguage();
  const { selectedCountry } = useRegion();

  const footerLinks = {
    company: [
      { label: t('footer.about'), href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: t('footer.contact'), href: '/contact' },
      { label: 'Help Center', href: '/help' },
      { label: 'FAQs', href: '/faqs' },
      { label: 'Feedback', href: '/feedback' },
    ],
    legal: [
      { label: t('footer.privacy'), href: '/privacy' },
      { label: t('footer.terms'), href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Accessibility', href: '/accessibility' },
    ],
    partners: [
      { label: 'For Retailers', href: '/retailers' },
      { label: 'For Brands', href: '/brands' },
      { label: 'Advertise', href: '/advertise' },
      { label: 'API Access', href: '/api' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/pricex', label: 'Twitter' },
    { icon: Facebook, href: 'https://facebook.com/pricex', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/pricex', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/pricex', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/pricex', label: 'YouTube' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className={`py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <PriceXLogoCompact />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Global AI-Powered Pricing Authority. Enterprise-grade price intelligence trusted by millions worldwide.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-muted-foreground">
              <a href="mailto:support@pricex.com" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                support@pricex.com
              </a>
              <a href="tel:+1-800-PRICEX" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +1-800-PRICEX
              </a>
              {selectedCountry && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedCountry.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Partners Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Partners</h4>
            <ul className="space-y-2">
              {footerLinks.partners.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`text-center md:text-left ${isRTL ? 'md:text-right' : ''}`}>
              <h4 className="font-semibold mb-1">Stay Updated</h4>
              <p className="text-sm text-muted-foreground">Get the latest deals and price drops delivered to your inbox.</p>
            </div>
            <div className={`flex gap-2 w-full md:w-auto ${isRTL ? 'flex-row-reverse' : ''}`}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 h-10 px-4 rounded-lg bg-background border border-border focus:border-[var(--pricex-yellow)] focus:ring-2 focus:ring-[var(--pricex-yellow)]/20 outline-none text-sm"
              />
              <button className="h-10 px-6 bg-[var(--pricex-yellow)] text-black font-semibold rounded-lg hover:bg-[var(--pricex-yellow-dark)] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className={`flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} PriceX. All rights reserved.
            </p>

            {/* Social Links */}
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
