import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils.ts";

export type TerminalStep =
  | {
      type: "command";
      text: string;
      typingSpeed?: number;
      pause?: number;
      className?: string;
    }
  | {
      type: "output";
      content: ReactNode;
      pause?: number;
      className?: string;
    };

interface RenderedCommand {
  id: number;
  type: "command";
  text: string;
  className?: string;
}

interface RenderedOutput {
  id: number;
  type: "output";
  content: ReactNode;
  className?: string;
}

type RenderedStep = RenderedCommand | RenderedOutput;

interface TerminalProps {
  path?: string;
  script: TerminalStep[];
  className?: string;
  startDelay?: number;
  threshold?: number;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function Terminal({
  path = "~/work/northstar-api",
  script,
  className,
  startDelay = 350,
  threshold = 0.35,
}: TerminalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [started, setStarted] = useState(false);
  const [typingId, setTypingId] = useState<number | null>(null);
  const [rendered, setRendered] = useState<RenderedStep[]>([]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || started) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setStarted(true);
        observer.disconnect();
      },
      {
        threshold,
      },
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
    };
  }, [started, threshold]);

  useEffect(() => {
    if (!started) {
      return;
    }

    let cancelled = false;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const run = async () => {
      setRendered([]);

      if (!reducedMotion) {
        await sleep(startDelay);
      }

      let id = 0;

      for (const step of script) {
        if (cancelled) {
          return;
        }

        const currentId = id++;

        if (step.type === "command") {
          if (reducedMotion) {
            setRendered((current) => [
              ...current,
              {
                id: currentId,
                type: "command",
                text: step.text,
                className: step.className,
              },
            ]);

            continue;
          }

          setRendered((current) => [
            ...current,
            {
              id: currentId,
              type: "command",
              text: "",
              className: step.className,
            },
          ]);

          setTypingId(currentId);

          const speed = step.typingSpeed ?? 18;

          for (let index = 1; index <= step.text.length; index++) {
            await sleep(speed);

            if (cancelled) {
              return;
            }

            setRendered((current) =>
              current.map((item) => {
                if (item.id !== currentId || item.type !== "command") {
                  return item;
                }

                return {
                  ...item,
                  text: step.text.slice(0, index),
                };
              }),
            );
          }

          setTypingId(null);

          if (step.pause) {
            await sleep(step.pause);
          }

          continue;
        }

        setRendered((current) => [
          ...current,
          {
            id: currentId,
            type: "output",
            content: step.content,
            className: step.className,
          },
        ]);

        if (!reducedMotion && step.pause) {
          await sleep(step.pause);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [script, started, startDelay]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });

    return () => cancelAnimationFrame(frame);
  }, [rendered, typingId]);

  return (
    <div
      ref={rootRef}
      className={cn(
        `
          flex aspect-video
          min-w-0 flex-col
          overflow-hidden
          border-y border-border/60
          bg-background
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
        <span
          className="
            font-mono text-[9px]
            uppercase tracking-[0.14em]
            text-muted-foreground/40
          "
        >
          terminal
        </span>

        <span
          className="
            truncate
            font-mono text-[9px]
            text-muted-foreground/35
          "
        >
          {path}
        </span>
      </div>

      <div
        ref={viewportRef}
        className="
          min-h-0 flex-1
          overflow-y-auto
          overscroll-contain
          px-4 py-5
          font-mono
          text-[10px]
          leading-[1.7]

          sm:px-5
          sm:text-[11px]

          lg:text-xs

          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {rendered.map((item) => {
          if (item.type === "command") {
            return (
              <div key={item.id} className={cn("flex items-start gap-3", item.className)}>
                <span className="shrink-0 select-none text-emerald-500">❯</span>

                <span className="min-w-0 whitespace-pre-wrap break-words text-foreground/85">
                  {item.text}

                  {typingId === item.id && (
                    <span
                      className="
                        ml-0.5
                        inline-block
                        h-[1em] w-[0.5em]
                        translate-y-[0.15em]
                        animate-pulse
                        bg-foreground/70
                      "
                    />
                  )}
                </span>
              </div>
            );
          }

          return (
            <div key={item.id} className={item.className}>
              {item.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
