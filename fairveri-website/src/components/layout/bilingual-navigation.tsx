'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { useLanguage, useTranslation } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { FairveriLogo } from '@/components/ui/fairveri-logo';

type NavLink = { href: string; tr: string; en: string };

const NAV_LINKS: NavLink[] = [
  { href: '/principles', tr: 'FAIR nedir?', en: 'What is FAIR?' },
  { href: '/roadmap', tr: 'Tarihçe', en: 'History' },
  { href: '/resources', tr: 'Kaynaklar', en: 'Resources' },
  { href: '/faq', tr: 'SSS', en: 'FAQ' },
];

function tx(t: (k: string, p?: any) => any, key: string, fallback: string) {
  const v = t(key);
  return !v || v === key ? fallback : v;
}

export default function BilingualNavigation() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { actualTheme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[var(--topbar-bg)] backdrop-blur-md backdrop-saturate-[180%]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_auto] items-center gap-4 px-[var(--gutter)] py-3.5 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <Link
          href="/"
          className="inline-flex items-center justify-self-start no-underline"
          aria-label="fairveri"
        >
          <FairveriLogo size={32} />
        </Link>

        <nav aria-label="Main" className="hidden justify-self-center md:flex">
          <ul className="flex list-none gap-6 p-0">
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href as any}
                    className={`px-0.5 py-1.5 text-sm font-medium no-underline transition-colors ${
                      active ? 'text-ink' : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {language === 'en' ? l.en : l.tr}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-self-end gap-2 md:gap-3">
          <Link
            href={'/search' as any}
            aria-label={tx(t, 'common.search', 'Ara')}
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 hover:bg-bg-2 hover:text-ink md:inline-flex"
          >
            <Search className="h-4 w-4" />
          </Link>

          <div className="hidden items-center gap-0.5 rounded-full bg-bg-2 p-[3px] text-[13px] font-medium sm:inline-flex">
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              aria-pressed={language === 'tr'}
              className={`rounded-full px-3 py-[5px] transition-all ${
                language === 'tr'
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              TR
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              className={`rounded-full px-3 py-[5px] transition-all ${
                language === 'en'
                  ? 'bg-surface text-ink shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              EN
            </button>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 hover:bg-bg-2 hover:text-ink"
          >
            {actualTheme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <Link
            href={'/assessment' as any}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-bg transition-all hover:-translate-y-px hover:shadow-md sm:inline-flex"
          >
            {tx(t, 'homepage.hero.ctaStart', 'Değerlendir')}
          </Link>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 md:hidden"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav aria-label="Mobile" className="px-[var(--gutter)] py-3">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href as any}
                    className="block rounded-md px-3 py-2 text-sm font-medium text-ink-2 hover:bg-bg-2 hover:text-ink"
                  >
                    {language === 'en' ? l.en : l.tr}
                  </Link>
                </li>
              ))}
              <li className="mt-2 flex items-center gap-2 sm:hidden">
                <button
                  type="button"
                  onClick={() => setLanguage('tr')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    language === 'tr' ? 'bg-surface text-ink shadow-xs' : 'bg-bg-2 text-muted'
                  }`}
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                    language === 'en' ? 'bg-surface text-ink shadow-xs' : 'bg-bg-2 text-muted'
                  }`}
                >
                  EN
                </button>
                <Link
                  href={'/assessment' as any}
                  className="ml-auto inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg"
                >
                  {tx(t, 'homepage.hero.ctaStart', 'Değerlendir')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
