/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      // Site palette, defined as CSS variables in src/style/index.css.
      colors: {
        paper: "var(--paper)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        highlight: "var(--highlight)",
        "accent-soft": "var(--accent-soft)",
      },
      maxWidth: {
        page: "68rem",
        prose: "42rem",
      },
    },
  },
  plugins: [],
};
