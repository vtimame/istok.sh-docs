import { Terminal, type TerminalStep } from "@/components/ui/terminal";

const script: TerminalStep[] = [
  {
    type: "command",
    text:
      'istok task create --title="Repository indexing" ' +
      '--description="Index project files for search" ' +
      '--acceptance-criteria="Search returns matching files and symbols"',
    typingSpeed: 8,
    pause: 300,
  },

  {
    type: "output",
    className: "mt-1",
    content: <ProjectReference id="1" />,
    pause: 120,
  },

  {
    type: "output",
    className: "mt-5",
    content: <CreatedOutput />,
    pause: 1100,
  },

  {
    type: "command",
    text: "istok task show 1",
    typingSpeed: 28,
    pause: 250,
    className: "mt-7",
  },

  {
    type: "output",
    className: "mt-1",
    content: <ProjectReference id="1" />,
    pause: 150,
  },

  {
    type: "output",
    className: "mt-5",
    content: <TaskHeader />,
    pause: 250,
  },

  {
    type: "output",
    className: "mt-5",
    content: (
      <TerminalSection title="Description">
        <TreeRow>Index project files for search</TreeRow>
      </TerminalSection>
    ),
    pause: 350,
  },

  {
    type: "output",
    className: "mt-5",
    content: (
      <TerminalSection title="Acceptance criteria">
        <TreeRow>Search returns matching files and symbols</TreeRow>
      </TerminalSection>
    ),
    pause: 350,
  },

  {
    type: "output",
    className: "mt-5",
    content: <Relations />,
    pause: 350,
  },

  {
    type: "output",
    className: "mt-5",
    content: <History />,
  },
];

export function TaskTerminal() {
  return <Terminal path="~/work/northstar-api" script={script} />;
}

function CreatedOutput() {
  return (
    <>
      <div className="font-semibold text-foreground/85">Repository indexing</div>

      <div className="mt-4">
        <TreeRow>
          <Field label="Action:">
            <span className="text-violet-400">Created</span>
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="State:">
            <StatusReady />
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Revision:">
            <span className="text-violet-400">r1</span>
          </Field>
        </TreeRow>
      </div>
    </>
  );
}

function TaskHeader() {
  return (
    <>
      <div className="font-semibold text-foreground/85">Repository indexing</div>

      <div className="mt-4">
        <TreeRow>
          <Field label="State:">
            <StatusReady />
          </Field>
        </TreeRow>

        <TreeRow>
          <Field label="Revision:">
            <span className="text-violet-400">r1</span>
          </Field>
        </TreeRow>
      </div>
    </>
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
      <TreeRow>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-muted-foreground/55">2026-08-17 14:13Z</span>

          <span className="text-violet-400">created</span>

          <span className="text-foreground/65">CLI</span>

          <span className="text-violet-400">r1</span>
        </div>
      </TreeRow>
    </TerminalSection>
  );
}

function ProjectReference({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sky-400">northstar-api</span>

      <span className="text-muted-foreground/35">·</span>

      <span className="text-amber-400">#{id}</span>
    </div>
  );
}

function StatusReady() {
  return (
    <span className="inline-flex items-center gap-2 text-emerald-400">
      <span className="size-1.5 rotate-45 bg-current" />
      READY
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
