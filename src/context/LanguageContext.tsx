/**
 * PriceX - Language Context Provider
 * Manages 12 languages with instant switching and RTL support
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Language, LanguageConfig, LANGUAGES } from '@/types';

interface LanguageContextType {
  currentLanguage: Language;
  currentLanguageConfig: LanguageConfig;
  setLanguage: (lang: Language) => void;
  availableLanguages: LanguageConfig[];
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  t: (key: string, fallback?: string) => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'pricex-language-prefs';
const DEFAULT_LANGUAGE: Language = 'en';

// Translation dictionaries (simplified - in production, load from JSON files)
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'PriceX',
    'app.tagline': 'Global AI-Powered Price Comparison',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.categories': 'Categories',
    'nav.deals': 'Hot Deals',
    'nav.alerts': 'Price Alerts',
    'nav.account': 'My Account',
    'search.placeholder': 'Search products, brands, or categories...',
    'search.button': 'Search',
    'region.select': 'Select Region',
    'region.current': 'Current Region',
    'country.select': 'Select Country',
    'language.select': 'Select Language',
    'currency.select': 'Select Currency',
    'product.compare': 'Compare Prices',
    'product.priceHistory': 'Price History',
    'product.alert': 'Set Alert',
    'footer.about': 'About PriceX',
    'footer.contact': 'Contact Us',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },
  ar: {
    'app.name': 'PriceX',
    'app.tagline': 'منصة المقارنة العالمية للأسعار بالذكاء الاصطناعي',
    'nav.home': 'الرئيسية',
    'nav.search': 'بحث',
    'nav.categories': 'الفئات',
    'nav.deals': 'عروض ساخنة',
    'nav.alerts': 'تنبيهات الأسعار',
    'nav.account': 'حسابي',
    'search.placeholder': 'ابحث عن منتجات أو علامات تجارية أو فئات...',
    'search.button': 'بحث',
    'region.select': 'اختر المنطقة',
    'region.current': 'المنطقة الحالية',
    'country.select': 'اختر الدولة',
    'language.select': 'اختر اللغة',
    'currency.select': 'اختر العملة',
    'product.compare': 'قارن الأسعار',
    'product.priceHistory': 'تاريخ الأسعار',
    'product.alert': 'تعيين تنبيه',
    'footer.about': 'عن PriceX',
    'footer.contact': 'اتصل بنا',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.terms': 'شروط الخدمة',
  },
  es: {
    'app.name': 'PriceX',
    'app.tagline': 'Comparación Global de Precios con IA',
    'nav.home': 'Inicio',
    'nav.search': 'Buscar',
    'nav.categories': 'Categorías',
    'nav.deals': 'Ofertas',
    'nav.alerts': 'Alertas de Precio',
    'nav.account': 'Mi Cuenta',
    'search.placeholder': 'Buscar productos, marcas o categorías...',
    'search.button': 'Buscar',
    'region.select': 'Seleccionar Región',
    'region.current': 'Región Actual',
    'country.select': 'Seleccionar País',
    'language.select': 'Seleccionar Idioma',
    'currency.select': 'Seleccionar Moneda',
    'product.compare': 'Comparar Precios',
    'product.priceHistory': 'Historial de Precios',
    'product.alert': 'Establecer Alerta',
    'footer.about': 'Sobre PriceX',
    'footer.contact': 'Contacto',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
  },
  fr: {
    'app.name': 'PriceX',
    'app.tagline': 'Comparaison de Prix Mondiale IA',
    'nav.home': 'Accueil',
    'nav.search': 'Rechercher',
    'nav.categories': 'Catégories',
    'nav.deals': 'Offres',
    'nav.alerts': 'Alertes Prix',
    'nav.account': 'Mon Compte',
    'search.placeholder': 'Rechercher des produits, marques ou catégories...',
    'search.button': 'Rechercher',
    'region.select': 'Sélectionner Région',
    'region.current': 'Région Actuelle',
    'country.select': 'Sélectionner Pays',
    'language.select': 'Sélectionner Langue',
    'currency.select': 'Sélectionner Devise',
    'product.compare': 'Comparer Prix',
    'product.priceHistory': 'Historique Prix',
    'product.alert': 'Définir Alerte',
    'footer.about': 'À Propos',
    'footer.contact': 'Contact',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
  },
  it: {
    'app.name': 'PriceX',
    'app.tagline': 'Confronto Prezzi Globale AI',
    'nav.home': 'Home',
    'nav.search': 'Cerca',
    'nav.categories': 'Categorie',
    'nav.deals': 'Offerte',
    'nav.alerts': 'Alert Prezzi',
    'nav.account': 'Account',
    'search.placeholder': 'Cerca prodotti, marchi o categorie...',
    'search.button': 'Cerca',
    'region.select': 'Seleziona Regione',
    'region.current': 'Regione Corrente',
    'country.select': 'Seleziona Paese',
    'language.select': 'Seleziona Lingua',
    'currency.select': 'Seleziona Valuta',
    'product.compare': 'Confronta Prezzi',
    'product.priceHistory': 'Storico Prezzi',
    'product.alert': 'Imposta Alert',
    'footer.about': 'Chi Siamo',
    'footer.contact': 'Contatti',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Termini',
  },
  zh: {
    'app.name': 'PriceX',
    'app.tagline': '全球AI驱动价格比较平台',
    'nav.home': '首页',
    'nav.search': '搜索',
    'nav.categories': '分类',
    'nav.deals': '热门优惠',
    'nav.alerts': '价格提醒',
    'nav.account': '我的账户',
    'search.placeholder': '搜索产品、品牌或分类...',
    'search.button': '搜索',
    'region.select': '选择地区',
    'region.current': '当前地区',
    'country.select': '选择国家',
    'language.select': '选择语言',
    'currency.select': '选择货币',
    'product.compare': '比较价格',
    'product.priceHistory': '价格历史',
    'product.alert': '设置提醒',
    'footer.about': '关于PriceX',
    'footer.contact': '联系我们',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',
  },
  tr: {
    'app.name': 'PriceX',
    'app.tagline': 'Küresel AI Fiyat Karşılaştırma',
    'nav.home': 'Ana Sayfa',
    'nav.search': 'Ara',
    'nav.categories': 'Kategoriler',
    'nav.deals': 'Fırsatlar',
    'nav.alerts': 'Fiyat Uyarıları',
    'nav.account': 'Hesabım',
    'search.placeholder': 'Ürün, marka veya kategori ara...',
    'search.button': 'Ara',
    'region.select': 'Bölge Seç',
    'region.current': 'Mevcut Bölge',
    'country.select': 'Ülke Seç',
    'language.select': 'Dil Seç',
    'currency.select': 'Para Birimi Seç',
    'product.compare': 'Fiyat Karşılaştır',
    'product.priceHistory': 'Fiyat Geçmişi',
    'product.alert': 'Uyarı Ayarla',
    'footer.about': 'Hakkımızda',
    'footer.contact': 'İletişim',
    'footer.privacy': 'Gizlilik',
    'footer.terms': 'Kullanım Şartları',
  },
  ru: {
    'app.name': 'PriceX',
    'app.tagline': 'Глобальная платформа сравнения цен с ИИ',
    'nav.home': 'Главная',
    'nav.search': 'Поиск',
    'nav.categories': 'Категории',
    'nav.deals': 'Горящие предложения',
    'nav.alerts': 'Ценовые оповещения',
    'nav.account': 'Мой аккаунт',
    'search.placeholder': 'Поиск товаров, брендов или категорий...',
    'search.button': 'Поиск',
    'region.select': 'Выбрать регион',
    'region.current': 'Текущий регион',
    'country.select': 'Выбрать страну',
    'language.select': 'Выбрать язык',
    'currency.select': 'Выбрать валюту',
    'product.compare': 'Сравнить цены',
    'product.priceHistory': 'История цен',
    'product.alert': 'Установить оповещение',
    'footer.about': 'О PriceX',
    'footer.contact': 'Контакты',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.terms': 'Условия использования',
  },
  pt: {
    'app.name': 'PriceX',
    'app.tagline': 'Comparação Global de Preços com IA',
    'nav.home': 'Início',
    'nav.search': 'Pesquisar',
    'nav.categories': 'Categorias',
    'nav.deals': 'Ofertas',
    'nav.alerts': 'Alertas de Preço',
    'nav.account': 'Minha Conta',
    'search.placeholder': 'Pesquisar produtos, marcas ou categorias...',
    'search.button': 'Pesquisar',
    'region.select': 'Selecionar Região',
    'region.current': 'Região Atual',
    'country.select': 'Selecionar País',
    'language.select': 'Selecionar Idioma',
    'currency.select': 'Selecionar Moeda',
    'product.compare': 'Comparar Preços',
    'product.priceHistory': 'Histórico de Preços',
    'product.alert': 'Definir Alerta',
    'footer.about': 'Sobre PriceX',
    'footer.contact': 'Contato',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
  },
  ur: {
    'app.name': 'PriceX',
    'app.tagline': 'عالمی AI قیمت موازنہ پلیٹ فارم',
    'nav.home': 'ہوم',
    'nav.search': 'تلاش',
    'nav.categories': 'زمرہ جات',
    'nav.deals': 'ہاٹ ڈیلز',
    'nav.alerts': 'قیمت الرٹس',
    'nav.account': 'میرا اکاؤنٹ',
    'search.placeholder': 'مصنوعات، برانڈز یا زمرہ جات تلاش کریں...',
    'search.button': 'تلاش',
    'region.select': 'علاقہ منتخب کریں',
    'region.current': 'موجودہ علاقہ',
    'country.select': 'ملک منتخب کریں',
    'language.select': 'زبان منتخب کریں',
    'currency.select': 'کرنسی منتخب کریں',
    'product.compare': 'قیمتوں کا موازنہ',
    'product.priceHistory': 'قیمت کی تاریخ',
    'product.alert': 'الرٹ سیٹ کریں',
    'footer.about': 'PriceX کے بارے میں',
    'footer.contact': 'رابطہ کریں',
    'footer.privacy': 'رازداری کی پالیسی',
    'footer.terms': 'سروس کی شرائط',
  },
  hi: {
    'app.name': 'PriceX',
    'app.tagline': 'वैश्विक AI मूल्य तुलना प्लेटफॉर्म',
    'nav.home': 'होम',
    'nav.search': 'खोज',
    'nav.categories': 'श्रेणियाँ',
    'nav.deals': 'हॉट डील्स',
    'nav.alerts': 'मूल्य अलर्ट',
    'nav.account': 'मेरा खाता',
    'search.placeholder': 'उत्पाद, ब्रांड या श्रेणियाँ खोजें...',
    'search.button': 'खोज',
    'region.select': 'क्षेत्र चुनें',
    'region.current': 'वर्तमान क्षेत्र',
    'country.select': 'देश चुनें',
    'language.select': 'भाषा चुनें',
    'currency.select': 'मुद्रा चुनें',
    'product.compare': 'मूल्य तुलना',
    'product.priceHistory': 'मूल्य इतिहास',
    'product.alert': 'अलर्ट सेट करें',
    'footer.about': 'PriceX के बारे में',
    'footer.contact': 'संपर्क करें',
    'footer.privacy': 'गोपनीयता नीति',
    'footer.terms': 'सेवा की शर्तें',
  },
  ko: {
    'app.name': 'PriceX',
    'app.tagline': '글로벌 AI 기반 가격 비교 플랫폼',
    'nav.home': '홈',
    'nav.search': '검색',
    'nav.categories': '카테고리',
    'nav.deals': '핫딜',
    'nav.alerts': '가격 알림',
    'nav.account': '내 계정',
    'search.placeholder': '제품, 브랜드 또는 카테고리 검색...',
    'search.button': '검색',
    'region.select': '지역 선택',
    'region.current': '현재 지역',
    'country.select': '국가 선택',
    'language.select': '언어 선택',
    'currency.select': '통화 선택',
    'product.compare': '가격 비교',
    'product.priceHistory': '가격 기록',
    'product.alert': '알림 설정',
    'footer.about': 'PriceX 소개',
    'footer.contact': '문의하기',
    'footer.privacy': '개인정보 처리방침',
    'footer.terms': '서비스 이용약관',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  const currentLanguageConfig = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  const isRTL = currentLanguageConfig.direction === 'rtl';
  const direction = currentLanguageConfig.direction;

  // Load language preference from localStorage
  useEffect(() => {
    const loadLanguage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const lang = stored as Language;
          if (LANGUAGES.some(l => l.code === lang)) {
            setCurrentLanguage(lang);
          }
        } else {
          // Try to detect browser language
          const browserLang = navigator.language.split('-')[0] as Language;
          if (LANGUAGES.some(l => l.code === browserLang)) {
            setCurrentLanguage(browserLang);
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);

  // Update document direction when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage, direction]);

  const setLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const translation = translations[currentLanguage]?.[key];
    if (translation) return translation;
    
    // Fallback to English
    const englishTranslation = translations.en[key];
    if (englishTranslation) return englishTranslation;
    
    return fallback || key;
  }, [currentLanguage]);

  const value: LanguageContextType = {
    currentLanguage,
    currentLanguageConfig,
    setLanguage,
    availableLanguages: LANGUAGES,
    isRTL,
    direction,
    t,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
