import { InitTerminal } from "@/components/landing/InitTerminal.tsx";

export function ProjectState() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
            <h2 className="font-cormorant text-4xl font-normal italic leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Project state lives
              <br />
              with your code.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Initialize a project once. Istok gives it a persistent identity and keeps its state
              independent from any individual agent session.
            </p>
          </div>

          <InitTerminal />
        </div>
      </div>
    </section>
  );
}
