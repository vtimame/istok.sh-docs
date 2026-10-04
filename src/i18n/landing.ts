import type { Locale } from "@/i18n";

export interface Fact {
  label: string;
  value: string;
}

export interface FeatureCopy {
  title: string[];
  body: string;
}

export interface LandingStrings {
  hero: {
    title: string[];
    subtitle: string;
    copy: string;
    copied: string;
    docs: string;
  };
  showcase: {
    title: string[];
    body: string;
    tabs: {
      projects: string;
      runs: string;
      tasks: string;
    };
    mediaLabel: string;
    media: {
      browser: string;
      terminal: string;
    };
    alt: {
      projects: string;
      runs: string;
      tasks: string;
    };
  };
  workflow: FeatureCopy & { replay: string };
  memory: FeatureCopy;
  history: FeatureCopy & { alt: string };
  context: FeatureCopy & { alt: string };
  evidence: FeatureCopy & { alt: string };
  local: FeatureCopy & { facts: Fact[] };
  start: {
    title: string[];
    steps: { title: string; body: string; code: string; prompt?: boolean }[];
    more: string;
  };
  cta: {
    title: string[];
    body: string;
    button: string;
  };
}

export const landing: Record<Locale, LandingStrings> = {
  en: {
    hero: {
      title: ["One", "workspace", "for every coding agent."],
      subtitle:
        "Keep tasks, context and progress with your project, not inside an agent session. See what every agent did, and how it proved it.",
      copy: "Copy install command",
      copied: "Copied",
      docs: "Read documentation",
    },
    showcase: {
      title: ["See what your agents", "are working on."],
      body: "One interface for all your projects and tasks, in the browser and in the terminal. You see everything your agents do.",
      tabs: {
        projects: "Projects",
        runs: "Runs",
        tasks: "Tasks",
      },
      mediaLabel: "Show in",
      media: {
        browser: "Browser",
        terminal: "Terminal",
      },
      alt: {
        projects: "Projects page: nine projects with open, blocked and done task counts, one running and one stale run",
        runs: "Run feed: active, succeeded, stale and failed runs by Claude and Codex across projects",
        tasks: "Task list of the acme-api project with statuses and an agent working on task 20",
      },
    },
    workflow: {
      title: ["Describe the problem.", "Istok keeps the work."],
      body: "No need to manage tasks by hand. Your agent creates the task, claims it, records progress and validates the result.",
      replay: "Replay",
    },
    memory: {
      title: ["Say it once.", "Every agent remembers."],
      body: "Ask your agent to remember a rule, a decision or a gotcha. Istok keeps it with the project and hands it to every agent that picks up a task there, whether it is Claude or Codex.",
    },
    history: {
      title: ["Come back to a task’s", "history at any time."],
      body: "Every task keeps its history: who claimed it, what failed, who took over and how it ended. Each step links to the run behind it.",
      alt: "Task page: Codex's run failed and handed over, Claude's run succeeded and completed the task",
    },
    context: {
      title: ["Start with context,", "not from zero."],
      body: "When an agent claims a task, it gets the relevant code, rules and decisions right away. Istok keeps a copy, so you can always see what the agent started with.",
      alt: "What the agent saw: context budget, three context records and retrieved code with syntax highlighting",
    },
    evidence: {
      title: ["Done == proven."],
      body: "Agents record every check: the command, exit code and time. A task closes with proof.",
      alt: "Run page: three passed validations with go test, go test -race and go vet",
    },
    local: {
      title: ["Built around", "your project."],
      body: "One binary and one SQLite file on your machine. No account, no cloud, no server to run. Agents come and go; the project keeps its history.",
      facts: [
        { label: "Storage", value: "local SQLite" },
        { label: "Transport", value: "MCP" },
        { label: "Scope", value: "per project" },
        { label: "Agents", value: "any MCP client" },
      ],
    },
    start: {
      title: ["Up and running", "in a minute."],
      steps: [
        {
          title: "Install",
          body: "One binary for Linux and macOS, verified on download.",
          code: "curl -fsSL https://get.istok.sh | sh",
        },
        {
          title: "Connect your agent",
          body: "Once per machine. Claude Code shown here; Codex, Cursor and any MCP client work too.",
          code: "claude mcp add --scope user istok -- \\\n  istok mcp --actor-id claude --actor-name \"Claude Code\"",
        },
        {
          title: "Register your project",
          body: "Open the agent in your repository and ask. It registers the project through MCP; nothing is written into the repository.",
          code: "Register this project in Istok.",
          prompt: true,
        },
        {
          title: "Open the UI",
          body: "Watch tasks and runs appear while your agent works.",
          code: "istok ui",
        },
      ],
      more: "Full quick start",
    },
    cta: {
      title: ["Give your agents", "a shared project memory."],
      body: "Set up your project, connect your coding agents through MCP and let Istok keep the work between sessions.",
      button: "Quick start",
    },
  },

  ru: {
    hero: {
      title: ["Одно", "пространство", "для всех агентов."],
      subtitle:
        "Следите за задачами, контекстом и ходом работы над проектом, а не за сессией агента. Смотрите, что сделал каждый агент и как он это доказал.",
      copy: "Скопировать команду установки",
      copied: "Скопировано",
      docs: "Документация",
    },
    showcase: {
      title: ["Следите за работой", "ваших агентов."],
      body: "Один интерфейс для всех проектов и задач — в браузере и в терминале. Вы видите всё, что делают агенты.",
      tabs: {
        projects: "Проекты",
        runs: "Запуски",
        tasks: "Задачи",
      },
      mediaLabel: "Где смотреть",
      media: {
        browser: "Браузер",
        terminal: "Терминал",
      },
      alt: {
        projects: "Страница проектов: девять проектов со счётчиками открытых, заблокированных и выполненных задач, один активный и один зависший запуск",
        runs: "Лента запусков: активные, успешные, зависшие и неудачные запуски Claude и Codex во всех проектах",
        tasks: "Список задач проекта acme-api со статусами и агентом, работающим над задачей 20",
      },
    },
    workflow: {
      title: ["Опишите задачу.", "Istok сохранит работу."],
      body: "Не нужно вести задачи руками. Агент сам создаёт задачу, берёт её в работу, записывает прогресс и проверяет результат.",
      replay: "Повторить",
    },
    memory: {
      title: ["Скажите один раз.", "Запомнят все агенты."],
      body: "Попросите агента запомнить правило, решение или подводный камень. Istok сохранит это в проекте и передаст каждому агенту, который возьмёт здесь задачу, будь то Claude или Codex.",
    },
    history: {
      title: ["Возвращайтесь к истории", "задачи в любое время."],
      body: "У каждой задачи есть история: кто её взял, что не получилось, кто продолжил и чем всё закончилось. Каждый шаг ведёт к своему запуску.",
      alt: "Страница задачи: запуск Codex завершился неудачей и передал задачу, запуск Claude прошёл успешно и завершил её",
    },
    context: {
      title: ["Начинайте с контекста,", "а не с нуля."],
      body: "Взяв задачу, агент сразу получает нужный код, правила и решения проекта. Istok сохраняет копию, так что всегда видно, с чем агент начинал.",
      alt: "Что получил агент: бюджет контекста, три записи контекста и найденный код с подсветкой синтаксиса",
    },
    evidence: {
      title: ["Готово == доказано."],
      body: "Агенты записывают каждую проверку: команду, код выхода и время. Задача закрывается с подтверждением.",
      alt: "Страница запуска: три успешные проверки go test, go test -race и go vet",
    },
    local: {
      title: ["Всё вокруг", "вашего проекта."],
      body: "Один бинарник и один файл SQLite на вашем компьютере. Без аккаунта, облака и отдельного сервера. Агенты приходят и уходят, а история остаётся с проектом.",
      facts: [
        { label: "Хранилище", value: "локальный SQLite" },
        { label: "Протокол", value: "MCP" },
        { label: "Границы", value: "проект" },
        { label: "Агенты", value: "любой MCP-клиент" },
      ],
    },
    start: {
      title: ["Готово к работе", "за минуту."],
      steps: [
        {
          title: "Установите",
          body: "Один бинарник для Linux и macOS, подпись проверяется при загрузке.",
          code: "curl -fsSL https://get.istok.sh | sh",
        },
        {
          title: "Подключите агента",
          body: "Один раз на компьютер. Пример для Claude Code; Codex, Cursor и любой MCP-клиент тоже подходят.",
          code: "claude mcp add --scope user istok -- \\\n  istok mcp --actor-id claude --actor-name \"Claude Code\"",
        },
        {
          title: "Зарегистрируйте проект",
          body: "Откройте агента в репозитории и попросите. Он зарегистрирует проект через MCP, в сам репозиторий ничего не записывается.",
          code: "Зарегистрируй этот проект в Istok.",
          prompt: true,
        },
        {
          title: "Откройте интерфейс",
          body: "Задачи и запуски появляются, пока агент работает.",
          code: "istok ui",
        },
      ],
      more: "Подробный быстрый старт",
    },
    cta: {
      title: ["Дайте агентам", "общую память проекта."],
      body: "Подготовьте проект, подключите агентов через MCP, и Istok сохранит работу между сессиями.",
      button: "Быстрый старт",
    },
  },
};
