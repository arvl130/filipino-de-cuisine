const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-hind)", ...fontFamily.sans],
        inika: ["var(--font-inika)"],
        karla: ["var(--font-karla)"],
      },
    },
  },
  plugins: [],
}
