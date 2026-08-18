import { useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

export function DocsToc({ headings }: Props) {
  const items = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);

  const [activeId, setActiveId] = useState<string | null>(items[0]?.slug ?? null);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const elements = items
      .map((item) => document.getElementById(item.slug))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-14 py-8 pl-8">
        <div className="mb-4 text-xs font-medium text-muted-foreground">On this page</div>

        <nav className="relative border-l border-border">
          {items.map((heading) => {
            const active = heading.slug === activeId;

            return (
              <a
                key={heading.slug}
                href={`#${heading.slug}`}
                className={cn(
                  "relative block py-1.5 text-sm leading-5 transition-colors",
                  heading.depth === 2 ? "pl-4" : "pl-7",
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span
                    className="
                      absolute
                      top-0
                      bottom-0
                      -left-px
                      w-px
                      bg-foreground
                    "
                  />
                )}

                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
