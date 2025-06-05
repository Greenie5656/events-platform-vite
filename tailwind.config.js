/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'snow': '#fbf5f3',
        'payne-gray': '#5c6b73',
        'gunmetal': '#253237',
        'asparagus': '#86a873',
        'gold': '#bb9f06',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}