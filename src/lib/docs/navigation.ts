import type { CollectionEntry } from "astro:content";

export interface DocsNavigationItem {
  title: string;
  href: string;
  slug: string;
  order: number;
}

export interface DocsNavigationGroup {
  title: string;
  slug: string;
  order: number;
  items: DocsNavigationItem[];
}

const groupTitles: Record<string, Record<string, string>> = {
  en: {
    "getting-started": "Getting started",
    "how-istok-works": "How Istok works",
    reference: "Reference",
    help: "Help",
  },

  ru: {
    "getting-started": "Начало работы",
  },
};

function parseOrderedSegment(segment: string) {
  const match = segment.match(/^(\d+)\.(.+)$/);

  if (!match) {
    return {
      order: Number.MAX_SAFE_INTEGER,
      name: segment,
    };
  }

  return {
    order: Number(match[1]),
    name: match[2],
  };
}

export function createDocsNavigation(
  entries: CollectionEntry<"docs">[],
  lang: string,
): DocsNavigationGroup[] {
  const localizedEntries = entries.filter((entry) => entry.id.startsWith(`${lang}/`));

  const groups = new Map<string, DocsNavigationGroup>();

  for (const entry of localizedEntries) {
    if (!entry.filePath) {
      continue;
    }

    const fileParts = entry.filePath.split("/");
    const langIndex = fileParts.findIndex((part) => part === lang);

    if (langIndex === -1) {
      continue;
    }

    const groupRaw = fileParts[langIndex + 1];
    const fileRaw = fileParts[langIndex + 2];

    if (!groupRaw || !fileRaw) {
      continue;
    }

    const group = parseOrderedSegment(groupRaw);

    const file = parseOrderedSegment(fileRaw.replace(/\.mdx?$/, ""));

    const [, ...slugParts] = entry.id.split("/");
    const slug = slugParts.join("/");

    let navigationGroup = groups.get(group.name);

    if (!navigationGroup) {
      navigationGroup = {
        slug: group.name,
        order: group.order,
        title: groupTitles[lang]?.[group.name] ?? group.name,
        items: [],
      };

      groups.set(group.name, navigationGroup);
    }

    navigationGroup.items.push({
      title: entry.data.title,
      slug,
      order: file.order,
      href: `/docs/${lang}/${slug}`,
    });
  }

  return Array.from(groups.values())
    .sort((a, b) => a.order - b.order)
    .map((group) => ({
      ...group,
      items: group.items.sort((a, b) => a.order - b.order),
    }));
}
