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
  footer: {
    tagline: string;
    product: string;
    project: string;
    documentation: string;
    quickStart: string;
    webUi: string;
    cli: string;
    releases: string;
    issues: string;
    changelog: string;
  };
}

export const ui: Record<Locale, UiStrings> = {
  en: {
    meta: {
      title: "Istok — One workspace for every coding agent",
      description:
        "Keep tasks, context and progress with your project, not inside an agent session. See what every agent did in a local web UI.",
    },
    nav: {
      docs: "Docs",
      github: "GitHub",
      language: "Русский",
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
    footer: {
      tagline: "One workspace for every coding agent.",
      product: "Product",
      project: "Project",
      documentation: "Documentation",
      quickStart: "Quick start",
      webUi: "Web UI",
      cli: "CLI reference",
      releases: "Releases",
      issues: "Issues",
      changelog: "Changelog",
    },
  },

  ru: {
    meta: {
      title: "Istok — одно пространство для всех агентов",
      description:
        "Задачи, контекст и прогресс хранятся вместе с проектом, а не в сессии агента. Всё, что сделали агенты, видно в локальном веб-интерфейсе.",
    },
    nav: {
      docs: "Документация",
      github: "GitHub",
      language: "English",
      themeToLight: "Светлая тема",
      themeToDark: "Тёмная тема",
    },
    docs: {
      searchButton: "Поиск по документации...",
      searchLabel: "Поиск по документации",
      searchPlaceholder: "Искать в документации...",
      searchUnavailable: "В режиме разработки поиск недоступен. Соберите сайт, чтобы появился поисковый индекс.",
      noResults: "Ничего не найдено.",
      results: "Результаты поиска",
      pages: "Страницы",
      onThisPage: "На этой странице",
      openNavigation: "Открыть навигацию по документации",
    },
    footer: {
      tagline: "Одно пространство для всех агентов.",
      product: "Продукт",
      project: "Проект",
      documentation: "Документация",
      quickStart: "Быстрый старт",
      webUi: "Веб-интерфейс",
      cli: "Справочник CLI",
      releases: "Релизы",
      issues: "Задачи",
      changelog: "Список изменений",
    },
  },
};
