export interface DocsSearchResult {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    [key: string]: string | undefined;
  };
}

interface PagefindSearchResult {
  id: string;
  data: () => Promise<DocsSearchResult>;
}

interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

interface PagefindModule {
  init: () => Promise<void> | void;
  search: (query: string) => Promise<PagefindSearchResponse>;
}

let pagefindPromise: Promise<PagefindModule> | null = null;

async function loadPagefind(): Promise<PagefindModule> {
  if (pagefindPromise) {
    return pagefindPromise;
  }

  const pagefindUrl = `${import.meta.env.BASE_URL}pagefind/pagefind.js`;

  pagefindPromise = import(
    /* @vite-ignore */
    pagefindUrl
  ).then(async (module) => {
    const pagefind = module as PagefindModule;

    await pagefind.init();

    return pagefind;
  });

  return pagefindPromise;
}

export async function preloadDocsSearch() {
  await loadPagefind();
}

export async function searchDocs(query: string, limit = 10): Promise<DocsSearchResult[]> {
  const pagefind = await loadPagefind();

  const response = await pagefind.search(query);

  return Promise.all(response.results.slice(0, limit).map((result) => result.data()));
}
