import { TaskTerminal } from "@/components/landing/TaskTerminal.tsx";

export function TasksSection() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
            <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              02 / Tasks
            </div>

            <h2 className="font-cormorant text-4xl font-normal italic leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Give agents work
              <br />
              that persists.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Tasks keep their description, acceptance criteria, state, relations and history in the
              project — across agent sessions.
            </p>
          </div>

          <TaskTerminal />
        </div>
      </div>
    </section>
  );
}
