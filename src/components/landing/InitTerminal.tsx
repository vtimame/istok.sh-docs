import { Terminal, type TerminalStep } from "@/components/ui/terminal.tsx";
import { cn } from "@/lib/utils";

const script: TerminalStep[] = [
  {
    type: "command",
    text: "istok init",
    typingSpeed: 35,
    pause: 350,
  },
  {
    type: "output",
    className: "mt-5",
    content: <InitOutput />,
  },
];

export function InitTerminal() {
  return <Terminal path="~/work/northstar-api" script={script} />;
}

function InitOutput() {
  return (
    <>
      <div className="text-foreground/75">Init</div>

      <div className="mt-4 space-y-0.5">
        <TerminalLine>
          Project{" "}
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />

            <span className="text-emerald-500">ACTIVE</span>
          </span>{" "}
          <span className="text-violet-400">revision 1</span>
        </TerminalLine>

        <TerminalLine>
          <TerminalField label="Name:" value="northstar-api" valueClassName="text-sky-400" />
        </TerminalLine>

        <TerminalLine>
          <TerminalField label="Root:" value="/home/dev/work/northstar/northstar-api" />
        </TerminalLine>

        <TerminalLine>
          <TerminalField
            label="ID:"
            value="01a0100d-6436-7968-9a5f-1bd2b5738613"
            valueClassName="text-orange-400"
          />
        </TerminalLine>
      </div>
    </>
  );
}

function TerminalLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[18px_1fr]">
      <span className="select-none text-muted-foreground/30">│</span>

      <div className="min-w-0 text-foreground/70">{children}</div>
    </div>
  );
}

function TerminalField({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr]">
      <span className="text-muted-foreground/45">{label}</span>

      <span className={cn("text-foreground/70", valueClassName)}>{value}</span>
    </div>
  );
}
