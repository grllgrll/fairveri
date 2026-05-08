/**
 * Design tokens for FAIR Data website
 * Centralized constants for consistent theming across components
 */

// Color tokens — fairveri.com refined palette.
// Brand is the green from --brand, FAIR letters use the four semantic colors.
export const colors = {
  // Brand green
  primary: {
    50: '#e8f5ee',
    100: '#cfeadd',
    200: '#9fd6bb',
    300: '#6fc299',
    400: '#3fae77',
    500: '#0d8a5b', // --brand
    600: '#0a7a4f',
    700: '#075c3d',
    800: '#053f2a',
    900: '#032117',
  },

  // F — yellow
  secondary: {
    50: '#fff7e2',
    100: '#fef0c7',
    200: '#fde293',
    300: '#fbd25e',
    400: '#f8c129',
    500: '#f5b400', // --c-f-dot
    600: '#c79200',
    700: '#8a6510',
    800: '#5d440a',
    900: '#2f2205',
  },

  // R — blue
  accent: {
    50: '#e7eefe',
    100: '#cfddfd',
    200: '#9fbafb',
    300: '#7099f8',
    400: '#4f7cea',
    500: '#2f5dd5', // --c-r-dot
    600: '#2548aa',
    700: '#1d3fa8',
    800: '#162c75',
    900: '#0d1a47',
  },

  // I — mint
  success: {
    50: '#e2f4ee',
    100: '#bfe7d7',
    200: '#8ed8b8',
    300: '#5dc998',
    400: '#2bba79',
    500: '#06b07d', // --c-i-dot
    600: '#0d7a55',
    700: '#0a5e42',
    800: '#06432f',
    900: '#03291c',
  },

  // F — amber/yellow re-exposed for warning role
  warning: {
    50: '#fff7e2',
    100: '#fef0c7',
    200: '#fde293',
    300: '#fbd25e',
    400: '#f8c129',
    500: '#f5b400',
    600: '#c79200',
    700: '#8a6510',
    800: '#5d440a',
    900: '#2f2205',
  },

  // A — red
  error: {
    50: '#ffeae8',
    100: '#fecdc9',
    200: '#fc9b94',
    300: '#fa6a5e',
    400: '#f24a3d',
    500: '#e63946', // --c-a-dot
    600: '#c12c38',
    700: '#a8231b',
    800: '#75180f',
    900: '#420d07',
  },

  // Neutral — slate
  neutral: {
    50: '#fbfbf8',  // --bg
    100: '#f5f4ef', // --bg-2
    200: '#e6e4dc', // --line
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // --muted
    600: '#475569',
    700: '#334155', // --ink-2
    800: '#1e293b',
    900: '#0f172a', // --ink
  },
} as const;

// Typography tokens
export const typography = {
  fontFamily: {
    sans: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-jetbrains-mono), ui-monospace, monospace',
  },
  
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.2,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Spacing tokens
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  56: '14rem',    // 224px
  64: '16rem',    // 256px
} as const;

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

// Shadow tokens
export const shadows = {
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// Animation tokens
export const animations = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

// Breakpoint tokens
export const breakpoints = {
  xs: '36em',   // 576px
  sm: '48em',   // 768px
  md: '62em',   // 992px
  lg: '75em',   // 1200px
  xl: '88em',   // 1408px
} as const;

// Z-index tokens
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem',    // 48px
      xl: '3.5rem',  // 56px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    },
  },
  
  input: {
    height: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem',    // 48px
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.75rem 1rem',
      lg: '1rem 1.25rem',
    },
  },
  
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '2.5rem',
    },
  },
} as const;

// Brand-specific gradients (fairveri.com refined palette)
export const gradients = {
  fair: 'linear-gradient(135deg, #f5b400 0%, #e63946 33%, #06b07d 66%, #2f5dd5 100%)',
  hero: 'linear-gradient(135deg, #fbfbf8 0%, #ffffff 50%, #f5f4ef 100%)',
  heroDark: 'linear-gradient(135deg, #0b1018 0%, #131c2b 50%, #0f1622 100%)',
  primary: 'linear-gradient(135deg, #075c3d 0%, #0d8a5b 100%)',
  secondary: 'linear-gradient(135deg, #f5b400 0%, #f8c129 100%)',
  success: 'linear-gradient(135deg, #0d7a55 0%, #06b07d 100%)',
  warning: 'linear-gradient(135deg, #8a6510 0%, #f5b400 100%)',
} as const;

// Export all tokens as a single object for convenience
export const designTokens = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
  gradients,
} as const;

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors;
export type ColorShade = keyof typeof colors.primary;
export type FontSizeToken = keyof typeof typography.fontSize;
export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type ShadowToken = keyof typeof shadows;
export type BreakpointToken = keyof typeof breakpoints;