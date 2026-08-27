import type { BlogPost } from "@/types";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

/**
 * Section 09 — "Writing".
 *
 * Mono-indexed log rows: index · date · reading-time · title with a
 * signal-green underline that draws on hover. Placeholder posts (no live
 * blog yet) — build-safe, content clearly marked as upcoming.
 *
 * Server component: the only motion comes from <Reveal> (a client child) and
 * CSS group-hover, so no client hooks are needed here.
 */

const POSTS: BlogPost[] = [
  {
    title: "building a fastapi mcp server with grpc tools",
    excerpt:
      "wiring an mcp server to query a live backend over grpc/protobuf, and why the model context protocol fits backend tooling.",
    date: "2026-04-12",
    readTime: "8 min read",
    tags: ["python", "fastapi", "grpc"],
    url: "#",
  },
  {
    title: "conflict-free realtime sync with websockets + postgres",
    excerpt:
      "notes from syncsy on keeping concurrent multi-user sessions consistent without locking yourself out of throughput.",
    date: "2025-11-03",
    readTime: "11 min read",
    tags: ["websockets", "postgres", "prisma"],
    url: "#",
  },
  {
    title: "zero-downtime releases on aws amplify ci/cd",
    excerpt:
      "shipping the unigo platform without a maintenance window: the pipeline, the gotchas, and the rollback plan.",
    date: "2025-09-21",
    readTime: "6 min read",
    tags: ["aws", "ci/cd", "devops"],
    url: "#",
  },
];

function formatDate(iso: string): string {
  // Deterministic, locale-stable formatting so SSR === client.
  const [year, month, day] = iso.split("-");
  const months = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const m = months[Number(month) - 1] ?? month;
  return `${year}.${m}.${day}`;
}

export default function Writing() {
  return (
    <Section id="writing">
      <SectionHeading
        index="04"
        eyebrow="writing"
        heading="notes from the log"
        description="occasional write-ups on backend systems, observability, and the messier parts of shipping to production."
      />

      <Reveal as="ul" className="mt-6 border-t border-border md:mt-8">
        {POSTS.map((post, i) => {
          const index = String(i + 1).padStart(2, "0");
          const RowTag = post.url ? "a" : "div";
          return (
            <li key={post.title} className="border-b border-border">
              <RowTag
                {...(post.url
                  ? {
                      href: post.url,
                      "aria-label": post.title,
                    }
                  : {})}
                className={cn(
                  "group block py-7 outline-none sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6",
                  post.url && "cursor-pointer"
                )}
              >
                {/* Left register — index + timestamp, same language as Experience. */}
                <div className="flex items-baseline gap-3 font-mono text-xs tracking-[0.12em] tabular-nums sm:flex-col sm:gap-1.5 sm:pt-1">
                  <span className="text-foreground/40">{index}</span>
                  <span className="uppercase text-muted-foreground">
                    {formatDate(post.date)}
                  </span>
                </div>

                {/* Entry */}
                <div className="mt-3 min-w-0 sm:mt-0">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="min-w-0 text-base leading-snug text-foreground sm:text-lg">
                      <span className="relative">
                        {post.title}
                        <span
                          aria-hidden
                          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
                        />
                      </span>
                    </h3>
                    {post.readTime ? (
                      <span className="hidden shrink-0 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground tabular-nums sm:inline">
                        {post.readTime}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  {post.tags && post.tags.length > 0 ? (
                    <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground/70">
                      {post.tags.join(" · ")}
                    </p>
                  ) : null}
                </div>
              </RowTag>
            </li>
          );
        })}
      </Reveal>

      <Reveal
        as="p"
        delay={0.1}
        className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground"
      >
        more posts soon. follow along on{" "}
        <a
          href="https://github.com/aashishrajdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-signal"
        >
          github
        </a>
        .
      </Reveal>
    </Section>
  );
}
