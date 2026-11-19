import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // Una frase: qué es y para quién
      kind: z.enum(['app', 'web']),
      format: z.enum(['desktop', 'mobile']).default('desktop'), // El marco en el lienzo de proyectos
      status: z.string(), // "En desarrollo", "Publicada"…
      role: z.string(),
      features: z.array(z.string()),
      stack: z.array(z.string()).default([]), // Vacío hasta confirmarlo: la ficha lo oculta
      ui: z.enum(['tempora', 'vibora', 'learnish']).optional(), // Fragmento de interfaz en HTML
      image: image().optional(), // Captura real (tiene prioridad sobre `ui`)
      imageAlt: z.string().optional(),
      link: z.string().optional(),
      year: z.number().optional(),
      order: z.number(),
      featured: z.boolean().default(true),
    }),
});

export const collections = {
  projects: projectsCollection,
};
