/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          primary: "#1E1F36",
          accent: "#0066FF",
          secondary: "#00C2FF",
          grayDark: "#6B7280",
          grayLight: "#9CA3AF",
          background: "#FFFFFF",
        },
      },
      backgroundImage: {
        "gradient-ink": "linear-gradient(90deg, #0066FF 0%, #00C2FF 100%)",
      },
    },
  },
  plugins: [],
};
