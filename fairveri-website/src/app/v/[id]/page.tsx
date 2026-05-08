import Link from 'next/link';
import { Check, ShieldAlert, ExternalLink } from 'lucide-react';
import { decodePayload, type CertPayload } from '@/lib/cert-payload';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ d?: string }>;
}

const TR = {
  eyebrow: 'Sertifika Doğrulama',
  verified: 'Doğrulandı',
  unverified: 'Doğrulanamadı',
  unverifiedBody: 'Bu URL için doğrulama verisi eksik veya bozuk. Sertifikanın orijinal kopyasındaki QR kodu kullanın.',
  idMismatch: 'URL’deki sertifika kimliği ile QR verisi eşleşmiyor.',
  awarded: 'Verilen Kurum',
  submittedBy: 'Sunan',
  dataset: 'Veri Seti',
  doi: 'DOI',
  issued: 'Veriliş Tarihi',
  scoresTitle: 'FAIR Skorları',
  overall: 'Toplam Skor',
  certNo: 'Sertifika No',
  footer: 'Bu sertifika fairveri.com tarafından düzenlenmiştir.',
  back: 'Ana sayfaya dön',
  letters: { f: 'Bulunabilirlik', a: 'Erişilebilirlik', i: 'Birlikte Çalışabilirlik', r: 'Yeniden Kullanılabilirlik' },
};

const EN = {
  eyebrow: 'Certificate Verification',
  verified: 'Verified',
  unverified: 'Could not verify',
  unverifiedBody: 'Verification data is missing or corrupted in this URL. Please use the QR code on the original certificate.',
  idMismatch: 'The certificate ID in the URL does not match the QR data.',
  awarded: 'Awarded To',
  submittedBy: 'Submitted by',
  dataset: 'Dataset',
  doi: 'DOI',
  issued: 'Issued',
  scoresTitle: 'FAIR Scores',
  overall: 'Overall Score',
  certNo: 'Certificate',
  footer: 'This certificate was issued by fairveri.com.',
  back: 'Back to home',
  letters: { f: 'Findable', a: 'Accessible', i: 'Interoperable', r: 'Reusable' },
};

function formatLongDate(ms: number, lang: 'tr' | 'en'): string {
  const d = new Date(ms);
  const monthsTR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const day = d.getDate();
  const month = lang === 'tr' ? monthsTR[d.getMonth()] : monthsEN[d.getMonth()];
  return lang === 'tr' ? `${day} ${month} ${d.getFullYear()}` : `${month} ${day}, ${d.getFullYear()}`;
}

const FAIR_COLORS = {
  f: { color: '#b8860b', bg: '#fff7e2', fg: '#8a6510' },
  a: { color: '#9b2c2c', bg: '#ffeae8', fg: '#a8231b' },
  i: { color: '#0d7a55', bg: '#e2f4ee', fg: '#0d7a55' },
  r: { color: '#1d3fa8', bg: '#e7eefe', fg: '#1d3fa8' },
} as const;

export default async function VerifyPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { d } = await searchParams;

  const payload: CertPayload | null = d ? decodePayload(d) : null;
  const valid = !!payload;
  const idMismatch = payload && payload.id !== id;
  const lang: 'tr' | 'en' = payload?.lang === 'en' ? 'en' : 'tr';
  const s = lang === 'en' ? EN : TR;

  return (
    <div className="min-h-[calc(100vh-200px)] bg-bg-2 py-16">
      <div className="mx-auto max-w-3xl px-[var(--gutter)]">
        {/* eyebrow */}
        <div className="mb-6 text-center font-mono text-[12px] uppercase tracking-[0.28em] text-muted">
          {s.eyebrow}
        </div>

        {/* status badge */}
        <div className="mb-8 flex justify-center">
          {valid && !idMismatch ? (
            <div className="inline-flex items-center gap-3 rounded-full bg-brand-soft px-6 py-3 text-brand-deep ring-1 ring-brand/20">
              <Check className="h-5 w-5" strokeWidth={3} />
              <span className="text-base font-semibold">{s.verified}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-3 rounded-full bg-a-bg px-6 py-3 text-a-fg ring-1 ring-a-dot/30">
              <ShieldAlert className="h-5 w-5" strokeWidth={2.5} />
              <span className="text-base font-semibold">{s.unverified}</span>
            </div>
          )}
        </div>

        {/* main card */}
        <div className="rounded-2xl border border-line bg-surface p-8 shadow-sm sm:p-12">
          {!valid && (
            <p className="text-center text-base leading-relaxed text-ink-2">
              {s.unverifiedBody}
            </p>
          )}

          {valid && idMismatch && (
            <p className="mb-6 rounded-lg bg-a-bg px-4 py-3 text-center text-sm text-a-fg">
              {s.idMismatch}
            </p>
          )}

          {payload && (
            <>
              {/* cert id */}
              <div className="mb-6 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                  {s.certNo}
                </div>
                <div className="mt-1 font-mono text-base font-semibold tracking-wider text-ink">
                  {payload.id}
                </div>
              </div>

              {/* divider */}
              <div className="mb-8 flex items-center justify-center gap-3">
                <span className="h-px w-16 bg-line" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span className="h-px w-16 bg-line" />
              </div>

              {/* awarded to */}
              <div className="mb-8 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted">
                  {s.awarded}
                </div>
                <h1
                  className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  {payload.inst}
                </h1>
              </div>

              {/* meta grid */}
              <dl className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {s.submittedBy}
                  </dt>
                  <dd className="mt-1 text-base font-medium text-ink">{payload.name}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {s.issued}
                  </dt>
                  <dd className="mt-1 text-base font-medium text-ink">
                    {formatLongDate(payload.issuedAt, lang)}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    {s.dataset}
                  </dt>
                  <dd className="mt-1 break-words text-base italic text-ink-2">
                    “{payload.ds}”
                  </dd>
                </div>
                {payload.doi && (
                  <div className="sm:col-span-2">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                      {s.doi}
                    </dt>
                    <dd className="mt-1 break-all font-mono text-sm text-ink-2">
                      {payload.doi}
                    </dd>
                  </div>
                )}
              </dl>

              {/* scores */}
              <div className="mb-2">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                  {s.scoresTitle}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(['f', 'a', 'i', 'r'] as const).map((k) => (
                    <div
                      key={k}
                      className="rounded-lg border-t-[3px] p-4"
                      style={{
                        background: FAIR_COLORS[k].bg,
                        borderTopColor: FAIR_COLORS[k].color,
                      }}
                    >
                      <div className="flex items-baseline justify-between">
                        <span
                          className="text-xl font-bold"
                          style={{ color: FAIR_COLORS[k].color, fontFamily: 'var(--font-playfair), Georgia, serif' }}
                        >
                          {k.toUpperCase()}
                        </span>
                        <span className="text-2xl font-semibold tabular-nums text-ink">
                          {payload.scores[k]}
                          <span className="ml-0.5 text-sm text-muted">%</span>
                        </span>
                      </div>
                      <div className="mt-2 font-mono text-[9px] uppercase tracking-wider text-muted">
                        {s.letters[k]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* overall */}
                <div className="mt-4 flex items-center justify-between rounded-lg bg-ink p-5 text-bg">
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-bg/60">
                    {s.overall}
                  </span>
                  <span
                    className="text-4xl font-bold tabular-nums"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {payload.overall}
                    <span className="ml-1 text-2xl text-brand">%</span>
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div className="mt-8 text-center">
          <p className="text-sm italic text-muted">{s.footer}</p>
          <Link
            href={'/' as any}
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-brand-deep no-underline hover:underline"
          >
            {s.back}
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
