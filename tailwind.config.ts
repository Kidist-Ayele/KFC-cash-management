import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E4002B',
          hover: '#C4002B',
        },
        accent: {
          DEFAULT: '#FCD116',
        },
      },
    },
  },
  plugins: [],
};
export default config;
