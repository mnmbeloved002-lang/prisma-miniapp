/** @type {import('tailwindcss').Config} */
// @ts-nocheck

export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        primary: "var(--primary)",
        success: "var(--success)",
        danger: "var(--danger)",
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        cinema: "var(--shadow-cinema)",
        card: "var(--shadow-card)",
      },
      container: {
        center: true,
        padding: "1rem",
      },
    },
  },
  plugins: [],
}
