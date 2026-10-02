import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1600px",
        "3xl": "1920px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        // Legacy alias: `font-inter` now resolves to the redesign UI font.
        inter: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          pressed: "hsl(var(--primary-pressed))",
          tint: "hsl(var(--primary-tint))",
          "tint-2": "hsl(var(--primary-tint-2))",
        },
        // Redesign neutrals and brand details (see src/styles/theme-tokens.css)
        "surface-2": "hsl(var(--surface-2))",
        "surface-3": "hsl(var(--surface-3))",
        stage: "hsl(var(--stage))",
        "line-strong": "hsl(var(--line-strong))",
        "ink-2": "hsl(var(--ink-2))",
        "ink-3": "hsl(var(--ink-3))",
        "brand-decor": "hsl(var(--brand-decor))",
        "shadow-hard": "hsl(var(--shadow-hard))",
        dot: "hsl(var(--dot))",
        "error-tint": "hsl(var(--error-tint))",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        /* Neon brand accent - decorative only, never a hover surface */
        "brand-accent": {
          DEFAULT: "hsl(var(--brand-accent))",
          foreground: "hsl(var(--brand-accent-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      // Stacked-plate elevation: hard offset, zero blur, flat colour.
      boxShadow: {
        e1: "0 1px 0 hsl(var(--border))",
        e2: "0 3px 0 hsl(var(--shadow-hard))",
        e3: "0 5px 0 hsl(var(--shadow-hard))",
        btn: "0 3px 0 hsl(var(--primary-pressed))",
        "btn-neutral": "0 3px 0 hsl(var(--shadow-hard))",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(.2,.8,.2,1)",
        inout: "cubic-bezier(.65,0,.35,1)",
        snap: "cubic-bezier(.34,1.56,.64,1)",
      },
      transitionDuration: {
        fast: "120ms",
        base: "200ms",
        slow: "320ms",
        flip: "600ms",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      screens: {
        xs: "480px",
      },
      keyframes: {
        // Redesign motion (reduced motion is handled globally in index.css)
        "flag-shake": {
          "0%, 100%": { transform: "none" },
          "20%": { transform: "translateX(-3px) rotate(-6deg)" },
          "40%": { transform: "translateX(3px) rotate(6deg)" },
          "60%": { transform: "translateX(-2px) rotate(-4deg)" },
          "80%": { transform: "translateX(2px) rotate(3deg)" },
        },
        "flag-out": { to: { transform: "scale(1.7)", opacity: "0" } },
        "flag-in": {
          from: { transform: "scale(.8)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
        "coin-in": {
          from: { transform: "scale(.4) rotateY(90deg)" },
          to: { transform: "none" },
        },
        "label-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
        "sheet-in": {
          from: { transform: "translateY(12px)", opacity: "0" },
          to: { transform: "none", opacity: "1" },
        },
        "brick-stack": {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "40%, 100%": { transform: "none", opacity: "1" },
        },
        twinkle: {
          "0%, 100%": { opacity: ".35" },
          "50%": { opacity: "1" },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(40px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        blink: {
          "0%, 50%": { borderColor: "transparent" },
          "51%, 100%": { borderColor: "hsl(var(--primary))" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(2rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(-2rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(2rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px hsl(var(--primary))" },
          "100%": { boxShadow: "0 0 30px hsl(var(--primary))" },
        },
      },
      animation: {
        "flag-shake": "flag-shake 450ms cubic-bezier(.65,0,.35,1)",
        "flag-out": "flag-out 350ms cubic-bezier(.2,.8,.2,1) forwards",
        "flag-in": "flag-in 250ms cubic-bezier(.2,.8,.2,1)",
        "coin-in": "coin-in 320ms cubic-bezier(.34,1.56,.64,1)",
        "label-up": "label-up 220ms cubic-bezier(.2,.8,.2,1)",
        "sheet-in": "sheet-in 200ms cubic-bezier(.2,.8,.2,1)",
        "brick-stack": "brick-stack 900ms cubic-bezier(.34,1.56,.64,1) infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 1s ease-out forwards",
        "slide-up": "slideUp 1s ease-out forwards",
        "slide-left": "slideLeft 1s ease-out forwards",
        "slide-right": "slideRight 1s ease-out forwards",
        "scale-in": "scaleIn 1s ease-out forwards",
        blink: "blink 1s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
