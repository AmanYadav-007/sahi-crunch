/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
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
        swiggy: {
          DEFAULT: '#681121',
          dark: '#540c19',
          light: '#fff4ed',
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
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'float': '0 10px 30px -4px rgba(0, 0, 0, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.08)',
        'nav': '0 -4px 20px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
