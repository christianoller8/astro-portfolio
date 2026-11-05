import fs from 'node:fs';
import path from 'node:path';

// Datos de contacto y enlaces. Solo se importa desde el frontmatter de Astro (lee el disco al compilar).
const cvPath = '/cv/christian-oller-cv.pdf';

export const site = {
  name: 'Christian Oller',
  email: 'contacto@christianoller.com',
  linkedin: 'https://www.linkedin.com/in/christian-oller',
  github: 'https://github.com/christianoller8',
  cv: cvPath,
  // Endpoint del formulario (Formspree, Web3Forms…): PUBLIC_FORM_ENDPOINT en .env
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) ?? '',
};

/** El botón de CV solo aparece cuando el PDF existe en public/cv/. */
export const hasCV = fs.existsSync(path.join(process.cwd(), 'public', cvPath));

/** Orden de las páginas en el menú: decide hacia dónde se desplaza el frame al navegar. */
export const frameOrder = ['/', '/projects', '/about', '/contact'] as const;
