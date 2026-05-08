'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/language-context';
import { PRINCIPLES } from '@/data/principles';

const colorClasses: Record<string, { bg: string; fg: string }> = {
  f: { bg: 'bg-f-bg', fg: 'text-f-fg' },
  a: { bg: 'bg-a-bg', fg: 'text-a-fg' },
  i: { bg: 'bg-i-bg', fg: 'text-i-fg' },
  r: { bg: 'bg-r-bg', fg: 'text-r-fg' },
};

export function PrinciplePreviewGrid() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'tr';

  return (
    <div className="wrap pb-[clamp(40px,6vw,80px)]">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        {PRINCIPLES.map((p) => {
          const c = colorClasses[p.color];
          return (
            <Link
              key={p.letter}
              href="#prensipler"
              className={`group block rounded-2xl border border-line bg-surface p-6 no-underline shadow-xs transition-all duration-200 hover:-translate-y-[3px] hover:border-line-2 hover:shadow-md`}
            >
              <div
                className={`mb-4 grid h-12 w-12 place-items-center rounded-xl ${c.bg} ${c.fg} font-mono text-[22px] font-extrabold leading-none`}
                aria-hidden
              >
                {p.letter}
              </div>
              <h3 className="mb-1.5 text-[18px] font-semibold text-ink">{p.word}</h3>
              <p className="text-sm leading-relaxed text-ink-2">{p.preview[lang]}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
