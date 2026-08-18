import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const retrieved = [
  {
    path: "src/features/auth/pages/SignInPage.tsx",
    lines: "1–84",
    score: 0.0846,
  },
  {
    path: "src/features/auth/components/SignInForm.tsx",
    lines: "1–62",
    score: 0.0464,
  },
  {
    path: "src/features/auth/hooks/useSession.ts",
    lines: "1–96",
    score: 0.0441,
  },
  {
    path: "src/lib/api/auth-client.ts",
    lines: "42–118",
    score: 0.0354,
  },
  {
    path: "src/features/auth/components/TwoFactorForm.tsx",
    lines: "1–78",
    score: 0.0351,
  },
  {
    path: "src/router/index.ts",
    lines: "1–64",
    score: 0.0312,
  },
  {
    path: "src/features/auth/guards/require-auth.ts",
    lines: "1–48",
    score: 0.0277,
  },
  {
    path: "src/features/profile/hooks/useCurrentUser.ts",
    lines: "1–72",
    score: 0.0245,
  },
  {
    path: "src/lib/api/token-storage.ts",
    lines: "1–58",
    score: 0.0223,
  },
  {
    path: "src/lib/api/refresh-token.ts",
    lines: "1–91",
    score: 0.022,
  },
];

export function ContextRetrievalSection() {
  return (
    <section className="border-t border-border/60 py-24 sm:py-28 lg:py-32 xl:py-36">
      <div className="app-container">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 xl:gap-24">
          <div className="max-w-xl">
            <h2 className="font-cormorant text-4xl font-normal italic leading-[0.98] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              Start with context,
              <br />
              not from zero.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              When an agent claims a task, Istok retrieves relevant project context and freezes it
              into the run snapshot.
            </p>
          </div>

          <ContextRetrievalTrace />
        </div>
      </div>
    </section>
  );
}

function ContextRetrievalTrace() {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [stage, setStage] = useState(0);
  const [visibleResults, setVisibleResults] = useState(0);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setStarted(true);
        observer.disconnect();
      },
      {
        threshold: 0.35,
      },
    );

    observer.observe(root);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;

    let cancelled = false;

    const timeoutIds: number[] = [];

    const schedule = (callback: () => void, delay: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) {
          callback();
        }
      }, delay);

      timeoutIds.push(id);
    };

    schedule(() => setStage(1), 300);
    schedule(() => setStage(2), 850);
    schedule(() => setStage(3), 1300);

    retrieved.forEach((_, index) => {
      schedule(() => setVisibleResults(index + 1), 1650 + index * 180);
    });

    return () => {
      cancelled = true;

      timeoutIds.forEach((id) => {
        window.clearTimeout(id);
      });
    };
  }, [started]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const frame = requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [stage, visibleResults]);

  return (
    <div
      ref={rootRef}
      className="
        flex aspect-video
        min-w-0 flex-col
        overflow-hidden
        border-y border-border/60
      "
    >
      <div
        className="
          flex shrink-0
          items-center justify-between
          border-b border-border/60
          px-4 py-3
          sm:px-5
        "
      >
        <div className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-emerald-500" />

          <span className="font-mono text-[9px] text-foreground/60">MCP Agent</span>
        </div>

        <span
          className="
            font-mono text-[9px]
            uppercase tracking-[0.14em]
            text-muted-foreground/35
          "
        >
          MCP / Istok
        </span>
      </div>

      <div
        ref={viewportRef}
        className="
          min-h-0 flex-1
          overflow-y-auto
          px-4 py-5
          font-mono
          text-[10px]
          leading-[1.7]
          sm:px-5 sm:text-[11px]

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {stage >= 1 && (
          <TraceBlock>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground/30">call</span>

              <span className="text-sky-400">istok.task_claim</span>
            </div>

            <div className="mt-2 border-l border-sky-400/30 pl-4">
              <TraceField label="task_id" value="01a01033-ae32-7663…" />

              <TraceField label="run_id" value="01a01033-ae32-7821…" />

              <TraceField label="snapshot_id" value="01a01033-ae32-7ec8…" />

              <TraceField label="context_limit" value="10" />
            </div>
          </TraceBlock>
        )}

        {stage >= 2 && (
          <TraceBlock className="mt-6">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground/30">result</span>

              <span className="size-1.5 rounded-full bg-emerald-500" />

              <span className="text-foreground/65">run active</span>
            </div>

            <div className="mt-2 border-l border-emerald-500/25 pl-4">
              <TraceField label="snapshot" value="01a01033-ae32-7ec8…" />

              <TraceField label="retrieval" value="enabled" valueClassName="text-emerald-400" />

              <TraceField label="records" value="0" />

              <TraceField label="retrieved" value="10" valueClassName="text-violet-400" />
            </div>
          </TraceBlock>
        )}

        {stage >= 3 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sky-400">Context snapshot</span>

              <span className="text-muted-foreground/30">istok.retrieval.v1</span>
            </div>

            <div className="space-y-0.5">
              {retrieved.slice(0, visibleResults).map((item, index) => (
                <RetrievedRow key={`${item.path}:${item.lines}`} index={index + 1} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TraceBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("animate-in fade-in slide-in-from-bottom-1 duration-300", className)}>
      {children}
    </div>
  );
}

function TraceField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-3">
      <span className="text-muted-foreground/40">{label}</span>

      <span className={cn("truncate text-foreground/70", valueClassName)}>{value}</span>
    </div>
  );
}

function RetrievedRow({
  index,
  path,
  lines,
  score,
}: {
  index: number;
  path: string;
  lines: string;
  score: number;
}) {
  return (
    <div
      className="
        grid
        grid-cols-[22px_minmax(0,1fr)_52px]
        items-center
        gap-3
        py-1.5
        animate-in
        fade-in
        slide-in-from-bottom-1
        duration-300
      "
    >
      <span className="text-muted-foreground/25">{String(index).padStart(2, "0")}</span>

      <div className="min-w-0">
        <div className="truncate text-foreground/65">{path}</div>

        <div className="text-[9px] text-muted-foreground/35">{lines}</div>
      </div>

      <span className="text-right text-[9px] text-muted-foreground/35">{score.toFixed(4)}</span>
    </div>
  );
}
