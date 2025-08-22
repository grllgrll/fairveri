'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Menu, Group, Text, UnstyledButton } from '@mantine/core';
import { IconChevronDown, IconWorld, IconCheck } from '@tabler/icons-react';
import { useLanguage, Language } from '@/contexts/language-context';
import { motion, AnimatePresence } from 'framer-motion';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  }
];

interface LanguageSelectorProps {
  variant?: 'button' | 'dropdown' | 'compact';
  showFlags?: boolean;
  showNativeName?: boolean;
  className?: string;
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  showFlags = true, 
  showNativeName = true,
  className = '' 
}: LanguageSelectorProps) {
  const { language, setLanguage, isLoading } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (newLanguage: Language) => {
    if (newLanguage === language) return;
    
    setIsOpen(false);
    await setLanguage(newLanguage);
  };

  const handleKeyDown = (event: React.KeyboardEvent, lang: Language) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange(lang);
    }
  };

  if (variant === 'button') {
    return (
      <Group gap="xs" className={className}>
        {languages.map((lang) => (
          <Button
            key={lang.code}
            variant={language === lang.code ? 'filled' : 'outline'}
            size="sm"
            onClick={() => handleLanguageChange(lang.code)}
            disabled={isLoading}
            leftSection={showFlags ? <span>{lang.flag}</span> : <IconWorld size={16} />}
            style={{ minWidth: '80px' }}
            aria-label={`${lang.name} dilini seç`}
            aria-pressed={language === lang.code}
          >
            {showNativeName ? lang.nativeName : lang.code.toUpperCase()}
          </Button>
        ))}
      </Group>
    );
  }

  if (variant === 'compact') {
    return (
      <UnstyledButton
        onClick={() => handleLanguageChange(language === 'tr' ? 'en' : 'tr')}
        disabled={isLoading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
        aria-label={`Switch to ${language === 'tr' ? 'English' : 'Türkçe'}`}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <Text size="sm" fw={500}>
          {currentLanguage?.code.toUpperCase()}
        </Text>
      </UnstyledButton>
    );
  }

  // Default dropdown variant
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <UnstyledButton
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-w-[100px]"
        aria-label="Dil seçimi menüsünü aç"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        style={{ minHeight: '44px' }}
      >
        {showFlags && (
          <span className="text-lg" aria-hidden="true">
            {currentLanguage?.flag}
          </span>
        )}
        <Text size="sm" fw={500}>
          {showNativeName ? currentLanguage?.nativeName : currentLanguage?.code.toUpperCase()}
        </Text>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <IconChevronDown size={14} />
        </motion.div>
      </UnstyledButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[160px]"
            role="menu"
            aria-label="Dil seçenekleri"
          >
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <UnstyledButton
                  onClick={() => handleLanguageChange(lang.code)}
                  onKeyDown={(e) => handleKeyDown(e, lang.code)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  role="menuitem"
                  aria-current={language === lang.code ? 'true' : 'false'}
                  tabIndex={0}
                >
                  <Group gap="sm">
                    {showFlags && (
                      <span className="text-lg" aria-hidden="true">
                        {lang.flag}
                      </span>
                    )}
                    <div>
                      <Text size="sm" fw={language === lang.code ? 600 : 400}>
                        {lang.nativeName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {lang.name}
                      </Text>
                    </div>
                  </Group>
                  {language === lang.code && (
                    <IconCheck size={16} color="var(--mantine-color-green-6)" />
                  )}
                </UnstyledButton>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}