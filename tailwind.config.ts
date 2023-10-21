import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";
import { type ScreensConfig } from "tailwindcss/types/config";

//https://tailwindcss.com/docs/screens
//make sure these values match what is in next.config.mjs
const DEVICE_SIZES: ScreensConfig = {
  "sm": "640px",
  "md": "768px",
  "lg": "1024px",
  "xl": "1280px",
  "2xl": "1536px",
};

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: DEVICE_SIZES,
    container: {
      screens: DEVICE_SIZES,
      center: true,
    },

    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        //imageborder: "inset 0 2px 4px 0 hsla(0, 0%, 0%, .2)",
        imageborder: "inset 0 0 0 1px hsla(0, 0%, 0%, .1)",
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
        },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".mainwidth": {
          "@apply w-full sm:max-w-[436px] md:max-w-[520px] lg:max-w-[620px]": {},
        },
        ".text-tweet": {
          "@apply whitespace-pre-wrap break-words": {},
        },
        ".text-paragraph": {
          "@apply max-w-[55ch] font-sans text-base font-normal leading-[1.55] tracking-[0.15px] text-neutral-600 [word-spacing:0.5px] dark:text-neutral-300":
            {},
        },
      });
    }),
  ],
} satisfies Config;
