/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: colors.blue,
    },
    fontFamily: {
      sans: ["Inter"],
      body: ["Inter"],
      mono: ["ui-monospace"],
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
