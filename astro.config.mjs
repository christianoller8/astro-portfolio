import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://christianoller.dev',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/sistema') && !page.includes('/personaje'),
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // three.js se carga a demanda (las capas 3D de la home). Si el servidor de desarrollo lo
    // descubre tarde, rehace su caché a mitad de sesión y sirve un 504 "Outdated Optimize Dep":
    // la sección se quedaba en su versión plana. Preparado desde el arranque, no pasa.
    optimizeDeps: {
      include: ['three'],
    },
  },
});
