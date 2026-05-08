'use client';

import { ExternalLink } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';

interface Step {
  year: string;
  title: string;
  body: string;
  href?: string;
  now?: boolean;
}

interface Strings {
  kicker: string;
  title: string;
  sub: string;
  steps: Step[];
}

const LINKS = {
  lorentz: 'https://www.lorentzcenter.nl/jointly-designing-a-data-fairport.html',
  paper: 'https://doi.org/10.1038/sdata.2016.18',
  goFair: 'https://www.go-fair.org/',
  sorbonne: 'https://www.leru.org/files/Sorbonne-declaration.pdf',
  aperta: 'https://aperta.ulakbim.gov.tr/',
};

const TR: Strings = {
  kicker: 'Tarihçe',
  title: "2014'ten bugüne FAIR.",
  sub: "FAIR prensiplerinin ortaya çıkışından Türkiye'deki güncel uygulamalarına kısa bir yolculuk.",
  steps: [
    { year: '2014', title: 'Lorentz Çalıştayı', body: '"Jointly designing a data fairport" çalıştayında kavram doğdu.', href: LINKS.lorentz },
    { year: '2016', title: 'Scientific Data yayını', body: 'Wilkinson ve ekibi 15 alt kriterli rehber ilkeleri yayımladı.', href: LINKS.paper },
    { year: '2017', title: 'GO FAIR girişimi', body: 'Almanya, Hollanda ve Fransa öncülüğünde uygulama topluluğu.', href: LINKS.goFair },
    { year: '2020', title: 'Sorbonne Deklarasyonu', body: "Dünya üniversiteleri FAIR'e bağlılıklarını ilan etti.", href: LINKS.sorbonne },
    { year: '2023', title: 'TÜBİTAK APERTA', body: "Türkiye'nin ulusal FAIR uyumlu deposu yaygınlaştı.", href: LINKS.aperta },
    { year: '2026', title: 'fairveri.com', body: 'Türkçe rehber, otomatik değerlendirme ve eğitim platformu.', now: true },
  ],
};

const EN: Strings = {
  kicker: 'History',
  title: 'FAIR, from 2014 to today.',
  sub: 'A short journey from the origin of FAIR principles to current practice in Turkey.',
  steps: [
    { year: '2014', title: 'Lorentz Workshop', body: 'The concept emerged at the "Jointly designing a data fairport" workshop.', href: LINKS.lorentz },
    { year: '2016', title: 'Scientific Data paper', body: 'Wilkinson et al. published the principles with 15 sub-criteria.', href: LINKS.paper },
    { year: '2017', title: 'GO FAIR initiative', body: 'Implementation community led by Germany, the Netherlands and France.', href: LINKS.goFair },
    { year: '2020', title: 'Sorbonne Declaration', body: 'Universities worldwide pledged commitment to FAIR.', href: LINKS.sorbonne },
    { year: '2023', title: 'TUBITAK APERTA', body: "Turkey's national FAIR-aligned repository scaled up.", href: LINKS.aperta },
    { year: '2026', title: 'fairveri.com', body: 'Turkish guide, automated assessment and a learning platform.', now: true },
  ],
};

export function Timeline() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <Section id="tarih" kicker={s.kicker} title={s.title} bg="soft">
      <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {s.steps.map((step) => {
          const cardCls = `relative rounded-2xl border bg-surface p-6 shadow-xs transition-all ${
            step.now ? 'border-brand ring-1 ring-brand/30' : 'border-line'
          } ${step.href ? 'hover:-translate-y-[3px] hover:border-line-2 hover:shadow-md' : ''}`;

          const inner = (
            <>
              <div
                className={`mb-3 inline-flex items-center gap-2 font-mono text-[13px] font-semibold ${
                  step.now ? 'text-brand' : 'text-muted'
                }`}
              >
                {step.now && (
                  <span aria-hidden className="grid h-1.5 w-1.5 rounded-full bg-brand" />
                )}
                {step.year}
              </div>
              <h4 className="mb-1.5 flex items-start gap-1.5 text-[18px] font-semibold leading-snug text-ink">
                <span>{step.title}</span>
                {step.href && (
                  <ExternalLink
                    aria-hidden
                    className="mt-1 h-3.5 w-3.5 flex-none text-muted"
                  />
                )}
              </h4>
              <p className="text-sm leading-relaxed text-ink-2">{step.body}</p>
            </>
          );

          return (
            <li key={step.year}>
              {step.href ? (
                <a
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardCls} block no-underline text-current`}
                >
                  {inner}
                </a>
              ) : (
                <div className={cardCls}>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
