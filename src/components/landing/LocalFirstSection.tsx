interface Agent {
  name: string;
  color: string;
  y: number;
  path: string;
  duration: string;
  begin: string;
}

const agents: Agent[] = [
  {
    name: "Claude Code",
    color: "#D97757",
    y: 100,
    path: "M 145 100 C 250 100, 260 155, 340 185 C 390 204, 420 216, 475 220",
    duration: "8s",
    begin: "0s",
  },
  {
    name: "Codex",
    color: "#71717a",
    y: 180,
    path: "M 145 180 C 245 180, 280 150, 345 180 C 395 203, 425 215, 475 220",
    duration: "8.8s",
    begin: "-2s",
  },
  {
    name: "Gemini CLI",
    color: "#4285F4",
    y: 260,
    path: "M 145 260 C 245 260, 280 290, 345 260 C 395 237, 425 225, 475 220",
    duration: "9.4s",
    begin: "-4s",
  },
  {
    name: "Cursor",
    color: "#94a3b8",
    y: 340,
    path: "M 145 340 C 250 340, 260 285, 340 255 C 390 236, 420 224, 475 220",
    duration: "10s",
    begin: "-6s",
  },
];

const facts = [
  { label: "storage", value: "local" },
  { label: "transport", value: "MCP" },
  { label: "scope", value: "per project" },
  { label: "agents", value: "MCP compatible" },
];

const projectState = [
  { label: "tasks", x: 550 },
  { label: "runs", x: 610 },
  { label: "context", x: 670 },
  { label: "index", x: 742 },
];

export function LocalFirstSection() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-24 lg:py-28 xl:py-32">
      <div className="app-container">
        <div
          className="
            grid gap-14
            lg:grid-cols-[1.25fr_0.75fr]
            lg:items-center
            lg:gap-16
            xl:grid-cols-[1.35fr_0.65fr]
            xl:gap-20
          "
        >
          <ThreadVisual />

          <div className="max-w-xl lg:justify-self-end">
            <h2
              className="
                font-cormorant
                text-4xl font-normal italic
                leading-[0.98]
                tracking-[-0.03em]
                sm:text-5xl
                lg:text-6xl
              "
            >
              Built around
              <br />
              your project.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              Agents come and go. The project keeps its tasks, runs and context as one continuous
              thread of work.
            </p>

            <div className="mt-9 grid max-w-md grid-cols-2 gap-x-8 gap-y-5">
              {facts.map((fact) => (
                <Fact key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreadEndMark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="20" fill="rgb(16 185 129)" opacity="0.035" />
      <circle r="14" fill="rgb(16 185 129)" opacity="0.06" />
      <circle r="9" fill="rgb(16 185 129)" opacity="0.11" />
      <circle r="5" fill="rgb(16 185 129)" opacity="0.22" />
      <circle r="2.8" fill="rgb(16 185 129)" />
    </g>
  );
}

function ThreadVisual() {
  return (
    <div
      className="
        relative mx-auto
        aspect-[16/10]
        w-full
        max-w-[900px]
      "
    >
      <svg
        viewBox="0 0 820 440"
        fill="none"
        className="absolute inset-0 size-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="project-thread"
            x1="475"
            y1="220"
            x2="790"
            y2="220"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="rgb(16 185 129)" stopOpacity="0.4" />

            <stop offset="0.4" stopColor="rgb(16 185 129)" stopOpacity="0.75" />

            <stop offset="1" stopColor="rgb(16 185 129)" stopOpacity="0.25" />
          </linearGradient>

          <filter id="thread-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.35" />
          </filter>
        </defs>

        {/* Agent labels */}
        {agents.map((agent) => (
          <g key={`label-${agent.name}`}>
            <circle cx="120" cy={agent.y} r="4" fill={agent.color} />

            <text
              x="108"
              y={agent.y + 3}
              textAnchor="end"
              className="fill-foreground/45 font-mono text-[9px]"
            >
              {agent.name}
            </text>
          </g>
        ))}

        {/* Individual threads */}
        {agents.map((agent) => (
          <g key={`thread-${agent.name}`}>
            <path
              d={agent.path}
              stroke={agent.color}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.18"
            />

            <circle r="2.8" fill={agent.color}>
              <animateMotion
                path={agent.path}
                dur={agent.duration}
                begin={agent.begin}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}

        {/* Small crossing fibres */}
        <path
          d="M 275 148 C 305 170, 330 198, 365 208"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="0.7"
          opacity="0.05"
        />

        <path
          d="M 275 292 C 305 270, 330 242, 365 232"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="0.7"
          opacity="0.05"
        />

        <path
          d="M 325 172 C 355 194, 385 212, 420 216"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="0.7"
          opacity="0.045"
        />

        <path
          d="M 325 268 C 355 246, 385 228, 420 224"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="0.7"
          opacity="0.045"
        />

        {/* Convergence */}
        <circle cx="475" cy="220" r="3.5" fill="rgb(16 185 129)" />

        <circle cx="475" cy="220" r="3.5" fill="none" stroke="rgb(16 185 129)" opacity="0">
          <animate attributeName="r" values="4;24" dur="4s" repeatCount="indefinite" />

          <animate attributeName="opacity" values="0;0.15;0" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Persistent project thread */}
        <path
          d="M 475 220 C 555 220, 655 220, 790 220"
          stroke="url(#project-thread)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Very subtle parallel fibres */}
        <path
          d="M 475 216 C 555 216, 655 216, 790 216"
          stroke="currentColor"
          className="text-emerald-500"
          strokeWidth="0.6"
          opacity="0.055"
        />

        <path
          d="M 475 224 C 555 224, 655 224, 790 224"
          stroke="currentColor"
          className="text-emerald-500"
          strokeWidth="0.6"
          opacity="0.055"
        />

        {/* Packet moving through persistent thread */}
        <circle r="2.8" fill="rgb(16 185 129)">
          <animateMotion
            path="M 475 220 C 555 220, 655 220, 790 220"
            dur="6s"
            repeatCount="indefinite"
          />

          <animate
            attributeName="opacity"
            values="0;1;1;0"
            keyTimes="0;0.08;0.9;1"
            dur="6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Project state nodes */}
        {projectState.map((item, index) => (
          <g key={item.label}>
            <line
              x1={item.x}
              y1="220"
              x2={item.x}
              y2={index % 2 === 0 ? 194 : 246}
              stroke="currentColor"
              className="text-foreground"
              strokeWidth="0.7"
              opacity="0.08"
            />

            <circle cx={item.x} cy="220" r="2" fill="rgb(16 185 129)" opacity="0.8" />

            <text
              x={item.x}
              y={index % 2 === 0 ? 184 : 262}
              textAnchor="middle"
              className="fill-foreground/35 font-mono text-[8px]"
            >
              {item.label}
            </text>
          </g>
        ))}

        {/* End node */}
        <ThreadEndMark x={790} y={220} />
      </svg>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="font-mono">
      <div
        className="
          text-[8px]
          uppercase
          tracking-[0.12em]
          text-muted-foreground/35
        "
      >
        {label}
      </div>

      <div className="mt-1.5 text-[10px] text-foreground/60">{value}</div>
    </div>
  );
}
