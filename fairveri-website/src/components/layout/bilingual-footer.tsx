'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/language-context';
import { FairveriLogo } from '@/components/ui/fairveri-logo';

function tx(t: (k: string, p?: any) => any, key: string, fallback: string) {
  const v = t(key);
  return !v || v === key ? fallback : v;
}

type Col = { heading: string; links: { href: string; label: string }[] };

export function BilingualFooter() {
  const { t } = useTranslation();

  const cols: Col[] = [
    {
      heading: tx(t, 'footer.fairPrinciples', 'Prensipler'),
      links: [
        { href: '/principles#findable', label: tx(t, 'fair.findable.title', 'Findable') },
        { href: '/principles#accessible', label: tx(t, 'fair.accessible.title', 'Accessible') },
        { href: '/principles#interoperable', label: tx(t, 'fair.interoperable.title', 'Interoperable') },
        { href: '/principles#reusable', label: tx(t, 'fair.reusable.title', 'Reusable') },
      ],
    },
    {
      heading: tx(t, 'footer.toolsAndResources', 'Araçlar'),
      links: [
        { href: '/assessment', label: tx(t, 'footer.links.dataAssessment', 'Değerlendirme') },
        { href: '/tools', label: tx(t, 'footer.links.assessmentTools', 'Araçlar') },
        { href: '/resources', label: tx(t, 'footer.links.resourceLibrary', 'Repo dizini') },
        { href: '/learn', label: tx(t, 'footer.links.learningGuide', 'Öğrenme rehberi') },
      ],
    },
    {
      heading: tx(t, 'footer.supportAndInfo', 'Hakkında'),
      links: [
        { href: '/partners', label: tx(t, 'navigation.partners', 'Ekip') },
        { href: '/contact', label: tx(t, 'footer.links.contact', 'İletişim') },
        { href: '/faq', label: tx(t, 'footer.links.frequentlyAsked', 'SSS') },
        { href: '/glossary', label: tx(t, 'navigation.glossary', 'Sözlük') },
      ],
    },
  ];

  const aboutText = tx(
    t,
    'footer.description',
    "Türkiye'de açık bilim ve FAIR veri prensipleri için bağımsız bir Türkçe rehber. Üniversiteler, kütüphaneler ve araştırma merkezleri için."
  );
  const copyright = tx(t, 'footer.copyright', '© 2026 fairveri · CC BY 4.0');
  const tagline = tx(t, 'footer.tagline', "İstanbul'da hazırlandı · Açık kaynak");

  return (
    <footer className="border-t border-line bg-bg">
      <div className="wrap py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center no-underline" aria-label="fairveri">
              <FairveriLogo size={44} />
            </Link>
            <p className="text-sm leading-relaxed text-ink-2">{aboutText}</p>
          </div>

          {cols.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h5 className="text-[13px] font-semibold uppercase tracking-wider text-muted">
                {col.heading}
              </h5>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href + l.label}>
                    <Link
                      href={l.href as any}
                      className="text-sm text-ink-2 no-underline transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center">
          <span>{copyright}</span>
          <span>{tagline}</span>
        </div>
      </div>
    </footer>
  );
}
