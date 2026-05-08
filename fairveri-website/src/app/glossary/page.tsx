import type { Metadata } from 'next';
import { Section } from '@/components/ui/section';
import { FvLinkButton } from '@/components/ui/fv-button';

export const metadata: Metadata = {
  title: 'FAIR Veri Sözlüğü | FairVeri',
  description:
    'FAIR veri yönetimi ile ilgili terimler ve açıklamaları - kapsamlı sözlük ve referans kaynağı',
  keywords: ['FAIR sözlük', 'veri terimleri', 'metadata', 'ontoloji', 'veri yönetimi terimleri'],
  openGraph: {
    title: 'FAIR Veri Sözlüğü',
    description:
      'FAIR veri yönetimi ile ilgili terimler ve açıklamalarını içeren kapsamlı sözlük',
    type: 'website',
  },
};

const TERMS: { term: string; tr: string }[] = [
  { term: 'DOI', tr: 'Digital Object Identifier — sayısal bir nesneye atanan kalıcı, küresel olarak benzersiz tanımlayıcı.' },
  { term: 'ORCID', tr: 'Open Researcher and Contributor ID — araştırmacılar için kalıcı dijital kimlik.' },
  { term: 'Metadata', tr: 'Veriyi tanımlayan veri. Başlık, yazar, lisans, tarih gibi alanlardan oluşur.' },
  { term: 'Repository', tr: 'Veri ve meta verinin uzun süreli barındırıldığı kalıcı, küratörlü bir depo.' },
  { term: 'PID', tr: 'Persistent Identifier — uzun vadeli kararlı bağlantı sağlayan kalıcı tanımlayıcı.' },
  { term: 'JSON-LD', tr: 'JSON for Linked Data — yapılandırılmış veriyi Bağlı Veri olarak ifade eden format.' },
  { term: 'CC BY 4.0', tr: 'Creative Commons Atıf 4.0 — esere atıfta bulunmak şartıyla geniş yeniden kullanım izni.' },
  { term: 'CC0', tr: 'Creative Commons Sıfır — eseri kamu malı olarak sunmak; tüm hakları feragat etmek.' },
  { term: 'F-UJI', tr: 'FAIR veri uyumluluğunu otomatik puanlayan açık kaynaklı değerlendirme motoru.' },
  { term: 'GO FAIR', tr: 'FAIR prensiplerinin uygulamaya geçirilmesi için kurulan uluslararası topluluk girişimi.' },
  { term: 'DataCite', tr: 'Veri DOI’ları sağlayan ve yöneten uluslararası çalışma topluluğu.' },
  { term: 're3data.org', tr: 'Dünya genelindeki araştırma veri depolarını listeleyen tescilli dizin.' },
  { term: 'VYP / DMP', tr: 'Veri Yönetim Planı / Data Management Plan — projenin veri yaşam döngüsünü tanımlayan belge.' },
  { term: 'APERTA', tr: 'TÜBİTAK ULAKBİM bünyesindeki ulusal açık erişim ve veri deposu.' },
];

export default function GlossaryPage() {
  return (
    <>
      <Section
        align="center"
        title="FAIR Veri Sözlüğü"
        description="FAIR veri yönetimi ile ilgili sık kullanılan terimleri bir bakışta görün. Eksik bulduğunuz bir terim varsa, bizimle iletişime geçin."
      />

      <Section bg="soft">
        <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TERMS.map((t) => (
            <div
              key={t.term}
              className="rounded-2xl border border-line bg-surface p-6 shadow-xs"
            >
              <dt className="mb-1.5 font-mono text-[14px] font-semibold uppercase tracking-wider text-brand-deep">
                {t.term}
              </dt>
              <dd className="text-[15px] leading-relaxed text-ink-2">{t.tr}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex justify-center">
          <FvLinkButton href="/contact" variant="ghost">
            Eksik bir terim mi var? Bildirin →
          </FvLinkButton>
        </div>
      </Section>
    </>
  );
}
