'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';
import { FvButton } from '@/components/ui/fv-button';

const TR = {
  kicker: 'Otomatik değerlendirme',
  title: 'Veri setiniz ne kadar FAIR?',
  sub: 'DOI girin, F-UJI motoru 16 metrik üzerinden saniyeler içinde puanlasın.',
  h: 'DOI girin, saniyeler içinde puan alın.',
  p: 'Sonuç olarak harf bazlı puanlar, eksik kriterler ve düzeltme rehberi alacaksınız. JSON-LD, DataCite XML ve PDF formatlarında dışa aktarın.',
  btn: 'Değerlendir',
  meta: 'Ortalama süre: 8–12 saniye · F-UJI v3.2 · 16 alt kriter',
  exLabel: 'Örnek değerlendirme',
  exTotal: 'Toplam FAIR puanı',
};

const EN = {
  kicker: 'Automated assessment',
  title: 'How FAIR is your dataset?',
  sub: 'Enter a DOI — the F-UJI-powered assessor scores 16 metrics in seconds.',
  h: 'Enter a DOI, get a score in seconds.',
  p: 'You receive letter-level scores, missing criteria and remediation guidance. Export to JSON-LD, DataCite XML and PDF.',
  btn: 'Assess',
  meta: 'Avg. duration: 8–12 seconds · F-UJI v3.2 · 16 sub-criteria',
  exLabel: 'Sample assessment',
  exTotal: 'Total FAIR score',
};

const SCORES: Array<{ letter: 'F' | 'A' | 'I' | 'R'; pct: number; bg: string; fg: string; dot: string }> = [
  { letter: 'F', pct: 80, bg: 'bg-f-bg', fg: 'text-f-fg', dot: 'bg-f-dot' },
  { letter: 'A', pct: 60, bg: 'bg-a-bg', fg: 'text-a-fg', dot: 'bg-a-dot' },
  { letter: 'I', pct: 40, bg: 'bg-i-bg', fg: 'text-i-fg', dot: 'bg-i-dot' },
  { letter: 'R', pct: 70, bg: 'bg-r-bg', fg: 'text-r-fg', dot: 'bg-r-dot' },
];

export function AssessmentTeaser() {
  const { language } = useLanguage();
  const router = useRouter();
  const s = language === 'en' ? EN : TR;
  const [value, setValue] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push((q ? `/assessment?doi=${encodeURIComponent(q)}` : '/assessment') as any);
  };

  return (
    <Section id="degerlendirme" kicker={s.kicker} title={s.title} description={s.sub}>
      <div className="grid grid-cols-1 gap-8 rounded-3xl border border-line bg-surface p-7 shadow-sm lg:grid-cols-2 lg:p-12">
        <div className="flex flex-col">
          <h3 className="mb-3 text-[clamp(20px,2.4vw,26px)] font-bold tracking-tight text-ink">
            {s.h}
          </h3>
          <p className="mb-6 text-[15px] leading-relaxed text-ink-2">{s.p}</p>
          <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="doi:10.5281/zenodo.7654321"
              className="flex-1 rounded-full border border-line bg-bg px-5 py-3 font-mono text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none"
              aria-label="DOI"
            />
            <FvButton type="submit">{s.btn}</FvButton>
          </form>
          <p className="mt-3 font-mono text-[12px] text-muted">{s.meta}</p>
        </div>

        <div className="rounded-2xl bg-bg-2 p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="font-mono text-[13px] text-ink">doi:10.5281/zenodo.7654321</div>
              <div className="mt-0.5 text-[12px] text-muted">{s.exLabel}</div>
            </div>
            <div className="text-right">
              <div className="text-[28px] font-bold leading-none tracking-tight text-ink">62.5%</div>
              <div className="mt-1 text-[12px] text-muted">{s.exTotal}</div>
            </div>
          </div>
          <div className="space-y-3">
            {SCORES.map((row) => (
              <div key={row.letter} className="grid grid-cols-[28px_1fr_44px] items-center gap-3">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-md ${row.bg} ${row.fg} font-mono text-[13px] font-bold`}
                >
                  {row.letter}
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-line">
                  <span
                    className={`block h-full rounded-full ${row.dot} transition-[width] duration-700 ease-out`}
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-right font-mono text-[13px] text-ink-2">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
