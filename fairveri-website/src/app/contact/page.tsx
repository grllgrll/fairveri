'use client';

import { useState } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { FvButton } from '@/components/ui/fv-button';
import { useLanguage } from '@/contexts/language-context';

const TR = {
  kicker: 'İletişim',
  title: 'Sorularınız için buradayız.',
  description:
    'FAIR veri prensipleri, eğitim talepleri ve işbirliği fırsatları için bizimle iletişime geçin. Genellikle 1–2 iş günü içinde yanıt veriyoruz.',
  formTitle: 'Mesaj gönderin',
  name: 'Ad soyad',
  namePh: 'Adınız ve soyadınız',
  email: 'E-posta',
  emailPh: 'siz@kurum.edu.tr',
  topic: 'Konu',
  topicPh: 'Hakkında konuşmak istediğiniz konu',
  msg: 'Mesaj',
  msgPh: 'Mesajınız…',
  send: 'Gönder',
  sent: 'Mesajınız kaydedildi. Teşekkürler!',
  cards: [
    { icon: Mail, title: 'E-posta', body: 'merhaba@fairveri.com', href: 'mailto:merhaba@fairveri.com' },
    { icon: MessageCircle, title: 'Topluluk', body: 'GitHub Discussions', href: 'https://github.com' },
    { icon: MapPin, title: 'Konum', body: 'İstanbul, Türkiye' },
  ],
};

const EN = {
  kicker: 'Contact',
  title: "We're here for your questions.",
  description:
    'Reach out about FAIR principles, training requests or collaboration opportunities. We typically reply within 1–2 working days.',
  formTitle: 'Send a message',
  name: 'Full name',
  namePh: 'Your full name',
  email: 'Email',
  emailPh: 'you@institution.edu',
  topic: 'Topic',
  topicPh: 'What would you like to discuss?',
  msg: 'Message',
  msgPh: 'Your message…',
  send: 'Send',
  sent: 'Thanks — your message was recorded.',
  cards: [
    { icon: Mail, title: 'Email', body: 'hello@fairveri.com', href: 'mailto:hello@fairveri.com' },
    { icon: MessageCircle, title: 'Community', body: 'GitHub Discussions', href: 'https://github.com' },
    { icon: MapPin, title: 'Location', body: 'Istanbul, Turkey' },
  ],
};

export default function ContactPage() {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;
  const [sent, setSent] = useState(false);

  const labelCls = 'mb-1.5 block text-[13px] font-medium text-ink-2';
  const inputCls =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-brand focus:outline-none';

  return (
    <>
      <Section align="center" kicker={s.kicker} title={s.title} description={s.description}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {s.cards.map(({ icon: Icon, title, body, href }) => {
            const inner = (
              <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-5 shadow-xs transition-all hover:-translate-y-px hover:shadow-md">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-brand-soft text-brand-deep">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-[13px] font-medium text-muted">{title}</div>
                  <div className="text-[15px] font-semibold text-ink">{body}</div>
                </div>
              </div>
            );
            return href ? (
              <a key={title} href={href} className="no-underline">
                {inner}
              </a>
            ) : (
              <div key={title}>{inner}</div>
            );
          })}
        </div>
      </Section>

      <Section bg="soft">
        <div className="mx-auto max-w-[640px] rounded-3xl border border-line bg-surface p-7 shadow-xs lg:p-10">
          <h2 className="mb-6 text-[22px] font-bold text-ink">{s.formTitle}</h2>
          {sent ? (
            <div className="rounded-2xl bg-i-bg p-5 text-i-fg">{s.sent}</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="flex flex-col gap-5"
            >
              <div>
                <label htmlFor="c-name" className={labelCls}>
                  {s.name} *
                </label>
                <input id="c-name" type="text" required placeholder={s.namePh} className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-email" className={labelCls}>
                  {s.email} *
                </label>
                <input id="c-email" type="email" required placeholder={s.emailPh} className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-topic" className={labelCls}>
                  {s.topic}
                </label>
                <input id="c-topic" type="text" placeholder={s.topicPh} className={inputCls} />
              </div>
              <div>
                <label htmlFor="c-msg" className={labelCls}>
                  {s.msg} *
                </label>
                <textarea id="c-msg" required rows={6} placeholder={s.msgPh} className={inputCls} />
              </div>
              <div className="pt-2">
                <FvButton type="submit" size="lg">
                  {s.send}
                </FvButton>
              </div>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}
