/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#db4444',
          dark: '#c43a3a',
          soft: '#fff4f4',
          ink: '#000000',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 12px 30px rgba(0, 0, 0, 0.08)',
        soft: '0 8px 20px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
