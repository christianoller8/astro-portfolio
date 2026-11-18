// Trayectoria profesional, de lo más reciente a lo más antiguo (Sobre mí y resumen del inicio).

type Lang = 'es' | 'en';

export interface Job {
  company: string;
  role: Record<Lang, string>;
  period: Record<Lang, string>;
  summary: Record<Lang, string>;
  highlights: Record<Lang, string[]>;
}

export const experience: Job[] = [
  {
    company: 'Vístalo',
    role: { es: 'Cofundador · Diseño y desarrollo', en: 'Co-founder · Design and development' },
    period: { es: '2025 - Actualidad', en: '2025 - Present' },
    summary: {
      es: 'Agencia que hace webs, fotos y presencia en Google para negocios pequeños.',
      en: 'An agency that builds websites, photography and Google presence for small businesses.',
    },
    highlights: {
      es: ['Diseño de cada pantalla y desarrollo del código, de la idea a la web terminada.'],
      en: ['Designing every screen and writing the code, from the idea to the finished website.'],
    },
  },
  {
    company: 'Inology',
    role: { es: 'FullStack Developer', en: 'FullStack Developer' },
    period: { es: 'Jun 2023 - Mar 2024', en: 'Jun 2023 - Mar 2024' },
    summary: {
      es: 'Desarrollo de aplicaciones ERP y soluciones de gestión horaria.',
      en: 'Development of ERP applications and time-management solutions.',
    },
    highlights: {
      es: [
        'Mantenimiento de ERP con SQL.',
        'Personalización de informes con Crystal Reports.',
        'Gestión y administración de servidores.',
        'Trato directo y consultoría con clientes.',
      ],
      en: [
        'ERP maintenance with SQL.',
        'Report customization with Crystal Reports.',
        'Server management and administration.',
        'Direct client communication and consulting.',
      ],
    },
  },
  {
    company: 'SM Medioambientales',
    role: { es: 'Front-end Developer', en: 'Front-end Developer' },
    period: { es: 'Sep 2023 - Nov 2023', en: 'Sep 2023 - Nov 2023' },
    summary: {
      es: 'Soluciones web para consultoría ambiental.',
      en: 'Web solutions for environmental consulting.',
    },
    highlights: {
      es: [
        'Mantenimiento web y optimización.',
        'Diseño UI (HTML/CSS/JS).',
        'Coordinación del rediseño completo de la plataforma.',
        'Refactorización a tecnologías modernas (Tailwind/Bootstrap).',
      ],
      en: [
        'Web maintenance and optimization.',
        'UI design (HTML/CSS/JS).',
        'Coordination of the full platform redesign.',
        'Refactoring to modern technologies (Tailwind/Bootstrap).',
      ],
    },
  },
  {
    company: 'Vueling Airlines',
    role: { es: 'Front-end Developer', en: 'Front-end Developer' },
    period: { es: 'Mar 2023 - May 2023', en: 'Mar 2023 - May 2023' },
    summary: {
      es: 'Innovación tecnológica y plataformas digitales para aerolíneas.',
      en: 'Technology innovation and digital platforms for airlines.',
    },
    highlights: {
      es: [
        'Desarrollo Web con Angular.',
        'Implementación robusta con TypeScript/JS.',
        'Creación de aplicaciones dinámicas de alto tráfico.',
        'Integración de APIs y testing exhaustivo con Postman.',
      ],
      en: [
        'Web development with Angular.',
        'Robust implementation with TypeScript/JS.',
        'Building dynamic, high-traffic applications.',
        'API integration and thorough testing with Postman.',
      ],
    },
  },
  {
    company: 'Pukkas',
    role: { es: 'Front-end Developer', en: 'Front-end Developer' },
    period: { es: 'Ene 2022 - Ago 2022', en: 'Jan 2022 - Aug 2022' },
    summary: {
      es: 'Desarrollo de proyectos web a medida.',
      en: 'Development of custom web projects.',
    },
    highlights: {
      es: [
        'Desarrollo Frontend de interfaces de usuario.',
        'Integración de APIs externas y servicios web.',
      ],
      en: [
        'Front-end development of user interfaces.',
        'Integration of external APIs and web services.',
      ],
    },
  },
];
