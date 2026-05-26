import type { Config } from 'tailwindcss';

import preset from '@summit/config/tailwind';

const config: Config = {
  presets: [require('nativewind/preset'), preset as Partial<Config>],
  content: ['./src/**/*.{ts,tsx}', './app/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};

export default config;
