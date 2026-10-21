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
    'hero.headline': 'De la *idea* a un|*producto* que funciona.',
    'hero.description':
      'Me encargo del diseño, la implementación y la calidad. Entrego webs y apps cuidadas, rápidas y sin sorpresas.',
    'hero.button': 'Cuéntame tu proyecto',
    'hero.button.secondary': 'Ver proyectos',
    'hero.status': 'Disponible para proyectos',
    'hero.work.design': 'Diseño UX / UI',
    'hero.work.wordpress': 'Webs con WordPress',
    'hero.work.web': 'Webs con Astro o React',
    'hero.work.apps': 'Apps con Angular',
    'hero.work.tests': 'Tests',

    // Home Sections
    'section.skills': 'Tecnologías Clave',
    'section.about': 'Creando experiencias digitales intuitivas y memorables',
    'section.work': 'Proyectos Destacados',
    'section.viewAll': 'Ver todos los proyectos',

    // About Summary section
    'about.summary.name': 'Hola, soy Christian Oller.',
    'about.summary.body1':
      'Me especializo en construir productos digitales que fusionan una estética cuidada con una funcionalidad robusta. Mi enfoque se basa en comprender las necesidades del usuario y traducirlas en interfaces visualmente atractivas y código eficiente.',
    'about.summary.body2':
      'Con una sólida base tanto en diseño como en desarrollo, actúo como puente entre la visión creativa y la ejecución técnica. Creo firmemente que un buen software no solo debe funcionar bien, sino que también debe sentirse bien al usarse.',

    // Services section
    'services.frontend.title': 'Arquitectura Frontend',
    'services.frontend.desc':
      'Desarrollo aplicaciones complejas con Angular y React. Creo interfaces modulares y mantenibles utilizando TypeScript, optimizando el rendimiento y la reutilización de componentes.',
    'services.backend.title': 'Soluciones Backend',
    'services.backend.desc':
      'Lógica robusta del lado del servidor e integración de APIs (SQL, PHP, Firebase).',
    'services.uiux.title': 'Implementación UI/UX',
    'services.uiux.desc':
      'Traducción de diseños a código pixel-perfect, accesible y responsive (Tailwind, SASS).',
    'services.testing.title': 'Rendimiento y Testing',
    'services.testing.desc':
      'Garantía de calidad y velocidad mediante Vitest y optimización continua.',

    // Home page
    'home.meta.title': 'Christian Oller | Desarrollador de Software',
    'home.meta.description':
      'Portfolio de Christian Oller, desarrollador especializado en crear experiencias digitales únicas.',

    // About page
    'about.meta.title': 'Sobre mí | Christian Oller',
    'about.meta.description':
      'Conoce más sobre mi trayectoria como desarrollador Full Stack y mi experiencia profesional.',
    'about.heading': 'Sobre mí',
    'about.img.alt': 'Foto de perfil de Christian Oller',
    'about.section.journey': 'Mi Trayectoria',
    'about.section.experience': 'Experiencia Profesional',
    'about.intro':
      'Soy un Desarrollador de Software con más de 2 años de experiencia. Mi enfoque combina la precisión técnica con la resolución creativa de problemas. Me he especializado en soluciones ERP, tecnología para aerolíneas y plataformas de consultoría medioambiental.',

    // Contact page
    'contact.meta.title': 'Contacto | Christian Oller',
    'contact.meta.description': '¿Tienes un proyecto en mente? Hablemos sobre cómo puedo ayudarte.',
    'contact.heading': 'Trabajemos juntos.',
    'contact.intro':
      '¿Interesado en empezar un proyecto? Actualmente estoy disponible para trabajos freelance y abierto a nuevas oportunidades profesionales.',
    'contact.label.email': 'Email',
    'contact.label.social': 'Redes Sociales',
    'contact.label.location': 'Ubicación',
    'contact.location.value': 'Córdoba, España',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Email',
    'contact.form.name.placeholder': 'Tu nombre',
    'contact.form.email.placeholder': 'tu@email.com',
    'contact.form.subject': 'Asunto',
    'contact.form.subject.placeholder': 'Selecciona un tipo de proyecto',
    'contact.form.subject.uiux': 'Diseño UI/UX',
    'contact.form.subject.branding': 'Identidad de Marca',
    'contact.form.subject.dev': 'Desarrollo Web',
    'contact.form.subject.other': 'Otro',
    'contact.form.message': 'Mensaje',
    'contact.form.message.placeholder': 'Cuéntame un poco sobre tu proyecto...',
    'contact.form.submit': 'Enviar Mensaje',

    // Projects page
    'projects.meta.title': 'Proyectos | Christian Oller',
    'projects.meta.description':
      'Una colección de trabajos en desarrollo full-stack, diseño UI/UX y arquitectura de software.',
    'projects.heading': 'Proyectos',
    'projects.description':
      'Una colección de trabajos en desarrollo full-stack, diseño UI/UX y arquitectura de software.',
    'projects.view': 'Ver Proyecto',

    // Project detail
    'project.year': 'Año',
    'project.client': 'Cliente',
    'project.tech': 'Tecnologías',

    // Accessibility
    'aria.menu': 'Menú de navegación',
    'aria.theme': 'Cambiar modo oscuro',
    'aria.lang.es': 'Cambiar a Español',
    'aria.lang.en': 'Cambiar a Inglés',

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
    'hero.headline': 'From *idea* to a|*product* that works.',
    'hero.description':
      'I take care of design, implementation and quality. I deliver polished, fast websites and apps with no surprises.',
    'hero.button': 'Tell me about your project',
    'hero.button.secondary': 'View projects',
    'hero.status': 'Available for projects',
    'hero.work.design': 'UX / UI design',
    'hero.work.wordpress': 'WordPress websites',
    'hero.work.web': 'Astro or React websites',
    'hero.work.apps': 'Angular apps',
    'hero.work.tests': 'Testing',

    // Home Sections
    'section.skills': 'Core Technologies',
    'section.about': 'Crafting meaningful brands & intuitive experiences',
    'section.work': 'Selected Work',
    'section.viewAll': 'View All Projects',

    // About Summary section
    'about.summary.name': "Hi, I'm Christian Oller.",
    'about.summary.body1':
      'I specialize in building digital products that merge refined aesthetics with robust functionality. My approach is based on understanding user needs and translating them into visually appealing interfaces and efficient code.',
    'about.summary.body2':
      'With a solid foundation in both design and development, I act as a bridge between creative vision and technical execution. I firmly believe that good software must not only work well, but also feel great to use.',

    // Services section
    'services.frontend.title': 'Frontend Architecture',
    'services.frontend.desc':
      'I build complex applications with Angular and React, creating modular and maintainable interfaces using TypeScript, optimizing performance and component reusability.',
    'services.backend.title': 'Backend Solutions',
    'services.backend.desc': 'Robust server-side logic and API integration (SQL, PHP, Firebase).',
    'services.uiux.title': 'UI/UX Implementation',
    'services.uiux.desc':
      'Translation of designs into pixel-perfect, accessible and responsive code (Tailwind, SASS).',
    'services.testing.title': 'Performance & Testing',
    'services.testing.desc':
      'Quality and speed assurance through Vitest and continuous optimization.',

    // Home page
    'home.meta.title': 'Christian Oller | Software Developer',
    'home.meta.description':
      'Portfolio of Christian Oller, a developer specialized in creating unique digital experiences.',

    // About page
    'about.meta.title': 'About | Christian Oller',
    'about.meta.description':
      'Learn more about my journey as a Full Stack developer and my professional experience.',
    'about.heading': 'About Me',
    'about.img.alt': 'Profile photo of Christian Oller',
    'about.section.journey': 'My Journey',
    'about.section.experience': 'Professional Experience',
    'about.intro':
      'I am a Software Developer with over 2 years of experience. My approach combines technical precision with creative problem solving. I have specialized in ERP solutions, airline technology and environmental consulting platforms.',

    // Contact page
    'contact.meta.title': 'Contact | Christian Oller',
    'contact.meta.description': "Have a project in mind? Let's talk about how I can help you.",
    'contact.heading': "Let's work together.",
    'contact.intro':
      "Interested in starting a project? I'm currently available for freelance work and open to new professional opportunities.",
    'contact.label.email': 'Email',
    'contact.label.social': 'Social Media',
    'contact.label.location': 'Location',
    'contact.location.value': 'Córdoba, Spain',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subject.placeholder': 'Select a project type',
    'contact.form.subject.uiux': 'UI/UX Design',
    'contact.form.subject.branding': 'Brand Identity',
    'contact.form.subject.dev': 'Web Development',
    'contact.form.subject.other': 'Other',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Tell me a bit about your project...',
    'contact.form.submit': 'Send Message',

    // Projects page
    'projects.meta.title': 'Projects | Christian Oller',
    'projects.meta.description':
      'A collection of work in full-stack development, UI/UX design and software architecture.',
    'projects.heading': 'Projects',
    'projects.description':
      'A collection of work in full-stack development, UI/UX design and software architecture.',
    'projects.view': 'View Project',

    // Project detail
    'project.year': 'Year',
    'project.client': 'Client',
    'project.tech': 'Technologies',

    // Accessibility
    'aria.menu': 'Navigation menu',
    'aria.theme': 'Toggle dark mode',
    'aria.lang.es': 'Switch to Spanish',
    'aria.lang.en': 'Switch to English',

    // Footer
    'footer.rights': 'All rights reserved.',
  },
} as const;
