/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#ffffff',
        'fg': '#0f1115',
        'muted': '#6b7177',
        'hair': '#e5e7eb',
        'acc': '#92BAC2',
      },
      zIndex: {
        '9999': '9999',
        '1000': '1000',
      },
      transitionProperty: {
        'height': 'height',
        'background': 'background-color',
        'border': 'border-color',
        'transform': 'transform',
      },
      transitionDuration: {
        '250': '250ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
        'ease': 'ease',
      },
      fontFamily: {
        'fira-sans': ['"Fira Sans Extra Condensed"', 'sans-serif'],
      },
      spacing: {
        'hdr-h': '60px',
        'railW': '96px',
        'colW': '556px',
      },
      maxWidth: {
        'page': '1240px',
      },
      fontSize: {
        'xs': ['12px', '1.2'],
        'sm': ['13px', '1.2'],
        'base': ['15px', '1.45'],
        'lg': ['17px', '1.45'],
        'xl': ['clamp(56px,11vw,104px)', '1'],
        '2xl': ['96px', '1'],
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
  darkMode: 'media',
}