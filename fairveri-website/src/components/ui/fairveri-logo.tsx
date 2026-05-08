import * as React from 'react';

interface Props {
  size?: number;
  className?: string;
  label?: string;
}

/**
 * Two-tone wordmark — koyu lacivert "fair" + brand yeşili "veri".
 * Theme-aware via CSS variables (--ink, --brand) so dark mode swaps automatically.
 * Quicksand 600 with tight letter-spacing matches the existing brand language.
 */
export function FairveriLogo({ size = 36, className, label = 'fairveri' }: Props) {
  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      style={{
        fontFamily: 'var(--font-quicksand), "Quicksand", "Nunito", "Inter", sans-serif',
        fontWeight: 600,
        fontSize: size,
        letterSpacing: '-0.01em',
        lineHeight: 1,
        display: 'inline-flex',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ color: 'var(--ink)' }}>fair</span>
      <span style={{ color: 'var(--brand)' }}>veri</span>
    </span>
  );
}
