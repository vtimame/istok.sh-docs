import { useEffect, useRef } from "react";

interface Props {
  size?: number;
}

interface Agent {
  id: string;
  name: string;
  orbit: number;
  phase: number;
  speed: number;
  color: string;
}

interface Position {
  x: number;
  y: number;
}

interface ActiveEvent {
  agentId: string;
  label: string;
  startedAt: number;
  duration: number;
}

const rings = [0.28, 0.44, 0.6, 0.76, 0.92];

const agents: Agent[] = [
  {
    id: "claude",
    name: "Claude Code",
    orbit: 0.44,
    phase: 0,
    speed: 0.15,
    color: "#D97757",
  },
  {
    id: "codex",
    name: "Codex",
    orbit: 0.44,
    phase: Math.PI,
    speed: 0.15,
    color: "#111111",
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    orbit: 0.6,
    phase: Math.PI * 0.2,
    speed: 0.11,
    color: "#4285F4",
  },
  {
    id: "opencode",
    name: "OpenCode",
    orbit: 0.6,
    phase: Math.PI * 1.2,
    speed: 0.11,
    color: "#009979",
  },
  {
    id: "cline",
    name: "Cline",
    orbit: 0.76,
    phase: Math.PI * 0.4,
    speed: 0.08,
    color: "#7C3AED",
  },
  {
    id: "aider",
    name: "Aider",
    orbit: 0.76,
    phase: Math.PI * 1.4,
    speed: 0.08,
    color: "#E11D48",
  },
  {
    id: "amp",
    name: "Amp",
    orbit: 0.92,
    phase: Math.PI * 0.15,
    speed: 0.055,
    color: "#F59E0B",
  },
  {
    id: "cursor",
    name: "Cursor",
    orbit: 0.92,
    phase: Math.PI * 1.15,
    speed: 0.055,
    color: "#6B7280",
  },
];

const eventLabels = ["context", "task", "handoff", "progress"];

const CENTER_DELAY = 0;
const CENTER_DURATION = 650;

const RING_START = 180;
const RING_STAGGER = 120;
const RING_DURATION = 900;

const AGENT_START = 280;
const AGENT_RADIUS_DURATION = 1700;

const SPIN_DOWN_DURATION = 2600;
const EXTRA_SPIN_SPEED = 18;

const LABEL_START = 1500;
const LABEL_STAGGER = 50;
const LABEL_DURATION = 800;

const EVENT_START = 3600;
const EVENT_DURATION = 1250;
const EVENT_MIN_INTERVAL = 3200;
const EVENT_MAX_INTERVAL = 5800;

const WAVE_START = 4300;
const WAVE_DURATION = 2200;
const WAVE_MIN_INTERVAL = 6500;
const WAVE_MAX_INTERVAL = 10000;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createArcPath(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  if (radius < 1) {
    return "";
  }

  const startX = centerX + Math.cos(startAngle) * radius;
  const startY = centerY + Math.sin(startAngle) * radius;

  const endX = centerX + Math.cos(endAngle) * radius;
  const endY = centerY + Math.sin(endAngle) * radius;

  return `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 0 1 ${endX} ${endY}
  `;
}

export function HeroOrbit(props: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  const ringRefs = useRef<Array<HTMLDivElement | null>>([]);

  const dotRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const trailRefs = useRef<Record<string, SVGPathElement | null>>({});

  const eventLineRef = useRef<SVGLineElement>(null);
  const eventPacketRef = useRef<SVGCircleElement>(null);
  const eventLabelRef = useRef<HTMLDivElement>(null);

  const waveRef = useRef<SVGCircleElement>(null);
  const waveSecondaryRef = useRef<SVGCircleElement>(null);

  const labelSizesRef = useRef<Record<string, { width: number; height: number }>>({});

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    let frame = 0;

    const startedAt = performance.now();
    let previousTime = startedAt;

    let activeEvent: ActiveEvent | null = null;
    let nextEventAt = startedAt + EVENT_START;

    let waveStartedAt: number | null = null;
    let nextWaveAt = startedAt + WAVE_START;

    const angles = Object.fromEntries(agents.map((agent) => [agent.id, agent.phase])) as Record<
      string,
      number
    >;

    const positions: Record<string, Position> = {};

    const measureLabels = () => {
      for (const agent of agents) {
        const label = labelRefs.current[agent.id];

        if (!label) continue;

        labelSizesRef.current[agent.id] = {
          width: label.offsetWidth,
          height: label.offsetHeight,
        };
      }
    };

    const resizeObserver = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;

      measureLabels();
    });

    resizeObserver.observe(container);

    measureLabels();

    const startEvent = (now: number) => {
      const agent = agents[Math.floor(Math.random() * agents.length)];
      const label = eventLabels[Math.floor(Math.random() * eventLabels.length)];

      activeEvent = {
        agentId: agent.id,
        label,
        startedAt: now,
        duration: EVENT_DURATION,
      };

      if (eventLabelRef.current) {
        eventLabelRef.current.textContent = label;
      }
    };

    const hideEvent = () => {
      if (eventLineRef.current) {
        eventLineRef.current.style.opacity = "0";
      }

      if (eventPacketRef.current) {
        eventPacketRef.current.style.opacity = "0";
      }

      if (eventLabelRef.current) {
        eventLabelRef.current.style.opacity = "0";
      }
    };

    const hideWave = () => {
      if (waveRef.current) {
        waveRef.current.style.opacity = "0";
      }

      if (waveSecondaryRef.current) {
        waveSecondaryRef.current.style.opacity = "0";
      }
    };

    const animate = (now: number) => {
      const delta = Math.min((now - previousTime) / 1000, 0.05);

      previousTime = now;

      const elapsed = now - startedAt;

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2;

      if (centerRef.current) {
        const centerT = clamp((elapsed - CENTER_DELAY) / CENTER_DURATION);
        const centerReveal = easeOutCubic(centerT);
        const scale = 0.72 + centerReveal * 0.28;

        centerRef.current.style.opacity = String(centerReveal);

        centerRef.current.style.transform = `
          translate(-50%, -50%)
          scale(${scale})
        `;
      }

      ringRefs.current.forEach((ring, index) => {
        if (!ring) return;

        const delay = RING_START + index * RING_STAGGER;
        const ringT = clamp((elapsed - delay) / RING_DURATION);
        const ringReveal = easeOutQuart(ringT);
        const scale = 0.06 + ringReveal * 0.94;

        ring.style.opacity = String(ringReveal);

        ring.style.transform = `
          translate(-50%, -50%)
          scale(${scale})
        `;
      });

      const spinT = clamp(elapsed / SPIN_DOWN_DURATION);
      const spinDown = 1 - smoothstep(spinT);
      const extraSpinSpeed = EXTRA_SPIN_SPEED * spinDown * spinDown;

      for (const agent of agents) {
        const dot = dotRefs.current[agent.id];
        const label = labelRefs.current[agent.id];
        const trail = trailRefs.current[agent.id];

        if (!dot || !label) continue;

        const orbitIndex = rings.indexOf(agent.orbit);

        const agentDelay = AGENT_START + orbitIndex * 80;
        const radiusT = clamp((elapsed - agentDelay) / AGENT_RADIUS_DURATION);
        const radiusReveal = easeOutQuart(radiusT);

        const angularSpeed = agent.speed + extraSpinSpeed;

        angles[agent.id] += angularSpeed * delta;

        const angle = angles[agent.id];
        const radius = maxRadius * agent.orbit * radiusReveal;

        const nx = Math.cos(angle);
        const ny = Math.sin(angle);

        const x = centerX + nx * radius;
        const y = centerY + ny * radius;

        positions[agent.id] = { x, y };

        const dotOpacity = clamp(radiusT * 1.6);
        const dotScale = 0.45 + radiusReveal * 0.55;

        dot.style.opacity = String(dotOpacity);

        dot.style.transform = `
          translate3d(${x}px, ${y}px, 0)
          translate(-50%, -50%)
          scale(${dotScale})
        `;

        if (trail) {
          const spinAmount = clamp(extraSpinSpeed / EXTRA_SPIN_SPEED);

          const trailAngle = 0.1 + spinAmount * 0.52;
          const trailOpacity = radiusReveal * (0.035 + spinAmount * 0.17);

          trail.setAttribute(
            "d",
            createArcPath(centerX, centerY, radius, angle - trailAngle, angle),
          );

          trail.style.opacity = String(trailOpacity);
        }

        const labelSize = labelSizesRef.current[agent.id] ?? {
          width: 0,
          height: 0,
        };

        const labelGap = 8;

        const labelRadius =
          labelGap + Math.abs(nx) * (labelSize.width / 2) + Math.abs(ny) * (labelSize.height / 2);

        const labelX = x + nx * labelRadius;
        const labelY = y + ny * labelRadius;

        const labelT = clamp((elapsed - LABEL_START - orbitIndex * LABEL_STAGGER) / LABEL_DURATION);

        const labelReveal = easeOutCubic(labelT);
        const labelScale = 0.94 + labelReveal * 0.06;

        label.style.opacity = String(labelReveal);

        label.style.transform = `
          translate3d(${labelX}px, ${labelY}px, 0)
          translate(-50%, -50%)
          scale(${labelScale})
        `;
      }

      if (!activeEvent && waveStartedAt === null && now >= nextEventAt) {
        startEvent(now);
      }

      if (activeEvent) {
        const position = positions[activeEvent.agentId];

        const eventLine = eventLineRef.current;
        const eventPacket = eventPacketRef.current;
        const eventLabel = eventLabelRef.current;

        if (position && eventLine && eventPacket && eventLabel) {
          const eventT = clamp((now - activeEvent.startedAt) / activeEvent.duration);

          const fade = Math.sin(eventT * Math.PI);

          eventLine.setAttribute("x1", String(centerX));
          eventLine.setAttribute("y1", String(centerY));
          eventLine.setAttribute("x2", String(position.x));
          eventLine.setAttribute("y2", String(position.y));

          eventLine.style.opacity = String(fade * 0.16);

          const packetT = smoothstep(eventT);

          const packetX = position.x + (centerX - position.x) * packetT;
          const packetY = position.y + (centerY - position.y) * packetT;

          eventPacket.setAttribute("cx", String(packetX));
          eventPacket.setAttribute("cy", String(packetY));

          eventPacket.style.opacity = String(fade * 0.8);

          const eventLabelX = centerX + (position.x - centerX) * 0.62;
          const eventLabelY = centerY + (position.y - centerY) * 0.62;

          eventLabel.style.opacity = String(fade * 0.55);

          eventLabel.style.transform = `
            translate3d(${eventLabelX}px, ${eventLabelY}px, 0)
            translate(-50%, -50%)
          `;

          if (eventT >= 1) {
            activeEvent = null;

            nextEventAt = now + randomBetween(EVENT_MIN_INTERVAL, EVENT_MAX_INTERVAL);

            hideEvent();
          }
        }
      }

      if (waveStartedAt === null && !activeEvent && now >= nextWaveAt) {
        waveStartedAt = now;
      }

      if (waveStartedAt !== null && waveRef.current && waveSecondaryRef.current) {
        const waveT = clamp((now - waveStartedAt) / WAVE_DURATION);

        const maxWaveRadius = maxRadius * rings[rings.length - 1];

        const primaryT = easeOutCubic(waveT);
        const primaryRadius = maxWaveRadius * primaryT;

        const primaryOpacity = Math.sin(waveT * Math.PI) * 0.1;

        waveRef.current.setAttribute("cx", String(centerX));
        waveRef.current.setAttribute("cy", String(centerY));
        waveRef.current.setAttribute("r", String(primaryRadius));

        waveRef.current.style.opacity = String(primaryOpacity);

        const secondaryT = clamp((waveT - 0.075) / 0.925);
        const secondaryReveal = easeOutCubic(secondaryT);
        const secondaryRadius = maxWaveRadius * secondaryReveal;

        const secondaryOpacity = Math.sin(secondaryT * Math.PI) * 0.032;

        waveSecondaryRef.current.setAttribute("cx", String(centerX));
        waveSecondaryRef.current.setAttribute("cy", String(centerY));
        waveSecondaryRef.current.setAttribute("r", String(secondaryRadius));

        waveSecondaryRef.current.style.opacity = String(secondaryOpacity);

        if (waveT >= 1) {
          waveStartedAt = null;

          nextWaveAt = now + randomBetween(WAVE_MIN_INTERVAL, WAVE_MAX_INTERVAL);

          hideWave();
        }
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto aspect-square w-full"
      style={{
        maxWidth: props.size ? `${props.size}px` : "640px",
      }}
    >
      {rings.map((ring, index) => (
        <OrbitRing
          key={ring}
          size={ring}
          innerRef={(element) => {
            ringRefs.current[index] = element;
          }}
        />
      ))}

      <svg
        className="
          pointer-events-none
          absolute inset-0 z-[4]
          size-full
          overflow-visible
        "
      >
        <circle
          ref={waveRef}
          r="0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground"
          opacity="0"
        />

        <circle
          ref={waveSecondaryRef}
          r="0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground"
          opacity="0"
        />
      </svg>

      <svg
        className="
          pointer-events-none
          absolute inset-0 z-[5]
          size-full
          overflow-visible
        "
      >
        {agents.map((agent) => (
          <path
            key={agent.id}
            ref={(element) => {
              trailRefs.current[agent.id] = element;
            }}
            fill="none"
            stroke={agent.color}
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0"
          />
        ))}
      </svg>

      <IstokMark
        innerRef={(element) => {
          centerRef.current = element;
        }}
      />

      <svg
        className="
          pointer-events-none
          absolute inset-0 z-[15]
          size-full
          overflow-visible
        "
      >
        <line
          ref={eventLineRef}
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="3 5"
          className="text-foreground"
          opacity="0"
        />

        <circle
          ref={eventPacketRef}
          r="2"
          fill="currentColor"
          className="text-foreground"
          opacity="0"
        />
      </svg>

      <div
        ref={eventLabelRef}
        className="
          pointer-events-none
          absolute left-0 top-0 z-[16]
          whitespace-nowrap
          font-mono text-[8px]
          text-foreground/40
          opacity-0
          will-change-transform
        "
      />

      {agents.map((agent) => (
        <div key={agent.id}>
          <div
            ref={(element) => {
              dotRefs.current[agent.id] = element;
            }}
            className="
              absolute left-0 top-0 z-20
              size-2
              rounded-full
              ring-4 ring-background
              opacity-0
              will-change-transform
            "
            style={{
              backgroundColor: agent.color,
            }}
          />

          <div
            ref={(element) => {
              labelRefs.current[agent.id] = element;
            }}
            className="
              pointer-events-none
              absolute left-0 top-0 z-30
              whitespace-nowrap
              font-mono text-[9px]
              text-foreground/45
              opacity-0
              will-change-transform
            "
          >
            {agent.name}
          </div>
        </div>
      ))}
    </div>
  );
}

function OrbitRing({
  size,
  innerRef,
}: {
  size: number;
  innerRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={innerRef}
      className="
        pointer-events-none
        absolute left-1/2 top-1/2
        rounded-full
        border border-primary/10
        opacity-0
        will-change-transform
        dark:border-emerald-500/10
      "
      style={{
        width: `${size * 100}%`,
        height: `${size * 100}%`,
        transform: "translate(-50%, -50%) scale(0.06)",
      }}
    />
  );
}

function IstokMark({ innerRef }: { innerRef?: (element: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={innerRef}
      className="
        absolute left-1/2 top-1/2 z-10
        opacity-0
        will-change-transform
      "
      style={{
        transform: "translate(-50%, -50%) scale(0.72)",
      }}
    >
      <div className="relative size-28">
        <div className="absolute inset-0 rounded-full bg-primary/[0.08] dark:bg-emerald-500/[0.08]" />
        <div className="absolute inset-[10px] rounded-full bg-primary/[0.12] dark:bg-emerald-500/[0.12]" />
        <div className="absolute inset-[20px] rounded-full bg-primary/[0.18] dark:bg-emerald-500/[0.18]" />
        <div className="absolute inset-[30px] rounded-full bg-primary/[0.28] dark:bg-emerald-500/[0.28]" />
        <div className="absolute inset-[40px] rounded-full bg-primary/[0.5] dark:bg-emerald-500/[0.5]" />
        <div className="absolute inset-[48px] rounded-full bg-primary dark:bg-emerald-500" />
      </div>
    </div>
  );
}
