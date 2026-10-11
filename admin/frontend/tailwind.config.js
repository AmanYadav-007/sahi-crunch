/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#681121',
          dark: '#540c19',
          light: '#82182c',
          deep: '#701222',
        },
        amber: {
          DEFAULT: '#D48924',
          dark: '#b87319',
          light: '#E2952A',
          gold: '#e69f35',
        },
        cream: {
          DEFAULT: '#FDFBF7',
          soft: '#FBF7F0',
          dark: '#f3ece0',
        },
        charcoal: {
          DEFAULT: '#1E1E24',
          light: '#2d2d36',
          muted: '#5a5a66',
        },
        navy: {
          DEFAULT: '#1D2E47',
          dark: '#142033',
          slate: '#2C3E50',
        },
        sage: {
          DEFAULT: '#4E8B56',
          dark: '#3d7044',
          light: '#5fa768',
        },
        kraft: {
          DEFAULT: '#D1A673',
          light: '#deb98e',
          dark: '#b88c57',
        },
        brand: {
          50: '#FDFBF7',
          100: '#FBF7F0',
          200: '#f5ebd9',
          500: '#681121',
          600: '#540c19',
          700: '#701222',
        },
      },
      fontFamily: {
        sans: ['Jost', '"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Jost', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        hand: ['"Cormorant Garamond"', 'Georgia', 'Times New Roman', 'serif'],
        note: ['Jost', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        float: '0 10px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        nav: '0 -4px 20px rgba(0, 0, 0, 0.06)',
        paper: '3px 4px 0 rgba(84,12,25,0.05), 0 16px 30px -22px rgba(84,12,25,0.4)',
        'paper-lift': '4px 6px 0 rgba(84,12,25,0.08), 0 20px 40px -24px rgba(84,12,25,0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [
    ({ addUtilities }: any) => {
      // Pinned-note tilt helpers — registered as real utilities so
      // variants like `hover:tilt-0` work exactly like in the customer panel.
      addUtilities({
        '.tilt-l': { transform: 'rotate(-0.7deg)' },
        '.tilt-r': { transform: 'rotate(0.6deg)' },
        '.tilt-l-sm': { transform: 'rotate(-0.4deg)' },
        '.tilt-r-sm': { transform: 'rotate(0.5deg)' },
        '.tilt-0': { transform: 'rotate(0deg)' },
      });
    },
  ],
};
