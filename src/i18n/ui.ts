// src/i18n/ui.ts

export const languages = {
  es: 'Español',
  en: 'English',
};

export const defaultLang = 'es';

export const ui = {
  es: {
    'nav.home': 'Inicio',
    'nav.about': 'Sobre mí',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'nav.back': 'Volver a Proyectos',

    // Hero
    'hero.greeting': 'Hola, soy',
    'hero.role': 'Desarrollador de Software',
    'hero.description':
      'Explorador digital, creador de código y entusiasta del aprendizaje continuo. Me sumerjo en el universo del diseño y el desarrollo.',
    'hero.button': 'Contactar',

    // Home Sections
    'section.skills': 'Tecnologías Clave',
    'section.about': 'Creando experiencias digitales intuitivas y memorables',
    'section.work': 'Proyectos Destacados',
    'section.viewAll': 'Ver todos los proyectos',

    // Footer
    'footer.rights': 'Todos los derechos reservados.',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.back': 'Back to Projects',

    // Hero
    'hero.greeting': "Hi, I'm",
    'hero.role': 'Software Developer',
    'hero.description':
      'Digital explorer, code creator and continuous learning enthusiast. I immerse myself in the universe of design and development.',
    'hero.button': 'Contact Me',

    // Home Sections
    'section.skills': 'Core Technologies',
    'section.about': 'Crafting meaningful brands & intuitive experiences',
    'section.work': 'Selected Work',
    'section.viewAll': 'View All Projects',

    // Footer
    'footer.rights': 'All rights reserved.',
  },
} as const;
