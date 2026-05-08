'use client';

import { useLanguage } from '@/contexts/language-context';
import { FvLinkButton } from '@/components/ui/fv-button';

const TR = {
  h: 'Bugün başlayın. Yarınki araştırmanız için.',
  b1: 'Değerlendirmeyi başlat',
};

const EN = {
  h: "Start today. For tomorrow's research.",
  b1: 'Start the assessment',
};

export function CtaBand() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <section className="section-y">
      <div className="wrap">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-8 py-12 text-center text-bg shadow-md sm:px-16 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 30% 20%, rgba(13, 138, 91, 0.35), transparent 55%), radial-gradient(circle at 75% 80%, rgba(47, 93, 213, 0.35), transparent 55%)',
            }}
          />
          <div className="relative z-10 mx-auto flex max-w-[680px] flex-col items-center gap-6 sm:flex-row sm:justify-between sm:text-left">
            <h3 className="text-balance text-[clamp(22px,3vw,32px)] font-bold leading-tight tracking-tight text-bg">
              {s.h}
            </h3>
            <FvLinkButton
              href="/assessment"
              size="lg"
              className="!bg-bg !text-ink hover:!bg-bg/90"
            >
              {s.b1} →
            </FvLinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}
