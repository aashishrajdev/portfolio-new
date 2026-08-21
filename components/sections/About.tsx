import type { IconType } from "react-icons";
import { FiServer, FiCloud, FiLayers } from "react-icons/fi";

import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { StatusDot } from "@/components/ui/status-dot";
import { Counter, Clock } from "@/components/ui/counter";

interface Expertise {
  index: string;
  title: string;
  icon: IconType;
  blurb: string;
  capabilities: string[];
}

const EXPERTISE: Expertise[] = [
  {
    index: "01",
    title: "Backend Systems",
    icon: FiServer,
    blurb:
      "apis and services that hold up under concurrency, and stay observable when they don't.",
    capabilities: [
      "REST + gRPC / protobuf services",
      "PostgreSQL, Prisma, Redis",
      "real-time sync over WebSockets",
      "FastAPI + Node.js / Express",
    ],
  },
  {
    index: "02",
    title: "Cloud & DevOps",
    icon: FiCloud,
    blurb:
      "shipping to production should be boring. ci/cd pipelines, containers, zero-downtime releases.",
    capabilities: [
      "Docker, AWS, GCP",
      "CI/CD with Jenkins + Amplify",
      "Nginx, Linux, Terraform",
      "zero-downtime deploys",
    ],
  },
  {
    index: "03",
    title: "Full-Stack Product",
    icon: FiLayers,
    blurb:
      "from the pixel to the pipeline — accessible interfaces wired to systems that actually work.",
    capabilities: [
      "React / Next.js, Angular Ionic",
      "TypeScript end to end",
      "WCAG 2.1 AA interfaces",
      "reusable component libraries",
    ],
  },
];

// Years coding since Sep 2020 (kept build-safe; computed at render).
const YEARS_CODING = Math.max(0, new Date().getFullYear() - 2022);

/**
 * Section 01 — About + Expertise bento.
 * A README narrative panel, an expertise triad, and a live "currently" module.
 * Server component: all interactive bits (Reveal, Counter, Clock, StatusDot)
 * are client components rendered across the client boundary.
 */
export default function About() {
  return (
    <Section id="about">
      <SectionHeading
        index="01"
        eyebrow="about"
        heading={
          <>
            engineer who cares how{" "}
            <span className="italic">things</span> run in production.
          </>
        }
        description="backend & devops at heart, full-stack by habit. i like systems that are calm, observable, and hard to break."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 lg:grid-cols-3">
        {/* README narrative panel — spans two columns on lg */}
        <Reveal className="lg:col-span-2">
          <Panel title="readme.md" className="h-full" bodyClassName="p-6 sm:p-8">
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                <span className="text-foreground">i&apos;m aashish</span> — a 22yo
                cse grad (sep &apos;20), from uttarakhand, currently in pune. i
                build web products and the infrastructure underneath them.
              </p>
              <p>
                most of my time goes to backend and devops: designing apis,
                wiring up databases, and making deploys uneventful. i contribute
                to open source and read more production post-mortems than i
                probably should.
              </p>
              <p>
                i care about the boring parts — error budgets, reproducible
                builds, the gap between &quot;works on my machine&quot; and
                &quot;works at 3am&quot;. confident through restraint, monochrome
                by choice.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge>typescript</Badge>
              <Badge>node.js</Badge>
              <Badge>python</Badge>
              <Badge>postgres</Badge>
              <Badge>docker</Badge>
              <Badge>aws</Badge>
            </div>
          </Panel>
        </Reveal>

        {/* Live "currently" module + uptime stats */}
        <Reveal delay={0.08} className="lg:col-span-1">
          <Panel
            title="currently"
            status
            action={<Clock />}
            className="h-full"
            bodyClassName="p-6"
          >
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  role
                </p>
                <p className="text-base text-foreground">backend developer</p>
                <p className="text-sm text-muted-foreground">pune, in</p>
              </div>

              <div className="space-y-1">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  learning
                </p>
                <p className="text-base text-foreground">
                  ai — langchain, langgraph, mcp tools
                </p>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
                <div className="bg-surface p-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    uptime
                  </dt>
                  <dd className="mt-1 font-serif text-3xl text-foreground tabular-nums">
                    <Counter value={YEARS_CODING} suffix=" yrs" />
                  </dd>
                </div>
                <div className="bg-surface p-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    status
                  </dt>
                  <dd className="mt-1 flex items-center gap-2 text-foreground">
                    <StatusDot size="sm" label="operational" />
                    <span className="font-mono text-sm">operational</span>
                  </dd>
                </div>
              </dl>
            </div>
          </Panel>
        </Reveal>
      </div>

      {/* Expertise triad */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {EXPERTISE.map(({ index, title, icon: Icon, blurb, capabilities }, i) => (
          <Reveal key={title} delay={0.08 * i}>
            <Card className="flex h-full flex-col">
              <div className="flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground"
                  aria-hidden
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground tabular-nums">
                  {index}
                </span>
              </div>

              <h3 className="mt-6 font-serif text-2xl text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {blurb}
              </p>

              <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
                {capabilities.map((cap) => (
                  <li key={cap} className="flex items-start gap-2.5">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground"
                      aria-hidden
                    />
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
