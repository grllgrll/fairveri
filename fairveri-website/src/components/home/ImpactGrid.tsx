'use client';

import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';

const TR = {
  kicker: 'Neden FAIR?',
  title: 'Açık bilim için somut kazanım.',
  sub: 'Horizon Europe ve TÜBİTAK dahil büyük fon sağlayıcıları artık veri yönetim planı talep ediyor.',
  tiles: [
    { feat: true, micro: 'AB · 2018 raporu', big: '€10.2', unit: 'milyar', body: "FAIR olmayan araştırma verileri nedeniyle Avrupa'da kaybedilen yıllık ekonomik değer." },
    { micro: 'Atıf etkisi', big: '+25', unit: '%', body: 'FAIR ile yayımlanan makaleler ortalama olarak daha fazla atıf alır.' },
    { micro: 'Zaman maliyeti', big: '5–10', unit: '%', body: 'Proje başında planlandığında getirdiği toplam ek süre yükü.' },
    { micro: 'ORCID benimseme', big: '22M', unit: '+', body: 'Küresel olarak kayıtlı araştırmacı kalıcı kimliği.' },
    { micro: 'Veri deposu', big: '3.800', unit: '+', body: 're3data.org dizininde listelenen kayıtlı veri havuzu.' },
    { feat: true, micro: 'Fon zorunluluğu · 2026', big: '94', unit: '%', body: 'Avrupa fon sağlayıcıları artık veri yönetim planı (VYP) talep ediyor — Horizon Europe, ERC ve AB ulusal ajansları dahil.' },
  ],
};

const EN = {
  kicker: 'Why FAIR?',
  title: 'Concrete value for open science.',
  sub: 'Horizon Europe and TUBITAK now require Data Management Plans from funded projects.',
  tiles: [
    { feat: true, micro: 'EU · 2018 report', big: '€10.2', unit: 'billion', body: 'Annual economic value lost in Europe due to research data that is not FAIR.' },
    { micro: 'Citation impact', big: '+25', unit: '%', body: 'Articles published with FAIR data receive more citations on average.' },
    { micro: 'Time cost', big: '5–10', unit: '%', body: 'Total overhead added when planned at the start of a project.' },
    { micro: 'ORCID adoption', big: '22M', unit: '+', body: 'Researcher persistent identifiers registered globally.' },
    { micro: 'Data repositories', big: '3,800', unit: '+', body: 'Registered repositories listed in the re3data.org index.' },
    { feat: true, micro: 'Funder mandates · 2026', big: '94', unit: '%', body: 'European funders now require Data Management Plans — Horizon Europe, ERC and EU national agencies included.' },
  ],
};

export function ImpactGrid() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <Section id="neden" kicker={s.kicker} title={s.title} description={s.sub} bg="soft">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {s.tiles.map((t, i) => (
          <div
            key={i}
            className={`rounded-2xl border border-line bg-surface p-7 shadow-xs ${
              t.feat ? 'lg:col-span-2' : ''
            }`}
          >
            <div className="mb-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
              {t.micro}
            </div>
            <div className="mb-3 flex items-baseline gap-1.5 text-[clamp(36px,5vw,56px)] font-bold leading-none tracking-tight text-ink">
              {t.big}
              <span className="text-[clamp(16px,2vw,20px)] font-medium text-ink-2">{t.unit}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-ink-2">{t.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
