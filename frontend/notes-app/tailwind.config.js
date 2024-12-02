/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      //Colores usados en el proyecto
      colors: {
        primary: '#2b85ff',
        secondary: '#ef863e',
      },
    },
  },
  plugins: [],
}

