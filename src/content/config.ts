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
      // Vídeo del proyecto (docs/referencias/guia-videos-proyectos.md). Si lo hay, sustituye a la
      // interfaz en la caja grande de Proyectos. `label` dice qué se ve, en el idioma de cada archivo
      video: z
        .object({
          src: z.string().startsWith('/videos/'), // MP4: /videos/<slug>.mp4
          poster: z.string().startsWith('/videos/'), // JPG: /videos/posters/<slug>.jpg
          label: z.string(),
        })
        .optional(),
      link: z.string().optional(),
      // Repositorio público en GitHub (solo los que no tienen nada privado dentro): botón "Ver el código"
      repo: z.string().url().optional(),
      year: z.number().optional(),
      order: z.number(),
      featured: z.boolean().default(true),
    }),
});

export const collections = {
  projects: projectsCollection,
};
