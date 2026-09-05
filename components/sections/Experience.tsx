import { FiGitCommit } from "react-icons/fi";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

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
  /** Mono timestamp range, e.g. "feb 2026 → present". */
  period: string;
  /** True while the role is the current deploy (live HEAD). */
  current?: boolean;
  summary: string;
  tech: string[];
}

/** Official docs for each stack chip. Chips without an entry (concepts rather
    than tools) render as plain badges. */
const TECH_DOCS: Record<string, string> = {
  Python: "https://docs.python.org/3/",
  FastAPI: "https://fastapi.tiangolo.com/",
  gRPC: "https://grpc.io/docs/",
  protobuf: "https://protobuf.dev/",
  MCP: "https://modelcontextprotocol.io/",
  TypeScript: "https://www.typescriptlang.org/docs/",
  React: "https://react.dev/",
  Accessibility: "https://www.w3.org/WAI/standards-guidelines/wcag/",
  "Node.js": "https://nodejs.org/en/docs",
  REST: "https://developer.mozilla.org/en-US/docs/Glossary/REST",
  "AWS Amplify": "https://docs.amplify.aws/",
};

const DEPLOYS: DeployEntry[] = [
  {
    ref: "a1f9c2e",
    role: "Backend Developer",
    company: "SaaS product company",
    location: "Pune, IN",
    period: "feb 2026 → present",
    current: true,
    summary:
      "joined as an intern in feb 2026, backend developer since jul 2026, owning backend tooling and internal services, from production bugfixes to a live querying service.",
    tech: ["Python", "FastAPI", "gRPC", "protobuf", "MCP"],
  },
  {
    ref: "7b3e081",
    role: "Software Developer Intern",
    company: "Spinach (pre-launch)",
    location: "Remote",
    period: "may 2025 → oct 2025",
    summary:
      "built the core interface for a pre-launch product, ahead of schedule and accessible by default.",
    tech: ["TypeScript", "React", "Accessibility", "Component Systems"],
  },
  {
    ref: "c40d5fa",
    role: "Freelance Developer",
    company: "Unigo (campus delivery startup)",
    location: "Remote",
    period: "sep 2025 → dec 2025",
    summary:
      "designed and launched a campus delivery platform end-to-end, with a CI/CD path to zero-downtime releases.",
    tech: ["Node.js", "REST", "AWS Amplify", "CI/CD"],
  },
];

/**
 * Section 03 — Experience as a "deploy history / changelog". Each role is a
 * commit-like entry on a left trace rail, carrying a mono timestamp, a short
 * summary, changelog-style notes, and the stack it ran on. Server
 * component; in-view motion comes from <Reveal>.
 */
export default function Experience() {
  return (
    <Section
      id="experience"
      index="01"
      heading={
        <>
          work <span className="font-serif italic">history</span>
        </>
      }
    >
      <SectionHeading
        eyebrow="changelog"
        heading="where the work shipped"
        description="A reverse-chronological log of roles: where i was, what i was building, and the stack it ran on."
      />

      <ol className="relative mt-8 md:mt-10">
        {/* Continuous trace rail */}
        <span
          aria-hidden
          className="absolute left-0 top-3 bottom-3 w-px bg-border md:left-[9rem]"
        />

        {DEPLOYS.map((entry, index) => (
          <li key={entry.ref} className="relative pb-16 last:pb-0">
            <Reveal delay={index * 0.06}>
              <div className="grid gap-x-10 gap-y-4 md:grid-cols-[9rem_1fr]">
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



                  {/* Stack — chips link to each tool's docs, like the hero marquee. */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.tech.map((tech) =>
                      TECH_DOCS[tech] ? (
                        <a
                          key={tech}
                          href={TECH_DOCS[tech]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs tracking-tight text-muted-foreground transition-colors duration-200 hover:border-foreground/40 hover:text-foreground"
                        >
                          {tech}
                        </a>
                      ) : (
                        <Badge key={tech}>{tech}</Badge>
                      ),
                    )}
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
