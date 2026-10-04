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
    eyebrow: string;
    title: string[];
    body: string;
    tabs: {
      projects: string;
      runs: string;
      tasks: string;
      search: string;
    };
    alt: {
      projects: string;
      runs: string;
      tasks: string;
      search: string;
    };
  };
  problem: {
    eyebrow: string;
    title: string[];
    items: { title: string; body: string }[];
  };
  workflow: FeatureCopy;
  history: FeatureCopy & { alt: string };
  context: FeatureCopy & { alt: string };
  handoff: FeatureCopy & { facts: Fact[] };
  evidence: FeatureCopy & { alt: string };
  local: FeatureCopy & { facts: Fact[] };
  start: {
    eyebrow: string;
    title: string[];
    steps: { title: string; body: string; code: string }[];
    more: string;
  };
  cta: {
    eyebrow: string;
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
      eyebrow: "Web UI",
      title: ["See what your agents", "are working on."],
      body: "opens a local dashboard for every project, task and run. It updates live as agents write, and never leaves your machine.",
      tabs: {
        projects: "Projects",
        runs: "Runs",
        tasks: "Tasks",
        search: "Search",
      },
      alt: {
        projects: "Projects page: nine projects with open, blocked and done task counts, one running and one stale run",
        runs: "Run feed: active, succeeded, stale and failed runs by Claude and Codex across projects",
        tasks: "Task list of the acme-api project with statuses and an agent working on task 20",
        search: "Search palette finding tasks that mention orders",
      },
    },
    problem: {
      eyebrow: "Why Istok",
      title: ["Agent sessions end.", "The work shouldn't."],
      items: [
        {
          title: "Context disappears",
          body: "A new session starts from zero. Decisions, failed attempts and half-done work stay behind in an old chat.",
        },
        {
          title: "Work is invisible",
          body: "With several agents across several repositories, it is hard to tell who is doing what, and what quietly stalled.",
        },
        {
          title: "“Done” is just a claim",
          body: "An agent says the tests pass. Without a record of the commands it ran, you can only take its word for it.",
        },
      ],
    },
    workflow: {
      title: ["Describe the problem.", "Istok keeps the work."],
      body: "Your agent creates the task, claims it, records progress and validates the result through MCP, without turning task management into your job.",
    },
    history: {
      title: ["See exactly", "what happened."],
      body: "Every task keeps its history: who claimed it, what failed, who took over and how it ended. Each step links to the run behind it.",
      alt: "Task page: Codex's run failed and handed over, Claude's run succeeded and completed the task",
    },
    context: {
      title: ["Start with context,", "not from zero."],
      body: "When an agent claims a task, Istok gives it the project's rules, past decisions and the relevant code, within a fixed budget. The run keeps a copy, so you can see exactly what the agent saw.",
      alt: "What the agent saw: context budget, three context records and retrieved code with syntax highlighting",
    },
    handoff: {
      title: ["Switch agents.", "Keep the work."],
      body: "One agent can stop and another can continue: the task stays the same. Istok keeps the work as one continuous thread across runs.",
      facts: [
        { label: "Task", value: "stays open" },
        { label: "Old run", value: "abandoned" },
        { label: "New run", value: "fresh" },
        { label: "Context", value: "retrieved again" },
      ],
    },
    evidence: {
      title: ["Done means", "proven."],
      body: "Agents record the checks they ran: the command, exit code and duration. A task is completed with evidence, not a promise.",
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
      eyebrow: "Get started",
      title: ["Up and running", "in a minute."],
      steps: [
        {
          title: "Install",
          body: "One binary for Linux and macOS, verified on download.",
          code: "curl -fsSL https://get.istok.sh | sh",
        },
        {
          title: "Initialize your project",
          body: "Run once in the repository. Nothing is written into it.",
          code: "cd my-project\nistok init",
        },
        {
          title: "Connect your agent",
          body: "Claude Code shown here; Codex, Cursor and any MCP client work too.",
          code: "claude mcp add --scope user istok -- \\\n  istok mcp --actor-id claude --actor-name \"Claude Code\"",
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
      eyebrow: "Start with Istok",
      title: ["Give your agents", "a shared project memory."],
      body: "Set up your project, connect your coding agents through MCP and let Istok keep the work between sessions.",
      button: "Quick start",
    },
  },

  ru: {
    hero: {
      title: ["Одно", "пространство", "для всех агентов."],
      subtitle:
        "Задачи, контекст и прогресс хранятся вместе с проектом, а не в сессии агента. Видно, что сделал каждый агент и чем он это подтвердил.",
      copy: "Скопировать команду установки",
      copied: "Скопировано",
      docs: "Документация",
    },
    showcase: {
      eyebrow: "Веб-интерфейс",
      title: ["Видно, чем заняты", "ваши агенты."],
      body: "открывает локальную панель со всеми проектами, задачами и запусками. Она обновляется вживую, пока агенты работают, и не покидает ваш компьютер.",
      tabs: {
        projects: "Проекты",
        runs: "Запуски",
        tasks: "Задачи",
        search: "Поиск",
      },
      alt: {
        projects: "Страница проектов: девять проектов со счётчиками открытых, заблокированных и выполненных задач, один активный и один зависший запуск",
        runs: "Лента запусков: активные, успешные, зависшие и неудачные запуски Claude и Codex во всех проектах",
        tasks: "Список задач проекта acme-api со статусами и агентом, работающим над задачей 20",
        search: "Палитра поиска находит задачи про заказы",
      },
    },
    problem: {
      eyebrow: "Зачем Istok",
      title: ["Сессия агента кончается.", "Работа — нет."],
      items: [
        {
          title: "Контекст теряется",
          body: "Новая сессия начинается с нуля. Решения, неудачные попытки и недоделанная работа остаются в старом чате.",
        },
        {
          title: "Работы не видно",
          body: "Когда несколько агентов работают в нескольких репозиториях, непонятно, кто чем занят и что тихо зависло.",
        },
        {
          title: "«Готово» — это только слова",
          body: "Агент говорит, что тесты прошли. Без записи запущенных команд остаётся верить ему на слово.",
        },
      ],
    },
    workflow: {
      title: ["Опишите задачу.", "Istok сохранит работу."],
      body: "Агент сам создаёт задачу, берёт её в работу, записывает прогресс и проверяет результат через MCP. Вести задачи вручную не придётся.",
    },
    history: {
      title: ["Видно всё,", "что произошло."],
      body: "У каждой задачи есть история: кто её взял, что не получилось, кто продолжил и чем всё закончилось. Каждый шаг ведёт к своему запуску.",
      alt: "Страница задачи: запуск Codex завершился неудачей и передал задачу, запуск Claude прошёл успешно и завершил её",
    },
    context: {
      title: ["Начинайте с контекста,", "а не с нуля."],
      body: "Когда агент берёт задачу, Istok выдаёт ему правила проекта, прошлые решения и нужный код в пределах заданного бюджета. Запуск сохраняет копию, поэтому видно, что именно получил агент.",
      alt: "Что получил агент: бюджет контекста, три записи контекста и найденный код с подсветкой синтаксиса",
    },
    handoff: {
      title: ["Меняйте агентов.", "Работа остаётся."],
      body: "Один агент может остановиться, другой — продолжить, а задача остаётся той же. Istok ведёт работу как одну непрерывную нить через все запуски.",
      facts: [
        { label: "Задача", value: "остаётся открытой" },
        { label: "Старый запуск", value: "брошен" },
        { label: "Новый запуск", value: "с чистого листа" },
        { label: "Контекст", value: "собран заново" },
      ],
    },
    evidence: {
      title: ["Готово —", "значит доказано."],
      body: "Агенты записывают проверки, которые запускали: команду, код выхода и длительность. Задача закрывается с доказательствами, а не с обещанием.",
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
      eyebrow: "Начало работы",
      title: ["Готово к работе", "за минуту."],
      steps: [
        {
          title: "Установите",
          body: "Один бинарник для Linux и macOS, подпись проверяется при загрузке.",
          code: "curl -fsSL https://get.istok.sh | sh",
        },
        {
          title: "Инициализируйте проект",
          body: "Один раз в репозитории. В сам репозиторий ничего не записывается.",
          code: "cd my-project\nistok init",
        },
        {
          title: "Подключите агента",
          body: "Пример для Claude Code; Codex, Cursor и любой MCP-клиент тоже подходят.",
          code: "claude mcp add --scope user istok -- \\\n  istok mcp --actor-id claude --actor-name \"Claude Code\"",
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
      eyebrow: "Начните с Istok",
      title: ["Дайте агентам", "общую память проекта."],
      body: "Подготовьте проект, подключите агентов через MCP, и Istok сохранит работу между сессиями.",
      button: "Быстрый старт",
    },
  },
};
