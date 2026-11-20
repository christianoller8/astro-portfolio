import fs from 'node:fs';
import path from 'node:path';

// Datos de contacto y enlaces. Solo se importa desde el frontmatter de Astro (lee el disco al compilar).
const cvPath = '/cv/christian-oller-cv.pdf';

export const site = {
  name: 'Christian Oller',
  // El mismo oficio que dicen la descripción por defecto y el JSON-LD de Layout.astro
  jobTitle: 'Software developer',
  // Su correo, el que indicó él el 20 nov (hasta entonces la web mostraba contacto@christianoller.com)
  email: 'christianoller.dev@gmail.com',
  linkedin: 'https://www.linkedin.com/in/christian-oller',
  github: 'https://github.com/christianoller8',
  cv: cvPath,
  // Endpoint del formulario (Formspree, Web3Forms…): PUBLIC_FORM_ENDPOINT en .env
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined) ?? '',
};

/**
 * Los botones de CV (inicio, menú de móvil y pie) solo aparecen cuando el PDF existe en public/cv/.
 * Desde el 20 nov el PDF está ahí: Christian decidió publicarlo tal cual, con su teléfono y su
 * código postal (antes lo había guardado en docs/cv/, que no se publica). Los botones siguen
 * dependiendo de que el archivo exista: si algún día se quita de public/cv/, desaparecen solos.
 * Para cambiar el CV basta con sustituir el PDF, con este mismo nombre.
 */
export const hasCV = fs.existsSync(path.join(process.cwd(), 'public', cvPath));

/** Orden de las páginas en el menú: decide hacia dónde se desplaza el frame al navegar. */
export const frameOrder = ['/', '/projects', '/about', '/contact'] as const;
