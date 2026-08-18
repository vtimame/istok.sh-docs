import { buttonVariants } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-36">
      <div className="app-container">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/35">
              Start with Istok
            </div>

            <h2 className="mt-5 font-cormorant text-5xl font-normal italic leading-[0.92] tracking-[-0.035em] sm:text-6xl lg:text-7xl">
              Give your agents
              <br />a shared project memory.
            </h2>

            <p className="mt-7 max-w-xl leading-relaxed text-muted-foreground">
              Set up your project, connect your coding agents through MCP and let Istok keep the
              work between sessions.
            </p>
          </div>

          <div className="shrink-0">
            <a
              href="/docs/en/getting-started/introduction"
              className={buttonVariants({
                size: "lg",
              })}
            >
              Quick start
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
