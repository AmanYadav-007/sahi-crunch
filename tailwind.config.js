/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070605',
          900: '#0b0a09',
          850: '#100e0c',
          800: '#16130f',
          700: '#1e1a16',
          600: '#2a251f',
        },
        ivory: {
          DEFAULT: '#f1eadd',
          soft: '#e6ddcd',
          dim: 'rgba(241,234,221,0.56)',
          faint: 'rgba(241,234,221,0.28)',
        },
        amber: {
          DEFAULT: '#e6a756',
          glow: '#e6a756',
          deep: '#c07b31',
        },
        chili: '#b5381f',
        herb: '#7d9b62',
        gold: '#c9a24b',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.24em',
        wide2: '0.14em',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
        inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      zIndex: {
        canvas: '0',
        content: '10',
        nav: '40',
        drawer: '45',
        loader: '60',
        cursor: '70',
      },
    },
  },
  plugins: [],
};
