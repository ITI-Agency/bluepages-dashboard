module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    screens: {
      xs: "440px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1900px",
      "4xl": "2250px",
      // => @media (min-width: 640px) { ... }
    },
    extend: {
      colors: {
        blueDark: "#1DA1F2",
        secondary: "#f5f8fa",
        heading: "#6C6C6C",
        primary: "#2aa3ef",
        blueLight: "#2facef",
      },
      animation: {
        bounce: "bounce 5s linear infinite",
      },
      keyframes: {
        bounce: {
          "0%, 100%": {
            transform: "rotate(-3deg)",
            transform: "translateY(-5%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "rotate(3deg)",
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        // sliding_offer: {
        //   "0%, 100%": { transform: "rotate(-3deg)" },
        //   "50%": { transform: "rotate(3deg)" },
        // },
      },
    },
    fontFamily: {
      sans: ["Sora", "Roboto Condensed", "sans-serif"],
    },
  },
  plugins: [require("tw-elements/dist/plugin", "@tailwindcss/aspect-ratio")],
};
