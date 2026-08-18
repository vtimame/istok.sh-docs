import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

function cleanPath(entry: string) {
  return entry
    .replace(/\.mdx?$/, "")
    .split("/")
    .map((part) => part.replace(/^\d+\./, ""))
    .join("/");
}

const docs = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./src/content",
    generateId: ({ entry }) => cleanPath(entry),
  }),

  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = {
  docs,
};
