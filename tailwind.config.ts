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
    colors: {
      "inherit": "inherit",
      "current": "currentColor",
      "transparent": "transparent",
      "black": "#000",
      "white": "#fff",
      "neutral": {
        "50": "hsl(var(--neutral-50))",
        "100": "hsl(var(--neutral-100))",
        "200": "hsl(var(--neutral-200))",
        "300": "hsl(var(--neutral-300))",
        "400": "hsl(var(--neutral-400))",
        "500": "hsl(var(--neutral-500))",
        "600": "hsl(var(--neutral-600))",
        "700": "hsl(var(--neutral-700))",
        "800": "hsl(var(--neutral-800))",
        "900": "hsl(var(--neutral-900))",
        "950": "hsl(var(--neutral-950))",
      },
      "primary": {
        "50": "hsl(var(--primary-50))",
        "100": "hsl(var(--primary-100))",
        "200": "hsl(var(--primary-200))",
        "300": "hsl(var(--primary-300))",
        "400": "hsl(var(--primary-400))",
        "500": "hsl(var(--primary-500))",
        "600": "hsl(var(--primary-600))",
        "700": "hsl(var(--primary-700))",
        "800": "hsl(var(--primary-800))",
        "900": "hsl(var(--primary-900))",
        "950": "hsl(var(--primary-950))",
      },
      "accent-highlight": {
        "50": "hsl(var(--accent-highlight-50))",
        "100": "hsl(var(--accent-highlight-100))",
        "200": "hsl(var(--accent-highlight-200))",
        "300": "hsl(var(--accent-highlight-300))",
        "400": "hsl(var(--accent-highlight-400))",
        "500": "hsl(var(--accent-highlight-500))",
        "600": "hsl(var(--accent-highlight-600))",
        "700": "hsl(var(--accent-highlight-700))",
        "800": "hsl(var(--accent-highlight-800))",
        "900": "hsl(var(--accent-highlight-900))",
        "950": "hsl(var(--accent-highlight-950))",
      },
      "accent-danger": {
        "50": "hsl(var(--accent-danger-50))",
        "100": "hsl(var(--accent-danger-100))",
        "200": "hsl(var(--accent-danger-200))",
        "300": "hsl(var(--accent-danger-300))",
        "400": "hsl(var(--accent-danger-400))",
        "500": "hsl(var(--accent-danger-500))",
        "600": "hsl(var(--accent-danger-600))",
        "700": "hsl(var(--accent-danger-700))",
        "800": "hsl(var(--accent-danger-800))",
        "900": "hsl(var(--accent-danger-900))",
        "950": "hsl(var(--accent-danger-950))",
      },
      "accent-warning": {
        "50": "hsl(var(--accent-warning-50))",
        "100": "hsl(var(--accent-warning-100))",
        "200": "hsl(var(--accent-warning-200))",
        "300": "hsl(var(--accent-warning-300))",
        "400": "hsl(var(--accent-warning-400))",
        "500": "hsl(var(--accent-warning-500))",
        "600": "hsl(var(--accent-warning-600))",
        "700": "hsl(var(--accent-warning-700))",
        "800": "hsl(var(--accent-warning-800))",
        "900": "hsl(var(--accent-warning-900))",
        "950": "hsl(var(--accent-warning-950))",
      },
      "accent-positive": {
        "50": "hsl(var(--accent-positive-50))",
        "100": "hsl(var(--accent-positive-100))",
        "200": "hsl(var(--accent-positive-200))",
        "300": "hsl(var(--accent-positive-300))",
        "400": "hsl(var(--accent-positive-400))",
        "500": "hsl(var(--accent-positive-500))",
        "600": "hsl(var(--accent-positive-600))",
        "700": "hsl(var(--accent-positive-700))",
        "800": "hsl(var(--accent-positive-800))",
        "900": "hsl(var(--accent-positive-900))",
        "950": "hsl(var(--accent-positive-950))",
      },
      "accent-focus": "hsl(var(--accent-focus))",
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      boxShadow: {
        //imageborder: "inset 0 2px 4px 0 hsla(0, 0%, 0%, .2)",
        imageborder: "inset 0 0 0 1px hsla(0, 0%, 0%, .1)",
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
