export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

// The English site lives at the root, every other language under its prefix.
export function homeHref(lang: Locale) {
  return lang === defaultLocale ? "/" : `/${lang}/`;
}

export function docsHref(lang: Locale, slug: string) {
  return `/docs/${lang}/${slug}`;
}
