import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { buttonVariants } from "@/components/ui/button";

import { DocsMobileNav } from "@/components/docs/DocsMobileNav";
import { DocsSearchDialog } from "@/components/docs/DocsSearchDialog";
import { ColorModeButton } from "@/components/layout/ColorModeButton";

import { docsHref, homeHref, type Locale } from "@/i18n";
import { ui } from "@/i18n/ui";
import type { DocsNavigationGroup } from "@/lib/docs/navigation";

interface HeaderProps {
  lang: Locale;
  alternateHref?: string;
  docs?: {
    pathname: string;
    groups: DocsNavigationGroup[];
  };
}

export default function Header({ lang, alternateHref, docs }: HeaderProps) {
  const strings = ui[lang].nav;

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
        <a href={homeHref(lang)} className="flex items-center gap-x-2">
          <Logo size={32} />

          <div className="font-outfit font-semibold">istok</div>
        </a>

        <nav className="ml-auto flex items-center gap-x-1">
          {docs && (
            <>
              <DocsSearchDialog groups={docs.groups} strings={ui[lang].docs} />

              <div className="lg:hidden">
                <DocsMobileNav groups={docs.groups} strings={ui[lang].docs} pathname={docs.pathname} />
              </div>
            </>
          )}

          <a
            href={docsHref(lang, "getting-started/introduction")}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              docs && "hidden lg:inline-flex",
            )}
          >
            {strings.docs}
          </a>

          <a
            href="https://github.com/vtimame/istok.sh"
            target={"_blank"}
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "sm",
              }),
              "hidden sm:inline-flex",
              docs && "lg:inline-flex sm:hidden",
            )}
          >
            {strings.github}
          </a>

          {alternateHref && (
            <a
              href={alternateHref}
              hrefLang={lang === "en" ? "ru" : "en"}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "sm",
                }),
                docs && "hidden lg:inline-flex",
              )}
            >
              <span className="sm:hidden">{lang === "en" ? "RU" : "EN"}</span>
              <span className="hidden sm:inline">{strings.language}</span>
            </a>
          )}

          <ColorModeButton toLight={strings.themeToLight} toDark={strings.themeToDark} />
        </nav>
      </div>
    </header>
  );
}
