'use client';

import { Section } from '@/components/ui/section';
import { FvLinkButton } from '@/components/ui/fv-button';
import { PrincipleExplorer } from '@/components/home/PrincipleExplorer';
import { useLanguage } from '@/contexts/language-context';

const TR = {
  kicker: '',
  title: 'FAIR Prensipleri — derinlemesine.',
  description:
    'Aşağıdaki harflere tıklayın; her prensibin tanımını ve 15 alt kriterini interaktif olarak inceleyin.',
  ctaTitle: 'Hazır mısınız?',
  cta: 'Veri setinizi değerlendirin',
};

const EN = {
  kicker: '',
  title: 'FAIR Principles — in depth.',
  description:
    'Click any letter below — explore each principle and its 15 sub-criteria interactively.',
  ctaTitle: 'Ready?',
  cta: 'Assess your dataset',
};

export default function PrinciplesPage() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <>
      <Section
        align="center"
        kicker={s.kicker}
        title={s.title}
        description={s.description}
      />

      <PrincipleExplorer />

      <Section align="center" title={s.ctaTitle} bg="soft">
        <div className="flex justify-center">
          <FvLinkButton href="/assessment" size="lg">
            {s.cta} →
          </FvLinkButton>
        </div>
      </Section>
    </>
  );
}
