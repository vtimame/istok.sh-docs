import { getCollection, type CollectionEntry } from "astro:content";

import { createDocsNavigation } from "@/lib/docs/navigation";

const site = "https://istok.sh";

export const intro = `# Istok

> Istok is a local CLI, MCP server and web UI that keeps coding-agent work with your project instead of inside a conversation: tasks, runs, validations, context and knowledge live in a local SQLite database, so work survives across sessions and between agents.

Install with \`curl -fsSL https://get.istok.sh | sh\`, run \`istok init\` in a repository, connect an agent to \`istok mcp\` and open \`istok ui\` to watch the work.`;

// English pages in sidebar order; llms.txt is for agents, so one language is enough.
export async function englishDocs() {
  const entries = await getCollection("docs");
  const byId = new Map(entries.map((entry) => [entry.id, entry]));

  return createDocsNavigation(entries, "en").map((group) => ({
    title: group.title,
    pages: group.items
      .map((item) => byId.get(`en/${item.slug}`))
      .filter((entry): entry is CollectionEntry<"docs"> => entry !== undefined),
  }));
}

export function pageUrl(entry: CollectionEntry<"docs">) {
  return `${site}/docs/${entry.id}`;
}

// MDX pages import components and render screenshots; agents only need the prose.
export function plainBody(entry: CollectionEntry<"docs">) {
  return (entry.body ?? "")
    .replace(/^import .*$/gm, "")
    .replace(/^<[A-Z][\s\S]*?\/>\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
