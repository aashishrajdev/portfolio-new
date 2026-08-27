import {
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";
import type { RepoCard } from "@/types";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { StatusDot } from "@/components/ui/status-dot";
import { Counter } from "@/components/ui/counter";

/**
 * Section 05 — Open Source, framed as a service status board.
 *
 * Each public repo reads as a monitored "service" (a `.panel` dashboard
 * module, not a marketing card): a mono register index, an operational
 * status line, and the language it runs on. Server component — renders
 * client primitives (Reveal, Counter) but holds no state of its own.
 *
 * Honest by construction: every count below is real and checkable against the
 * GitHub API — no fabricated stars. The live commit signal lives in the GitHub
 * section above; this is the set of things anyone can read, fork, and audit.
 */

const PROFILE = "https://github.com/aashishrajdev";

const REPOS: RepoCard[] = [
  {
    name: "aashishrajdev/syncsy",
    description:
      "real-time collaboration engine: conflict-free multi-user sync over websockets, postgres + prisma.",
    url: "https://github.com/aashishrajdev/syncsy",
    language: "TypeScript",
  },
  {
    name: "aashishrajdev/urbaneyes",
    description:
      "civic reporting platform: geotagged issue intake, a status pipeline and an admin triage dashboard.",
    url: "https://github.com/aashishrajdev/urbaneyes",
    language: "JavaScript",
  },
];

/**
 * Upstream work: pull requests landed in repos owned by someone else (or, for
 * ZeroAxiis, by the org I co-founded). Counts come from the GitHub search API
 * for `author:aashishrajdev`, so each row links to the query that proves it.
 */
interface Upstream {
  org: string;
  repo: string;
  /** Link to the filtered PR list or the specific PR being cited. */
  url: string;
  role: string;
  detail: string;
  merged: number;
  opened: number;
}

const UPSTREAM: Upstream[] = [
  {
    org: "ZeroAxiis",
    repo: "zeroaxiis/*",
    url: "https://github.com/zeroaxiis",
    role: "co-founder",
    detail:
      "the product site, the Go backend services and the admin console, across the org's repos.",
    merged: 22,
    opened: 24,
  },
  {
    org: "OWASP VIT Bhopal",
    repo: "owasp-vitbhopal-website",
    url: "https://github.com/OWASPVITBHOPAL/owasp-vitbhopal-website/pulls?q=is%3Apr+author%3Aaashishrajdev",
    role: "chapter member",
    detail:
      "achievements page, hero and layout refactors, and the report-bug form.",
    merged: 8,
    opened: 8,
  },
  {
    org: "Open Source Kigali",
    repo: "docksight",
    url: "https://github.com/Open-Source-Kigali/docksight/pull/139",
    role: "contributor",
    detail: "login attribution fix, closing issue #130.",
    merged: 1,
    opened: 1,
  },
];

const MERGED_TOTAL = UPSTREAM.reduce((sum, u) => sum + u.merged, 0);

/**
 * One monitored "service": a dashboard module (Panel) with a mono register
 * index in the title bar, an operational status dot, the repo name, and a
 * footer health line of language + a view link.
 */
function ServiceModule({ repo, index }: { repo: RepoCard; index: string }) {
  return (
    <Panel
      className="group flex h-full flex-col transition-colors hover:border-foreground/20"
      title={
        <span className="flex items-center gap-2">
          <span className="text-foreground tabular-nums">{index}</span>
          <span aria-hidden className="text-border">
            /
          </span>
          <span>service</span>
        </span>
      }
      status
      bodyClassName="flex flex-1 flex-col gap-4 p-4"
    >
      <div className="flex items-center gap-2 font-mono text-sm text-foreground">
        <FiGithub aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="break-all">{repo.name}</span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {repo.description}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4">
        {repo.language ? (
          <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"
            />
            {repo.language}
          </span>
        ) : null}
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Open ${repo.name} on GitHub`}
        >
          view
          <FiExternalLink aria-hidden className="h-3.5 w-3.5" />
        </a>
      </div>
    </Panel>
  );
}

/**
 * One upstream contribution: the org, what the work was, and a merged/opened
 * tally that links out to the PR list it was counted from.
 */
function UpstreamRow({ item }: { item: Upstream }) {
  return (
    <li className="flex flex-col gap-3 border-t border-border py-4 sm:flex-row sm:items-baseline sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-mono text-sm text-foreground">{item.org}</span>
          <Badge>{item.role}</Badge>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {item.detail}
        </p>
      </div>

      <div className="flex shrink-0 items-baseline gap-5 font-mono text-xs text-muted-foreground">
        <span className="inline-flex items-baseline gap-1.5">
          <Counter value={item.merged} className="text-base text-foreground" />
          merged
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          aria-label={`Open ${item.org} contributions on GitHub`}
        >
          view
          <FiExternalLink aria-hidden className="h-3.5 w-3.5" />
        </a>
      </div>
    </li>
  );
}

export default function OpenSource() {
  return (
    <Section id="open-source">
      <SectionHeading
        index="03"
        eyebrow="open source"
        heading="working in the open"
        description="public repositories and upstream pull requests: the parts of the system anyone can read, fork, and audit."
      />

      {/* Status register strip — reads as a dashboard summary line */}
      <Reveal className="mt-6" delay={0.05}>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <StatusDot size="sm" label="open source status" />
            <span className="text-foreground">contributing</span>
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <Counter value={REPOS.length} className="text-base text-foreground" />
            public repos
          </span>
          <span className="inline-flex items-baseline gap-1.5">
            <Counter value={MERGED_TOTAL} className="text-base text-foreground" />
            merged upstream
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="text-foreground">live commit signal above</span>
          </span>
        </div>
      </Reveal>

      {/* Service status board — each repo is a monitored module */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {REPOS.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 0.06}>
            <ServiceModule
              repo={repo}
              index={String(i + 1).padStart(2, "0")}
            />
          </Reveal>
        ))}
      </div>

      {/* Upstream board — PRs landed in repos I do not own */}
      <Reveal className="mt-4" delay={0.1}>
        <Panel
          title={
            <span className="flex items-center gap-2">
              <span className="text-foreground tabular-nums">03</span>
              <span aria-hidden className="text-border">
                /
              </span>
              <span>upstream</span>
            </span>
          }
          status
          bodyClassName="px-4 pb-2 pt-0"
        >
          <ul>
            {UPSTREAM.map((item) => (
              <UpstreamRow key={item.org} item={item} />
            ))}
          </ul>
        </Panel>
      </Reveal>

      {/* CTA */}
      <Reveal className="mt-10 flex flex-wrap items-center gap-3" delay={0.12}>
        <Button
          href={PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          size="sm"
        >
          <FiGithub aria-hidden className="h-4 w-4" />
          view github
        </Button>
        <Badge>open to collaboration</Badge>
      </Reveal>
    </Section>
  );
}
