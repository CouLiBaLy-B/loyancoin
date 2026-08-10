/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f3ee',
        'paper-deep': '#ebe8df',
        ink: '#1d2821',
        'ink-soft': '#4c554d',
        moss: '#203027',
        'moss-light': '#30463a',
        clay: '#c88970',
        'clay-light': '#e6b9a5',
        line: '#d9d6cd',
        white: '#fffdf8',
      },
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
