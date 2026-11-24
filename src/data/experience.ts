// Trayectoria, formación e idiomas, de lo más reciente a lo más antiguo (Sobre mí y resumen del inicio).
// Fuente: el CV de Christian (public/cv/christian-oller-cv.pdf, recibido el 18 nov 2026) y, para
// Vístalo, lo que contó él. Los textos resumen sus propias frases del CV.

type Lang = 'es' | 'en';
type Text = Record<Lang, string>;

export interface Job {
  company: string;
  role: Text;
  period: Text;
  place: Text;
  summary: Text;
  highlights: Record<Lang, string[]>;
  stack: string[];
  /** Etapas con Angular: el hilo conductor de la cronología */
  angular?: string;
}

export const experience: Job[] = [
  {
    company: 'Vístalo',
    role: { es: 'Cofundador · Diseño y desarrollo', en: 'Co-founder · Design and development' },
    period: { es: '2025 – Actualidad', en: '2025 – Present' },
    place: { es: 'Remoto', en: 'Remote' },
    summary: {
      es: 'Agencia creativa que hace webs, fotos, vídeo y presencia en Google para negocios pequeños.',
      en: 'A creative agency that builds websites, photography, video and Google presence for small businesses.',
    },
    highlights: {
      es: ['Diseño cada pantalla y escribo el código, de la idea a la web publicada.'],
      en: ['I design every screen and write the code, from the idea to the published website.'],
    },
    stack: ['Astro', 'CSS', 'JavaScript'],
  },
  {
    company: 'Accenture',
    role: { es: 'Consultor digital y QA', en: 'Digital consultant and QA' },
    period: { es: 'Ene 2026 – Ago 2026', en: 'Jan 2026 – Aug 2026' },
    place: { es: 'Remoto', en: 'Remote' },
    summary: {
      es: 'Control de calidad de los cursos de un programa nacional de formación en transformación digital e IA, con 80.000 usuarios.',
      en: 'Quality control for the courses of a national training programme on digital transformation and AI, with 80,000 users.',
    },
    highlights: {
      es: [
        'Pruebas E2E automatizadas con Cypress y Playwright para la navegación, los contenidos y las evaluaciones.',
        'Scripts en TypeScript y Python para las verificaciones repetitivas.',
        'Validación de los datos de los cursos con SQL y Excel.',
        'Seguimiento de incidencias con colegios profesionales y equipos de contenido.',
      ],
      en: [
        'Automated E2E tests with Cypress and Playwright for navigation, content and assessments.',
        'TypeScript and Python scripts for repetitive checks.',
        'Course data validation with SQL and Excel.',
        'Issue tracking with professional bodies and content teams.',
      ],
    },
    stack: ['Cypress', 'Playwright', 'TypeScript', 'Python', 'SQL'],
  },
  {
    company: 'VHIR · Vall d’Hebron',
    role: { es: 'Software developer y QA', en: 'Software developer and QA' },
    period: { es: 'Sep 2024 – Ago 2025', en: 'Sep 2024 – Aug 2025' },
    place: { es: 'Barcelona', en: 'Barcelona' },
    summary: {
      es: 'Desarrollo y mantenimiento de RAMS, el ERP interno de los departamentos de investigación.',
      en: 'Development and maintenance of RAMS, the internal ERP used by the research departments.',
    },
    highlights: {
      es: [
        'Lideré la migración de Angular a versiones más recientes, saneando dependencias y deuda técnica.',
        'Pruebas unitarias y de integración con Karma y Jasmine, y E2E con Cypress.',
        'Recogida de requisitos y pruebas de aceptación con los usuarios finales.',
      ],
      en: [
        'Led the Angular migration to newer versions, cleaning up dependencies and technical debt.',
        'Unit and integration tests with Karma and Jasmine, and E2E with Cypress.',
        'Requirements gathering and acceptance testing with end users.',
      ],
    },
    stack: ['SQL Server', 'Karma', 'Jasmine', 'Cypress'],
    angular: 'Angular',
  },
  {
    company: 'Inology',
    role: { es: 'Software developer', en: 'Software developer' },
    period: { es: 'Jun 2023 – May 2024', en: 'Jun 2023 – May 2024' },
    place: { es: 'Barcelona', en: 'Barcelona' },
    summary: {
      es: 'Desarrollo y mantenimiento de MARINO, un ERP corporativo.',
      en: 'Development and maintenance of MARINO, a corporate ERP.',
    },
    highlights: {
      es: [
        'Informes a medida con Crystal Reports para cada cliente.',
        'Administración de los entornos en los servidores de los clientes.',
        'Trato directo con los clientes para resolver sus incidencias.',
      ],
      en: [
        'Custom reports with Crystal Reports for each client.',
        'Administration of environments on client servers.',
        'Direct contact with clients to solve their issues.',
      ],
    },
    stack: ['SQL Server', 'Crystal Reports'],
    angular: 'Angular',
  },
  {
    company: 'Kenos Technology · Vueling',
    role: { es: 'Software developer', en: 'Software developer' },
    period: { es: 'Mar 2023 – May 2023', en: 'Mar 2023 – May 2023' },
    place: { es: 'Barcelona', en: 'Barcelona' },
    summary: {
      es: 'Aplicaciones web internas para Vueling.',
      en: 'Internal web applications for Vueling.',
    },
    highlights: {
      es: [
        'Vistas y componentes optimizados para mejorar el rendimiento y la usabilidad.',
        'Integración de servicios con API REST y GraphQL, validados con Postman.',
        'Equipo ágil con Scrum y reuniones diarias.',
      ],
      en: [
        'Views and components optimised for performance and usability.',
        'Service integration with REST and GraphQL APIs, validated with Postman.',
        'Agile team with Scrum and daily stand-ups.',
      ],
    },
    stack: ['API REST', 'GraphQL', 'Postman', 'Scrum'],
    angular: 'Angular',
  },
  {
    company: 'SM Medioambientales',
    role: { es: 'Frontend developer', en: 'Frontend developer' },
    period: { es: 'Sep 2022 – Ene 2023', en: 'Sep 2022 – Jan 2023' },
    place: { es: 'Barcelona', en: 'Barcelona' },
    summary: {
      es: 'Sitios web con WordPress, adaptados a cada cliente.',
      en: 'WordPress websites, tailored to each client.',
    },
    highlights: {
      es: [
        'Diseño de interfaces y plantillas reutilizables para acortar las entregas.',
        'Contacto directo con los clientes para recoger requisitos y proponer mejoras.',
      ],
      en: [
        'Interface design and reusable templates to shorten delivery times.',
        'Direct contact with clients to gather requirements and suggest improvements.',
      ],
    },
    stack: ['WordPress'],
  },
  {
    company: 'Pukkas',
    role: { es: 'Frontend developer', en: 'Frontend developer' },
    period: { es: 'Ene 2022 – Ago 2022', en: 'Jan 2022 – Aug 2022' },
    place: { es: 'Barcelona', en: 'Barcelona' },
    summary: {
      es: 'Proyectos web y de comercio electrónico.',
      en: 'Web and e-commerce projects.',
    },
    highlights: {
      es: [
        'Maquetación fiel de los diseños del equipo, cuidando la accesibilidad.',
        'Optimización del rendimiento de webs y tiendas.',
        'Equipo ágil con Scrum y Jira.',
      ],
      en: [
        'Faithful implementation of the design team’s mockups, with care for accessibility.',
        'Performance optimisation of websites and shops.',
        'Agile team with Scrum and Jira.',
      ],
    },
    stack: ['WordPress', 'Elementor', 'HTML', 'CSS', 'JavaScript', 'React'],
  },
];

export const education: { title: Text; place: string; period: Text }[] = [
  {
    title: { es: 'Grado en Ingeniería Informática', en: 'BSc in Computer Engineering' },
    place: 'UOC',
    period: { es: 'En curso', en: 'In progress' },
  },
  {
    title: { es: 'Autoformación: UX/UI, Angular, React y testing', en: 'Self-study: UX/UI, Angular, React and testing' },
    place: 'Udemy',
    period: { es: 'En curso', en: 'In progress' },
  },
  {
    title: { es: 'Grado Superior en Desarrollo de Aplicaciones Web (DAW)', en: 'Higher Diploma in Web Application Development (DAW)' },
    place: 'CCC',
    period: { es: 'Jun 2022', en: 'Jun 2022' },
  },
];

export const languages: { name: Text; level: Text; value: number }[] = [
  { name: { es: 'Castellano', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' }, value: 1 },
  { name: { es: 'Catalán', en: 'Catalan' }, level: { es: 'Nativo', en: 'Native' }, value: 1 },
  { name: { es: 'Inglés', en: 'English' }, level: { es: 'B1', en: 'B1' }, value: 0.5 },
];
