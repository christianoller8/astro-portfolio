
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
  site: 'https://midominio.com', 
  i18n: {
    defaultLocale: "es",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true 
    }
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
