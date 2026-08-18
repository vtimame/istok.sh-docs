import { cn } from "@/lib/utils";
import type { DocsNavigationGroup } from "@/lib/docs/navigation";

interface DocsNavigationProps {
  groups: DocsNavigationGroup[];
  pathname: string;
  onNavigate?: () => void;
}

function normalizePathname(pathname: string) {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
}

export function DocsNavigation({ groups, pathname, onNavigate }: DocsNavigationProps) {
  const currentPathname = normalizePathname(pathname);

  return (
    <nav className="space-y-8">
      {groups.map((group) => (
        <div key={group.slug}>
          <div className="mb-2 text-xs font-medium text-muted-foreground">{group.title}</div>

          <div className="space-y-0.5">
            {group.items.map((item) => {
              const active = currentPathname === normalizePathname(item.href);

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-muted font-medium text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.title}
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
