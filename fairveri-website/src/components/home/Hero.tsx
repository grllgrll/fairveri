'use client';

import { useLanguage } from '@/contexts/language-context';
import { FvLinkButton } from '@/components/ui/fv-button';

const TR = {
  h1a: 'Araştırma verileriniz',
  h1b: 'FAIR olsun.',
  lede: 'Türkçe rehber, otomatik değerlendirme ve uygulama şablonları — akademisyenler, kütüphaneciler ve veri yöneticileri için.',
  cta1: 'Verinizi değerlendirin →',
  cta2: 'Prensipleri keşfedin',
};

const EN = {
  h1a: 'Make your research data',
  h1b: 'truly FAIR.',
  lede: 'A Turkish guide, automated assessment and ready-to-use templates — for researchers, librarians and data stewards.',
  cta1: 'Assess your dataset →',
  cta2: 'Explore the principles',
};

export function Hero() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <section id="top" className="relative pt-[clamp(56px,9vw,112px)] pb-[clamp(40px,6vw,64px)]">
      <div className="wrap">
        <div className="mx-auto max-w-[820px] text-center">
          <h1 className="mb-6 text-balance text-[clamp(40px,6.5vw,72px)] font-bold leading-[1.05] tracking-[-0.035em] text-ink">
            <span>{s.h1a}</span>{' '}
            <span className="text-brand">{s.h1b}</span>
          </h1>
          <p className="mx-auto mb-8 max-w-[640px] text-pretty text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-ink-2">
            {s.lede}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <FvLinkButton href="/assessment" variant="primary" size="lg">
              {s.cta1}
            </FvLinkButton>
            <FvLinkButton href="#prensipler" variant="ghost" size="lg">
              {s.cta2}
            </FvLinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
