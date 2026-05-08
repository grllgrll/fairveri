export interface CertPayload {
  id: string;
  inst: string;
  name: string;
  ds: string;
  doi?: string;
  scores: { f: number; a: number; i: number; r: number };
  overall: number;
  issuedAt: number;
  lang: 'tr' | 'en';
}

function utf8ToBase64Url(input: string): string {
  const utf8 =
    typeof TextEncoder !== 'undefined'
      ? new TextEncoder().encode(input)
      : null;

  let b64: string;
  if (utf8) {
    let bin = '';
    utf8.forEach((c) => (bin += String.fromCharCode(c)));
    b64 = typeof btoa !== 'undefined' ? btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
  } else {
    b64 = Buffer.from(input, 'utf8').toString('base64');
  }
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToUtf8(input: string): string {
  const b64 =
    input.replace(/-/g, '+').replace(/_/g, '/') +
    '='.repeat((4 - (input.length % 4)) % 4);

  if (typeof atob !== 'undefined') {
    const bin = atob(b64);
    if (typeof TextDecoder !== 'undefined') {
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder().decode(bytes);
    }
    return decodeURIComponent(escape(bin));
  }
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function encodePayload(p: CertPayload): string {
  return utf8ToBase64Url(JSON.stringify(p));
}

export function decodePayload(s: string): CertPayload | null {
  try {
    const json = base64UrlToUtf8(s);
    return JSON.parse(json) as CertPayload;
  } catch {
    return null;
  }
}

export const VERIFY_BASE_URL = 'https://fairveri.com';

export function buildVerifyUrl(payload: CertPayload): string {
  const encoded = encodePayload(payload);
  return `${VERIFY_BASE_URL}/v/${payload.id}?d=${encoded}`;
}
