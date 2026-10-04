import { useEffect, useRef, useState, type CSSProperties } from "react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { CheckIcon, CopyIcon } from "lucide-react";

const installCommand = "curl -fsSL https://get.istok.sh | sh";

interface HeroTextProps {
  title: string[];
  highlight: string;
  subtitle: string;
  copyLabel: string;
  copiedLabel: string;
  docsLabel: string;
  docsHref: string;
}

export function HeroText({ title, highlight, subtitle, copyLabel, copiedLabel, docsLabel, docsHref }: HeroTextProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installCommand);

      setCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy install command:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1
        className={`
          font-heading
          text-5xl font-bold leading-[1.02] tracking-[-0.035em]
          hero-rise
          sm:text-6xl
        `}
        style={{ "--rise-delay": "100ms" } as CSSProperties}
      >
        {title.map((line, index) => {
          const [before, after] = line.includes(highlight) ? line.split(highlight) : [line, null];

          return (
            <span key={line} className="block">
              {before}
              {after !== null && <span className="text-agents">{highlight}</span>}
              {after}
              {index < title.length - 1 && " "}
            </span>
          );
        })}
      </h1>

      <div
        className={`
          hero-rise
          max-w-md text-muted-foreground
        `}
        style={{ "--rise-delay": "500ms" } as CSSProperties}
      >
        {subtitle}
      </div>

      <div
        className={`
          hero-rise
          flex flex-wrap items-center gap-3
        `}
        style={{ "--rise-delay": "800ms" } as CSSProperties}
      >
        <div className="relative flex h-9 flex-1 items-center rounded-lg bg-emerald-500/10 px-4 pr-12 text-sm font-semibold text-emerald-500">
          <span className="select-none">$&nbsp;</span>
          <span className="select-all">{installCommand}</span>

          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? copiedLabel : copyLabel}
            title={copied ? copiedLabel : copyLabel}
            className="absolute right-0 top-0 flex size-9 cursor-pointer items-center justify-center rounded-lg transition hover:bg-emerald-600/10"
          >
            {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </button>
        </div>

        <a
          href={docsHref}
          className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}
        >
          {docsLabel}
        </a>
      </div>
    </div>
  );
}
