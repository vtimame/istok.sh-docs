interface HandoffFact {
  label: string;
  value: string;
}

const facts: HandoffFact[] = [
  {
    label: "task",
    value: "stays open",
  },
  {
    label: "old run",
    value: "abandoned",
  },
  {
    label: "new run",
    value: "fresh",
  },
  {
    label: "context",
    value: "retrieved again",
  },
];

const leftMainPath = "M 170 250 C 250 250, 320 238, 392 232 C 418 230, 435 232, 448 242";

const rightMainPath = "M 452 258 C 468 268, 488 270, 516 264 C 590 248, 655 244, 730 248";

const leftFiberTop = "M 170 242 C 248 242, 318 230, 390 224 C 418 222, 436 224, 448 234";

const leftFiberBottom = "M 170 258 C 250 258, 320 247, 392 240 C 418 238, 435 240, 446 248";

const rightFiberTop = "M 454 250 C 470 260, 490 261, 516 256 C 590 242, 656 237, 730 240";

const rightFiberBottom = "M 450 266 C 468 277, 490 279, 518 273 C 592 257, 658 252, 730 256";

export function AgentHandoffSection() {
  return (
    <section className="border-t border-border/60 py-20 sm:py-24 lg:py-28 xl:py-32">
      <div className="app-container">
        <div
          className="
            grid gap-12

            lg:grid-cols-[0.62fr_1.38fr]
            lg:items-center
            lg:gap-12

            xl:grid-cols-[0.58fr_1.42fr]
            xl:gap-14
          "
        >
          <div className="max-w-xl">
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
              Switch agents.
              <br />
              Keep the work.
            </h2>

            <p className="mt-7 max-w-md leading-relaxed text-muted-foreground">
              One agent can stop, another can continue, but the task remains the same. Istok keeps
              the work as one continuous thread across runs.
            </p>

            <div className="mt-9 grid max-w-md grid-cols-2 gap-x-8 gap-y-5">
              {facts.map((fact) => (
                <Fact key={fact.label} label={fact.label} value={fact.value} />
              ))}
            </div>
          </div>

          <ThreadTransferVisual />
        </div>
      </div>
    </section>
  );
}

function ThreadTransferVisual() {
  return (
    <div
      className="
        relative
        mx-auto
        aspect-[16/8]
        w-full
        max-w-[1100px]
        overflow-hidden

        lg:-mr-6
        xl:-mr-12
        2xl:-mr-16
      "
    >
      <svg
        viewBox="0 0 900 500"
        fill="none"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="thread-left"
            x1="170"
            y1="250"
            x2="450"
            y2="250"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#D97757" stopOpacity="0.34" />
            <stop offset="1" stopColor="#D97757" stopOpacity="0.14" />
          </linearGradient>

          <linearGradient
            id="thread-right"
            x1="450"
            y1="250"
            x2="730"
            y2="250"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="rgb(16 185 129)" stopOpacity="0.38" />
            <stop offset="0.55" stopColor="rgb(16 185 129)" stopOpacity="0.22" />
            <stop offset="1" stopColor="#4285F4" stopOpacity="0.18" />
          </linearGradient>

          <radialGradient id="thread-core-glow">
            <stop offset="0" stopColor="rgb(16 185 129)" stopOpacity="0.12" />
            <stop offset="50%" stopColor="rgb(16 185 129)" stopOpacity="0.04" />
            <stop offset="100%" stopColor="rgb(16 185 129)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* subtle baseline */}
        <path
          d="M 80 250 H 820"
          stroke="currentColor"
          className="text-foreground"
          strokeWidth="1"
          strokeDasharray="2 10"
          opacity="0.03"
        />

        {/* agent nodes */}
        <circle cx="150" cy="250" r="12" stroke="#D97757" strokeWidth="1" opacity="0.24" />
        <circle cx="150" cy="250" r="4" fill="#D97757" opacity="0.9" />

        <circle cx="750" cy="250" r="12" stroke="#4285F4" strokeWidth="1" opacity="0.28" />
        <circle cx="750" cy="250" r="4" fill="#4285F4" opacity="0.92" />

        {/* thread glow */}
        <ellipse cx="450" cy="250" rx="76" ry="48" fill="url(#thread-core-glow)" />

        {/* main thread */}
        <path d={leftMainPath} stroke="url(#thread-left)" strokeWidth="2" strokeLinecap="round" />
        <path d={rightMainPath} stroke="url(#thread-right)" strokeWidth="2" strokeLinecap="round" />

        {/* support fibers */}
        <path
          d={leftFiberTop}
          stroke="#D97757"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.18"
        />
        <path
          d={leftFiberBottom}
          stroke="#D97757"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.14"
        />

        <path
          d={rightFiberTop}
          stroke="rgb(16 185 129)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.16"
        />
        <path
          d={rightFiberBottom}
          stroke="#4285F4"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.12"
        />

        {/* center task core */}
        <circle cx="450" cy="250" r="4.5" fill="currentColor" className="text-emerald-500" />

        <circle
          cx="450"
          cy="250"
          r="16"
          stroke="currentColor"
          className="text-emerald-500"
          opacity="0"
        >
          <animate attributeName="r" values="16;50" dur="4.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.09;0" dur="4.8s" repeatCount="indefinite" />
        </circle>

        {/* left packet */}
        <circle r="2.9" fill="#D97757" opacity="0">
          <animateMotion path={leftMainPath} dur="6.6s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;0.7;0.45;0"
            keyTimes="0;0.16;0.82;1"
            dur="6.6s"
            repeatCount="indefinite"
          />
        </circle>

        {/* center pulse */}
        <circle cx="450" cy="250" r="2.8" fill="rgb(16 185 129)" opacity="0">
          <animate
            attributeName="opacity"
            values="0;0.95;0"
            dur="1.2s"
            begin="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="2.8;4.4;2.8"
            dur="1.2s"
            begin="1.8s"
            repeatCount="indefinite"
          />
        </circle>

        {/* right packet */}
        <circle r="2.9" fill="rgb(16 185 129)" opacity="0">
          <animateMotion path={rightMainPath} dur="6.6s" begin="0.85s" repeatCount="indefinite" />
          <animate
            attributeName="opacity"
            values="0;0.95;0.78;0"
            keyTimes="0;0.14;0.84;1"
            dur="6.6s"
            begin="0.85s"
            repeatCount="indefinite"
          />
        </circle>

        {/* tiny state ticks */}
        {[
          { x: 308, y: 239 },
          { x: 386, y: 232 },
          { x: 562, y: 264 },
          { x: 640, y: 253 },
        ].map((tick, index) => (
          <line
            key={index}
            x1={tick.x}
            y1={tick.y - 5}
            x2={tick.x}
            y2={tick.y + 5}
            stroke="currentColor"
            className="text-foreground"
            strokeWidth="0.8"
            opacity="0.06"
          />
        ))}
      </svg>

      {/* left label */}
      <div
        className="
          absolute
          left-[2%] top-1/2
          -translate-y-1/2
          text-right

          sm:left-[3%]
        "
      >
        <div className="flex items-center justify-end gap-2.5">
          <span className="font-mono text-[10px] text-foreground/50 sm:text-[11px] lg:text-xs">
            agent A
          </span>

          <span className="size-2 rounded-full bg-[#D97757]" />
        </div>

        <div className="mt-4 space-y-2 font-mono text-[9px]">
          <div className="text-muted-foreground/40">run A</div>
          <div className="text-muted-foreground/28">snapshot A</div>
          <div className="text-amber-500/55">abandoned</div>
        </div>
      </div>

      {/* center task */}
      <div
        className="
          absolute
          left-1/2 top-[64.5%]
          -translate-x-1/2
          text-center
        "
      >
        <div className="font-mono text-[10px] text-foreground/65 sm:text-[11px]">task #42</div>

        <div
          className="
            mt-1
            font-mono text-[8px]
            uppercase tracking-[0.12em]
            text-emerald-500/55
          "
        >
          open · persistent
        </div>
      </div>

      {/* right label */}
      <div
        className="
          absolute
          right-[2%] top-1/2
          -translate-y-1/2

          sm:right-[3%]
        "
      >
        <div className="flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-[#4285F4]" />

          <span className="font-mono text-[10px] text-foreground/60 sm:text-[11px] lg:text-xs">
            agent B
          </span>
        </div>

        <div className="mt-4 space-y-2 font-mono text-[9px]">
          <div className="text-muted-foreground/45">run B</div>
          <div className="text-muted-foreground/30">snapshot B</div>
          <div className="text-emerald-500/60">fresh retrieval</div>
        </div>
      </div>

      {/*<StateLabel className="left-[33%] top-[19%]" label="history" />*/}
      {/*<StateLabel className="left-[42%] top-[14%]" label="progress" />*/}
      {/*<StateLabel className="right-[34%] top-[22%]" label="context" />*/}
      {/*<StateLabel className="right-[29%] bottom-[18%]" label="revision" />*/}
    </div>
  );
}

function StateLabel({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`
        absolute
        font-mono text-[8px]
        text-muted-foreground/30
        ${className ?? ""}
      `}
    >
      {label}
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
