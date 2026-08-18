import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";

import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsSearchDialog } from "@/components/docs/DocsSearchDialog";

import type { DocsNavigationGroup } from "@/lib/docs/navigation";

interface HeaderProps {
  docs?: {
    pathname: string;
    groups: DocsNavigationGroup[];
  };
}

export default function Header({ docs }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        `
          fixed
          top-0 right-0 left-0
          z-10
          border-b border-b-transparent
          bg-background/50
          backdrop-blur-2xl
          transition-[border-color]
        `,
        isScrolled && "border-b-foreground/10",
      )}
    >
      <div className="app-container flex h-14 items-center">
        <a href="/" className="flex items-center gap-x-2">
          <Logo size={32} />

          <div className="font-outfit font-semibold">istok</div>
        </a>

        <nav className="ml-auto flex items-center gap-x-2">
          {docs && (
            <>
              <DocsSearchDialog groups={docs.groups} />

              <div className="lg:hidden">
                <DocsMobileNav groups={docs.groups} pathname={docs.pathname} />
              </div>
            </>
          )}

          <a
            href="/docs/en/getting-started/introduction"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              docs && "hidden lg:inline-flex",
            )}
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
