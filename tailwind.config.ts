import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#f7f8fc",
        ink: "#202437",
        muted: "#747b91",
        line: "#e8eaf1",
        surface: "#f1f2f8",
        brand: {
          DEFAULT: "#635bdb",
          dark: "#5048c8",
        },
      },
      boxShadow: {
        card: "0 3px 14px rgba(32, 36, 55, 0.035)",
        "card-hover": "0 12px 30px rgba(32, 36, 55, 0.075)",
      },
      fontFamily: {
        display: ['"Avenir Next"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};

export default config;
