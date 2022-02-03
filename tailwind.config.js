const colors = {
  info: "#0762c8",
  focus: "#2a7ffe",
  error: "#e10600",
  success: "#008941",
  beige: "#f9f8f6",
  red: {
    300: "#f7bfc3",
    500: "#e1000f",
  },
  indigo: {
    300: "#9a9aff",
    200: "#ececff",
    100: "#f5f5ff",
    ecume: "#e9edfe",
  },
  blue: {
    300: "#2929ff",
    400: "#0000dd",
    500: "#000091",
    ecume: "#465f9d",
  },
  gray: {
    800: "#1e1e1e",
    700: "#383838",
    600: "#6a6a6a",
    500: "#9c9c9c",
    400: "#cecece",
    300: "#e7e7e7",
    200: "#f0f0f0",
    100: "#f8f8f8",
  },
}

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      spectral: ["Spectral", "serif"],
    },
    extend: {
      textColor: colors,
      borderColor: colors,
      backgroundColor: colors,
      fontFamily: {
        bold: ["Marianne", "arial", "sans-serif"],
        sans: ["Marianne", "arial", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {
      margin: ["last"],
      padding: ["first"],
      boxShadow: ["active"],
      cursor: ["disabled"],
      borderWidth: ["last"],
      backgroundColor: ["odd", "even", "active"],
    },
  },
  plugins: [],
}
