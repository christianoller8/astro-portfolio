import js from '@eslint/js';
import eslintPluginAstro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default [
  // Solo el código de la web y sus pruebas: ni lo compilado ni las herramientas de revisión de
  // .taste-skill (guiones de captura y copias de compilaciones)
  { ignores: ['dist/**', '.astro/**', '.vercel/**', '.taste-skill/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },
];
