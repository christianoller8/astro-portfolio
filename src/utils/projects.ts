import { getCollection, type CollectionEntry } from 'astro:content';

export type Lang = 'es' | 'en';

const DEFAULT_LANG: Lang = 'es';

type ProjectEntry = CollectionEntry<'projects'>;

/** Splits an entry id like `en/project-1.md` into its locale folder and public slug. */
function splitSlug(entry: ProjectEntry): { lang: string; slug: string } {
  const [lang, ...rest] = entry.slug.split('/');
  return { lang, slug: rest.join('/') };
}

/**
 * Projects for one locale, with the locale folder stripped from `slug`
 * so public URLs are identical across languages. Slugs that exist only in
 * the default locale fall back to the default-locale entry.
 */
async function getLocalizedProjects(lang: Lang): Promise<ProjectEntry[]> {
  const all = await getCollection('projects');
  const bySlug = new Map<string, ProjectEntry>();

  for (const entry of all) {
    const { lang: entryLang, slug } = splitSlug(entry);
    if (entryLang === DEFAULT_LANG) bySlug.set(slug, { ...entry, slug });
  }
  if (lang !== DEFAULT_LANG) {
    for (const entry of all) {
      const { lang: entryLang, slug } = splitSlug(entry);
      if (entryLang === lang) bySlug.set(slug, { ...entry, slug });
    }
  }

  return [...bySlug.values()];
}

/** All projects for a locale, newest first. */
export async function getSortedProjects(lang: Lang) {
  const projects = await getLocalizedProjects(lang);
  return projects.sort((a, b) => b.data.year - a.data.year);
}

/** Featured projects for a locale, newest first. */
export async function getFeaturedProjects(lang: Lang) {
  const projects = await getSortedProjects(lang);
  return projects.filter((project) => project.data.featured);
}

/** Builds `getStaticPaths` for the `/projects/[slug]` route of a given locale. */
export function getProjectStaticPaths(lang: Lang) {
  return async () => {
    const projects = await getLocalizedProjects(lang);
    return projects.map((project) => ({
      params: { slug: project.slug },
      props: { project },
    }));
  };
}
