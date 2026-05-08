'use client';

import { Section } from '@/components/ui/section';
import { useLanguage } from '@/contexts/language-context';

const TR = {
  kicker: 'Veri depoları',
  title: 'Veriniz nereye gitsin?',
  sub: 'Boyut, DOI, versiyon ve maliyet bir bakışta.',
  cols: ['Depo', 'Tip', 'Boyut limiti', 'DOI', 'Versiyon', 'Maliyet', 'Türkçe'],
  type: { general: 'Genel amaçlı', national: 'Ulusal', curated: 'Küratörlü', domain: 'Alan-özel' },
  free: 'Ücretsiz',
  variable: 'Değişken',
  unlimited: 'Sınırsız',
  metaDryad: 'Dergi entegrasyonu',
  metaPangaea: 'Yer ve çevre bilimleri',
};

const EN = {
  kicker: 'Repositories',
  title: 'Where should your data go?',
  sub: 'Size, DOI, versions and cost at a glance.',
  cols: ['Repository', 'Type', 'Size limit', 'DOI', 'Versions', 'Cost', 'Turkish'],
  type: { general: 'General-purpose', national: 'National', curated: 'Curated', domain: 'Domain-specific' },
  free: 'Free',
  variable: 'Variable',
  unlimited: 'Unlimited',
  metaDryad: 'Journal-integrated',
  metaPangaea: 'Earth & environmental',
};

const Check = () => <span aria-label="yes" className="font-bold text-i-dot">✓</span>;
const Dash = () => <span aria-label="no" className="text-muted">–</span>;

export function RepositoriesTable() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  const rows: Array<{
    name: string;
    meta: string;
    nameBadge?: string;
    type: keyof typeof s.type;
    size: string;
    doi: boolean;
    ver: boolean;
    cost: string;
    costPaid?: boolean;
    locale: boolean;
  }> = [
    { name: 'Zenodo', meta: 'CERN · Avrupa Komisyonu', type: 'general', size: '50 GB', doi: true, ver: true, cost: s.free, locale: false },
    { name: 'APERTA', nameBadge: 'TR', meta: 'TÜBİTAK ULAKBİM', type: 'national', size: s.variable, doi: true, ver: true, cost: s.free, locale: true },
    { name: 'Figshare', meta: 'Digital Science', type: 'general', size: '20 GB', doi: true, ver: true, cost: s.free, locale: false },
    { name: 'Dryad', meta: s.metaDryad, type: 'curated', size: s.unlimited, doi: true, ver: false, cost: '$120', costPaid: true, locale: false },
    { name: 'GenBank', meta: 'NCBI · NIH', type: 'domain', size: s.unlimited, doi: true, ver: true, cost: s.free, locale: false },
    { name: 'PANGAEA', meta: s.metaPangaea, type: 'domain', size: s.unlimited, doi: true, ver: true, cost: s.free, locale: false },
  ];

  const typeStyle: Record<string, string> = {
    general: 'bg-bg-2 text-ink-2',
    national: 'bg-brand-soft text-brand-deep',
    curated: 'bg-r-bg text-r-fg',
    domain: 'bg-i-bg text-i-fg',
  };

  return (
    <Section id="kaynaklar" kicker={s.kicker} title={s.title} description={s.sub}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg-2 text-[12px] uppercase tracking-wider text-muted">
              <tr>
                {s.cols.map((c) => (
                  <th key={c} className="px-5 py-4 font-medium first:pl-7">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name} className="border-t border-line align-middle">
                  <td className="px-5 py-4 first:pl-7">
                    <div className="flex items-center gap-2 text-[15px] font-semibold text-ink">
                      {r.name}
                      {r.nameBadge && (
                        <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-brand-deep">
                          {r.nameBadge}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[12px] text-muted">{r.meta}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-medium ${typeStyle[r.type]}`}>
                      {s.type[r.type]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-ink-2">{r.size}</td>
                  <td className="px-5 py-4">{r.doi ? <Check /> : <Dash />}</td>
                  <td className="px-5 py-4">{r.ver ? <Check /> : <Dash />}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${
                        r.costPaid ? 'bg-f-bg text-f-fg' : 'bg-i-bg text-i-fg'
                      }`}
                    >
                      {r.cost}
                    </span>
                  </td>
                  <td className="px-5 py-4">{r.locale ? <Check /> : <Dash />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}
