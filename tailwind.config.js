/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "media",
  theme: {
    colors: {
      ...colors,
      primary: colors.blue,
    },
    fontFamily: {
      body: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        // other fallback fonts
      ],
      sans: [
        "Inter",
        "ui-sans-serif",
        "system-ui",
        // other fallback fonts
      ],
    },
    extend: {
      maxWidth: {
        "2xs": "16rem",
        "8xl": "90rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
