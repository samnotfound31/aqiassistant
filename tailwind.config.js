/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'aqi-good': '#B4F65C',
        'aqi-moderate': '#F4E85C',
        'aqi-unhealthy': '#FF9F68',
        'aqi-very-unhealthy': '#FF6B6B',
        'aqi-hazardous': '#E74C6C',
        'dark-bg': '#0F1423',
        'dark-card': '#1A1F35',
      },
      maxWidth: {
        'mobile': '430px',
      },
    },
  },
  plugins: [],
};
