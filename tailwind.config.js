/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      primaryBackground: "#18181B",
      primaryText: "#FFFFFF",
      primaryButtonBackground: "##636a75",
      primaryButtonText: "#FFFFFF",
    },
  },
  plugins: [],
};
