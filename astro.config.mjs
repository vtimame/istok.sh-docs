// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://istok.sh",
  // Pages merged or removed when the docs were shortened; old links keep working.
  redirects: {
    "/docs/en/getting-started/installation": "/docs/en/getting-started/quick-start",
    "/docs/en/guides/web-ui": "/docs/en/getting-started/introduction",
    "/docs/en/guides/rules-and-knowledge": "/docs/en/guides/working-with-agents",
    "/docs/en/guides/multiple-agents": "/docs/en/guides/working-with-agents",
    "/docs/en/guides/updates-and-service": "/docs/en/getting-started/quick-start",
    "/docs/en/how-istok-works/projects": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/tasks-and-runs": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/validation": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/context-and-knowledge": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/tasks": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/runs-and-validation": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/context": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/knowledge": "/docs/en/how-istok-works/overview",
    "/docs/en/how-istok-works/handoffs": "/docs/en/guides/working-with-agents",
    "/docs/en/reference/ui": "/docs/en/getting-started/introduction",
    "/docs/en/help/troubleshooting": "/docs/en/help/faq",
    "/docs/en/reference/cli-overview": "/docs/en/reference/cli",
    "/docs/en/reference/project": "/docs/en/reference/cli",
    "/docs/en/reference/task": "/docs/en/reference/cli",
    "/docs/en/reference/run": "/docs/en/reference/cli",
    "/docs/en/reference/context": "/docs/en/reference/cli",
    "/docs/en/reference/knowledge": "/docs/en/reference/cli",
    "/docs/en/reference/index-search-graph": "/docs/en/reference/cli",
    "/docs/en/reference/configuration": "/docs/en/reference/cli",
    "/docs/en/reference/json-output": "/docs/en/reference/cli",
    "/docs/ru/getting-started/installation": "/docs/ru/getting-started/quick-start",
    "/docs/ru/guides/web-ui": "/docs/ru/getting-started/introduction",
    "/docs/ru/guides/rules-and-knowledge": "/docs/ru/guides/working-with-agents",
    "/docs/ru/guides/multiple-agents": "/docs/ru/guides/working-with-agents",
    "/docs/ru/guides/updates-and-service": "/docs/ru/getting-started/quick-start",
    "/docs/ru/how-istok-works/projects": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/tasks-and-runs": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/validation": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/context-and-knowledge": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/tasks": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/runs-and-validation": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/context": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/knowledge": "/docs/ru/how-istok-works/overview",
    "/docs/ru/how-istok-works/handoffs": "/docs/ru/guides/working-with-agents",
    "/docs/ru/reference/ui": "/docs/ru/getting-started/introduction",
    "/docs/ru/help/troubleshooting": "/docs/ru/help/faq",
    "/docs/ru/reference/cli-overview": "/docs/ru/reference/cli",
    "/docs/ru/reference/project": "/docs/ru/reference/cli",
    "/docs/ru/reference/task": "/docs/ru/reference/cli",
    "/docs/ru/reference/run": "/docs/ru/reference/cli",
    "/docs/ru/reference/context": "/docs/ru/reference/cli",
    "/docs/ru/reference/knowledge": "/docs/ru/reference/cli",
    "/docs/ru/reference/index-search-graph": "/docs/ru/reference/cli",
    "/docs/ru/reference/configuration": "/docs/ru/reference/cli",
    "/docs/ru/reference/json-output": "/docs/ru/reference/cli",
  },
  integrations: [react(), mdx()],
  markdown: {
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["diagram", "math"],
    },
    // Both themes are emitted; the light one shows by default and
    // global.css switches to --shiki-dark under .dark. Long lines wrap, so
    // prose-like blocks (agent instructions) read without scrolling.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
