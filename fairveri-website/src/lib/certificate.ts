'use client';

import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { CertificateTemplate } from '@/components/features/certificate-template';
import type { AssessmentMetadata, AssessmentResults } from '@/lib/assessment-store';

interface GenerateOptions {
  metadata: AssessmentMetadata;
  results: AssessmentResults;
  certificateId: string;
  overallPct: number;
  lang: 'tr' | 'en';
}

// Wait for all <img> children inside `node` to finish loading (or error out).
function waitForImages(node: HTMLElement): Promise<void> {
  const imgs = Array.from(node.querySelectorAll('img'));
  if (imgs.length === 0) return Promise.resolve();
  return Promise.all(
    imgs.map((img) =>
      img.complete && img.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
          })
    )
  ).then(() => undefined);
}

// Poll until React has committed children to `host` (or timeout).
async function waitForFirstChild(host: HTMLElement, timeoutMs = 1000): Promise<HTMLElement> {
  const start = performance.now();
  while (!host.firstElementChild) {
    if (performance.now() - start > timeoutMs) {
      throw new Error('Certificate template did not mount in time');
    }
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
  }
  return host.firstElementChild as HTMLElement;
}

export async function generateCertificatePDF(options: GenerateOptions): Promise<Blob> {
  const { metadata, results, certificateId, overallPct, lang } = options;

  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  // Mount the certificate offscreen so html2canvas can capture it.
  const host = document.createElement('div');
  host.setAttribute('aria-hidden', 'true');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  host.style.top = '0';
  host.style.width = '1123px';
  host.style.height = '794px';
  host.style.pointerEvents = 'none';
  host.style.zIndex = '-1';
  document.body.appendChild(host);

  const root = createRoot(host);
  root.render(
    createElement(CertificateTemplate, {
      metadata,
      results,
      certificateId,
      overallPct,
      lang,
    })
  );

  try {
    // Give React enough frames to commit, then wait for any images and fonts.
    const target = await waitForFirstChild(host);
    await waitForImages(host);
    if (typeof document !== 'undefined' && (document as any).fonts?.ready) {
      try {
        await (document as any).fonts.ready;
      } catch {
        // ignore — html2canvas will fall back to whatever is loaded
      }
    }

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#fbfbf8',
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a4', // 842 x 595 pt
    });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pageW, pageH, undefined, 'FAST');
    return pdf.output('blob');
  } finally {
    root.unmount();
    host.remove();
  }
}
