import type { Locale } from "@/i18n";

// Labels in the docs chrome: search, navigation and the table of contents.
export interface DocsStrings {
  searchButton: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchUnavailable: string;
  noResults: string;
  results: string;
  pages: string;
  onThisPage: string;
  openNavigation: string;
}

export interface UiStrings {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    docs: string;
    github: string;
    language: string;
    themeToLight: string;
    themeToDark: string;
  };
  docs: DocsStrings;
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    meta: {
      title: "Istok — One workspace for every coding agent",
      description:
        "Keep tasks, progress and proof of done with your project, not inside an agent session, and continue on any of your machines.",
    },
    nav: {
      docs: "Docs",
      github: "GitHub",
      language: "Language",
      themeToLight: "Switch to light theme",
      themeToDark: "Switch to dark theme",
    },
    docs: {
      searchButton: "Search docs...",
      searchLabel: "Search documentation",
      searchPlaceholder: "Search documentation...",
      searchUnavailable: "Search is unavailable in development. Run a production build to generate the search index.",
      noResults: "No results found.",
      results: "Search results",
      pages: "Pages",
      onThisPage: "On this page",
      openNavigation: "Open documentation navigation",
    },
  },

  ru: {
    meta: {
      title: "Istok — единое пространство для всех агентов",
      description:
        "Задачи, ход работы и доказательства хранятся вместе с проектом, а не в сессии агента, и продолжаются на любой вашей машине.",
    },
    nav: {
      docs: "Документация",
      github: "GitHub",
      language: "Язык",
      themeToLight: "Светлая тема",
      themeToDark: "Тёмная тема",
    },
    docs: {
      searchButton: "Поиск...",
      searchLabel: "Поиск по документации",
      searchPlaceholder: "Искать в документации...",
      searchUnavailable: "В режиме разработки поиск недоступен. Соберите сайт, чтобы появился поисковый индекс.",
      noResults: "Ничего не найдено.",
      results: "Результаты поиска",
      pages: "Страницы",
      onThisPage: "На этой странице",
      openNavigation: "Открыть навигацию по документации",
    },
  },
};
