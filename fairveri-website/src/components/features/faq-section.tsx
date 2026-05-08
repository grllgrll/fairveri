'use client';

import React, { useEffect, useState } from 'react';
import { Search, ChevronDown, HelpCircle, Tag, Lightbulb, CheckSquare, Target, Coins, Wrench, AlertCircle, ListChecks, X } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import faqData from '@/data/faq.json';

interface FAQSectionProps {
  className?: string;
  showSearch?: boolean;
  showCategories?: boolean;
  maxItems?: number;
}

const TR = {
  searchPlaceholder: 'Soru, cevap veya etiket ile ara…',
  allCategories: 'Tümü',
  found: (n: number) => `${n} soru bulundu`,
  noResults: 'Arama kriterlerinize uygun soru bulunamadı.',
  tipsTitle: 'İpuçları',
  checklistTitle: 'Kontrol Listesi',
  benefitsTitle: 'Faydalar',
  costsTitle: 'Maliyetler',
  licensesTitle: 'Lisanslar',
  requirementsTitle: 'Gereksinimler',
  toolsTitle: 'Araçlar',
  recommendedTitle: 'Önerilen',
  avoidTitle: 'Kaçınılacak',
  relatedTitle: 'İlgili Sorular',
  tagsTitle: 'Etiketler',
  clearSearch: 'Aramayı temizle',
};

const EN = {
  searchPlaceholder: 'Search by question, answer or tag…',
  allCategories: 'All',
  found: (n: number) => `${n} question${n === 1 ? '' : 's'} found`,
  noResults: 'No questions match your search.',
  tipsTitle: 'Tips',
  checklistTitle: 'Checklist',
  benefitsTitle: 'Benefits',
  costsTitle: 'Costs',
  licensesTitle: 'Licenses',
  requirementsTitle: 'Requirements',
  toolsTitle: 'Tools',
  recommendedTitle: 'Recommended',
  avoidTitle: 'Avoid',
  relatedTitle: 'Related Questions',
  tagsTitle: 'Tags',
  clearSearch: 'Clear search',
};

const FAQSection: React.FC<FAQSectionProps> = ({
  className = '',
  showSearch = true,
  showCategories = true,
  maxItems,
}) => {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = faqData.faq.categories;
  const allQuestions = categories.flatMap((category) =>
    category.questions.map((q) => ({ ...q, categoryId: category.id, categoryTitle: category.title }))
  );

  // Open accordion item matching URL hash (e.g. #fair-vs-open from quick-link cards).
  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace(/^#/, '');
      if (!id) return;
      if (!allQuestions.some((q) => q.id === id)) return;
      setActiveCategory('all');
      setOpenId(id);
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = searchQuery.trim().toLowerCase();
  const filteredQuestions = allQuestions
    .filter((question) => {
      const matchesSearch =
        q === '' ||
        question.question.toLowerCase().includes(q) ||
        question.answer.toLowerCase().includes(q) ||
        question.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesCategory = activeCategory === 'all' || question.categoryId === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .slice(0, maxItems);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Search */}
      {showSearch && (
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={s.searchPlaceholder}
            className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-12 text-[15px] text-ink placeholder:text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label={s.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted hover:bg-bg-2 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Category pills */}
      {showCategories && (
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            label={s.allCategories}
            count={allQuestions.length}
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
          />
          {categories.map((category) => (
            <CategoryPill
              key={category.id}
              label={category.title}
              count={category.questions.length}
              active={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            />
          ))}
        </div>
      )}

      {/* Result count */}
      <div className="font-mono text-[12px] uppercase tracking-wider text-muted">
        {s.found(filteredQuestions.length)}
      </div>

      {/* Question list */}
      {filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <HelpCircle className="h-10 w-10 text-muted" strokeWidth={1.5} />
          <p className="text-sm text-ink-2">{s.noResults}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredQuestions.map((question) => {
            const isOpen = openId === question.id;
            return (
              <li
                key={question.id}
                id={question.id}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : question.id)}
                  className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[16px] font-semibold leading-snug text-ink">
                      {question.question}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <CategoryBadge label={question.categoryTitle} />
                      {question.tags?.slice(0, 3).map((tag) => (
                        <TagBadge key={tag} label={tag} />
                      ))}
                    </div>
                  </div>
                  <ChevronDown
                    aria-hidden
                    className={`mt-1 h-5 w-5 flex-none text-muted transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-line bg-bg-2/40 px-6 py-6">
                    <QuestionContent question={question} s={s} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ── Category pill ────────────────────────────────────────────────
function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active
          ? 'bg-ink text-bg shadow-xs'
          : 'border border-line bg-surface text-ink-2 hover:border-line-2 hover:text-ink'
      }`}
    >
      <span>{label}</span>
      <span
        className={`rounded-full px-1.5 font-mono text-[11px] ${
          active ? 'bg-bg/15 text-bg/80' : 'bg-bg-2 text-muted'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ── Category badge (inside accordion header) ─────────────────────
function CategoryBadge({ label }: { label: string }) {
  return (
    <span className="rounded-md border border-line bg-bg-2 px-2 py-0.5 text-[11px] font-medium text-ink-2">
      {label}
    </span>
  );
}

// ── Tag badge ───────────────────────────────────────────────────
const TAG_TONE: Record<string, { bg: string; fg: string }> = {
  fair: { bg: 'bg-r-bg', fg: 'text-r-fg' },
  'open-data': { bg: 'bg-i-bg', fg: 'text-i-fg' },
  metadata: { bg: 'bg-r-bg', fg: 'text-r-fg' },
  license: { bg: 'bg-f-bg', fg: 'text-f-fg' },
  privacy: { bg: 'bg-a-bg', fg: 'text-a-fg' },
  technical: { bg: 'bg-bg-2', fg: 'text-ink-2' },
  cost: { bg: 'bg-f-bg', fg: 'text-f-fg' },
  training: { bg: 'bg-i-bg', fg: 'text-i-fg' },
};

function TagBadge({ label }: { label: string }) {
  const tone = TAG_TONE[label] ?? { bg: 'bg-bg-2', fg: 'text-muted' };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${tone.bg} ${tone.fg}`}
    >
      {label}
    </span>
  );
}

// ── Callout box (replaces pastel boxes) ─────────────────────────
function Callout({
  icon: Icon,
  title,
  tone = 'brand',
  children,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  tone?: 'brand' | 'f' | 'a' | 'i' | 'r' | 'neutral';
  children: React.ReactNode;
}) {
  const map = {
    brand: { bg: 'bg-brand-soft', accent: 'text-brand-deep', border: 'border-brand/15' },
    f: { bg: 'bg-f-bg', accent: 'text-f-fg', border: 'border-f-dot/20' },
    a: { bg: 'bg-a-bg', accent: 'text-a-fg', border: 'border-a-dot/20' },
    i: { bg: 'bg-i-bg', accent: 'text-i-fg', border: 'border-i-dot/20' },
    r: { bg: 'bg-r-bg', accent: 'text-r-fg', border: 'border-r-dot/20' },
    neutral: { bg: 'bg-bg-2', accent: 'text-ink-2', border: 'border-line' },
  } as const;
  const c = map[tone];
  return (
    <div className={`rounded-xl border ${c.border} ${c.bg} px-4 py-3.5`}>
      <div className={`mb-2 flex items-center gap-2 text-[13px] font-semibold ${c.accent}`}>
        <Icon className="h-4 w-4" strokeWidth={2} />
        {title}
      </div>
      <div className={`text-sm ${c.accent}`}>{children}</div>
    </div>
  );
}

// ── Question content ────────────────────────────────────────────
const QuestionContent: React.FC<{ question: any; s: typeof TR }> = ({ question, s }) => {
  return (
    <div className="space-y-4">
      <p className="text-[15px] leading-relaxed text-ink-2">{question.answer}</p>

      {question.tips && (
        <Callout icon={Lightbulb} title={s.tipsTitle} tone="i">
          <ul className="space-y-1">
            {question.tips.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {question.checklist && (
        <Callout icon={CheckSquare} title={s.checklistTitle} tone="brand">
          <ul className="space-y-1">
            {question.checklist.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {question.benefits && (
        <Callout icon={Target} title={s.benefitsTitle} tone="r">
          <ul className="space-y-1">
            {question.benefits.map((benefit: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {question.costs && (
        <Callout icon={Coins} title={s.costsTitle} tone="f">
          <dl className="space-y-1.5">
            {Object.entries(question.costs).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-3 border-b border-current/10 pb-1.5 last:border-b-0 last:pb-0">
                <dt className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                <dd className="font-medium">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </Callout>
      )}

      {question.licenses && (
        <Callout icon={ListChecks} title={s.licensesTitle} tone="neutral">
          <div className="space-y-2.5">
            {question.licenses.map((license: any, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-2">
                  {license.name}
                </span>
                <div className="flex-1 text-ink-2">
                  <p className="font-medium text-ink">{license.description}</p>
                  <p className="mt-0.5 text-muted">{license.use}</p>
                </div>
              </div>
            ))}
          </div>
        </Callout>
      )}

      {question.requirements && (
        <Callout icon={AlertCircle} title={s.requirementsTitle} tone="a">
          <ul className="space-y-1">
            {question.requirements.map((req: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Callout>
      )}

      {question.tools && (
        <Callout icon={Wrench} title={s.toolsTitle} tone="r">
          <div className="flex flex-wrap gap-1.5">
            {question.tools.map((tool: string, i: number) => (
              <span
                key={i}
                className="rounded-md border border-current/15 bg-current/10 px-2 py-0.5 text-[12px] font-medium"
              >
                {tool}
              </span>
            ))}
          </div>
        </Callout>
      )}

      {question.recommended && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Callout icon={CheckSquare} title={s.recommendedTitle} tone="brand">
            <ul className="space-y-1">
              {question.recommended.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Callout>
          {question.avoid && (
            <Callout icon={AlertCircle} title={s.avoidTitle} tone="a">
              <ul className="space-y-1">
                {question.avoid.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-current opacity-70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Callout>
          )}
        </div>
      )}

      {question.tags && question.tags.length > 0 && (
        <div className="border-t border-line pt-4">
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-muted">
            {s.tagsTitle}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {question.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-md bg-bg-2 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-2"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
