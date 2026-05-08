'use client';

import { useState } from 'react';
import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';
import { PRINCIPLES, type PrincipleLetter } from '@/data/principles';

const colorClasses: Record<string, { bg: string; fg: string; ring: string; dot: string }> = {
  f: { bg: 'bg-f-bg', fg: 'text-f-fg', ring: 'ring-f-dot', dot: 'bg-f-dot' },
  a: { bg: 'bg-a-bg', fg: 'text-a-fg', ring: 'ring-a-dot', dot: 'bg-a-dot' },
  i: { bg: 'bg-i-bg', fg: 'text-i-fg', ring: 'ring-i-dot', dot: 'bg-i-dot' },
  r: { bg: 'bg-r-bg', fg: 'text-r-fg', ring: 'ring-r-dot', dot: 'bg-r-dot' },
};

const TR = {
  kicker: 'Prensipler',
  title: 'Dört harfin tamamı, tek yerde.',
  sub: 'Her prensibe tıklayın — açıklamayı, alt kriterleri ve uygulama ipuçlarını okuyun. 15 alt kriter ile uluslararası standart.',
  critTitle: '15 ALT KRİTERDEN İLGİLİ OLANLAR',
  cmpNoBadge: 'Yanılgı',
  cmpNoKicker: 'FAIR ≠ Açık veri',
  cmpNoTitle: 'FAIR olmak, herkese açık olmak demek değildir',
  cmpNoItems: [
    'Erişim kısıtlamaları olabilir (KVKK, ticari sır, hasta verisi).',
    'Açık olmak FAIR olmayı, FAIR olmak da açık olmayı gerektirmez.',
    'Sadece dosya yüklemek yeterli değildir — meta veri ve kalıcı tanımlayıcı şarttır.',
  ],
  cmpYesBadge: 'Doğru',
  cmpYesKicker: 'FAIR demek',
  cmpYesTitle: 'Makinelerin de okuyabildiği, iyi betimlenmiş veri',
  cmpYesItems: [
    'Kalıcı tanımlayıcı (DOI) ve zengin, kontrollü meta veri.',
    'Standart protokoller (HTTPS, REST API), gerektiğinde kimlik doğrulama.',
    'Açık lisans (CC0, CC BY), köken bilgisi ve topluluk standartları.',
  ],
};

const EN = {
  kicker: 'Principles',
  title: 'All four letters, in one place.',
  sub: 'Click any principle — read the description, sub-criteria and implementation tips. 15 sub-criteria, an international standard.',
  critTitle: 'RELEVANT SUB-CRITERIA',
  cmpNoBadge: 'Misconception',
  cmpNoKicker: 'FAIR ≠ Open data',
  cmpNoTitle: 'Being FAIR does not mean being open to everyone',
  cmpNoItems: [
    'Access can be restricted (privacy law, trade secrets, patient data).',
    'Open does not require FAIR, and FAIR does not require open.',
    'Uploading a file is not enough — metadata and a persistent identifier are essential.',
  ],
  cmpYesBadge: 'Correct',
  cmpYesKicker: 'FAIR means',
  cmpYesTitle: 'Well-described data that machines can also read',
  cmpYesItems: [
    'Persistent identifier (DOI) and rich, controlled metadata.',
    'Standard protocols (HTTPS, REST API), authentication where needed.',
    'Open licence (CC0, CC BY), provenance and community standards.',
  ],
};

export function PrincipleExplorer() {
  const { language } = useLanguage();
  const lang = language === 'en' ? 'en' : 'tr';
  const s = lang === 'en' ? EN : TR;

  const [active, setActive] = useState<PrincipleLetter>('F');
  const principle = PRINCIPLES.find((p) => p.letter === active)!;
  const c = colorClasses[principle.color];

  return (
    <Section id="prensipler" kicker={s.kicker} title={s.title} description={s.sub}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr] lg:gap-10">
        <ul className="flex flex-col gap-2.5" role="tablist" aria-label="FAIR principles">
          {PRINCIPLES.map((p) => {
            const pc = colorClasses[p.color];
            const isActive = p.letter === active;
            return (
              <li key={p.letter}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${p.letter}`}
                  onClick={() => setActive(p.letter)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all ${
                    isActive
                      ? `${pc.bg} ${pc.fg} border-transparent shadow-md`
                      : 'border-line bg-surface text-ink-2 hover:-translate-y-[3px] hover:border-line-2 hover:shadow-sm'
                  }`}
                >
                  <span
                    className={`grid h-12 w-12 flex-none place-items-center rounded-xl font-mono text-[22px] font-extrabold leading-none ${
                      isActive ? 'bg-surface/40 text-current' : `${pc.bg} ${pc.fg}`
                    }`}
                  >
                    {p.letter}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold leading-tight">{p.word}</span>
                    <span className={`text-[13px] leading-tight ${isActive ? 'opacity-80' : 'text-muted'}`}>
                      {p.trWord}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div
          id={`panel-${principle.letter}`}
          role="tabpanel"
          className="rounded-2xl border border-line bg-surface p-7 shadow-xs lg:p-9"
        >
          <header className="mb-5 flex items-center gap-4">
            <div
              className={`grid h-14 w-14 place-items-center rounded-xl ${c.bg} ${c.fg} font-mono text-[26px] font-extrabold leading-none`}
              aria-hidden
            >
              {principle.letter}
            </div>
            <div>
              <div className="text-[22px] font-bold tracking-tight text-ink">{principle.word}</div>
              <div className="text-sm text-muted">{principle.trWord}</div>
            </div>
          </header>
          <p className="text-[15px] leading-relaxed text-ink-2">{principle.body[lang]}</p>
          <hr className="my-6 border-0 border-t border-line" />
          <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
            {s.critTitle}
          </div>
          <ul className="space-y-3">
            {principle.crits.map((crit) => (
              <li key={crit.id} className="flex items-start gap-3">
                <span
                  className={`flex-none rounded-md px-2 py-0.5 font-mono text-[12px] font-semibold ${c.bg} ${c.fg}`}
                >
                  {crit.id}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-2">{crit[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Compare grid */}
      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        <div className="rounded-2xl border border-line bg-surface p-7 shadow-xs">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-a-bg px-2.5 py-0.5 font-semibold text-a-fg">
              {s.cmpNoBadge}
            </span>
            <span className="text-muted">{s.cmpNoKicker}</span>
          </div>
          <h3 className="mb-4 text-[20px] font-semibold text-ink">{s.cmpNoTitle}</h3>
          <ul className="space-y-2.5">
            {s.cmpNoItems.map((it) => (
              <li key={it} className="flex items-start gap-3 text-[15px] text-ink-2">
                <span aria-hidden className="mt-0.5 flex-none font-bold text-a-dot">×</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-7 shadow-xs">
          <div className="mb-3 flex items-center gap-2 text-sm">
            <span className="rounded-full bg-i-bg px-2.5 py-0.5 font-semibold text-i-fg">
              {s.cmpYesBadge}
            </span>
            <span className="text-muted">{s.cmpYesKicker}</span>
          </div>
          <h3 className="mb-4 text-[20px] font-semibold text-ink">{s.cmpYesTitle}</h3>
          <ul className="space-y-2.5">
            {s.cmpYesItems.map((it) => (
              <li key={it} className="flex items-start gap-3 text-[15px] text-ink-2">
                <span aria-hidden className="mt-0.5 flex-none font-bold text-i-dot">✓</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
