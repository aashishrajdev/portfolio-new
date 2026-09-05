"use client";

import { FiArrowUpRight, FiGithub, FiExternalLink } from "react-icons/fi";

import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Content — real flagship systems, framed problem -> architecture -> stack.
 * Links use "#" where the real URL is unknown (build-safe).
 * -------------------------------------------------------------------------- */

interface Flagship {
  index: string;
  title: string;
  year: string;
  /** One-line role summary under the title. */
  kind: string;
  problem: string;
  architecture: string;
  stack: string[];
  repoUrl: string;
  liveUrl: string;
}

/** Official docs for each stack chip. Chips without an entry (concepts rather
    than tools) render as plain badges. */
const TECH_DOCS: Record<string, string> = {
  TypeScript: "https://www.typescriptlang.org/docs/",
  Go: "https://go.dev/doc/",
  ConnectRPC: "https://connectrpc.com/docs/",
  "Next.js": "https://nextjs.org/docs",
  WebSockets: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API",
  PostgreSQL: "https://www.postgresql.org/docs/",
  Prisma: "https://www.prisma.io/docs",
  "Node.js": "https://nodejs.org/en/docs",
  "REST API": "https://developer.mozilla.org/en-US/docs/Glossary/REST",
  React: "https://react.dev/",
  Tailwind: "https://tailwindcss.com/docs",
  motion: "https://motion.dev/docs",
  Python: "https://docs.python.org/3/",
  FastAPI: "https://fastapi.tiangolo.com/",
  gRPC: "https://grpc.io/docs/",
  protobuf: "https://protobuf.dev/",
  Angular: "https://angular.dev/overview",
  Ionic: "https://ionicframework.com/docs",
  "AWS Amplify": "https://docs.amplify.aws/",
  JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  REST: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
};

/** A stack chip: linked to its docs when one exists, a plain badge otherwise. */
function TechChip({ tech }: { tech: string }) {
  const href = TECH_DOCS[tech];
  if (!href) return <Badge>{tech}</Badge>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs tracking-tight text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
    >
      {tech}
    </a>
  );
}

const FLAGSHIPS: Flagship[] = [
  {
    index: "01",
    title: "HaloMail",
    year: "building",
    kind: "Scheduling + contact-form platform — work in progress",
    problem:
      "A booking page and a portfolio contact form are somehow two separate paid subscriptions. That felt like one API's job.",
    architecture:
      "One typed ConnectRPC contract, spoken as gRPC or plain REST. A Go backend syncs Google and Outlook calendars; an embeddable widget catches form submissions, filters the spam, and forwards the rest. Still building it — in the open.",
    stack: ["TypeScript", "Go", "ConnectRPC", "Next.js"],
    repoUrl: "https://github.com/aashishrajdev/halomail",
    liveUrl: "https://halomail.vercel.app",
  },
  {
    index: "02",
    title: "Syncsy",
    year: "may 2025",
    kind: "Real-time collaboration system",
    problem:
      "Two people type in the same document, and one of them loses. Most apps quietly pick a winner.",
    architecture:
      "WebSockets fan every edit out live, a conflict-free merge decides what sticks, and Postgres remembers it. No locks, no lost keystrokes.",
    stack: ["TypeScript", "WebSockets", "PostgreSQL", "Prisma", "Node.js"],
    repoUrl: "#",
    liveUrl: "#",
  },
  {
    index: "03",
    title: "UrbanEyes",
    year: "apr 2025",
    kind: "Civic reporting platform",
    problem:
      "You report a broken streetlight and never hear about it again. Civic complaints go into a void.",
    architecture:
      "Every geotagged report gets an owner, a status, and a paper trail — from first sighting to fixed. Nothing disappears quietly.",
    stack: ["Full-Stack", "REST API", "Node.js", "Database"],
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


        {/* Stack */}
        <div>
          <div className="mb-3 font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            stack
          </div>
          <div className="flex flex-wrap gap-2">
            {item.stack.map((tech) => (
              <TechChip key={tech} tech={tech} />
            ))}
          </div>
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
                  <TechChip key={t} tech={t} />
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
 */
/**
 * Archived for now at the owner's request: the systems / apps / archive card
 * grid below the flagships. Flip to true to bring it back — the data and
 * components stay compiled so they cannot rot while parked.
 */
const SHOW_TIER_GRID = false;

export default function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      heading={
        <>
          Selected <span className="italic text-muted-foreground">projects</span>
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

      {/* Tiered grid — archived behind SHOW_TIER_GRID, see note on the flag. */}
      {SHOW_TIER_GRID ? (
        <div className="mt-24 md:mt-32">
          <div className="flex flex-col gap-16">
            {TIERS.map((tier) => (
              <TierBlock key={tier.id} tier={tier} />
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
