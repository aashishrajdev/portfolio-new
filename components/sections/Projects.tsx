"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { FiArrowUpRight, FiGithub, FiExternalLink } from "react-icons/fi";

import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Content — real flagship systems, framed problem -> architecture -> stack ->
 * outcome. Links use "#" where the real URL is unknown (build-safe).
 * -------------------------------------------------------------------------- */

interface FlowNode {
  /** Short mono label for a hop in the request path. */
  label: string;
}

interface Flagship {
  index: string;
  title: string;
  year: string;
  /** One-line role summary under the title. */
  kind: string;
  problem: string;
  architecture: string;
  /** The request-flow hops drawn in the inline SVG diagram. */
  flow: FlowNode[];
  stack: string[];
  outcomes: { metric: string; label: string }[];
  repoUrl: string;
  liveUrl: string;
}

const FLAGSHIPS: Flagship[] = [
  {
    index: "01",
    title: "Syncsy",
    year: "2025",
    kind: "Real-time collaboration system",
    problem:
      "Multiple users editing the same document at once will clobber each other's writes. Last-write-wins loses data, and naive locking kills the live, in-the-room feel that collaboration is supposed to have.",
    architecture:
      "A WebSocket layer fans changes out to every connected client, while a conflict-free merge strategy reconciles concurrent edits before they're committed. Postgres (via Prisma) is the durable source of truth; the socket tier stays stateless so sessions can scale horizontally without sticky routing.",
    flow: [
      { label: "client" },
      { label: "ws gateway" },
      { label: "merge" },
      { label: "postgres" },
    ],
    stack: ["TypeScript", "WebSockets", "PostgreSQL", "Prisma", "Node.js"],
    outcomes: [
      { metric: "conflict-free", label: "concurrent merge" },
      { metric: "multi-user", label: "live sessions" },
      { metric: "stateless", label: "socket tier" },
    ],
    repoUrl: "#",
    liveUrl: "#",
  },
  {
    index: "02",
    title: "UrbanEyes",
    year: "2025",
    kind: "Civic reporting platform",
    problem:
      "Civic issues like broken lights, potholes and unsafe spots get reported into the void. Without a structured pipeline from sighting to resolution, reports pile up with no owner, no status, and no feedback loop back to the people who filed them.",
    architecture:
      "A full-stack pipeline takes a geotagged report, persists it, and moves it through a lifecycle of states. A REST API backs the submission and status surfaces; the data model keeps each report auditable from first sighting to closed, so nothing silently disappears.",
    flow: [
      { label: "report" },
      { label: "api" },
      { label: "lifecycle" },
      { label: "store" },
    ],
    stack: ["Full-Stack", "REST API", "Node.js", "Database"],
    outcomes: [
      { metric: "geotagged", label: "report intake" },
      { metric: "lifecycle", label: "tracked states" },
      { metric: "auditable", label: "report trail" },
    ],
    repoUrl: "#",
    liveUrl: "#",
  },
  {
    index: "03",
    title: "Learnod V2",
    year: "2024",
    kind: "Learning platform",
    problem:
      "Learning content is easy to publish and hard to make stick. A flat list of resources gives no sense of progress, no structure to follow, and no reason to come back tomorrow.",
    architecture:
      "A full-stack rebuild organises content into structured paths with progress tracking, served by a clean API and a responsive client. The second iteration tightened the data model and the delivery surface so the experience holds up as the catalogue grows.",
    flow: [
      { label: "learner" },
      { label: "api" },
      { label: "progress" },
      { label: "content" },
    ],
    stack: ["Full-Stack", "REST API", "React", "Node.js"],
    outcomes: [
      { metric: "structured", label: "learning paths" },
      { metric: "tracked", label: "learner progress" },
      { metric: "v2", label: "rebuilt model" },
    ],
    repoUrl: "#",
    liveUrl: "#",
  },
];

/* ----------------------------------------------------------------------------
 * Tiered grid — Systems / Apps / Archive
 * -------------------------------------------------------------------------- */

interface GridProject {
  title: string;
  description: string;
  tech: string[];
  repoUrl: string;
  year?: string;
}

interface Tier {
  id: string;
  title: string;
  note: string;
  projects: GridProject[];
}

const TIERS: Tier[] = [
  {
    id: "systems",
    title: "Systems",
    note: "backend / infra heavy",
    projects: [
      {
        title: "FastAPI MCP Server",
        description:
          "A Python FastAPI server exposing gRPC / protobuf tools for live backend querying, built so an agent can interrogate production data through a typed interface.",
        tech: ["Python", "FastAPI", "gRPC", "protobuf"],
        repoUrl: "#",
        year: "2026",
      },
      {
        title: "Unigo Delivery Platform",
        description:
          "Campus delivery service: catalog browsing and a full order lifecycle over 10+ REST endpoints, shipped with AWS Amplify CI/CD for zero-downtime releases.",
        tech: ["REST", "AWS Amplify", "Node.js"],
        repoUrl: "#",
        year: "2025",
      },
    ],
  },
  {
    id: "apps",
    title: "Apps",
    note: "full-stack / product",
    projects: [
      {
        title: "Spinach (pre-launch)",
        description:
          "Core product screens and a 20+ component library for a pre-launch product, delivered WCAG 2.1 AA compliant and two sprints ahead of schedule.",
        tech: ["TypeScript", "Angular", "Ionic"],
        repoUrl: "#",
        year: "2025",
      },
      {
        title: "Portfolio: Uptime",
        description:
          "This site: a portfolio reframed as an observable system: status panels, a command palette, scroll-spy rail, and a live IST clock.",
        tech: ["Next.js", "Tailwind", "motion"],
        repoUrl: "https://github.com/aashishrajdev",
        year: "2026",
      },
    ],
  },
  {
    id: "archive",
    title: "Archive",
    note: "earlier work",
    projects: [
      {
        title: "Learnod V1",
        description:
          "The first iteration of the learning platform, the groundwork that the V2 rebuild refined into structured paths and progress tracking.",
        tech: ["Full-Stack", "JavaScript"],
        repoUrl: "#",
        year: "2023",
      },
      {
        title: "Assorted experiments",
        description:
          "Smaller tools, hackathon builds, and exploratory repos, kept around as a record of things tried and learned from.",
        tech: ["Various"],
        repoUrl: "https://github.com/aashishrajdev",
      },
    ],
  },
];

/* ----------------------------------------------------------------------------
 * Request-flow diagram — a hairline path with nodes whose signal fill advances
 * as the flagship block scrolls through the viewport (framer useScroll).
 * Reduced motion -> the front rests at the midpoint, statically.
 * -------------------------------------------------------------------------- */

function FlowNodeDot({
  i,
  count,
  progress,
  reduce,
}: {
  i: number;
  count: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  // Each node "lights up" as the scroll front passes its position along 0..1.
  const at = count > 1 ? i / (count - 1) : 0;
  const window = 1 / Math.max(count, 1);
  const opacity = useTransform(
    progress,
    [at - window, at, 1],
    reduce ? [0.5, 0.5, 0.5] : [0.15, 1, 1],
    { clamp: true },
  );

  return (
    <motion.span
      aria-hidden
      style={{ opacity }}
      className="relative inline-flex h-2 w-2 items-center justify-center"
    >
      <span className="h-2 w-2 rounded-full bg-signal" />
    </motion.span>
  );
}

function RequestFlow({ flow }: { flow: FlowNode[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  // Track this row through the viewport so the trace fills as you read past it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "start 0.35"],
  });

  // The hairline that the signal trace draws over.
  const traceWidth = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["50%", "50%"] : ["0%", "100%"],
  );

  return (
    <div ref={ref} className="select-none">
      <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
        request flow
      </div>
      <div className="relative flex items-center">
        {/* Base hairline track */}
        <span
          aria-hidden
          className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border"
        />
        {/* Signal trace drawing left -> right */}
        <motion.span
          aria-hidden
          style={{ width: traceWidth }}
          className="absolute left-0 top-1/2 h-px -translate-y-1/2 bg-signal"
        />
        <div className="relative flex w-full items-center justify-between gap-2">
          {flow.map((node, i) => (
            <div
              key={node.label}
              className="flex min-w-0 flex-col items-center gap-2"
            >
              <FlowNodeDot
                i={i}
                count={flow.length}
                progress={scrollYProgress}
                reduce={reduce}
              />
              <span className="whitespace-nowrap font-mono text-[0.6rem] tracking-tight text-muted-foreground sm:text-[0.65rem]">
                {node.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Flagship block — sticky-pinned narrative panel.
 * -------------------------------------------------------------------------- */

function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </p>
    </div>
  );
}

function Flagship({ item }: { item: Flagship }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] lg:gap-12">
      {/* Sticky-pinned identity column (desktop) */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-signal tabular-nums">
            {item.index}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
            {item.year}
          </span>
        </div>
        <h3 className="mt-3 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl">
          {item.title}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">{item.kind}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            href={item.repoUrl}
            variant="outline"
            size="sm"
            target={item.repoUrl.startsWith("http") ? "_blank" : undefined}
            rel={item.repoUrl.startsWith("http") ? "noreferrer" : undefined}
          >
            <FiGithub className="h-4 w-4" aria-hidden />
            Source
          </Button>
          <Button
            href={item.liveUrl}
            variant="ghost"
            size="sm"
            target={item.liveUrl.startsWith("http") ? "_blank" : undefined}
            rel={item.liveUrl.startsWith("http") ? "noreferrer" : undefined}
          >
            <FiExternalLink className="h-4 w-4" aria-hidden />
            Live
          </Button>
        </div>
      </div>

      {/* Narrative column */}
      <div className="flex flex-col gap-8">
        <Stage label="problem">{item.problem}</Stage>
        <Stage label="architecture">{item.architecture}</Stage>

        {/* Request-flow diagram */}
        <div className="panel p-5">
          <RequestFlow flow={item.flow} />
        </div>

        {/* Stack */}
        <div>
          <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            stack
          </div>
          <div className="flex flex-wrap gap-2">
            {item.stack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <div>
          <div className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            <StatusDot size="sm" />
            outcome
          </div>
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            {item.outcomes.map((o) => (
              <div key={o.label} className="frosted p-4">
                <dt className="font-mono text-base text-foreground tabular-nums">
                  {o.metric}
                </dt>
                <dd className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {o.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Tier grid row
 * -------------------------------------------------------------------------- */

function TierBlock({ tier }: { tier: Tier }) {
  return (
    <div>
      <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-3">
        <h4 className="font-mono text-sm uppercase tracking-[0.2em] text-foreground">
          {tier.title}
        </h4>
        <span className="font-mono text-xs tracking-tight text-muted-foreground">
          {tier.note}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {tier.projects.map((p, i) => (
          <Reveal key={p.title} delay={(i % 2) * 0.06}>
            <Card className="group flex h-full flex-col p-5">
              <div className="flex items-start justify-between gap-4">
                <h5 className="text-base font-semibold tracking-tight text-foreground">
                  {p.title}
                </h5>
                <a
                  href={p.repoUrl}
                  target={p.repoUrl.startsWith("http") ? "_blank" : undefined}
                  rel={p.repoUrl.startsWith("http") ? "noreferrer" : undefined}
                  aria-label={`Open ${p.title}`}
                  className="mt-0.5 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <FiArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
              {p.year ? (
                <span className="mt-1 font-mono text-xs text-muted-foreground tabular-nums">
                  {p.year}
                </span>
              ) : null}
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

/**
 * Projects (section 04) — signature sticky-pinned showcase of flagship systems
 * framed problem -> architecture -> stack -> outcome with a scroll-driven
 * request-flow diagram, followed by a tiered Systems / Apps / Archive grid.
 * Client component: uses framer useScroll for the request-flow trace.
 */
export default function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      heading={
        <>
          Selected <span className="italic text-muted-foreground">systems</span>
        </>
      }
    >
      <p className="-mt-6 mb-16 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:-mt-8 md:mb-24">
        flagship builds, traced end to end: the problem, the shape of the
        system, the stack, and what it actually does in production.
      </p>

      {/* Flagship systems */}
      <div className={cn("flex flex-col gap-16 sm:gap-24 md:gap-40")}>
        {FLAGSHIPS.map((item) => (
          <Flagship key={item.title} item={item} />
        ))}
      </div>

      {/* Tiered grid */}
      <div className="mt-28 md:mt-40">
        <div className="mb-12 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-8 bg-border" aria-hidden />
          more work
        </div>
        <div className="flex flex-col gap-16">
          {TIERS.map((tier) => (
            <TierBlock key={tier.id} tier={tier} />
          ))}
        </div>
      </div>
    </Section>
  );
}
