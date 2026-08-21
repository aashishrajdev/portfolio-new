import { FiGitCommit, FiArrowUpRight } from "react-icons/fi";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";

/**
 * A single deploy/changelog entry — modeled as a commit row on a deploy
 * history timeline rather than a generic resume bullet list.
 */
interface DeployEntry {
  /** Short hex-style ref for the mono "commit" glyph. */
  ref: string;
  role: string;
  company: string;
  location: string;
  /** Mono timestamp range, e.g. "2026.02 → present". */
  period: string;
  /** True while the role is the current deploy (live HEAD). */
  current?: boolean;
  summary: string;
  /** Quantified impact metrics rendered as mono stat cells. */
  metrics: { value: number; suffix?: string; label: string }[];
  highlights: string[];
  tech: string[];
}

const DEPLOYS: DeployEntry[] = [
  {
    ref: "a1f9c2e",
    role: "Backend Developer",
    company: "SaaS product company",
    location: "Pune, IN",
    period: "2026.02 → present",
    current: true,
    summary:
      "joined as an intern in feb 2026, backend developer since jul 2026 — owning backend tooling and internal services, from production bugfixes to a live querying service.",
    metrics: [
      { value: 5, suffix: "+", label: "prod bugs resolved" },
      { value: 8, suffix: "+", label: "reusable components" },
      { value: 1, label: "fastapi mcp server" },
    ],
    highlights: [
      "Resolved 5+ production bugs across the live product stack.",
      "Shipped 8+ reusable Angular Ionic components into the shared library.",
      "Built a Python FastAPI MCP server exposing gRPC/protobuf tools for live backend querying.",
    ],
    tech: ["Python", "FastAPI", "gRPC", "protobuf", "MCP"],
  },
  {
    ref: "7b3e081",
    role: "Frontend Developer",
    company: "Spinach (pre-launch)",
    location: "Remote",
    period: "2025.05 → 2025.10",
    summary:
      "built the core interface for a pre-launch product, ahead of schedule and accessible by default.",
    metrics: [
      { value: 5, suffix: "+", label: "core screens shipped" },
      { value: 20, suffix: "+", label: "component library" },
      { value: 2, label: "sprints ahead" },
    ],
    highlights: [
      "Shipped 5+ core screens two sprints early.",
      "Built a reusable 20+ component library for the product surface.",
      "Delivered WCAG 2.1 AA compliant interfaces for the pre-launch product.",
    ],
    tech: ["TypeScript", "React", "Accessibility", "Component Systems"],
  },
  {
    ref: "c40d5fa",
    role: "Freelance Developer",
    company: "Unigo (campus delivery startup)",
    location: "Remote",
    period: "2025.09 → 2025.12",
    summary:
      "designed and launched a campus delivery platform end-to-end, with a CI/CD path to zero-downtime releases.",
    metrics: [
      { value: 10, suffix: "+", label: "rest endpoints" },
      { value: 1, label: "full order lifecycle" },
      { value: 0, label: "downtime releases" },
    ],
    highlights: [
      "Designed and launched the Unigo campus delivery platform: catalog browsing and full order lifecycle.",
      "Built 10+ REST endpoints powering the ordering flow.",
      "Set up AWS Amplify CI/CD for zero-downtime releases.",
    ],
    tech: ["Node.js", "REST", "AWS Amplify", "CI/CD"],
  },
];

/**
 * Section 03 — Experience as a "deploy history / changelog". Each role is a
 * commit-like entry on a left trace rail, carrying a mono timestamp, a short
 * summary, quantified impact metrics, and the stack it ran on. Server
 * component; in-view motion comes from <Reveal> and animated <Counter> stats.
 */
export default function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      heading={
        <>
          deploy <span className="font-serif italic">history</span>
        </>
      }
    >
      <SectionHeading
        eyebrow="changelog"
        heading="where the work shipped"
        description="A reverse-chronological log of roles — read it like a deploy history: timestamp, summary, and the measurable change each one left behind."
      />

      <ol className="relative mt-8 md:mt-10">
        {/* Continuous trace rail */}
        <span
          aria-hidden
          className="absolute left-0 top-3 bottom-3 w-px bg-border md:left-[9rem]"
        />

        {DEPLOYS.map((entry, index) => (
          <li key={entry.ref} className="relative">
            <Reveal delay={index * 0.06}>
              <div className="grid gap-x-10 gap-y-4 pb-14 last:pb-0 md:grid-cols-[9rem_1fr]">
                {/* Timestamp column (desktop) */}
                <div className="hidden pt-1 md:block md:text-right">
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground tabular-nums">
                    {entry.period}
                  </span>
                </div>

                {/* Commit content column */}
                <div className="relative pl-9 md:pl-12">
                  {/* Commit node on the trace rail */}
                  <span
                    aria-hidden
                    className="absolute left-[-9px] top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-border bg-background text-muted-foreground md:left-[-9px]"
                  >
                    <FiGitCommit className="h-3 w-3" />
                  </span>

                  {/* Commit header line */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <span className="font-mono text-xs tracking-tight text-muted-foreground tabular-nums">
                      {entry.ref}
                    </span>
                    {entry.current ? (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-signal">
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-signal"
                        />
                        HEAD · live
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                    {entry.role}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <span className="text-foreground">{entry.company}</span>
                    <span aria-hidden className="text-muted-foreground/40">
                      ·
                    </span>
                    <span>{entry.location}</span>
                  </div>

                  {/* Timestamp (mobile) */}
                  <span className="mt-1 block font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground tabular-nums md:hidden">
                    {entry.period}
                  </span>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {entry.summary}
                  </p>

                  {/* Impact metrics */}
                  <Panel
                    title="impact"
                    bodyClassName="grid grid-cols-3 divide-x divide-border p-0"
                    className="mt-5"
                  >
                    {entry.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex flex-col gap-1 px-3 py-4 sm:px-4"
                      >
                        <span className="font-mono text-xl leading-none text-foreground tabular-nums sm:text-2xl">
                          <Counter
                            value={metric.value}
                            suffix={metric.suffix}
                          />
                        </span>
                        <span className="font-mono text-[0.65rem] uppercase leading-tight tracking-[0.1em] text-muted-foreground">
                          {metric.label}
                        </span>
                      </div>
                    ))}
                  </Panel>

                  {/* Changelog highlights */}
                  <ul className="mt-5 flex flex-col gap-2.5">
                    {entry.highlights.map((highlight) => (
                      <li
                        key={highlight}
                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                      >
                        <FiArrowUpRight
                          aria-hidden
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
                        />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stack */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.tech.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
