import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        sm: "16px",
        md: "24px",
        lg: "32px",
        xl: "40px",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          dark: "var(--secondary-dark)",
          light: "var(--secondary-light)",
          foreground: "var(--secondary-foreground)",
        },
        emergency: {
          DEFAULT: "var(--emergency)",
          dark: "var(--emergency-dark)",
          light: "var(--emergency-light)",
          foreground: "var(--emergency-foreground)",
        },
        neutral: {
          white: "var(--white)",
          background: "var(--background)",
          surface: "var(--surface)",
          border: "var(--border)",
          text: "var(--text)",
          muted: "var(--text-muted)",
          light: "var(--text-light)",
        },
        /* Semantic and alias color tokens */
        white: "var(--white)",
        background: "var(--background)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
          light: "var(--text-light)",
        },
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        inter: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      fontSize: {
        /* Typography scale per design requirements */
        display: [
          "clamp(2.25rem, 5vw, 4rem)",
          { lineHeight: "1.1", letterSpacing: "-0.02em" },
        ], // Mobile 36-44px / Desktop 48-64px
        h1: [
          "clamp(2.5rem, 4vw, 3rem)",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ], // 40-48px
        h2: [
          "clamp(2rem, 3vw, 2.5rem)",
          { lineHeight: "1.25", letterSpacing: "-0.01em" },
        ], // 32-40px
        h3: [
          "clamp(1.5rem, 2vw, 1.875rem)",
          { lineHeight: "1.3", letterSpacing: "-0.01em" },
        ], // 24-30px
        h4: [
          "clamp(1.25rem, 1.5vw, 1.5rem)",
          { lineHeight: "1.4" },
        ], // 20-24px
        body: [
          "clamp(1rem, 1vw, 1.125rem)",
          { lineHeight: "1.6" },
        ], // 16-18px
        small: ["0.875rem", { lineHeight: "1.5" }], // 14px (minimum allowed for body-adjacent)
        caption: ["0.8125rem", { lineHeight: "1.4" }], // 12-13px (0.8125rem = 13px)
      },
      spacing: {
        4: "4px",
        8: "8px",
        12: "12px",
        16: "16px",
        24: "24px",
        32: "32px",
        40: "40px",
        48: "48px",
        64: "64px",
        80: "80px",
        96: "96px",
        120: "120px",
      },
      maxWidth: {
        content: "1280px",
        "screen-xl": "1280px",
      },
      borderRadius: {
        sm: "var(--radius-sm)", // 6px
        md: "var(--radius-md)", // 10px
        lg: "var(--radius-lg)", // 16px
        pill: "var(--radius-pill)", // 999px
        full: "var(--radius-pill)", // 999px
        DEFAULT: "var(--radius-md)", // 10px
      },
      boxShadow: {
        none: "none",
        card: "none", // Borders first, shadows second rule
        nav: "var(--shadow-nav)",
        dropdown: "var(--shadow-dropdown)",
        modal: "var(--shadow-modal)",
        emergency: "var(--shadow-emergency)",
        cta: "var(--shadow-cta)",
      },
    },
  },
  plugins: [],
};

export default config;
