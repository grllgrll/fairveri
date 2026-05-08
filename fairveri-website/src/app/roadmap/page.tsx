import type { Metadata } from 'next';
import { Section } from '@/components/ui/section';
import { Timeline } from '@/components/home/Timeline';

export const metadata: Metadata = {
  title: 'FAIR Uygulama Yol Haritası | FairVeri',
  description:
    'Verilerinizi FAIR prensiplere uygun hale getirmek için adım adım rehber ve ilerleme takibi',
  keywords: [
    'FAIR yol haritası',
    'veri yönetimi planı',
    'uygulama rehberi',
    'FAIR dönüşüm',
    'veri standardları',
  ],
  openGraph: {
    title: 'FAIR Uygulama Yol Haritası',
    description:
      'Verilerinizi FAIR prensiplere uygun hale getirmek için kapsamlı rehber',
    type: 'website',
  },
};

export default function RoadmapPage() {
  return (
    <>
      <Section
        align="center"
        title="FAIR Uygulama Yol Haritası"
        description="Verilerinizi FAIR prensiplere uygun hale getirmek için kapsamlı, adım adım rehber ve kişiselleştirilmiş ilerleme takibi."
      >
        <div className="mx-auto max-w-[680px] rounded-2xl border border-line bg-surface p-7 text-center shadow-xs">
          <h3 className="mb-2 text-[18px] font-semibold text-ink">
            Yol haritası özelliği geliştiriliyor
          </h3>
          <p className="text-sm leading-relaxed text-ink-2">
            Yakında bütünleşik bir takip aracı sunacağız. Şimdilik aşağıdaki tarihçeyi
            inceleyebilir ve öğrenme modüllerinden yararlanabilirsiniz.
          </p>
        </div>
      </Section>
      <Timeline />
    </>
  );
}
