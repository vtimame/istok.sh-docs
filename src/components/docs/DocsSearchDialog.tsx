import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { ArrowRightIcon, CornerDownLeftIcon, LoaderCircleIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { preloadDocsSearch, searchDocs, type DocsSearchResult } from "@/lib/docs/pagefind";

import type { DocsNavigationGroup, DocsNavigationItem } from "@/lib/docs/navigation";

interface DocsSearchDialogProps {
  groups: DocsNavigationGroup[];
  className?: string;
}

interface SearchItem {
  title: string;
  url: string;
  excerpt?: string;
}

export function DocsSearchDialog({ groups, className }: DocsSearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DocsSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [shortcut, setShortcut] = useState("Ctrl K");

  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo<SearchItem[]>(() => {
    return groups
      .flatMap((group) => group.items)
      .slice(0, 8)
      .map((item: DocsNavigationItem) => ({
        title: item.title,
        url: item.href,
      }));
  }, [groups]);

  const normalizedQuery = query.trim();

  const items = useMemo<SearchItem[]>(() => {
    if (normalizedQuery.length < 2) {
      return suggestions;
    }

    return results.map((result) => ({
      title: result.meta.title ?? "Untitled",
      url: result.url,
      excerpt: result.excerpt,
    }));
  }, [normalizedQuery, suggestions, results]);

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);

    setShortcut(isMac ? "⌘ K" : "Ctrl K");

    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    void preloadDocsSearch().catch(() => {
      // Pagefind is generated only after production build.
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setFailed(false);
      setActiveIndex(0);

      return;
    }

    let active = true;

    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);

      try {
        const searchResults = await searchDocs(normalizedQuery, 10);

        if (!active) {
          return;
        }

        setResults(searchResults);
        setActiveIndex(0);
      } catch (error) {
        console.error("Unable to search documentation:", error);

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

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setFailed(false);
      setActiveIndex(0);
    }
  }, [open]);

  const navigate = (url: string) => {
    setOpen(false);
    window.location.assign(url);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (items.length === 0) {
        return;
      }

      setActiveIndex((current) => (current >= items.length - 1 ? 0 : current + 1));

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (items.length === 0) {
        return;
      }

      setActiveIndex((current) => (current <= 0 ? items.length - 1 : current - 1));

      return;
    }

    if (event.key === "Enter") {
      const item = items[activeIndex];

      if (!item) {
        return;
      }

      event.preventDefault();
      navigate(item.url);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          `
            hidden h-8 w-56
            items-center gap-2
            rounded-lg border border-border/60
            bg-muted/30
            px-2.5
            text-sm text-muted-foreground
            transition-colors
            hover:bg-muted/60
            hover:text-foreground
            lg:flex
            xl:w-64
          `,
          className,
        )}
      >
        <SearchIcon className="size-3.5 shrink-0" />

        <span className="truncate">Search docs...</span>

        <kbd
          className="
            ml-auto
            rounded-md border border-border/60
            bg-background/60
            px-1.5 py-0.5
            font-sans text-[10px]
            leading-none
            text-muted-foreground
          "
        >
          {shortcut}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="
            top-[18%]
            w-[calc(100%-2rem)]
            max-w-xl
            translate-y-0
            gap-0
            overflow-hidden
            rounded-2xl
            border-border/70
            p-0
            shadow-2xl
            sm:max-w-xl
          "
        >
          <DialogTitle className="sr-only">Search documentation</DialogTitle>

          <div className="flex h-12 items-center border-b border-border/60 px-4">
            <SearchIcon
              className="
                mr-3 size-4 shrink-0
                text-muted-foreground
              "
            />

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder="Search documentation..."
              autoComplete="off"
              spellCheck={false}
              className="
                h-full min-w-0 flex-1
                bg-transparent
                text-sm
                outline-none
                placeholder:text-muted-foreground
              "
            />

            {loading && (
              <LoaderCircleIcon
                className="
                  ml-3 size-4 shrink-0
                  animate-spin
                  text-muted-foreground
                "
              />
            )}
          </div>

          <div className="max-h-[420px] min-h-48 overflow-y-auto p-2">
            {failed ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                Search is unavailable in development. Run a production build to generate the
                Pagefind index.
              </div>
            ) : normalizedQuery.length >= 2 && !loading && items.length === 0 ? (
              <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <>
                <div
                  className="
                    px-2 pb-1.5 pt-1
                    text-xs font-medium
                    text-muted-foreground
                  "
                >
                  {normalizedQuery.length >= 2 ? "Search results" : "Pages"}
                </div>

                <div>
                  {items.map((item, index) => {
                    const active = index === activeIndex;

                    return (
                      <a
                        key={`${item.url}-${index}`}
                        href={item.url}
                        onMouseEnter={() => {
                          setActiveIndex(index);
                        }}
                        onClick={() => {
                          setOpen(false);
                        }}
                        className={cn(
                          `
                            flex items-start gap-3
                            rounded-lg
                            px-2.5 py-2.5
                            text-sm
                            no-underline
                            transition-colors
                          `,
                          active ? "bg-muted text-foreground" : "text-foreground",
                        )}
                      >
                        <ArrowRightIcon
                          className="
                            mt-0.5 size-4
                            shrink-0
                            text-muted-foreground
                          "
                        />

                        <div className="min-w-0 flex-1">
                          <div className="font-medium">{item.title}</div>

                          {item.excerpt && (
                            <div
                              className="
                                mt-1
                                line-clamp-2
                                text-xs leading-5
                                text-muted-foreground

                                [&_mark]:bg-transparent
                                [&_mark]:font-semibold
                                [&_mark]:text-foreground
                              "
                              dangerouslySetInnerHTML={{
                                __html: item.excerpt,
                              }}
                            />
                          )}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div
            className="
              flex h-10 items-center
              gap-4
              border-t border-border/60
              px-3
              text-[11px]
              text-muted-foreground
            "
          >
            <div className="flex items-center gap-1.5">
              <kbd
                className="
                  flex size-5 items-center justify-center
                  rounded border border-border/70
                  bg-muted/40
                "
              >
                <CornerDownLeftIcon className="size-3" />
              </kbd>

              <span>Open</span>
            </div>

            <div className="ml-auto flex items-center gap-1.5">
              <kbd
                className="
                  rounded border border-border/70
                  bg-muted/40
                  px-1.5 py-0.5
                "
              >
                esc
              </kbd>

              <span>Close</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
