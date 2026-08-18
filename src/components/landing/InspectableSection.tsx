import { Terminal, type TerminalStep } from "@/components/ui/terminal";

const script: TerminalStep[] = [
  {
    type: "command",
    text: "istok task show 2",
    typingSpeed: 28,
    pause: 300,
  },

  {
    type: "output",
    className: "mt-1",
    content: <ProjectReference />,
    pause: 180,
  },

  {
    type: "output",
    className: "mt-5",
    content: <TaskHeader />,
    pause: 300,
  },

  {
    type: "output",
    className: "mt-5",
    content: (
      <TerminalSection title="Description">
        <TreeRow>Index project files for search.</TreeRow>
      </TerminalSection>
    ),
    pause: 300,
  },

  {
    type: "output",
    className: "mt-5",
    content: (
      <TerminalSection title="Acceptance criteria">
        <TreeRow>Search returns matching files and symbols.</TreeRow>
      </TerminalSection>
    ),
    pause: 300,
  },

  {
    type: "output",
    className: "mt-5",
    content: <Relations />,
    pause: 300,
  },

  {
    type: "output",
    className: "mt-5 pb-2",
    content: <History />,
  },
];

export function InspectableSection() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
            <h2 className="font-cormorant text-4xl font-normal italic leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              See exactly
              <br />
              what happened.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Every task keeps a durable history of the work — when it was created, claimed,
              updated, finished and completed.
            </p>
          </div>

          <InspectableTerminal />
        </div>
      </div>
    </section>
  );
}

function InspectableTerminal() {
  return <Terminal path="~/work/northstar-api" script={script} />;
}

function ProjectReference() {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sky-400">northstar-api</span>

      <span className="text-muted-foreground/35">·</span>

      <span className="text-amber-400">#2</span>
    </div>
  );
}

function TaskHeader() {
  return (
    <>
      <div className="font-semibold text-foreground/85">Repository indexing</div>

      <div className="mt-4">
        <TreeRow>
          <Field label="State:">
            <StatusDone />
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Revision:">
            <span className="text-violet-400">r3</span>
          </Field>
        </TreeRow>
      </div>
    </>
  );
}

function StatusDone() {
  return (
    <span className="inline-flex items-center gap-2 text-emerald-400">
      <span>✓</span>
      DONE
    </span>
  );
}

function Relations() {
  return (
    <TerminalSection title="Relations">
      <TreeRow>
        <Field label="Blocked by:">
          <span className="text-muted-foreground/55">—</span>
        </Field>
      </TreeRow>

      <TreeRow>
        <Field label="Blocks:">
          <span className="text-muted-foreground/55">—</span>
        </Field>
      </TreeRow>
    </TerminalSection>
  );
}

function History() {
  return (
    <TerminalSection title="History">
      <HistoryRow time="14:36" event="created" revision="r1" />

      <HistoryRow time="14:36" event="claimed" revision="r1" detail="run 01a01026…" />

      <HistoryRow
        time="14:36"
        event="progress"
        revision="r2"
        detail="Filesystem walker implemented"
      />

      <HistoryRow time="14:36" event="run_finished" revision="r2" detail="validation passed" />

      <HistoryRow time="14:37" event="completed" revision="r3" detail="task completed" />
    </TerminalSection>
  );
}

function HistoryRow({
  time,
  event,
  revision,
  detail,
}: {
  time: string;
  event: string;
  revision: string;
  detail?: string;
}) {
  return (
    <TreeRow>
      <div
        className="
          grid
          grid-cols-[42px_92px_76px_28px_minmax(0,1fr)]
          gap-3
        "
      >
        <span className="text-muted-foreground/45">{time}</span>

        <span
          className={
            event === "completed"
              ? "text-emerald-400"
              : event === "progress"
                ? "text-sky-400"
                : "text-violet-400"
          }
        >
          {event}
        </span>

        <span className="text-foreground/55">MCP Agent</span>

        <span className="text-violet-400">{revision}</span>

        <span className="truncate text-muted-foreground/40">{detail ?? "—"}</span>
      </div>
    </TreeRow>
  );
}

function TreeRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[20px_1fr]">
      <span className="select-none text-sky-400/70">│</span>

      <div className="min-w-0 text-foreground/75">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[104px_1fr]">
      <span className="text-muted-foreground/55">{label}</span>

      <span>{children}</span>
    </div>
  );
}

function TerminalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 font-semibold text-sky-400">{title}</div>

      {children}
    </div>
  );
}
