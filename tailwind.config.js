/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ibk: {
          blue: '#003B6F',
          yellow: '#F5A800',
          'blue-light': '#005299',
          'yellow-light': '#FFD166',
        },
      },
      fontFamily: {
        sans: ['"Yu Gothic"', '"游ゴシック"', 'YuGothic', '"Hiragino Kaku Gothic ProN"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
