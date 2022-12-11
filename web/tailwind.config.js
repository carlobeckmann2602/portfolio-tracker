const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        highlight1: {
          // Green
          DEFAULT: "#11F1A6",
          offset: "#3BBD92",
        },
        highlight2: {
          // Purple
          DEFAULT: "#A410FF",
          offset: "#7523A7",
        },
        back: {
          DEFAULT: "#180A44",
          offset: "#6F00B2",
        },
        front: "white",
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
        serif: ["Roboto Serif", ...defaultTheme.fontFamily.serif],
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      padding: {
        full: "100%",
      },
      maxHeight: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
