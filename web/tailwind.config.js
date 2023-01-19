const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "380px",
        ...defaultTheme.screens,
      },
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
      backgroundImage: {
        "falloff-soft":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.143371) 38.02%, rgba(255, 255, 255, 0) 100%)",
        "falloff-highlight-mix":
          "linear-gradient(87.54deg, #A410FF 15.44%, #6472D8 57.36%, #11F1A6 100.38%)",
      },
    },
  },
  plugins: [],
};
