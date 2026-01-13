/** @type {import("prettier").Config} */
export default {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],

  // Specific overrides for Astro files
  overrides: [{ files: '*.astro', options: { parser: 'astro' } }],

  // Formatting rules
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  printWidth: 100,
};
