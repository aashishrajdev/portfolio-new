"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { StatusDot } from "@/components/ui/status-dot";
import { KeyCap } from "@/components/ui/key-cap";
import { Panel } from "@/components/ui/panel";
import { Badge } from "@/components/ui/badge";
import { useUI } from "@/components/providers/lenis-provider";
import { toggleCommandPalette } from "@/components/command-palette";
import { HeroCharacter } from "@/components/hero-character";
import { cn } from "@/lib/utils";
import type {
  ContribDay,
  ContribLevel,
  ContribResponse,
} from "@/app/api/github/route";

/** Oversized display word that blur-reveals char-by-char on load. */
const KINETIC_WORD = "aashish";

/* ---------------------------------------------------------------------------
   Commit signal panel — the hero's right column. Live GitHub contribution
   graph (grayscale) + computed stats (total, active days, best streak) so the
   column reads full without any fabricated numbers.
--------------------------------------------------------------------------- */

const LEVEL_CLASS: Record<ContribLevel, string> = {
  0: "bg-foreground/8",
  1: "bg-foreground/25",
  2: "bg-foreground/45",
  3: "bg-foreground/70",
  4: "bg-foreground",
};

/** Weeks shown in the hero graph — the full trailing year the API returns.
    Columns flex, so 53 of them fit the panel width without scrolling. */
const HERO_WEEKS = 53;

function computeStats(days: ContribDay[]) {
  let best = 0;
  let run = 0;
  let active = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      active += 1;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return { best, active };
}

function HeroCommitSignal() {
  const [data, setData] = React.useState<ContribResponse | null>(null);

  React.useEffect(() => {
    let live = true;
    fetch("/api/github")
      .then((res) => res.json() as Promise<ContribResponse>)
      .then((json) => {
        if (live) setData(json);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  const days = React.useMemo(() => data?.days ?? [], [data]);
  const total = data?.total ?? 0;
  const { best, active } = React.useMemo(() => computeStats(days), [days]);

  // Trailing HERO_WEEKS full weeks.
  const weeks = React.useMemo(() => {
    const cols: ContribDay[][] = [];
    for (let i = 0; i < days.length; i += 7) cols.push(days.slice(i, i + 7));
    return cols.slice(-HERO_WEEKS);
  }, [days]);

  return (
    <div className="frosted flex h-full flex-col rounded-md border border-border p-5">
      {/* Header */}
      <div className="flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <StatusDot size="sm" label="live" />
          commit signal
        </span>
        <span className="inline-flex shrink-0 items-baseline gap-1.5">
          <Counter value={total} className="text-sm text-foreground" />
          <span>last year</span>
        </span>
      </div>

      {/* Graph — trailing 12 months, grayscale */}
      <div className="mt-5 flex gap-[2px]" aria-hidden={days.length === 0}>
        {(weeks.length > 0
          ? weeks
          : Array.from({ length: HERO_WEEKS }, () => [] as ContribDay[])
        ).map((week, w) => (
          <div key={w} className="flex min-w-0 flex-1 flex-col gap-[2px]">
            {Array.from({ length: 7 }).map((_, d) => {
              const day = week[d];
              return (
                <span
                  key={d}
                  title={
                    day
                      ? `${day.count} contribution${day.count === 1 ? "" : "s"} · ${day.date}`
                      : undefined
                  }
                  className={cn(
                    "aspect-square w-full rounded-xs",
                    day ? LEVEL_CLASS[day.level] : "bg-foreground/8",
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/60">
        last 12 months
      </p>

      {/* Computed stats — fills the column with real telemetry */}
      <dl className="mt-auto grid grid-cols-3 gap-px pt-5 overflow-hidden rounded-md border border-border bg-border">
        <div className="frosted px-3 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            active days
          </dt>
          <dd className="mt-1 font-mono text-xl text-foreground tabular-nums">
            <Counter value={active} />
          </dd>
        </div>
        <div className="frosted px-3 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            best streak
          </dt>
          <dd className="mt-1 font-mono text-xl text-foreground tabular-nums">
            <Counter value={best} suffix="d" />
          </dd>
        </div>
        <div className="frosted px-3 py-3.5">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            since
          </dt>
          <dd className="mt-1 font-mono text-xl text-foreground tabular-nums">
            2022
          </dd>
        </div>
      </dl>

      {/* Footer link */}
      <a
        href="https://github.com/aashishrajdev"
        target="_blank"
        rel="noopener noreferrer"
        className="group mt-auto inline-flex items-center gap-2 pt-4 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <FiGithub className="h-3.5 w-3.5" aria-hidden />
        github.com/aashishrajdev
        <FiArrowUpRight
          className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden
        />
      </a>
    </div>
  );
}

export default function Hero() {
  const { scrollToId } = useUI();
  const shouldReduceMotion = useReducedMotion();

  /**
   * Entrance transform for the boot-up reveal. Under prefers-reduced-motion we
   * drop the y-offset entirely so elements fade in place instead of sliding —
   * framer does not auto-strip explicit initial/animate transforms, so we gate
   * them ourselves (matching the Reveal primitive).
   */
  const rise = (y: number) => (shouldReduceMotion ? 0 : y);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.045 },
    },
  };

  const char: Variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: "0.35em", filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <Section id="hero" className="pt-28 pb-14 md:pt-32 md:pb-20">
      <div className="grid grid-cols-1 gap-10 sm:gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-16">
        {/* LEFT — identity + kinetic word + CTAs */}
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: rise(12) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex items-center gap-3"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: rise(12) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.03, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-xl italic text-muted-foreground sm:text-2xl"
          >
            Hi, I&apos;m
          </motion.p>

          {/* Kinetic display word — the page's single h1. The visible text is
              lowercase, so the accessible name carries the full name. */}
          <motion.h1
            variants={container}
            initial="hidden"
            animate="visible"
            aria-label="Aashish Raj"
            className="mt-2 font-serif text-[clamp(2.75rem,14vw,8rem)] italic leading-[0.95] text-foreground"
          >
            <span aria-hidden className="inline-flex flex-wrap">
              {KINETIC_WORD.split("").map((c, i) => (
                <motion.span
                  key={`${c}-${i}`}
                  variants={char}
                  className="inline-block will-change-transform"
                >
                  {c}
                </motion.span>
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: rise(12) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground"
          >
            backend · fullstack · learning ai
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: rise(12) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button onClick={() => scrollToId("projects")} variant="primary">
              View Work
            </Button>
            <Button
              href="https://github.com/aashishrajdev/Resume"
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Résumé
            </Button>
            <Button onClick={() => scrollToId("contact")} variant="outline">
              Contact
            </Button>
          </motion.div>

          {/* ⌘K hint */}
          <motion.button
            type="button"
            onClick={toggleCommandPalette}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-7 inline-flex w-fit items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <span>press</span>
            <KeyCap>Ctrl/⌘ + K</KeyCap>
            <span>to navigate</span>
          </motion.button>
        </div>

        {/* RIGHT — cursor-tracking portrait */}
        <motion.div
          initial={{ opacity: 0, y: rise(18) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="order-first mx-auto w-[min(78%,320px)] lg:order-none lg:mx-0 lg:w-full lg:max-w-[400px] lg:justify-self-end"
        >
          <HeroCharacter />
        </motion.div>
      </div>

      {/* readme.md + commit signal share one stretch row, so the grid gives
          both cards exactly the same height. */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-stretch lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: rise(12) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <Panel
            title="readme.md"
            className="flex h-full flex-col"
            bodyClassName="flex flex-1 flex-col p-5 sm:p-6"
          >
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                <span className="text-foreground">i&apos;m aashish</span>, a
                22yo cse grad (sep &apos;20), from uttarakhand, currently in
                pune. i build web products and the infrastructure underneath
                them.
              </p>
              <p>
                most of my time goes to backend and devops: designing apis,
                wiring up databases, and making deploys uneventful. i
                contribute to open source and read more production
                post-mortems than i probably should.
              </p>
              <p>
                i care about the boring parts: error budgets, reproducible
                builds, the gap between &quot;works on my machine&quot; and
                &quot;works at 3am&quot;. confident through restraint,
                monochrome by choice.
              </p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 pt-6">
              <Badge>typescript</Badge>
              <Badge>node.js</Badge>
              <Badge>python</Badge>
              <Badge>postgres</Badge>
              <Badge>docker</Badge>
              <Badge>aws</Badge>
            </div>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: rise(16) }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-full"
        >
          <HeroCommitSignal />
        </motion.div>
      </div>
    </Section>
  );
}
