'use client';

import { useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAssessmentStore } from '@/lib/assessment-store';
import { FvButton } from '@/components/ui/fv-button';
import assessmentDataEn from '@/data/assessment-questions.json';
import assessmentDataTr from '@/data/assessment-questions-tr.json';

const TR = {
  step: (i: number, total: number) => `Soru ${i} / ${total}`,
  prev: 'Önceki',
  next: 'Sonraki',
  finish: 'Değerlendirmeyi tamamla',
  reset: 'Sıfırla',
  resetConfirm: 'Tüm cevaplarınız silinecek. Devam etmek istiyor musunuz?',
  showExpl: 'Açıklamayı göster',
  hideExpl: 'Açıklamayı gizle',
  saved: 'Otomatik kaydedildi',
};

const EN = {
  step: (i: number, total: number) => `Question ${i} of ${total}`,
  prev: 'Previous',
  next: 'Next',
  finish: 'Finish assessment',
  reset: 'Reset',
  resetConfirm: 'All your answers will be lost. Continue?',
  showExpl: 'Show explanation',
  hideExpl: 'Hide explanation',
  saved: 'Auto-saved',
};

const colorByCategory: Record<
  string,
  { bg: string; fg: string; dot: string; border: string; ring: string }
> = {
  findable:      { bg: 'bg-f-bg', fg: 'text-f-fg', dot: 'bg-f-dot', border: 'border-f-dot', ring: 'ring-f-dot' },
  accessible:    { bg: 'bg-a-bg', fg: 'text-a-fg', dot: 'bg-a-dot', border: 'border-a-dot', ring: 'ring-a-dot' },
  interoperable: { bg: 'bg-i-bg', fg: 'text-i-fg', dot: 'bg-i-dot', border: 'border-i-dot', ring: 'ring-i-dot' },
  reusable:      { bg: 'bg-r-bg', fg: 'text-r-fg', dot: 'bg-r-dot', border: 'border-r-dot', ring: 'ring-r-dot' },
};

interface Props {
  onComplete: () => void;
}

export function FairAssessmentTool({ onComplete }: Props) {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  const {
    currentCategoryIndex,
    currentQuestionIndex,
    answers,
    showExplanations,
    saveAnswer,
    setCurrentCategory,
    goToNextQuestion,
    goToPreviousQuestion,
    calculateResults,
    resetAssessment,
    toggleExplanations,
    getProgress,
  } = useAssessmentStore();

  const assessmentData = language === 'en' ? assessmentDataEn : assessmentDataTr;
  const { categories } = assessmentData.assessment;
  const totalQuestions = useMemo(
    () => categories.reduce((sum, c) => sum + c.questions.length, 0),
    [categories]
  );
  const progress = getProgress();

  const category = categories[currentCategoryIndex];
  const question = category.questions[currentQuestionIndex];
  const colors = colorByCategory[category.id] ?? colorByCategory.findable;

  const flatIndex = useMemo(() => {
    let idx = 0;
    for (let i = 0; i < currentCategoryIndex; i++) idx += categories[i].questions.length;
    return idx + currentQuestionIndex + 1;
  }, [categories, currentCategoryIndex, currentQuestionIndex]);

  const currentAnswer = answers.find((a) => a.questionId === question.id);
  const isLast =
    currentCategoryIndex === categories.length - 1 &&
    currentQuestionIndex === category.questions.length - 1;

  const handleFinish = () => {
    calculateResults();
    onComplete();
  };

  // Keyboard navigation: ← / → between questions.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') goToPreviousQuestion();
      if (e.key === 'ArrowRight' && currentAnswer) {
        if (isLast) handleFinish();
        else goToNextQuestion();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAnswer, isLast]);

  const handleSelect = (option: { value: string; score: number; feedback?: string }) => {
    saveAnswer({
      questionId: question.id,
      value: option.value,
      score: option.score,
      feedback: option.feedback,
    });
  };

  const handleReset = () => {
    if (window.confirm(s.resetConfirm)) {
      resetAssessment();
    }
  };

  const overallPct = (progress.answeredQuestions / totalQuestions) * 100;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 font-mono text-[12px] uppercase tracking-[0.18em] text-muted">
          {s.step(flatIndex, totalQuestions)}
        </div>
        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>

        <ul className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-2 lg:overflow-visible">
          {categories.map((cat, idx) => {
            const c = colorByCategory[cat.id] ?? colorByCategory.findable;
            const cp = progress.categoryProgress[cat.id];
            const isActive = idx === currentCategoryIndex;
            return (
              <li key={cat.id} className="flex-none lg:flex-auto">
                <button
                  type="button"
                  onClick={() => setCurrentCategory(idx)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    isActive
                      ? `${c.bg} ${c.fg} border-transparent shadow-sm`
                      : 'border-line bg-surface text-ink-2 hover:bg-bg-2'
                  }`}
                >
                  <span
                    className={`grid h-9 w-9 flex-none place-items-center rounded-lg font-mono text-[16px] font-extrabold ${
                      isActive ? 'bg-surface/40 text-current' : `${c.bg} ${c.fg}`
                    }`}
                  >
                    {cat.id.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-semibold leading-tight">{cat.title}</span>
                    <span
                      className={`block text-[12px] leading-tight ${
                        isActive ? 'opacity-80' : 'text-muted'
                      }`}
                    >
                      {cp.answered} / {cp.total}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={handleReset}
          className="mt-5 hidden items-center gap-2 text-[13px] text-muted transition-colors hover:text-ink lg:inline-flex"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {s.reset}
        </button>
      </aside>

      {/* Main */}
      <section className="rounded-3xl border border-line bg-surface p-6 shadow-xs lg:p-10">
        <header className="mb-5 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ${colors.bg} ${colors.fg}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
            {category.title} · {question.principle}
          </span>
          <span className="font-mono text-[12px] text-muted">{s.saved}</span>
        </header>

        <h2 className="mb-2 text-[clamp(20px,2.4vw,26px)] font-bold leading-tight tracking-tight text-ink">
          {question.title}
        </h2>
        <p className="mb-3 text-[15px] leading-relaxed text-ink-2">{question.question}</p>

        <button
          type="button"
          onClick={toggleExplanations}
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-brand-deep hover:underline"
        >
          <Info className="h-3.5 w-3.5" />
          {showExplanations ? s.hideExpl : s.showExpl}
        </button>

        {showExplanations && (question as any).explanation && (
          <div className="mb-6 rounded-xl bg-bg-2 p-4 text-[14px] leading-relaxed text-ink-2">
            {(question as any).explanation}
          </div>
        )}

        <ul className="mb-8 space-y-2.5" role="radiogroup">
          {question.options.map((option) => {
            const selected = currentAnswer?.value === option.value;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? `${colors.bg} ${colors.border} ring-2 ${colors.ring} ring-offset-1 ring-offset-surface`
                      : 'border-line bg-bg hover:border-line-2 hover:bg-bg-2'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border-2 ${
                      selected ? `${colors.border} ${colors.dot}` : 'border-line bg-surface'
                    }`}
                  >
                    {selected && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-surface" />}
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-[15px] font-medium ${selected ? colors.fg : 'text-ink'}`}
                    >
                      {option.label}
                    </span>
                    {selected && (option as any).feedback && (
                      <span
                        className={`mt-1 block text-[13px] leading-relaxed ${colors.fg} opacity-90`}
                      >
                        {(option as any).feedback}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-3">
          <FvButton
            type="button"
            variant="ghost"
            onClick={goToPreviousQuestion}
            disabled={flatIndex === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            {s.prev}
          </FvButton>

          {isLast ? (
            <FvButton type="button" onClick={handleFinish} disabled={!currentAnswer}>
              {s.finish}
            </FvButton>
          ) : (
            <FvButton type="button" onClick={goToNextQuestion} disabled={!currentAnswer}>
              {s.next}
              <ChevronRight className="h-4 w-4" />
            </FvButton>
          )}
        </div>
      </section>
    </div>
  );
}
