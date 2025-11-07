import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px"
      }
    },
    extend: {
      fontFamily: { sans: ["ui-sans-serif","system-ui","Segoe UI","Roboto","Inter","Arial","Noto Sans","Apple Color Emoji","Segoe UI Emoji"], },
      colors: {
        background: "#0b0f17",
        foreground: "#f8fafc",
        muted: {
          DEFAULT: "#121725",
          foreground: "#8c9cbf"
        },
        accent: {
          DEFAULT: "#1f2436",
          foreground: "#e0f2ff"
        },
        border: "#1f2436",
        input: "#1f2436",
        ring: "#7c3aed",
        card: {
          DEFAULT: "#121725",
          foreground: "#f8fafc"
        },
        brand: {
          purple: "#7c3aed",
          cyan: "#22d3ee",
          pink: "#d946ef"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono]
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle at top, rgba(124,58,237,0.35), transparent 65%)",
        "gradient-aurora": "linear-gradient(135deg, rgba(124,58,237,0.9), rgba(34,211,238,0.75))"
      },
      boxShadow: {
        neon: "0 0 20px rgba(124,58,237,0.45), 0 0 40px rgba(34,211,238,0.35)",
        card: "0 10px 35px rgba(10,14,25,0.45)"
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(124,58,237,0.45), 0 0 20px rgba(34,211,238,0.25)"
          },
          "50%": {
            boxShadow: "0 0 20px rgba(124,58,237,0.75), 0 0 45px rgba(34,211,238,0.4)"
          }
        },
        glitchX: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "20%": { transform: "translate3d(-3px,1px,0)" },
          "40%": { transform: "translate3d(3px,-2px,0)" },
          "60%": { transform: "translate3d(-2px,2px,0)" },
          "80%": { transform: "translate3d(2px,-1px,0)" }
        },
        glitchY: {
          "0%, 100%": { clipPath: "inset(0 0 0 0)" },
          "25%": { clipPath: "inset(10% 0 85% 0)" },
          "50%": { clipPath: "inset(85% 0 5% 0)" },
          "75%": { clipPath: "inset(40% 0 40% 0)" }
        },
        hoverLift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "neon-pulse": "neonPulse 3s ease-in-out infinite",
        "glitch-x": "glitchX 1.5s infinite steps(2, jump-start)",
        "glitch-y": "glitchY 1.5s infinite steps(2, jump-end)",
        "hover-lift": "hoverLift 6s ease-in-out infinite"
      }
    }
  },
  plugins: [animate]
};

export default config;
