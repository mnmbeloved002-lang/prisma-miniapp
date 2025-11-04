/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        primary: "var(--primary)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
      },
      boxShadow: {
        cinema: "var(--shadow-cinema)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
}
