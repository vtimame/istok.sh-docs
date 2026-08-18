import { useEffect, useState } from "react";
import { LoaderCircleIcon, SearchIcon, XIcon } from "lucide-react";

interface DocsSearchProps {
  onNavigate?: () => void;
}

interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: {
    title?: string;
    [key: string]: string | undefined;
  };
}

interface PagefindSearchResult {
  id: string;
  data: () => Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
  results: PagefindSearchResult[];
}

interface PagefindModule {
  init: () => Promise<void> | void;
  search: (query: string) => Promise<PagefindSearchResponse>;
}

let pagefindPromise: Promise<PagefindModule> | null = null;

function loadPagefind(): Promise<PagefindModule> {
  if (pagefindPromise) {
    return pagefindPromise;
  }

  const baseUrl = import.meta.env.BASE_URL;
  const pagefindUrl = `${baseUrl}pagefind/pagefind.js`;

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

export function DocsSearch({ onNavigate }: DocsSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PagefindResultData[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const normalizedQuery = query.trim();

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setFailed(false);

      return;
    }

    let active = true;

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);

      try {
        const pagefind = await loadPagefind();

        const response = await pagefind.search(normalizedQuery);

        const data = await Promise.all(response.results.slice(0, 8).map((result) => result.data()));

        if (!active) {
          return;
        }

        setResults(data);
      } catch (error) {
        console.error("Unable to load Pagefind:", error);

        if (!active) {
          return;
        }

        setResults([]);
        setFailed(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 150);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [normalizedQuery]);

  const preloadPagefind = () => {
    void loadPagefind().catch(() => {
      // astro dev does not generate the Pagefind index.
    });
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setFailed(false);
  };

  return (
    <div>
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />

        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={preloadPagefind}
          placeholder="Search documentation..."
          aria-label="Search documentation"
          autoComplete="off"
          className="
            h-9 w-full rounded-lg border border-input
            bg-background
            pl-9 pr-9
            text-sm
            outline-none
            transition-[border-color,box-shadow]
            placeholder:text-muted-foreground
            focus-visible:border-ring
            focus-visible:ring-[3px]
            focus-visible:ring-ring/20
          "
        />

        {loading ? (
          <LoaderCircleIcon
            aria-hidden="true"
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
          />
        ) : query ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear search"
            className="
              absolute right-1.5 top-1/2
              flex size-7 -translate-y-1/2
              items-center justify-center
              rounded-md
              text-muted-foreground
              transition-colors
              hover:bg-muted
              hover:text-foreground
            "
          >
            <XIcon className="size-3.5" />
          </button>
        ) : null}
      </div>

      {normalizedQuery.length >= 2 && (
        <div className="mt-4">
          {failed ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              Search is unavailable in development. Run a production build to generate the search
              index.
            </p>
          ) : !loading && results.length === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">No results found.</p>
          ) : (
            <div className="space-y-1">
              {results.map((result) => (
                <a
                  key={result.url}
                  href={result.url}
                  onClick={onNavigate}
                  className="
                    block rounded-lg
                    px-2.5 py-2.5
                    transition-colors
                    hover:bg-muted/70
                  "
                >
                  <div className="text-sm font-medium text-foreground">
                    {result.meta.title ?? "Untitled"}
                  </div>

                  {result.excerpt && (
                    <div
                      className="
                        mt-1 line-clamp-2
                        text-xs leading-5
                        text-muted-foreground
                        [&_mark]:bg-transparent
                        [&_mark]:font-semibold
                        [&_mark]:text-foreground
                      "
                      dangerouslySetInnerHTML={{
                        __html: result.excerpt,
                      }}
                    />
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
