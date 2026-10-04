import type { APIRoute } from "astro";

import { englishDocs, intro, pageUrl, plainBody } from "@/lib/docs/llms";

export const GET: APIRoute = async () => {
  const groups = await englishDocs();

  const pages = groups.flatMap((group) =>
    group.pages.map((entry) => `# ${entry.data.title}\n\nSource: ${pageUrl(entry)}\n\n${plainBody(entry)}`),
  );

  return new Response([intro, ...pages].join("\n\n---\n\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
