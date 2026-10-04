import type { Locale } from "@/i18n";

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
      title: "Istok — общее рабочее пространство для кодинг-агентов",
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
    footer: {
      tagline: "Общее рабочее пространство для кодинг-агентов.",
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
