import type { Config } from 'tailwindcss';

/**
 * Shared Tailwind preset. Consumers extend this with their own `content` array.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        summit: {
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
          sky: {
            500: '#2563eb',
          },
          amber: {
            500: '#f59e0b',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(12,15,10,0.06), 0 4px 12px rgba(12,15,10,0.04)',
      },
    },
  },
};

export default preset satisfies Partial<Config>;
