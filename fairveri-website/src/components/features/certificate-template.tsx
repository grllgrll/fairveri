import * as React from 'react';
import type { AssessmentMetadata, AssessmentResults } from '@/lib/assessment-store';
import { VERIFY_BASE_URL } from '@/lib/cert-payload';

interface Props {
  metadata: AssessmentMetadata;
  results: AssessmentResults;
  certificateId: string;
  overallPct: number;
  lang: 'tr' | 'en';
  issuedAt?: Date;
}

const TR = {
  eyebrow: 'FAIR Veri Yetkinlik Sertifikası',
  awardedTo: 'işbu belge ile aşağıda adı yazılı kuruma verilmiştir',
  body: (dataset: string, person: string) =>
    `${person} tarafından sunulan “${dataset}” veri seti için FAIR ilkeleri değerlendirmesi başarıyla tamamlanmıştır.`,
  overallLabel: 'Toplam Skor',
  authorityLine: 'fairveri · Veri Yönetişim Otoritesi',
  certLabel: 'Sertifika No',
  issuedLabel: 'Veriliş Tarihi',
  verifyLabel: 'Doğrulama',
  sealText: (year: number) => `FAIRVERI · ONAYLI · ${year} ·`,
};

const EN = {
  eyebrow: 'FAIR Data Stewardship Certificate',
  awardedTo: 'is hereby awarded to the institution named below',
  body: (dataset: string, person: string) =>
    `for the successful FAIR assessment of the dataset “${dataset}”, submitted by ${person}.`,
  overallLabel: 'Overall Score',
  authorityLine: 'fairveri · Data Stewardship Authority',
  certLabel: 'Certificate',
  issuedLabel: 'Issued',
  verifyLabel: 'Verify',
  sealText: (year: number) => `FAIRVERI · CERTIFIED · ${year} ·`,
};

const CATEGORIES: Array<{ id: string; letter: 'F' | 'A' | 'I' | 'R'; color: string }> = [
  { id: 'findable',      letter: 'F', color: '#b8860b' },
  { id: 'accessible',    letter: 'A', color: '#9b2c2c' },
  { id: 'interoperable', letter: 'I', color: '#0d7a55' },
  { id: 'reusable',      letter: 'R', color: '#1d3fa8' },
];

const SERIF = '"Playfair Display", "EB Garamond", Georgia, "Times New Roman", serif';
const SANS = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, "Cascadia Mono", monospace';
const WORDMARK = 'Quicksand, "Nunito", Inter, sans-serif';

const INK = '#1a1d29';
const INK_2 = '#3d4255';
const MUTED = '#7a7f93';
const HAIRLINE = '#d8d4c8';
const PARCHMENT = '#faf7ee';
const PARCHMENT_2 = '#f4efe0';
const BRAND = '#0d8a5b';
const BRAND_DEEP = '#075c3d';
const GOLD = '#a8884a';

function pad2(n: number) {
  return n.toString().padStart(2, '0');
}

function formatDate(d: Date, lang: 'tr' | 'en'): string {
  const day = pad2(d.getDate());
  const monthsTR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const monthsEN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const m = lang === 'tr' ? monthsTR[d.getMonth()] : monthsEN[d.getMonth()];
  return lang === 'tr' ? `${day} ${m} ${d.getFullYear()}` : `${m} ${parseInt(day, 10)}, ${d.getFullYear()}`;
}

// Renders the certificate at exactly 1123x794px (A4 landscape @ 96dpi).
// All styling is inline so html2canvas captures it without external CSS dependencies.
export const CertificateTemplate: React.FC<Props> = ({
  metadata,
  results,
  certificateId,
  overallPct,
  lang,
  issuedAt = new Date(),
}) => {
  const s = lang === 'en' ? EN : TR;
  const dateLong = formatDate(issuedAt, lang);
  const sealText = s.sealText(issuedAt.getFullYear()).repeat(3);

  const verifyDisplay = `${VERIFY_BASE_URL.replace(/^https?:\/\//, '')}/v/${certificateId}`;

  return (
    <div
      style={{
        width: 1123,
        height: 794,
        background: PARCHMENT,
        backgroundImage: `radial-gradient(ellipse at center, ${PARCHMENT} 0%, ${PARCHMENT_2} 100%)`,
        color: INK,
        fontFamily: SERIF,
        position: 'relative',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* ── ENGRAVED FRAME ────────────────────────────────── */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 28,
          border: `1px solid ${INK}`,
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 36,
          border: `0.5px solid ${GOLD}`,
          opacity: 0.55,
          pointerEvents: 'none',
        }}
      />

      {/* ── INNER CONTENT ─────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          padding: '60px 100px 52px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* META BAR — cert id + date left, wordmark right */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 40,
            fontFamily: MONO,
            fontSize: 9.5,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: MUTED,
            lineHeight: 1.7,
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div>
              <span>{s.certLabel}</span>{' '}
              <span style={{ color: INK, fontWeight: 600, letterSpacing: '0.16em' }}>{certificateId}</span>
            </div>
            <div>
              <span>{s.issuedLabel}</span>{' '}
              <span style={{ color: INK, fontWeight: 600, letterSpacing: '0.14em' }}>{dateLong}</span>
            </div>
          </div>

          <span
            style={{
              fontFamily: WORDMARK,
              fontSize: 22,
              letterSpacing: '-0.01em',
              fontWeight: 600,
              lineHeight: 1,
              textTransform: 'none',
              color: INK,
              display: 'inline-flex',
              flexShrink: 0,
            }}
          >
            <span>fair</span>
            <span style={{ color: BRAND }}>veri</span>
          </span>
        </div>

        {/* ORNAMENT */}
        <div style={{ marginTop: 36 }}>
          <Ornament />
        </div>

        {/* EYEBROW */}
        <div
          style={{
            marginTop: 14,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 22,
            letterSpacing: '0.02em',
            color: INK_2,
          }}
        >
          {s.eyebrow}
        </div>

        {/* AWARDED-TO LINE */}
        <div
          style={{
            marginTop: 28,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 15,
            color: MUTED,
            letterSpacing: '0.02em',
            maxWidth: 720,
          }}
        >
          — {s.awardedTo} —
        </div>

        {/* INSTITUTION NAME (the recipient) */}
        <h1
          style={{
            margin: '18px 0 0',
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: 56,
            lineHeight: 1.1,
            letterSpacing: '0.005em',
            color: INK,
            maxWidth: 920,
            wordBreak: 'break-word',
          }}
        >
          {metadata.institution}
        </h1>

        {/* GOLD HAIRLINE + DOT */}
        <div
          aria-hidden
          style={{
            marginTop: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <span style={{ width: 90, height: 1, background: GOLD, opacity: 0.55 }} />
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: GOLD }} />
          <span style={{ width: 90, height: 1, background: GOLD, opacity: 0.55 }} />
        </div>

        {/* BODY (mentions submitter + dataset) */}
        <p
          style={{
            margin: '20px 0 0',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 17,
            lineHeight: 1.6,
            color: INK_2,
            maxWidth: 760,
          }}
        >
          {s.body(metadata.datasetTitle, metadata.fullName)}
        </p>

        {/* spacer */}
        <div style={{ flex: 1 }} />

        {/* SCORE BAND */}
        <div
          style={{
            width: '100%',
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 32,
            paddingTop: 20,
            paddingBottom: 20,
            borderTop: `1px solid ${HAIRLINE}`,
            borderBottom: `1px solid ${HAIRLINE}`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 40 }}>
            {CATEGORIES.map((c) => {
              const cs = results.categoryScores[c.id];
              const pct = cs?.percentage ?? 0;
              return (
                <div key={c.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: 30,
                      color: c.color,
                      letterSpacing: '0.01em',
                      lineHeight: 1,
                    }}
                  >
                    {c.letter}
                  </span>
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 500,
                      fontSize: 30,
                      color: INK,
                      fontVariantNumeric: 'tabular-nums',
                      letterSpacing: '-0.01em',
                      lineHeight: 1,
                    }}
                  >
                    {pct.toFixed(0)}
                    <span style={{ fontSize: 15, color: MUTED, marginLeft: 1, fontStyle: 'italic' }}>%</span>
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: '0.26em',
                textTransform: 'uppercase',
                color: MUTED,
                marginBottom: 4,
              }}
            >
              {s.overallLabel}
            </div>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 50,
                lineHeight: 1,
                color: BRAND_DEEP,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.01em',
              }}
            >
              {overallPct.toFixed(0)}
              <span style={{ fontSize: 24, color: BRAND, fontStyle: 'italic', marginLeft: 2 }}>%</span>
            </div>
          </div>
        </div>

        {/* AUTHORITY + SEAL ROW */}
        <div
          style={{
            width: '100%',
            marginTop: 28,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ textAlign: 'left', flex: 1, maxWidth: 380 }}>
            <div
              aria-hidden
              style={{ height: 1, background: INK, opacity: 0.6, marginBottom: 8 }}
            />
            <div
              style={{
                fontFamily: SERIF,
                fontStyle: 'italic',
                fontSize: 13,
                color: INK_2,
                letterSpacing: '0.01em',
              }}
            >
              {s.authorityLine}
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 8.5,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: MUTED,
                marginTop: 6,
              }}
            >
              {s.verifyLabel} · {verifyDisplay}
            </div>
            {metadata.doi && (
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: '0.18em',
                  color: MUTED,
                  marginTop: 2,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: 380,
                }}
              >
                DOI · {metadata.doi}
              </div>
            )}
          </div>

          <Seal text={sealText} />
        </div>
      </div>
    </div>
  );
};

// ── Decorative ornament centered above the title ──────────────────
function Ornament() {
  return (
    <svg width={180} height={14} viewBox="0 0 180 14" aria-hidden>
      <line x1={0} y1={7} x2={62} y2={7} stroke={GOLD} strokeWidth={0.6} opacity={0.7} />
      <line x1={118} y1={7} x2={180} y2={7} stroke={GOLD} strokeWidth={0.6} opacity={0.7} />
      <g transform="translate(90 7)">
        <circle r={4} fill="none" stroke={GOLD} strokeWidth={0.7} />
        <circle r={1.6} fill={GOLD} />
        <circle cx={-12} r={1.2} fill={GOLD} opacity={0.7} />
        <circle cx={12} r={1.2} fill={GOLD} opacity={0.7} />
        <circle cx={-22} r={0.8} fill={GOLD} opacity={0.5} />
        <circle cx={22} r={0.8} fill={GOLD} opacity={0.5} />
      </g>
    </svg>
  );
}

// ── Verification seal ──────────────────────────────────────────────
function Seal({ text }: { text: string }) {
  const size = 130;
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden style={{ flexShrink: 0 }}>
      <defs>
        <path
          id="seal-ring-outer"
          d={`M ${c},${c} m -${c - 14},0 a ${c - 14},${c - 14} 0 1,1 ${(c - 14) * 2},0 a ${c - 14},${c - 14} 0 1,1 -${(c - 14) * 2},0`}
          fill="none"
        />
      </defs>

      <circle cx={c} cy={c} r={c - 5} fill="none" stroke={INK} strokeWidth={1.2} />
      <circle cx={c} cy={c} r={c - 9} fill="none" stroke={INK} strokeWidth={0.4} opacity={0.5} />

      <text
        fontFamily={MONO}
        fontSize={7.5}
        fill={INK}
        letterSpacing="1.6"
        fontWeight={600}
        style={{ textTransform: 'uppercase' }}
      >
        <textPath href="#seal-ring-outer" startOffset="0">
          {text}
        </textPath>
      </text>

      <circle cx={c} cy={c} r={c - 28} fill={PARCHMENT} stroke={GOLD} strokeWidth={0.6} />

      <text
        x={c}
        y={c + 5}
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize={26}
        fontWeight={700}
        fontStyle="italic"
        fill={BRAND_DEEP}
      >
        fv
      </text>

      <circle cx={c} cy={c - 22} r={1.2} fill={GOLD} opacity={0.7} />
      <circle cx={c} cy={c + 22} r={1.2} fill={GOLD} opacity={0.7} />
      <circle cx={c - 22} cy={c} r={1.2} fill={GOLD} opacity={0.7} />
      <circle cx={c + 22} cy={c} r={1.2} fill={GOLD} opacity={0.7} />
    </svg>
  );
}
