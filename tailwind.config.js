/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#13131b',
        surface: {
          DEFAULT: '#13131b',
          bright: '#393841',
          container: '#1f1f27',
          low: '#1b1b23',
          lowest: '#0d0d15',
          high: '#292932',
          highest: '#34343d',
        },
        primary: {
          DEFAULT: '#c0c1ff',
          indigo: '#6366F1',
          container: '#8083ff',
        },
        secondary: {
          DEFAULT: '#4edea3',
          container: '#00a572',
        },
        tertiary: {
          DEFAULT: '#ffb783',
          container: '#d97721',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        on: {
          surface: '#e4e1ed',
          primary: '#1000a9',
          secondary: '#003824',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        tech: ['Space Grotesk', 'monospace'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
