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
    title: ["One", "workspace", "for every coding agent."],
    highlight: "every coding agent",
    subtitle:
      "Tasks, progress and proof of done live with your project, not inside one chat. A new session, another agent or another of your machines picks up where the last one stopped.",
    copy: "Copy install command",
    copied: "Copied",
    docs: "Read documentation",
    points: [
      { title: "Sessions end, the work stays", body: "Plans, decisions and handoffs survive restarts and compactions." },
      { title: "“Done” comes with proof", body: "The checks an agent ran are recorded with the task." },
      { title: "Same tasks on every machine", body: "Your own hub keeps devices in sync, end-to-end encrypted." },
    ],
    links: { docs: "Docs", changelog: "Changelog" },
  },

  ru: {
    title: ["Единое", "пространство", "для всех агентов."],
    highlight: "всех агентов",
    subtitle:
      "Задачи, ход работы и доказательства хранятся с проектом, а не в одном чате. Новая сессия, другой агент или другая ваша машина продолжают с того места, где остановилась предыдущая.",
    copy: "Скопировать команду установки",
    copied: "Скопировано",
    docs: "Документация",
    points: [
      { title: "Сессия закончилась — работа осталась", body: "Планы, решения и передача дел переживают перезапуск и сжатие контекста." },
      { title: "«Готово» с доказательствами", body: "Проверки, которые запускал агент, записаны в задаче." },
      { title: "Одни задачи на всех машинах", body: "Свой хаб синхронизирует устройства со сквозным шифрованием." },
    ],
    links: { docs: "Документация", changelog: "Изменения" },
  },
};
