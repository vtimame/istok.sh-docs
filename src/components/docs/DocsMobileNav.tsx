import { useState } from "react";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { DocsNavigation } from "@/components/docs/DocsNavigation";
import { DocsSearch } from "@/components/docs/DocsSearch";

import type { DocsNavigationGroup } from "@/lib/docs/navigation";

interface DocsMobileNavProps {
  groups: DocsNavigationGroup[];
  pathname: string;
}

export function DocsMobileNav({ groups, pathname }: DocsMobileNavProps) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open documentation navigation"
        className={cn(
          buttonVariants({
            variant: "ghost",
            size: "icon",
          }),
        )}
      >
        <MenuIcon className="size-4" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="
            flex
            w-[min(22rem,calc(100vw-1.5rem))]
            flex-col
            gap-0
            p-0
            sm:max-w-sm
          "
        >
          <SheetHeader className="shrink-0 border-b border-border/60 px-5 py-4">
            <SheetTitle className="text-left">Documentation</SheetTitle>
          </SheetHeader>

          <div className="shrink-0 border-b border-border/60 p-4">
            <DocsSearch onNavigate={close} />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6">
            <DocsNavigation groups={groups} pathname={pathname} onNavigate={close} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
