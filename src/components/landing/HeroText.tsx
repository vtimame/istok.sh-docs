import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { CheckIcon, CopyIcon } from "lucide-react";

const installCommand = "curl -fsSL https://get.istok.sh | sh";

interface HeroTextProps {
  title: string[];
  subtitle: string;
  copyLabel: string;
  copiedLabel: string;
  docsLabel: string;
  docsHref: string;
}

export function HeroText({ title, subtitle, copyLabel, copiedLabel, docsLabel, docsHref }: HeroTextProps) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);

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
          font-cormorant
          text-5xl font-normal italic leading-[0.95] tracking-[-0.035em]
          transition-[opacity,transform] duration-700 ease-out
          sm:text-7xl
          ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}
        `}
        style={{ transitionDelay: "100ms" }}
      >
        {title.map((line, index) => (
          <span key={line} className="block">
            {line}
            {index < title.length - 1 && " "}
          </span>
        ))}
      </h1>

      <div
        className={`
          max-w-md text-muted-foreground
          transition-[opacity,transform] duration-700 ease-out
          ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
        `}
        style={{ transitionDelay: "650ms" }}
      >
        {subtitle}
      </div>

      <div
        className={`
          flex flex-wrap items-center gap-3
          transition-[opacity,transform] duration-700 ease-out
          ${visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}
        `}
        style={{ transitionDelay: "950ms" }}
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
