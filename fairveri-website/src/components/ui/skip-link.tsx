'use client';

import React from 'react';
import Link from 'next/link';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <Link
      href={href}
      className={`skip-link ${className}`}
      style={{
        position: 'absolute',
        top: '-100px',
        left: '16px',
        background: '#3b82f6',
        color: 'white',
        padding: '8px 16px',
        textDecoration: 'none',
        borderRadius: '4px',
        zIndex: 1000,
        fontSize: '14px',
        fontWeight: '600',
        border: '2px solid transparent',
        transition: 'all 0.3s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '16px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100px';
      }}
    >
      {children}
    </Link>
  );
}

export function SkipNavigation() {
  return (
    <>
      <SkipLink href="#main-content">
        Ana içeriğe geç
      </SkipLink>
      <SkipLink href="#navigation" style={{ left: '160px' }}>
        Navigasyona geç
      </SkipLink>
      <SkipLink href="#footer" style={{ left: '320px' }}>
        Footer'a geç
      </SkipLink>
    </>
  );
}