import type { Config } from "tailwindcss";

const config: Config = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'vgray': {
          DEFAULT: '#121317',
        },
        'vblue': {
          DEFAULT: '#2E86AB',
        },
        'vvanil': {
          DEFAULT: '#F6F5AE',
        },
        'vyellow': {
          DEFAULT: '#F5F749',
        },
        'vcinna': {
          DEFAULT: '#E55934',
        },
      },    
    },
  },
  plugins: [],
};
export default config;
