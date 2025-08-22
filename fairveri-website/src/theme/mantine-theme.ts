import { createTheme, MantineColorsTuple } from '@mantine/core';

// Professional FAIR Data color palette
const navy: MantineColorsTuple = [
  '#f0f4ff',
  '#d9e2ff',
  '#adc2ff',
  '#7c9eff',
  '#5681ff',
  '#3c71ff',
  '#1e40af', // Primary navy blue
  '#1a3a9e',
  '#16338c',
  '#122b7a'
];

const teal: MantineColorsTuple = [
  '#e6f7ff',
  '#bae7ff',
  '#7dd3fc',
  '#38bdf8',
  '#0ea5e9',
  '#0891b2', // Primary teal
  '#0e7490',
  '#155e75',
  '#164e63',
  '#083344'
];

const electricBlue: MantineColorsTuple = [
  '#eff6ff',
  '#dbeafe',
  '#bfdbfe',
  '#93c5fd',
  '#60a5fa',
  '#3b82f6', // Primary electric blue
  '#2563eb',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a'
];

const success: MantineColorsTuple = [
  '#ecfdf5',
  '#d1fae5',
  '#a7f3d0',
  '#6ee7b7',
  '#34d399',
  '#059669', // Primary success green
  '#047857',
  '#065f46',
  '#064e3b',
  '#022c22'
];

const warning: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#fcd34d',
  '#fbbf24',
  '#d97706', // Primary warning amber
  '#b45309',
  '#92400e',
  '#78350f',
  '#451a03'
];

export const mantineTheme = createTheme({
  colorScheme: 'light',
  primaryColor: 'navy',
  primaryShade: 6,
  
  colors: {
    navy,
    teal,
    electricBlue,
    success,
    warning,
  },

  // Professional typography - Academic standard fonts
  fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyMonospace: 'var(--font-jetbrains-mono), JetBrains Mono, Consolas, "Liberation Mono", monospace',
  
  headings: {
    fontFamily: 'var(--font-inter), Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeight: '600',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.1', fontWeight: '700' },
      h2: { fontSize: '2rem', lineHeight: '1.2', fontWeight: '600' }, 
      h3: { fontSize: '1.75rem', lineHeight: '1.3', fontWeight: '600' },
      h4: { fontSize: '1.5rem', lineHeight: '1.4', fontWeight: '600' },
      h5: { fontSize: '1.25rem', lineHeight: '1.5', fontWeight: '500' },
      h6: { fontSize: '1.125rem', lineHeight: '1.5', fontWeight: '500' },
    },
  },

  // Professional spacing and sizing
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  radius: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
  },

  // Professional shadows
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Component-specific theming
  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
          transition: 'all 200ms ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
      },
    },

    Card: {
      defaultProps: {
        shadow: 'sm',
        radius: 'lg',
        padding: 'lg',
      },
      styles: {
        root: {
          border: '1px solid #e5e7eb',
          transition: 'all 200ms ease',
          '&:hover': {
            shadow: 'md',
            transform: 'translateY(-2px)',
          },
        },
      },
    },

    Paper: {
      defaultProps: {
        shadow: 'xs',
        radius: 'md',
        padding: 'md',
      },
    },

    Container: {
      defaultProps: {
        sizes: {
          xs: 540,
          sm: 720,
          md: 960,
          lg: 1140,
          xl: 1320,
        },
      },
    },

    Input: {
      defaultProps: {
        radius: 'md',
        size: 'md',
      },
      styles: {
        input: {
          transition: 'all 200ms ease',
          '&:focus': {
            transform: 'scale(1.02)',
          },
        },
      },
    },

    Badge: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
      },
    },

    Table: {
      defaultProps: {
        striped: true,
        highlightOnHover: true,
        verticalSpacing: 'sm',
        horizontalSpacing: 'lg',
      },
    },
    
    Notification: {
      defaultProps: {
        radius: 'md',
        autoClose: 5000,
      },
    },
  },

  // Responsive breakpoints
  breakpoints: {
    xs: '36em', // 576px
    sm: '48em', // 768px  
    md: '62em', // 992px
    lg: '75em', // 1200px
    xl: '88em', // 1408px
  },

  // Other theme properties
  other: {
    brandColors: {
      primary: '#1e40af',
      secondary: '#0891b2', 
      accent: '#3b82f6',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
    },
    
    gradients: {
      fairGradient: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #3b82f6 100%)',
      heroGradient: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)',
    },
  },
});

// Dark theme configuration
export const mantineDarkTheme = createTheme({
  ...mantineTheme,
  colorScheme: 'dark',
  
  colors: {
    ...mantineTheme.colors,
    dark: [
      '#ffffff',
      '#f8f9fa', 
      '#e9ecef',
      '#dee2e6',
      '#ced4da',
      '#adb5bd',
      '#6c757d',
      '#495057',
      '#343a40',
      '#212529'
    ],
  },

  other: {
    ...mantineTheme.other,
    gradients: {
      fairGradient: 'linear-gradient(135deg, #3b82f6 0%, #0891b2 50%, #1e40af 100%)',
      heroGradient: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #374151 100%)',
    },
  },
});