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
      colors: {
        "theme-neutral": {
          "0": "hsl(var(--theme-neutral-0))",
          "50": "hsl(var(--theme-neutral-50))",
          "100": "hsl(var(--theme-neutral-100))",
          "200": "hsl(var(--theme-neutral-200))",
          "300": "hsl(var(--theme-neutral-300))",
          "400": "hsl(var(--theme-neutral-400))",
          "500": "hsl(var(--theme-neutral-500))",
          "600": "hsl(var(--theme-neutral-600))",
          "700": "hsl(var(--theme-neutral-700))",
          "800": "hsl(var(--theme-neutral-800))",
          "900": "hsl(var(--theme-neutral-900))",
          "950": "hsl(var(--theme-neutral-950))",
          "1000": "hsl(var(--theme-neutral-1000))",
        },
        "theme-primary": {
          "50": "hsl(var(--theme-primary-50))",
          "100": "hsl(var(--theme-primary-100))",
          "200": "hsl(var(--theme-primary-200))",
          "300": "hsl(var(--theme-primary-300))",
          "400": "hsl(var(--theme-primary-400))",
          "500": "hsl(var(--theme-primary-500))",
          "600": "hsl(var(--theme-primary-600))",
          "700": "hsl(var(--theme-primary-700))",
          "800": "hsl(var(--theme-primary-800))",
          "900": "hsl(var(--theme-primary-900))",
          "950": "hsl(var(--theme-primary-950))",
        },
        "theme-accent-highlight": {
          "50": "hsl(var(--theme-accent-highlight-50))",
          "100": "hsl(var(--theme-accent-highlight-100))",
          "200": "hsl(var(--theme-accent-highlight-200))",
          "300": "hsl(var(--theme-accent-highlight-300))",
          "400": "hsl(var(--theme-accent-highlight-400))",
          "500": "hsl(var(--theme-accent-highlight-500))",
          "600": "hsl(var(--theme-accent-highlight-600))",
          "700": "hsl(var(--theme-accent-highlight-700))",
          "800": "hsl(var(--theme-accent-highlight-800))",
          "900": "hsl(var(--theme-accent-highlight-900))",
          "950": "hsl(var(--theme-accent-highlight-950))",
        },
        "theme-accent-danger": {
          "50": "hsl(var(--theme-accent-danger-50))",
          "100": "hsl(var(--theme-accent-danger-100))",
          "200": "hsl(var(--theme-accent-danger-200))",
          "300": "hsl(var(--theme-accent-danger-300))",
          "400": "hsl(var(--theme-accent-danger-400))",
          "500": "hsl(var(--theme-accent-danger-500))",
          "600": "hsl(var(--theme-accent-danger-600))",
          "700": "hsl(var(--theme-accent-danger-700))",
          "800": "hsl(var(--theme-accent-danger-800))",
          "900": "hsl(var(--theme-accent-danger-900))",
          "950": "hsl(var(--theme-accent-danger-950))",
        },
        "theme-accent-warning": {
          "50": "hsl(var(--theme-accent-warning-50))",
          "100": "hsl(var(--theme-accent-warning-100))",
          "200": "hsl(var(--theme-accent-warning-200))",
          "300": "hsl(var(--theme-accent-warning-300))",
          "400": "hsl(var(--theme-accent-warning-400))",
          "500": "hsl(var(--theme-accent-warning-500))",
          "600": "hsl(var(--theme-accent-warning-600))",
          "700": "hsl(var(--theme-accent-warning-700))",
          "800": "hsl(var(--theme-accent-warning-800))",
          "900": "hsl(var(--theme-accent-warning-900))",
          "950": "hsl(var(--theme-accent-warning-950))",
        },
        "theme-accent-positive": {
          "50": "hsl(var(--theme-accent-positive-50))",
          "100": "hsl(var(--theme-accent-positive-100))",
          "200": "hsl(var(--theme-accent-positive-200))",
          "300": "hsl(var(--theme-accent-positive-300))",
          "400": "hsl(var(--theme-accent-positive-400))",
          "500": "hsl(var(--theme-accent-positive-500))",
          "600": "hsl(var(--theme-accent-positive-600))",
          "700": "hsl(var(--theme-accent-positive-700))",
          "800": "hsl(var(--theme-accent-positive-800))",
          "900": "hsl(var(--theme-accent-positive-900))",
          "950": "hsl(var(--theme-accent-positive-950))",
        },
        "theme-accent-focus": {
          "50": "hsl(var(--theme-accent-focus-50))",
          "100": "hsl(var(--theme-accent-focus-100))",
          "200": "hsl(var(--theme-accent-focus-200))",
          "300": "hsl(var(--theme-accent-focus-300))",
          "400": "hsl(var(--theme-accent-focus-400))",
          "500": "hsl(var(--theme-accent-focus-500))",
          "600": "hsl(var(--theme-accent-focus-600))",
          "700": "hsl(var(--theme-accent-focus-700))",
          "800": "hsl(var(--theme-accent-focus-800))",
          "900": "hsl(var(--theme-accent-focus-900))",
          "950": "hsl(var(--theme-accent-focus-950))",
        },
      },
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
