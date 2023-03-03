/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Mulish: ["Mulish"],
        Roboto: ["Roboto"],
      },
      animation: {
        pulsee: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1)  5",
      },
    },
  },
  plugins: [],
};
