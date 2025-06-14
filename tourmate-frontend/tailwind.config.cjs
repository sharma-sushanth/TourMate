/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fdf6e3',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        pulse: 'pulse 4s ease-in-out infinite',
      },
      blur: {
        xl: '100px',
        '3xl': '160px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // <-- SAFELY ADDED THIS LINE
  ],
};