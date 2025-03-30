const { Config } = require("tailwindcss");
const { withUt } = require("uploadthing/tw");

module.exports = withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Các phần còn lại của theme
      },
      // Các phần mở rộng khác của theme
    },
  },
  daisyui: {
    themes: ["light", "dark"],
  },
  plugins: [require("daisyui"), require("tailwindcss-animate")],
});
