// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://istok.sh",
  redirects: {
    "/docs/en/how-istok-works/tasks": "/docs/en/how-istok-works/tasks-and-runs",
    "/docs/en/how-istok-works/runs-and-validation": "/docs/en/how-istok-works/validation",
    "/docs/en/how-istok-works/context": "/docs/en/how-istok-works/context-and-knowledge",
    "/docs/en/how-istok-works/knowledge": "/docs/en/how-istok-works/context-and-knowledge",
    "/docs/en/how-istok-works/handoffs": "/docs/en/guides/multiple-agents",
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
