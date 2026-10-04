import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { CheckIcon } from "lucide-react";
import { useId } from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import type { Locale } from "@/i18n";

interface LanguageMenuProps {
  lang: Locale;
  alternateHref: string;
  label: string;
  className?: string;
}

const languages: { locale: Locale; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "ru", name: "Русский" },
];

// A round flag button with the current language; the menu links to the same
// page in every language.
export function LanguageMenu({ lang, alternateHref, label, className }: LanguageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={label}
        title={label}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "rounded-full", className)}
      >
        <Flag locale={lang} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-auto min-w-36">
        {languages.map((language) => {
          const current = language.locale === lang;

          return (
            <MenuPrimitive.LinkItem
              key={language.locale}
              href={current ? undefined : alternateHref}
              hrefLang={language.locale}
              lang={language.locale}
              aria-current={current ? "page" : undefined}
              closeOnClick
              className="
                flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none
                focus:bg-accent focus:text-accent-foreground
              "
            >
              <Flag locale={language.locale} />

              {language.name}

              {current && <CheckIcon className="ml-auto size-4" />}
            </MenuPrimitive.LinkItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Flag({ locale }: { locale: Locale }) {
  return (
    <span className="size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/15">
      {locale === "ru" ? <RussianFlag /> : <BritishFlag />}
    </span>
  );
}

function RussianFlag() {
  return (
    <svg viewBox="0 0 9 9" className="size-full" aria-hidden="true">
      <rect width="9" height="3" fill="#fff" />
      <rect y="3" width="9" height="3" fill="#0039a6" />
      <rect y="6" width="9" height="3" fill="#d52b1e" />
    </svg>
  );
}

// The Union Jack, cropped to its centre square.
function BritishFlag() {
  const diagonals = `${useId()}-diagonals`;

  return (
    <svg viewBox="15 0 30 30" className="size-full" aria-hidden="true">
      <clipPath id={diagonals}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>

      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#c8102e" strokeWidth="4" clipPath={`url(#${diagonals})`} />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6" />
    </svg>
  );
}
