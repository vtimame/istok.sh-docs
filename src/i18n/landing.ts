import type { Locale } from "@/i18n";

export interface LandingStrings {
  title: string[];
  // The words in the title painted with the agents' gradient.
  highlight: string;
  subtitle: string;
  copy: string;
  copied: string;
  docs: string;
  points: { title: string; body: string }[];
  links: { docs: string; changelog: string };
}

export const landing: Record<Locale, LandingStrings> = {
  en: {
    title: ["Your agent says", "“done”.", "Istok keeps the proof."],
    highlight: "the proof",
    subtitle:
      "Istok runs your agent's checks itself and keeps them with the task, every attempt and handoff, in your project instead of one chat. A new session, another agent or another machine picks up where the last one stopped.",
    copy: "Copy install command",
    copied: "Copied",
    docs: "Read documentation",
    points: [
      { title: "Checks, not claims", body: "Tests and builds run through Istok, and their exit codes stay with the task. What the agent only reported is marked as its word." },
      { title: "Sessions end, the work stays", body: "Plans, decisions and handoffs survive restarts and compactions." },
      { title: "Any agent, every machine", body: "Claude Code, Codex and Cursor share the same tasks. Your own hub keeps devices in sync, end-to-end encrypted." },
    ],
    links: { docs: "Docs", changelog: "Changelog" },
  },

  ru: {
    title: ["Агент говорит", "«готово».", "Istok хранит доказательства."],
    highlight: "доказательства",
    subtitle:
      "Istok сам запускает проверки агента и хранит их в задаче вместе с попытками и передачей дел — в проекте, а не в одном чате. Новая сессия, другой агент или другая машина продолжают с того места, где остановилась предыдущая.",
    copy: "Скопировать команду установки",
    copied: "Скопировано",
    docs: "Документация",
    points: [
      { title: "Проверки, а не слова", body: "Тесты и сборка идут через Istok, и их коды возврата остаются в задаче. То, о чём агент только сообщил, помечено как его слова." },
      { title: "Сессия закончилась — работа осталась", body: "Планы, решения и передача дел переживают перезапуск и сжатие контекста." },
      { title: "Любой агент, любая машина", body: "Claude Code, Codex и Cursor работают с одними задачами. Свой хаб синхронизирует устройства со сквозным шифрованием." },
    ],
    links: { docs: "Документация", changelog: "Изменения" },
  },
};
