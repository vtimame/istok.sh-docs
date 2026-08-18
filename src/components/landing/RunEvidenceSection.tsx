import { Terminal, type TerminalStep } from "@/components/ui/terminal";

const script: TerminalStep[] = [
  {
    type: "command",
    text: "istok run show 01a01026-8d83-7e31-8bae-e910fff42489",
    typingSpeed: 12,
    pause: 300,
  },

  {
    type: "output",
    className: "mt-5",
    content: <RunHeader />,
    pause: 450,
  },

  {
    type: "output",
    className: "mt-5",
    content: <RunSummary />,
    pause: 400,
  },

  {
    type: "output",
    className: "mt-5",
    content: <ContextSnapshot />,
    pause: 450,
  },

  {
    type: "output",
    className: "mt-5 pb-2",
    content: <Evidence />,
  },
];

export function RunEvidenceSection() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div
          className="
            grid gap-16
            lg:grid-cols-[1.2fr_0.8fr]
            lg:items-center
            lg:gap-20
            xl:gap-24
          "
        >
          <RunEvidenceTerminal />

          <div className="max-w-xl lg:justify-self-end">
            <h2
              className="
                font-cormorant
                text-4xl
                font-normal
                italic
                leading-[0.98]
                tracking-[-0.03em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Done means
              <br />
              proven.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Runs keep the context and execution evidence behind the result. Agents can validate
              their work before a task is completed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RunEvidenceTerminal() {
  return <Terminal path="~/work/northstar-api" script={script} />;
}

function RunHeader() {
  return (
    <>
      <div className="font-semibold text-foreground/85">Run</div>

      <div className="mt-4">
        <TreeRow>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <StatusSucceeded />

            <span className="text-muted-foreground/35">·</span>

            <span className="text-violet-400">revision 2</span>

            <span className="text-muted-foreground/45">2026-08-17T14:36:08Z</span>
          </div>
        </TreeRow>

        <TreeRow>
          <Field label="ID:">
            <span className="text-orange-400">01a01026-8d83-7e31-8bae-e910fff42489</span>
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Task:">
            <span className="text-orange-400">01a01026-8d83-7405-9de2-29725c930f00</span>
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Snapshot:">
            <span className="text-orange-400">01a01026-8d83-7e6d-9368-830b14ab2ba0</span>
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Lease:">
            <span className="text-orange-400">01a01026-bb75-72bb-a572-b5ec59270458</span>
          </Field>
        </TreeRow>
      </div>
    </>
  );
}

function RunSummary() {
  return (
    <div>
      <TreeRow>
        <span className="text-foreground/70">Repository indexing completed successfully.</span>
      </TreeRow>

      <TreeRow>
        <Field label="Task number:">
          <span className="text-amber-400">#2</span>
        </Field>
      </TreeRow>
    </div>
  );
}

function ContextSnapshot() {
  return (
    <TerminalSection title="Context snapshot">
      <TreeRow>
        <Field label="Version:">
          <span className="text-violet-400">3</span>
        </Field>
      </TreeRow>

      <TreeRow>
        <Field label="Records:">
          <span className="text-foreground/70">8</span>
        </Field>
      </TreeRow>

      <TreeRow>
        <Field label="Retrieved:">
          <span className="text-foreground/70">5</span>
        </Field>
      </TreeRow>
    </TerminalSection>
  );
}

function Evidence() {
  return (
    <TerminalSection title="Evidence">
      <TreeRow>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-foreground/70">1 executions</span>

          <span className="text-muted-foreground/30">·</span>

          <span className="text-foreground/70">1 validations</span>

          <span className="text-muted-foreground/30">·</span>

          <span className="text-foreground/70">2 artifacts</span>
        </div>
      </TreeRow>

      <div className="mt-2">
        <TreeRow>
          <Artifact type="stdout" id="01a01027-4a36-7c06-82d5-d7e741831568" size="3.4 KB" />
        </TreeRow>

        <TreeRow>
          <Artifact type="stderr" id="01a01027-4a36-7c07-86c9-2051a80517f8" size="0 B" />
        </TreeRow>
      </div>
    </TerminalSection>
  );
}

function Artifact({ type, id, size }: { type: string; id: string; size: string }) {
  return (
    <div
      className="
        grid
        grid-cols-[52px_minmax(0,1fr)_48px]
        gap-3
      "
    >
      <span className="text-sky-400">{type}</span>

      <span className="truncate text-orange-400">{id}</span>

      <span className="text-right text-muted-foreground/45">{size}</span>
    </div>
  );
}

function StatusSucceeded() {
  return (
    <span className="inline-flex items-center gap-2 text-emerald-400">
      <span>✓</span>

      <span>SUCCEEDED</span>
    </span>
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

      <span className="min-w-0 truncate">{children}</span>
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
