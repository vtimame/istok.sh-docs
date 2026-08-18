import { cn } from "@/lib/utils";

type DocsDiagramProps = {
  variant: "cli-and-mcp" | "agent-workflow" | "mcp-scope";
  className?: string;
};

export function DocsDiagram({ variant, className }: DocsDiagramProps) {
  return (
    <figure
      className={cn(
        `
          not-prose
          my-7
          overflow-hidden
          rounded-xl
          border border-border/50
        `,
        className,
      )}
      style={{
        background: "color-mix(in oklab, var(--muted) 10%, transparent)",
      }}
    >
      <div className="overflow-x-auto">
        {variant === "cli-and-mcp" && <CliAndMcpDiagram />}
        {variant === "agent-workflow" && <AgentWorkflowDiagram />}
        {variant === "mcp-scope" && <McpScopeDiagram />}
      </div>
    </figure>
  );
}

function CliAndMcpDiagram() {
  const cliItems = ["setup", "inspection", "troubleshooting", "automation", "direct control"];

  return (
    <svg
      viewBox="0 0 720 235"
      role="img"
      aria-label="Istok can be accessed directly through the CLI or by coding agents through MCP."
      className="block h-auto w-full min-w-[620px]"
    >
      {/* Istok → CLI */}
      <path
        d="M360 54 C360 72 235 70 235 94"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.22"
      />

      {/* Istok → MCP */}
      <path
        d="M360 54 C360 72 485 70 485 94"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.22"
      />

      {/* CLI trunk */}
      <path
        d="M235 98 V198"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      {/* CLI branches */}
      {cliItems.map((_, index) => {
        const y = 118 + index * 20;

        return (
          <path
            key={y}
            d={`M235 ${y} H260`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-foreground"
            opacity="0.2"
          />
        );
      })}

      {/* MCP → coding agents */}
      <path
        d="M485 98 V138 H525"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      {/* Istok */}
      <circle cx="360" cy="49" r="14" className="fill-primary" opacity="0.045" />

      <circle cx="360" cy="49" r="8" className="fill-primary" opacity="0.09" />

      <circle cx="360" cy="49" r="3" className="fill-primary" />

      <text x="360" y="27" textAnchor="middle" className="fill-foreground/80 font-mono text-[12px]">
        Istok
      </text>

      {/* CLI */}
      <circle cx="235" cy="96" r="2.8" className="fill-foreground/55" />

      <text x="235" y="82" textAnchor="middle" className="fill-foreground/70 font-mono text-[11px]">
        CLI
      </text>

      {/* MCP */}
      <circle cx="485" cy="96" r="2.8" className="fill-primary" />

      <text x="485" y="82" textAnchor="middle" className="fill-foreground/70 font-mono text-[11px]">
        MCP
      </text>

      {/* CLI items */}
      {cliItems.map((item, index) => {
        const y = 118 + index * 20;

        return (
          <g key={item}>
            <circle cx="260" cy={y} r="1.7" className="fill-muted-foreground" opacity="0.65" />

            <text x="272" y={y + 3.5} className="fill-muted-foreground font-mono text-[10px]">
              {item}
            </text>
          </g>
        );
      })}

      {/* Coding agents */}
      <circle cx="525" cy="138" r="2" className="fill-primary" opacity="0.9" />

      <text x="539" y="141.5" className="fill-foreground/65 font-mono text-[10px]">
        coding agents
      </text>
    </svg>
  );
}

function AgentWorkflowDiagram() {
  const nodes = [
    {
      x: 92,
      label: "You",
      primary: false,
    },
    {
      x: 270,
      label: "coding agent",
      primary: false,
    },
    {
      x: 450,
      label: "Istok MCP",
      primary: true,
    },
    {
      x: 628,
      label: "durable project state",
      primary: true,
    },
  ];

  return (
    <svg
      viewBox="0 0 720 105"
      role="img"
      aria-label="You work with a coding agent, which uses Istok MCP to persist durable project state."
      className="block h-auto w-full min-w-[620px]"
    >
      {/* Main line */}
      <path
        d="M92 44 H628"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      {/* Direction markers */}
      {nodes.slice(0, -1).map((node, index) => {
        const next = nodes[index + 1];
        const x = (node.x + next.x) / 2;

        return (
          <path
            key={x}
            d={`M${x - 4} 40 L${x} 44 L${x - 4} 48`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground"
            opacity="0.7"
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.label}>
          {node.primary && (
            <circle cx={node.x} cy="44" r="11" className="fill-primary" opacity="0.05" />
          )}

          <circle
            cx={node.x}
            cy="44"
            r={node.primary ? 3 : 2.7}
            className={node.primary ? "fill-primary" : "fill-foreground/55"}
          />

          <text
            x={node.x}
            y="72"
            textAnchor="middle"
            className="fill-foreground/70 font-mono text-[10px]"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function McpScopeDiagram() {
  return (
    <svg
      viewBox="0 0 720 165"
      role="img"
      aria-label="The repository root and actor identity determine the scope of an Istok MCP process."
      className="block h-auto w-full min-w-[620px]"
    >
      {/* repository → MCP */}
      <path
        d="M155 48 C250 48 270 82 350 82"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      {/* actor → MCP */}
      <path
        d="M155 118 C250 118 270 82 350 82"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      {/* MCP → project operations */}
      <path
        d="M356 82 H568"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-foreground"
        opacity="0.2"
      />

      <DiagramNode x={155} y={48} label="repository root" />

      <DiagramNode x={155} y={118} label="actor identity" />

      {/* MCP */}
      <circle cx="353" cy="82" r="14" className="fill-primary" opacity="0.045" />

      <circle cx="353" cy="82" r="8" className="fill-primary" opacity="0.09" />

      <circle cx="353" cy="82" r="3" className="fill-primary" />

      <text x="353" y="58" textAnchor="middle" className="fill-foreground/75 font-mono text-[11px]">
        istok mcp
      </text>

      <DiagramNode x={568} y={82} label="project operations" primary />
    </svg>
  );
}

function DiagramNode({
  x,
  y,
  label,
  primary = false,
}: {
  x: number;
  y: number;
  label: string;
  primary?: boolean;
}) {
  return (
    <g>
      {primary && <circle cx={x} cy={y} r="10" className="fill-primary" opacity="0.05" />}

      <circle
        cx={x}
        cy={y}
        r={primary ? 3 : 2.7}
        className={primary ? "fill-primary" : "fill-foreground/55"}
      />

      <text
        x={x}
        y={y + 24}
        textAnchor="middle"
        className="fill-foreground/70 font-mono text-[10px]"
      >
        {label}
      </text>
    </g>
  );
}
