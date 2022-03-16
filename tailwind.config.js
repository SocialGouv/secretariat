const colors = {
  info: "#0762c8",
  focus: "#2a7ffe",
  error: "#e10600",
  success: "#008941",
  beige: "#f9f8f6",
  hover: "#e0e0e0",
  brown: {
    425: "#845d48",
    600: "#c08c65",
    900: "#f7ecdb",
    925: "#f3e2d9",
  },
  warning: {
    950: "#ffe9e6",
    425: "#b34000",
  },
  red: {
    100: "#fff4f3",
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
  ecume: {
    247: "#2f4077",
    400: "#465f9d",
    850: "#bfccfb",
    925: "#dee5fd",
    950: "#e9edfe",
    975: "#f4f6fe",
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
      boxShadow: {
        input: "inset 0 -2px 0 0 #6a6a6a",
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
