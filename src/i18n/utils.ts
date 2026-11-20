// src/i18n/utils.ts
import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    let cleanPath = path.startsWith('/') ? path : `/${path}`;

    // Strip existing non-default locale prefix before adding the new one
    for (const locale of Object.keys(ui)) {
      if (locale === defaultLang) continue;
      if (cleanPath === `/${locale}` || cleanPath.startsWith(`/${locale}/`)) {
        cleanPath = cleanPath.slice(`/${locale}`.length) || '/';
        break;
      }
    }

    const translated = l === defaultLang ? cleanPath : `/${l}${cleanPath === '/' ? '' : cleanPath}`;
    return withTrailingSlash(translated);
  };
}

/**
 * Toda ruta interna acaba en "/": Vercel redirige las URLs sin barra a la que lleva barra
 * (vercel.json, trailingSlash) y así el menú, el pie, el hreflang y el canonical dicen lo mismo
 * y no hay dos URLs para una misma página. Respeta el ancla (#...) y la consulta (?...), y no
 * toca los archivos con extensión (/cv.pdf).
 */
export function withTrailingSlash(path: string) {
  const match = path.match(/^([^?#]*)(.*)$/);
  const base = match?.[1] ?? path;
  const rest = match?.[2] ?? '';
  const last = base.split('/').pop() ?? '';
  if (base.endsWith('/') || last.includes('.')) return path;
  return `${base}/${rest}`;
}
