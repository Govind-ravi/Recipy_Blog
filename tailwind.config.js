/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/layouts/*.ejs", "./views/*.ejs"],
  theme: {
    extend: {
      screens:{
        'xs': '500px'
      }
    },
  },
  plugins: [],
}
