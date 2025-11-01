/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b0c0f',
        surface: '#12141a',
        text: '#e7e9ee',
        muted: '#9aa3b2',
        primary: '#6ea8fe',
      },
      boxShadow: {
        cinema: '0 6px 24px rgba(0,0,0,.28)',
      },
      container: { center: true, screens: { lg: '1120px' } },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
