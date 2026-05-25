/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background': '#121416',
        'brand-accent': '#c89384',
        'text-secondary': '#bfa399',
        'pure-white': '#ffffff',
        'body-light': '#e2e4e6',
        'border-accent': 'rgba(200, 147, 132, 0.15)',
        // ...add more as needed
      },
      fontFamily: {
        'headline-lg': ['Libre Caslon Text', 'serif'],
        'body-md': ['Manrope', 'sans-serif'],
        'display-lg': ['Libre Caslon Text', 'serif'],
        'label-caps': ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
      spacing: {
        'stack-xs': '4px',
        'stack-md': '24px',
        'unit': '8px',
        'margin-desktop': '64px',
        'gutter': '24px',
        'stack-lg': '48px',
        'container-max': '1280px',
        'margin-mobile': '20px',
        'stack-sm': '12px',
      },
      fontSize: {
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'label-caps': ['12px', { lineHeight: '16px', letterSpacing: '0.1em', fontWeight: '700' }],
        'headline-xl': ['48px', { lineHeight: '56px', fontWeight: '600' }],
        'display-lg': ['64px', { lineHeight: '72px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
};
