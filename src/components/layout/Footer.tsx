import { Logo } from "@/components/Logo";

const productLinks = [
  {
    label: "Documentation",
    href: "/docs/en/getting-started/introduction",
  },
  {
    label: "Quick start",
    href: "/docs/en/getting-started/quick-start",
  },
  {
    label: "CLI reference",
    href: "/docs/en/reference/cli-overview",
  },
  {
    label: "MCP",
    href: "/docs/en/reference/mcp",
  },
];

const projectLinks = [
  {
    label: "GitHub",
    href: "https://github.com/vtimame/istok.sh",
  },
  {
    label: "Releases",
    href: "https://github.com/vtimame/istok.sh/releases",
  },
  {
    label: "Issues",
    href: "https://github.com/vtimame/istok.sh/issues",
  },
  {
    label: "Apache-2.0",
    href: "https://github.com/vtimame/istok.sh/blob/main/LICENSE",
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div>
        <div className={"app-container"}>
          <div className="grid gap-12 py-12 sm:py-14 lg:grid-cols-[1fr_auto_auto] lg:gap-20 lg:py-16">
            <div className="max-w-sm">
              <a href="/" className="inline-flex items-center gap-x-2" aria-label="Istok home">
                <Logo size={32} />

                <span className="font-outfit font-semibold">istok</span>
              </a>

              <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
                One workspace for every coding agent.
              </p>
            </div>

            <div>
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                Product
              </div>

              <nav className="flex flex-col items-start gap-2.5">
                {productLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <div className="mb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/50">
                Project
              </div>

              <nav className="flex flex-col items-start gap-2.5">
                {projectLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
