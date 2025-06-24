/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        'custom-950': '950px',
        'custom-670': '670px',
        'xxs':"300px",
        'xs':'475px'
      }
    },
  },
  plugins: [],
}
