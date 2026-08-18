import { DocsNavigation } from "@/components/docs/DocsNavigation";
import type { DocsNavigationGroup } from "@/lib/docs/navigation";

interface DocsSidebarProps {
  groups: DocsNavigationGroup[];
  pathname: string;
}

export function DocsSidebar({ groups, pathname }: DocsSidebarProps) {
  return (
    <aside className="hidden border-r border-border/60 lg:block">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-6 py-8">
        <DocsNavigation groups={groups} pathname={pathname} />
      </div>
    </aside>
  );
}
