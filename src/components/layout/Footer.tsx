import { Logo } from "@/components/Logo";

import { docsHref, homeHref, type Locale } from "@/i18n";
import { ui } from "@/i18n/ui";

const repository = "https://github.com/vtimame/istok.sh";

export function Footer({ lang }: { lang: Locale }) {
  const strings = ui[lang].footer;

  const productLinks = [
    { label: strings.documentation, href: docsHref(lang, "getting-started/introduction") },
    { label: strings.quickStart, href: docsHref(lang, "getting-started/quick-start") },
    { label: strings.webUi, href: docsHref(lang, "guides/web-ui") },
    { label: strings.cli, href: docsHref(lang, "reference/cli-overview") },
  ];

  const projectLinks = [
    { label: "GitHub", href: repository },
    { label: strings.releases, href: `${repository}/releases` },
    { label: strings.changelog, href: `${repository}/blob/main/CHANGELOG.md` },
    { label: strings.issues, href: `${repository}/issues` },
    { label: "Apache-2.0", href: `${repository}/blob/main/LICENSE` },
  ];

  return (
    <footer className="border-t border-border/60">
      <div className="app-container">
        <div className="grid gap-12 py-12 sm:py-14 lg:grid-cols-[1fr_auto_auto] lg:gap-20 lg:py-16">
          <div className="max-w-sm">
            <a href={homeHref(lang)} className="inline-flex items-center gap-x-2" aria-label="Istok">
              <Logo size={32} />

              <span className="font-outfit font-semibold">istok</span>
            </a>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">{strings.tagline}</p>
          </div>

          <FooterLinks title={strings.product} links={productLinks} />
          <FooterLinks title={strings.project} links={projectLinks} external />
        </div>
      </div>
    </footer>
  );
}

interface FooterLinksProps {
  title: string;
  links: { label: string; href: string }[];
  external?: boolean;
}

function FooterLinks({ title, links, external }: FooterLinksProps) {
  return (
    <div>
      <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70">
        {title}
      </div>

      <nav className="flex flex-col items-start gap-2.5">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
