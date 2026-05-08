'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock, ListChecks } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { FvButton } from '@/components/ui/fv-button';
import { FairAssessmentTool } from '@/components/features/fair-assessment-tool';
import { AssessmentResults } from '@/components/features/assessment-results';
import { AssessmentMetadataForm } from '@/components/features/assessment-metadata-form';
import { useAssessmentStore } from '@/lib/assessment-store';
import { useLanguage } from '@/contexts/language-context';

type Stage = 'intro' | 'form' | 'tool' | 'results';

const TR = {
  introTitle: 'Veri setiniz ne kadar FAIR?',
  introDesc:
    'Veri yönetim uygulamalarınızı 15 soruda değerlendirin. Sonuç olarak F/A/I/R kırılımı, eksik kriterler ve düzeltme önerileri alacaksınız. %85 ve üzeri puanla başarılı olursanız adınıza özel bir sertifika hazırlanır.',
  stats: [
    { icon: ListChecks, label: '15 soru' },
    { icon: Clock, label: '~10 dakika' },
    { icon: CheckCircle2, label: '%85 → sertifika' },
  ],
  start: 'Başla',
  resume: 'Değerlendirmeye devam et',
  resumeNote: 'Daha önce başlatılmış bir değerlendirmeniz var.',
};

const EN = {
  introTitle: 'How FAIR is your dataset?',
  introDesc:
    'Assess your data management practice in 15 questions. You will receive an F/A/I/R breakdown, missing criteria and remediation guidance. Score 85% or higher to earn a personalised certificate.',
  stats: [
    { icon: ListChecks, label: '15 questions' },
    { icon: Clock, label: '~10 minutes' },
    { icon: CheckCircle2, label: '85% → certificate' },
  ],
  start: 'Start',
  resume: 'Resume assessment',
  resumeNote: 'You have an assessment in progress.',
};

export default function AssessmentPage() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  const metadata = useAssessmentStore((st) => st.metadata);
  const isCompleted = useAssessmentStore((st) => st.isCompleted);
  const answers = useAssessmentStore((st) => st.answers);

  const inProgress = !isCompleted && answers.length > 0 && !!metadata;
  const initialStage: Stage = isCompleted ? 'results' : inProgress ? 'tool' : 'intro';
  const [stage, setStage] = useState<Stage>(initialStage);

  // If the store finishes hydrating after first render and pushes us into a new state, follow it.
  useEffect(() => {
    if (isCompleted) setStage('results');
  }, [isCompleted]);

  if (stage === 'results') {
    return (
      <Section>
        <AssessmentResults onRetake={() => setStage('intro')} />
      </Section>
    );
  }

  if (stage === 'tool') {
    return (
      <Section>
        <FairAssessmentTool onComplete={() => setStage('results')} />
      </Section>
    );
  }

  if (stage === 'form') {
    return (
      <Section>
        <AssessmentMetadataForm onSubmit={() => setStage('tool')} />
      </Section>
    );
  }

  return (
    <Section align="center" title={s.introTitle} description={s.introDesc}>
      <div className="mx-auto flex max-w-[640px] flex-col items-center gap-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {s.stats.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink-2 shadow-xs"
            >
              <Icon className="h-4 w-4 text-brand" />
              {label}
            </span>
          ))}
        </div>

        {inProgress && (
          <div className="w-full rounded-2xl border border-brand/40 bg-brand-soft p-5 text-center">
            <p className="mb-3 text-[14px] text-brand-deep">{s.resumeNote}</p>
            <FvButton onClick={() => setStage('tool')}>
              {s.resume}
              <ArrowRight className="h-4 w-4" />
            </FvButton>
          </div>
        )}

        <FvButton size="lg" onClick={() => setStage('form')}>
          {s.start}
          <ArrowRight className="h-4 w-4" />
        </FvButton>
      </div>
    </Section>
  );
}
