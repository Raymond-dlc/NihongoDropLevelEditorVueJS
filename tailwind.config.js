/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sakura: '#B56079',
        'mint-green-100': '#b2f2c0',
        'mint-green-200': '#a7f0b7',
        'mint-green-300': '#9ceeae',
        'mint-green-400': '#91ECA5',
        'mint-green-500': '#83d495',
        'mint-green-600': '#74bd84',
        'mint-green-700': '#66a573',
        'mint-green-800': '#578e63'
      }
    }
  },
  plugins: []
}
