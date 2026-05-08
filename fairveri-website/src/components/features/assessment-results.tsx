'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Download, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAssessmentStore } from '@/lib/assessment-store';
import { FvButton } from '@/components/ui/fv-button';
import { RadarChart, type RadarChartData } from '@/components/ui/radar-chart';
import { generateCertificatePDF } from '@/lib/certificate';
import assessmentDataEn from '@/data/assessment-questions.json';
import assessmentDataTr from '@/data/assessment-questions-tr.json';

const TR = {
  emptyTitle: 'Henüz değerlendirme tamamlanmadı',
  emptyDesc: 'Sonuçları görmek için değerlendirmeyi tamamlayın.',
  overallTitle: 'Toplam FAIR puanı',
  passTitle: 'Tebrikler — sertifikanız hazır!',
  passDesc:
    'Veri yönetim uygulamalarınız FAIR prensiplere yüksek oranda uyumlu. Aşağıdaki butonlardan sertifikanızı indirebilirsiniz.',
  improveTitle: 'Geliştirme alanları var',
  improveDesc:
    '%85 ve üzeri puan alarak sertifika kazanabilirsiniz. Aşağıdaki önerilere göz atın ve değerlendirmeyi tekrar deneyin.',
  breakdownTitle: 'F / A / I / R kırılımı',
  visualTitle: 'Radar görünümü',
  recsTitle: 'Öneriler',
  ctaCert: 'Sertifika (TR)',
  ctaCertEn: 'Certificate (EN)',
  retake: 'Yeniden başla',
  certIdLabel: 'Sertifika no',
  generating: 'Oluşturuluyor…',
};

const EN = {
  emptyTitle: 'Assessment not completed yet',
  emptyDesc: 'Complete the assessment to see your results.',
  overallTitle: 'Overall FAIR score',
  passTitle: 'Congratulations — your certificate is ready!',
  passDesc:
    'Your data management practice is highly aligned with the FAIR principles. Download your certificate below.',
  improveTitle: 'Room to improve',
  improveDesc:
    'Score 85% or higher to earn a certificate. Review the recommendations below and retake the assessment.',
  breakdownTitle: 'F / A / I / R breakdown',
  visualTitle: 'Radar view',
  recsTitle: 'Recommendations',
  ctaCert: 'Certificate (TR)',
  ctaCertEn: 'Certificate (EN)',
  retake: 'Retake assessment',
  certIdLabel: 'Certificate ID',
  generating: 'Generating…',
};

const CATEGORY_VISUAL: Record<
  string,
  { letter: 'F' | 'A' | 'I' | 'R'; bg: string; fg: string; dot: string; hex: string }
> = {
  findable:      { letter: 'F', bg: 'bg-f-bg', fg: 'text-f-fg', dot: 'bg-f-dot', hex: '#f5b400' },
  accessible:    { letter: 'A', bg: 'bg-a-bg', fg: 'text-a-fg', dot: 'bg-a-dot', hex: '#e63946' },
  interoperable: { letter: 'I', bg: 'bg-i-bg', fg: 'text-i-fg', dot: 'bg-i-dot', hex: '#06b07d' },
  reusable:      { letter: 'R', bg: 'bg-r-bg', fg: 'text-r-fg', dot: 'bg-r-dot', hex: '#2f5dd5' },
};

interface Props {
  onRetake?: () => void;
}

export function AssessmentResults({ onRetake }: Props) {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;
  const assessmentData = language === 'en' ? assessmentDataEn : assessmentDataTr;

  const results = useAssessmentStore((st) => st.results);
  const metadata = useAssessmentStore((st) => st.metadata);
  const certificateId = useAssessmentStore((st) => st.certificateId);
  const resetAssessment = useAssessmentStore((st) => st.resetAssessment);
  const overallPct = useAssessmentStore((st) => st.getOverallPercentage());
  const passed = useAssessmentStore((st) => st.hasPassed());

  const [generatingLang, setGeneratingLang] = useState<'tr' | 'en' | null>(null);

  const radarData: RadarChartData[] = useMemo(() => {
    if (!results) return [];
    return assessmentData.assessment.categories.map((cat) => {
      const cs = results.categoryScores[cat.id];
      const v = CATEGORY_VISUAL[cat.id];
      return {
        label: v?.letter ?? cat.title.charAt(0),
        value: cs?.percentage ?? 0,
        maxValue: 100,
        color: v?.hex ?? '#0d8a5b',
      };
    });
  }, [results, assessmentData]);

  // Pick localized level + recommendations fresh at render time so the user's language toggle
  // affects the displayed text (the score itself is language-independent).
  const localizedLevel = useMemo(() => {
    if (!results) return null;
    return assessmentData.assessment.scoring.levels.find(
      (l: any) => results.totalScore >= l.min && results.totalScore <= l.max
    );
  }, [results, assessmentData]);
  const localizedRecommendations: string[] =
    (localizedLevel?.recommendations as string[] | undefined) ?? results?.recommendations ?? [];

  if (!results) {
    return (
      <div className="mx-auto max-w-[640px] rounded-2xl border border-line bg-surface p-8 text-center shadow-xs">
        <h2 className="mb-2 text-[20px] font-semibold text-ink">{s.emptyTitle}</h2>
        <p className="text-[14px] text-ink-2">{s.emptyDesc}</p>
      </div>
    );
  }

  const handleCertificate = async (target: 'tr' | 'en') => {
    if (!metadata || !certificateId) return;
    setGeneratingLang(target);
    try {
      const blob = await generateCertificatePDF({
        metadata,
        results,
        certificateId,
        lang: target,
        overallPct,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fairveri-certificate-${certificateId}-${target}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setGeneratingLang(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero score card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-7 shadow-sm sm:p-10 ${
          passed ? 'border-brand bg-brand-soft' : 'border-line bg-surface'
        }`}
      >
        <div className="grid items-center gap-6 sm:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
              {s.overallTitle}
            </div>
            <div className="text-[clamp(56px,9vw,96px)] font-bold leading-none tracking-tight text-ink">
              {overallPct.toFixed(0)}
              <span className="text-[clamp(28px,4vw,40px)] text-ink-2">%</span>
            </div>
            <h2
              className={`mt-3 text-[clamp(20px,2.4vw,28px)] font-bold tracking-tight ${
                passed ? 'text-brand-deep' : 'text-ink'
              }`}
            >
              {passed ? s.passTitle : s.improveTitle}
            </h2>
            <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-ink-2">
              {passed ? s.passDesc : s.improveDesc}
            </p>
            {certificateId && (
              <p className="mt-3 font-mono text-[12px] text-muted">
                {s.certIdLabel}: {certificateId}
              </p>
            )}
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            {passed && (
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                <FvButton onClick={() => handleCertificate('tr')} disabled={generatingLang !== null}>
                  <Download className="h-4 w-4" />
                  {generatingLang === 'tr' ? s.generating : s.ctaCert}
                </FvButton>
                <FvButton
                  variant="ghost"
                  onClick={() => handleCertificate('en')}
                  disabled={generatingLang !== null}
                >
                  <Download className="h-4 w-4" />
                  {generatingLang === 'en' ? s.generating : s.ctaCertEn}
                </FvButton>
              </div>
            )}
            {onRetake && (
              <button
                type="button"
                onClick={() => {
                  resetAssessment();
                  onRetake();
                }}
                className="inline-flex items-center justify-center gap-1.5 self-end text-[13px] text-muted transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {s.retake}
              </button>
            )}
          </div>
        </div>

        {passed && (
          <Sparkles
            aria-hidden
            className="pointer-events-none absolute right-6 top-6 h-6 w-6 text-brand"
          />
        )}
      </div>

      {/* F/A/I/R breakdown */}
      <section>
        <h3 className="mb-4 text-[18px] font-semibold tracking-tight text-ink">
          {s.breakdownTitle}
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {assessmentData.assessment.categories.map((cat) => {
            const v = CATEGORY_VISUAL[cat.id];
            const cs = results.categoryScores[cat.id];
            const pct = cs?.percentage ?? 0;
            return (
              <div key={cat.id} className="rounded-2xl border border-line bg-surface p-5 shadow-xs">
                <div className="mb-3 flex items-center gap-2.5">
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-lg ${v.bg} ${v.fg} font-mono text-[18px] font-extrabold`}
                  >
                    {v.letter}
                  </span>
                  <div className="text-[14px] font-semibold leading-tight text-ink">
                    {cat.title}
                  </div>
                </div>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[28px] font-bold leading-none tracking-tight text-ink">
                    {pct.toFixed(0)}%
                  </span>
                  <span className="font-mono text-[12px] text-muted">
                    {cs.score} / {cs.maxScore}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <span
                    className={`block h-full rounded-full ${v.dot} transition-[width] duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Radar */}
      <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
        <h3 className="mb-4 text-[18px] font-semibold tracking-tight text-ink">{s.visualTitle}</h3>
        <div className="flex justify-center">
          <RadarChart data={radarData} size={320} />
        </div>
      </section>

      {/* Recommendations */}
      {localizedRecommendations.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-6 shadow-xs">
          <h3 className="mb-4 flex items-center gap-2 text-[18px] font-semibold tracking-tight text-ink">
            <CheckCircle2 className="h-5 w-5 text-brand" />
            {s.recsTitle}
          </h3>
          <ul className="space-y-2.5">
            {localizedRecommendations.map((rec, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-[15px] leading-relaxed text-ink-2"
              >
                <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
