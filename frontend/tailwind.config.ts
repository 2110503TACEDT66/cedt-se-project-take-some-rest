import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      width: {
        '128': '32rem',
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      'cgr-white': '#FFFAFB',
      'cgr-light-green': '#7DE2D1',
      'cgr-dark-green': '#339989',
      'cgr-gray-10': '#F2F2F2',
      'cgr-gray-20': '#E6E6E6',
      'cgr-gray-30': '#D9D9D9',
      'cgr-gray-40': '#CECECE',
      'cgr-gray-50': '#9A9A9A',
      'cgr-gray-60': '#5C5C5C',
      'cgr-gray-70': '#464643',
      'cgr-gray-80': '#2B2C28',
      'cgr-black': '#131515',
      'cgr-red': '#FF6363',
    },
  },
  plugins: [],
}
export default config
