import shared from '@summit/config/eslint';

export default [
  ...shared,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      // App Router pages can default-export an inferred type
      'import/no-default-export': 'off',
    },
  },
];
