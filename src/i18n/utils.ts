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

    if (l === defaultLang) return cleanPath;

    return `/${l}${cleanPath === '/' ? '' : cleanPath}`;
  };
}
