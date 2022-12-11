module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        'green': '#11F1A6',
        'green-darker': '#3BBD92',
        'purple': '#A410FF',
        'purple-darker': '#7523A7',
        'primary-purple-darkest': '#6F00B2',
        'magenta': '#EA4FFF',
        'blue': '#5C67FF',
        'blue-lighter': '#489CE8',
        'blue-lightest': '#76FCFF',
        'primary-blue-darkest': '#180A44',
        // main: {
        //   100: "#C5D5EE",
        //   200: "#ACBEDE",
        //   300: "#90AFE5",
        //   400: "#547ECD",
        //   500: "#4666A2",
        // },
      },
      fontFamily: {
        serif: ['Roboto', 'serif'],
        sans: ['Roboto', 'sans-serif'],
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
