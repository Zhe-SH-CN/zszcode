/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: '#1a1a2e',
        surfaceLight: '#16213e',
        accent: '#0f3460',
      },
    },
  },
  plugins: [],
}
