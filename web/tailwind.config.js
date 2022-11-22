module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        main: {
          100: "#C5D5EE",
          200: "#ACBEDE",
          300: "#90AFE5",
          400: "#547ECD",
          500: "#4666A2",
        },
      },
      borderWidth: {
        DEFAULT: "1px",
      },
      padding: {
        full: "100%",
      },
    },
  },
  plugins: [],
};
