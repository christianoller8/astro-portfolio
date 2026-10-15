import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content', // v2.5+ (o 'content' en versiones anteriores de Astro)
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // Vital para el SEO y la preview
      year: z.number(),
      client: z.string(),
      tags: z.array(z.string()),
      image: image(), // Ruta relativa al asset (ej: '../../assets/images/project-1.jpg')
      featured: z.boolean().default(false), // Importante para la Home
      link: z.string().optional(), // Por si quieres poner un link al proyecto real
    }),
});

export const collections = {
  projects: projectsCollection,
};
