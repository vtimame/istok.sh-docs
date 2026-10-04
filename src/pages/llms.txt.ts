import type { APIRoute } from "astro";

import { englishDocs, intro, pageUrl } from "@/lib/docs/llms";

export const GET: APIRoute = async () => {
  const groups = await englishDocs();

  const sections = groups.map((group) => {
    const links = group.pages.map((entry) => {
      const description = entry.data.description ? `: ${entry.data.description}` : "";
      return `- [${entry.data.title}](${pageUrl(entry)})${description}`;
    });

    return `## ${group.title}\n\n${links.join("\n")}`;
  });

  const optional = "## Optional\n\n- [Full documentation in one file](https://istok.sh/llms-full.txt)";

  return new Response([intro, ...sections, optional].join("\n\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
