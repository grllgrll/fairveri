'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import academicPapersData from '@/data/academic-papers.json';
import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';

interface Paper {
  id: string;
  title: string;
  authors?: string;
  year?: number;
  citations?: number;
  journal?: string;
  sjrQuartile?: string;
  doi?: string;
  consensusLink?: string;
  abstract?: string;
  takeaway?: string;
}

interface Category {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  papers: Paper[];
}

const TR = {
  kicker: '',
  title: 'Kaynaklar ve ileri okuma',
  description:
    'FAIR veri prensipleri hakkında akademik makaleler, uygulamalı rehberler ve uluslararası standartlardan oluşan kapsamlı bir koleksiyon.',
  paperCount: (n: number) => `${n} akademik makale`,
  citationCount: (n: number) => `${n.toLocaleString('tr-TR')} toplam atıf`,
  doiLabel: 'DOI',
  citationsLabel: 'atıf',
};

const EN = {
  kicker: '',
  title: 'Resources & further reading',
  description:
    'A curated collection of academic papers, applied guides and international standards covering FAIR data principles.',
  paperCount: (n: number) => `${n} academic papers`,
  citationCount: (n: number) => `${n.toLocaleString('en-US')} total citations`,
  doiLabel: 'DOI',
  citationsLabel: 'citations',
};

export default function ResourcesPage() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;
  const data = academicPapersData.papers as unknown as {
    totalPapers: number;
    totalCitations: number;
    categories: Category[];
  };

  const [activeCat, setActiveCat] = useState<string>(data.categories[0]?.id ?? '');
  const cat = useMemo(
    () => data.categories.find((c) => c.id === activeCat) ?? data.categories[0],
    [activeCat, data.categories]
  );

  return (
    <>
      <Section align="center" kicker={s.kicker} title={s.title} description={s.description}>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-2 shadow-xs">
            {s.paperCount(data.totalPapers)}
          </span>
          <span className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-2 shadow-xs">
            {s.citationCount(data.totalCitations)}
          </span>
        </div>
      </Section>

      <Section bg="soft">
        <div className="mb-6 flex flex-wrap gap-2">
          {data.categories.map((c) => {
            const label = c.name || c.title || c.id;
            const active = c.id === activeCat;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCat(c.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active
                    ? 'bg-ink text-bg shadow-sm'
                    : 'border border-line bg-surface text-ink-2 hover:bg-bg-2 hover:text-ink'
                }`}
              >
                {label}
                <span
                  className={`ml-2 inline-block rounded-full px-1.5 text-[11px] font-mono ${
                    active ? 'bg-bg/15 text-bg/80' : 'bg-bg-2 text-muted'
                  }`}
                >
                  {c.papers.length}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {cat?.papers.map((p) => (
            <article
              key={p.id}
              className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-xs"
            >
              <div className="mb-3 flex items-center gap-2 font-mono text-[12px] uppercase tracking-wider text-muted">
                {p.year && <span>{p.year}</span>}
                {p.journal && (
                  <>
                    <span aria-hidden>·</span>
                    <span lang="en">{p.journal}</span>
                  </>
                )}
                {p.sjrQuartile && (
                  <span className="ml-auto rounded-md bg-i-bg px-2 py-0.5 text-[11px] font-semibold text-i-fg">
                    {p.sjrQuartile}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-[17px] font-semibold leading-snug text-ink">
                {p.title}
              </h3>
              {p.authors && (
                <p className="mb-3 line-clamp-2 text-[13px] text-muted">{p.authors}</p>
              )}
              {(p.takeaway || p.abstract) && (
                <p className="mb-4 line-clamp-3 text-[14px] leading-relaxed text-ink-2">
                  {p.takeaway || p.abstract}
                </p>
              )}
              <div className="mt-auto flex flex-wrap items-center gap-3 text-[13px] text-ink-2">
                {typeof p.citations === 'number' && (
                  <span className="font-mono">
                    {p.citations.toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}{' '}
                    {s.citationsLabel}
                  </span>
                )}
                {p.doi && (
                  <a
                    href={`https://doi.org/${p.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand no-underline hover:underline"
                  >
                    {s.doiLabel} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {p.consensusLink && (
                  <a
                    href={p.consensusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand no-underline hover:underline"
                  >
                    Consensus <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
