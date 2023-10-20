/** @type {import('prettier').Config} */
const config = {
  endOfLine: "lf",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  printWidth: 120,
  trailingComma: "es5",
  quoteProps: "consistent",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
