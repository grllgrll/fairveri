'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export type Language = 'tr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number | boolean>) => any;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

// Translation cache
const translationsCache: Record<Language, Record<string, any>> = {
  tr: {},
  en: {}
};

export function LanguageProvider({ children, defaultLanguage = 'tr' }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load translations from localStorage and detect browser language on mount
  useEffect(() => {
    const loadInitialLanguage = async () => {
      // Check localStorage first
      const savedLanguage = localStorage.getItem('fairveri-language') as Language;
      let initialLanguage: Language;
      
      if (savedLanguage && ['tr', 'en'].includes(savedLanguage)) {
        initialLanguage = savedLanguage;
      } else {
        // Detect from browser language
        const browserLanguage = navigator.language.toLowerCase();
        initialLanguage = browserLanguage.startsWith('tr') ? 'tr' : 'en';
      }

      // Load translations for both languages before setting loading to false
      await Promise.all([
        loadTranslations('tr'),
        loadTranslations('en')
      ]);

      setLanguageState(initialLanguage);
      setIsLoading(false);
    };

    loadInitialLanguage();
  }, []);

  // Load translations dynamically
  const loadTranslations = async (lang: Language) => {
    if (translationsCache[lang] && Object.keys(translationsCache[lang]).length > 0) {
      return translationsCache[lang];
    }

    try {
      // Import translation files
      const translations = await import(`@/locales/${lang}.json`);
      translationsCache[lang] = translations.default;
      return translations.default;
    } catch (error) {
      // Failed to load translations - fallback to empty object
      return {};
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    setIsLoading(true);
    
    // Load translations for the new language
    await loadTranslations(newLanguage);
    
    setLanguageState(newLanguage);
    localStorage.setItem('fairveri-language', newLanguage);
    
    // Update document language
    document.documentElement.lang = newLanguage;
    
    // Announce language change to screen readers
    const announcement = newLanguage === 'tr' 
      ? 'Dil Türkçe olarak değiştirildi' 
      : 'Language changed to English';
    
    const event = new CustomEvent('screen-reader-announce', {
      detail: { 
        message: announcement, 
        options: { priority: 'assertive', delay: 500 }
      }
    });
    window.dispatchEvent(event);
    
    setIsLoading(false);
  };

  // Translation function with parameter substitution and object support
  const t = (key: string, params?: Record<string, string | number | boolean>): any => {
    const translations = translationsCache[language];
    
    if (!translations) {
      // Translations not loaded for language - fallback to key
      return key;
    }

    // Navigate nested keys (e.g., "navigation.home")
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Translation key not found - fallback to key
        return key;
      }
    }

    // Handle returnObjects option for arrays/objects
    if (params && params.returnObjects === true) {
      // Returning objects for key
      return value;
    }

    if (typeof value !== 'string') {
      // Return the raw value for non-string types when returnObjects is used
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        // Auto-returning non-string value
        return value;
      }
      // Translation value is not a string - returning as is
      return key;
    }

    // Replace parameters in the translation (only for strings)
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
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

// Hook for getting language-specific content
export function useTranslation() {
  const { t, language } = useLanguage();
  
  return {
    t,
    language,
    isRTL: false, // Neither Turkish nor English are RTL
    formatNumber: (num: number) => {
      return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US').format(num);
    },
    formatDate: (date: Date) => {
      return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    formatCurrency: (amount: number, currency = 'USD') => {
      return new Intl.NumberFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  };
}