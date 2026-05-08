'use client';

import Link from 'next/link';
import { HelpCircle, MessageCircle, BookOpen, Users, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { FvLinkButton } from '@/components/ui/fv-button';
import FAQSection from '@/components/features/faq-section';
import { useLanguage } from '@/contexts/language-context';

const TR = {
  title: 'Sık Sorulan Sorular',
  description:
    'FAIR veri prensipleri hakkında en çok sorulan sorular ve detaylı yanıtları. Genel kavramlardan teknik detaylara, hukuki hususlardan kurumsal uygulamalara kadar kapsamlı rehberlik.',
  stats: [
    { icon: HelpCircle, label: '25+ Soru' },
    { icon: MessageCircle, label: 'Detaylı Yanıtlar' },
    { icon: BookOpen, label: 'Pratik Öneriler' },
  ],
  quickKicker: 'Hızlı yardım',
  quickTitle: 'En çok sorulan altı soru.',
  quickLinks: [
    { href: '#fair-vs-open', title: 'FAIR vs Açık Veri', sub: 'Temel fark nedir?' },
    { href: '#minimum-requirements', title: 'Minimum Gereksinimler', sub: 'Nereden başlamalı?' },
    { href: '#license-choice', title: 'Lisans Seçimi', sub: 'Hangi lisansı kullanmalı?' },
    { href: '#file-formats', title: 'Dosya Formatları', sub: 'Hangi format daha iyi?' },
    { href: '#metadata-automation', title: 'Metadata Otomasyonu', sub: 'Nasıl yönetmeli?' },
    { href: '#personal-data', title: 'KVKK ve FAIR', sub: 'Birlikte mümkün mü?' },
  ],
  ctaTitle: 'Aradığınızı bulamadınız mı?',
  ctaDescription: 'Sorunuzu doğrudan iletin — 1–2 iş günü içinde yanıtlıyoruz.',
  ctaPrimary: 'İletişime geç',
  ctaSecondary: 'Önce öğren',
};

const EN = {
  title: 'Frequently Asked Questions',
  description:
    'The most common questions about FAIR data principles with detailed answers. From general concepts to technical details, from legal considerations to institutional practice.',
  stats: [
    { icon: HelpCircle, label: '25+ Questions' },
    { icon: MessageCircle, label: 'Detailed Answers' },
    { icon: BookOpen, label: 'Practical Tips' },
  ],
  quickKicker: 'Quick help',
  quickTitle: 'Six most common questions.',
  quickLinks: [
    { href: '#fair-vs-open', title: 'FAIR vs Open Data', sub: 'What is the core difference?' },
    { href: '#minimum-requirements', title: 'Minimum Requirements', sub: 'Where to start?' },
    { href: '#license-choice', title: 'Choosing a License', sub: 'Which license to use?' },
    { href: '#file-formats', title: 'File Formats', sub: 'Which format is best?' },
    { href: '#metadata-automation', title: 'Metadata Automation', sub: 'How to manage?' },
    { href: '#personal-data', title: 'GDPR and FAIR', sub: 'Are they compatible?' },
  ],
  ctaTitle: "Couldn't find what you needed?",
  ctaDescription: 'Send us your question — we usually reply within 1–2 working days.',
  ctaPrimary: 'Get in touch',
  ctaSecondary: 'Learn first',
};

export default function FAQPage() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;

  return (
    <>
      <Section align="center" title={s.title} description={s.description}>
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
      </Section>

      <Section bg="soft" kicker={s.quickKicker} title={s.quickTitle}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {s.quickLinks.map((q) => (
            <Link
              key={q.href}
              href={q.href as any}
              className="group flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5 no-underline shadow-xs transition-all hover:-translate-y-px hover:shadow-md"
            >
              <div>
                <div className="text-[15px] font-semibold text-ink">{q.title}</div>
                <div className="mt-0.5 text-[13px] text-muted">{q.sub}</div>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 flex-none text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <FAQSection />
      </Section>

      <Section bg="soft" align="center" title={s.ctaTitle} description={s.ctaDescription}>
        <div className="flex flex-wrap justify-center gap-3">
          <FvLinkButton href="/contact" size="lg">
            <Users className="h-4 w-4" />
            {s.ctaPrimary}
          </FvLinkButton>
          <FvLinkButton href="/learn" variant="ghost" size="lg">
            {s.ctaSecondary}
          </FvLinkButton>
        </div>
      </Section>
    </>
  );
}
