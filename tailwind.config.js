/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Fira Code', 'monospace'],
        'vt323': ['VT323', 'monospace'],
      },
      colors: {
        'terminal-green': '#33ff00',
      },
    },
  },
  plugins: [],
}
