'use client';

import { Section } from '@/components/ui/section';
import { FvLinkButton } from '@/components/ui/fv-button';

const PARTNERS = [
  { name: 'TÜBİTAK ULAKBİM', kind: 'Ulusal · Veri altyapısı' },
  { name: 'GO FAIR', kind: 'Uluslararası · Topluluk' },
  { name: 'DataCite', kind: 'Uluslararası · DOI altyapısı' },
  { name: 're3data.org', kind: 'Dizin · Repo kataloğu' },
  { name: 'OpenAIRE', kind: 'AB · Açık bilim platformu' },
  { name: 'CESSDA', kind: 'AB · Sosyal bilim arşivi' },
];

export default function PartnersPage() {
  return (
    <>
      <Section
        align="center"
        title="Ortaklar ve işbirlikleri"
        description="FAIR veri prensiplerini yaygınlaştırmak için birlikte çalıştığımız kurumlar, organizasyonlar ve projeler. Akademik dünyadan endüstriye, ulusal ve uluslararası işbirlikleri ile daha güçlü bir veri ekosistemi kuruyoruz."
      />

      <Section bg="soft">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl border border-line bg-surface p-5 shadow-xs"
            >
              <div className="text-[15px] font-semibold text-ink">{p.name}</div>
              <div className="mt-1 text-[12px] text-muted">{p.kind}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section align="center" title="İşbirliği yapmak ister misiniz?" description="Üniversite, kütüphane, veri merkezi veya STK olarak bizimle çalışmak için iletişime geçin.">
        <div className="flex flex-wrap justify-center gap-3">
          <FvLinkButton href="/contact" size="lg">
            İletişime geç →
          </FvLinkButton>
          <FvLinkButton href="/learn" variant="ghost" size="lg">
            Önce öğren
          </FvLinkButton>
        </div>
      </Section>
    </>
  );
}
