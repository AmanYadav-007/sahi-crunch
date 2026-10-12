/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#C45688',
          dark: '#A83A6E',
          light: '#D86B9B',
          deep: '#8F2859',
        },
        amber: {
          DEFAULT: '#D86B9B',
          dark: '#B04875',
          light: '#E88EB5',
          gold: '#C45688',
        },
        cream: {
          DEFAULT: '#FAF7F9',
          soft: '#F5EEF3',
          dark: '#EFE5EB',
        },
        charcoal: {
          DEFAULT: '#231C22',
          light: '#352C34',
          muted: '#634B5C',
        },
        navy: {
          DEFAULT: '#2B2332',
          dark: '#1D1722',
          slate: '#3D3444',
        },
        sage: {
          DEFAULT: '#4E8B56',
          dark: '#3d7044',
          light: '#5fa768',
        },
        kraft: {
          DEFAULT: '#C8CCD8',
          light: '#deb98e',
          dark: '#b88c57',
        },
        swiggy: {
          DEFAULT: '#C45688',
          dark: '#A83A6E',
          light: '#FBF0F5',
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
