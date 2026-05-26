/**
 * Design tokens that are shared verbatim between web (Tailwind) and mobile
 * (NativeWind). Update {@link ../../config/tailwind.config.ts} together with
 * this file.
 */
export const colors = {
  green: {
    50: '#f1f9ed',
    100: '#e7f5e1',
    200: '#c8e4ba',
    300: '#9fce8a',
    400: '#6db84e',
    500: '#3da524',
    600: '#2e9418',
    700: '#1e7c0d',
    800: '#165e0a',
    900: '#103f08',
  },
  charcoal: {
    50: '#f6f6f5',
    100: '#e7e8e4',
    300: '#a4a89e',
    500: '#5b6256',
    700: '#2b3128',
    900: '#0c0f0a',
  },
  sand: {
    50: '#fbfaf6',
    100: '#f6f4eb',
    200: '#ece9dd',
    300: '#d8d3bd',
  },
  sky: { 500: '#2563eb' },
  amber: { 500: '#f59e0b' },
  red: { 500: '#dc2626' },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export type ColorScale = keyof typeof colors;
