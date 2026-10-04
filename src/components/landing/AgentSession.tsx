import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import { cn } from "@/lib/utils";

// Recorded sessions from tools/demosession in istok-cli: task numbers, context
// and command output are what the real Istok returned.

type Tone = "muted" | "success" | "added";

interface SessionLine {
  text: string;
  tone?: Tone;
}

interface SessionStep {
  kind: "istok" | "tool" | "message";
  name?: string;
  summary?: string;
  output?: SessionLine[];
  text?: string;
}

interface SessionPart {
  agent: string;
  cwd: string;
  prompt: string;
  steps: SessionStep[];
}

export interface Session {
  parts: SessionPart[];
}

interface AgentSessionProps {
  session: Session;
  replayLabel: string;
}

// One row of the terminal; the animation reveals rows in order.
type Row =
  | { kind: "shell"; cwd: string; agent: string }
  | { kind: "prompt"; text: string }
  | { kind: "head"; step: SessionStep; wait: number }
  | { kind: "output"; line: SessionLine; first: boolean }
  | { kind: "message"; text: string }
  | { kind: "gap" };

const typingDelay = 30;

function buildRows(parts: SessionPart[]): Row[] {
  const rows: Row[] = [];

  parts.forEach((part, index) => {
    if (index > 0) {
      rows.push({ kind: "gap" }, { kind: "gap" });
    }

    rows.push({ kind: "shell", cwd: part.cwd, agent: part.agent });
    rows.push({ kind: "prompt", text: part.prompt });

    for (const step of part.steps) {
      rows.push({ kind: "gap" });

      if (step.kind === "message") {
        rows.push({ kind: "message", text: step.text ?? "" });
        continue;
      }

      // Running the tests takes noticeably longer than a bookkeeping call.
      const wait = step.name === "run_validate" ? 1600 : step.kind === "istok" ? 650 : 450;
      rows.push({ kind: "head", step, wait });

      const output = step.output ?? [];
      output.forEach((line, lineIndex) => rows.push({ kind: "output", line, first: lineIndex === 0 }));
    }
  });

  return rows;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
}

export function AgentSession({ session, replayLabel }: AgentSessionProps) {
  const rows = useMemo(() => buildRows(session.parts), [session.parts]);
  const title = session.parts[0]?.cwd ?? "~";

  const rootRef = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState<{ row: number; chars: number } | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    let cancelled = false;

    const play = async () => {
      setShown(0);
      setTyping(null);
      setPending(null);
      setFinished(false);

      // Without motion the finished session is shown right away.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShown(rows.length);
        setFinished(true);
        return;
      }

      await sleep(400);

      for (let index = 0; index < rows.length; index++) {
        if (cancelled) return;
        const row = rows[index];

        setShown(index + 1);

        if (row.kind === "prompt") {
          for (let chars = 1; chars <= row.text.length; chars++) {
            if (cancelled) return;
            setTyping({ row: index, chars });
            await sleep(typingDelay);
          }
          setTyping(null);
          await sleep(400);
        } else if (row.kind === "shell") {
          await sleep(350);
        } else if (row.kind === "head") {
          setPending(index);
          await sleep(row.wait);
          setPending(null);
        } else if (row.kind === "output") {
          await sleep(70);
        } else if (row.kind === "message") {
          await sleep(500);
        }
      }

      if (!cancelled) setFinished(true);
    };

    // Start when the terminal scrolls into view, not on page load.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        void play();
      },
      { threshold: 0.4 },
    );
    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [rows, run]);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-2xl shadow-black/10 dark:shadow-black/40"
    >
      <div className="relative flex h-8 items-center border-b border-border/70 px-3 sm:h-9">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[11px] text-muted-foreground sm:block">
          {title}
        </div>

        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className={cn(
            "absolute top-1 right-2 flex h-6 items-center gap-1.5 rounded-md px-2 font-sans text-xs text-muted-foreground transition-opacity hover:bg-accent hover:text-foreground sm:top-1.5",
            finished ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <RotateCcw className="size-3" />
          {replayLabel}
        </button>
      </div>

      {/* Every row is rendered from the start so the terminal never changes height. */}
      <div className="px-4 py-4 font-mono text-[11px] leading-[1.65] sm:px-5 sm:text-[12.5px]">
        {rows.map((row, index) => (
          <div
            key={index}
            className={cn("transition-opacity duration-200", index < shown ? "opacity-100" : "opacity-0")}
            aria-hidden={index >= shown}
          >
            <RowView
              row={row}
              pending={pending === index}
              typedChars={typing?.row === index ? typing.chars : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface RowViewProps {
  row: Row;
  pending: boolean;
  typedChars?: number;
}

function RowView({ row, pending, typedChars }: RowViewProps) {
  switch (row.kind) {
    case "gap":
      return <div className="h-2.5" />;

    case "shell":
      return (
        <div>
          <span className="text-(--term-green)">{row.cwd}</span> $ {row.agent}
        </div>
      );

    case "prompt": {
      const typingNow = typedChars !== undefined;

      return (
        <div className="mt-2 rounded-md border border-border px-3 py-1.5 font-sans text-[12.5px] sm:text-[13.5px]">
          <span className="font-mono text-muted-foreground">&gt; </span>
          <span>{typingNow ? row.text.slice(0, typedChars) : row.text}</span>
          {typingNow && (
            <span className="ml-px inline-block h-[1.1em] w-[0.5em] translate-y-[0.2em] animate-pulse bg-foreground/60" />
          )}
        </div>
      );
    }

    case "message":
      return (
        <div className="flex gap-2 font-sans text-[12.5px] leading-relaxed sm:text-[13.5px]">
          <span>●</span>
          <span>{row.text}</span>
        </div>
      );

    case "head":
      return (
        <div className="flex gap-2">
          <span className={pending ? "animate-pulse text-muted-foreground" : "text-(--term-green)"}>●</span>
          <span className="min-w-0 truncate">
            {row.step.kind === "istok" && (
              <>
                <span className="text-(--term-cyan)">istok</span>
                <span className="text-muted-foreground"> · </span>
              </>
            )}
            <span className="font-semibold">{row.step.name}</span>
            {row.step.summary && <span className="text-muted-foreground"> ({row.step.summary})</span>}
          </span>
        </div>
      );

    case "output":
      return (
        <div className="flex gap-2 pl-[1.1em]">
          <span className="w-[1ch] shrink-0 text-muted-foreground/60">{row.first ? "⎿" : ""}</span>
          <span
            className={cn(
              "min-w-0 truncate whitespace-pre",
              row.line.tone === "muted" && "text-muted-foreground",
              row.line.tone === "success" && "text-(--term-green)",
              row.line.tone === "added" && "rounded-sm bg-(--term-green)/10 px-1 text-(--term-green)",
            )}
          >
            {row.line.text}
          </span>
        </div>
      );
  }
}
