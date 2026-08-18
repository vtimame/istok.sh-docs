import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type TraceField = readonly [label: string, value: string];

interface TraceStep {
  tool: string;
  args?: TraceField[];
  result?: TraceField[];
}

interface Props {
  agent: string;
  steps: TraceStep[];
  className?: string;
  startDelay?: number;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function McpTrace({ agent, steps, className, startDelay = 350 }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);

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

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = async () => {
      if (reducedMotion) {
        setVisibleSteps(steps.length);
        return;
      }

      await sleep(startDelay);

      for (let index = 0; index < steps.length; index++) {
        if (cancelled) return;

        setVisibleSteps(index + 1);
        setActiveStep(index);

        await sleep(900);

        if (cancelled) return;

        setActiveStep(null);

        await sleep(280);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [started, steps, startDelay]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return;

    const frame = requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [visibleSteps]);

  return (
    <div
      ref={rootRef}
      className={cn(
        `
          flex aspect-video
          min-w-0 flex-col
          overflow-hidden
          border-y border-border/60
        `,
        className,
      )}
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

          <span className="font-mono text-[9px] text-foreground/60">{agent}</span>
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

          sm:px-5
          sm:text-[11px]

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <div className="space-y-6">
          {steps.slice(0, visibleSteps).map((step, index) => (
            <TraceStepView
              key={`${step.tool}-${index}`}
              step={step}
              active={activeStep === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TraceStepView({ step, active }: { step: TraceStep; active: boolean }) {
  return (
    <div className={cn("transition-opacity duration-300", active ? "opacity-100" : "opacity-70")}>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground/30">call</span>

        <span className="text-sky-400">istok.{step.tool}</span>

        {active && (
          <span className="ml-auto animate-pulse text-[8px] text-muted-foreground/30">running</span>
        )}
      </div>

      {step.args && step.args.length > 0 && (
        <div className="mt-2 border-l border-sky-400/30 pl-4">
          {step.args.map(([label, value]) => (
            <TraceFieldRow key={label} label={label} value={value} />
          ))}
        </div>
      )}

      {step.result && (
        <div className="mt-3">
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground/30">result</span>

            <span className="size-1.5 rounded-full bg-emerald-500" />
          </div>

          <div className="mt-2 border-l border-emerald-500/25 pl-4">
            {step.result.map(([label, value]) => (
              <TraceFieldRow key={label} label={label} value={value} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TraceFieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3">
      <span className="text-muted-foreground/40">{label}</span>

      <span className="min-w-0 truncate text-foreground/70">{value}</span>
    </div>
  );
}
