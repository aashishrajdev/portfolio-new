"use client";

import { useRef } from "react";
import companyExperienceData from "../../content/company-experience.json";
import freelanceSideHustlesData from "../../content/freelance-side-hustles.json";
import Container from "../Container";
import Screen from "../Screen";
import { Github, Globe } from "lucide-react";
import { playSound } from "../../utils/sound";

type WorkItem = {
  title: string;
  entity: string;
  description: string;
  year: string;
  isCurrent: boolean;
  from?: string;
  to?: string;
  gitUrl?: string;
  deployUrl?: string;
};

const companyExperience = companyExperienceData as unknown as WorkItem[];
const freelanceSideHustles = freelanceSideHustlesData as unknown as WorkItem[];

/* 2.5D tilt — follows the cursor, gives the row depth on hover */
function TiltCard({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) scale(1.015)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      className={`tilt ${className}`}
    >
      {children}
    </div>
  );
}

function WorkSection({
  title,
  items,
  showLinks = false,
}: {
  title: string;
  items: WorkItem[];
  showLinks?: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-end justify-between pb-3 border-b border-foreground/10">
        <div className="space-y-0.5">
          <h2 className="font-serif fluid-fs-copy-xl tracking-tight text-foreground">
            {title}
          </h2>
          <p className="fluid-fs-copy-xs uppercase tracking-[0.25em] text-foreground/40">
            {items.length} entries
          </p>
        </div>
        <span className="fluid-fs-copy-xs uppercase tracking-wide text-foreground/40">
          Timeline
        </span>
      </div>

      <div className="mt-3 space-y-2 md:space-y-3 pr-1 md:min-h-0 md:flex-1 md:overflow-y-auto">
        {items.map((item, idx) => (
          <TiltCard
            key={`${item.title}-${idx}`}
            onClick={() => playSound()}
            className="group cursor-pointer rounded-2xl border-l-2 border-transparent px-3 py-3 hover:border-foreground/40 hover:bg-foreground/5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-1.5">
                <h3 className="font-serif fluid-fs-compact leading-tight text-foreground text-balance">
                  {item.title}
                </h3>
                <p className="fluid-fs-copy-xs uppercase tracking-[0.22em] text-foreground/45">
                  {item.entity}
                </p>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-0.5 fluid-fs-copy-xs uppercase tracking-[0.18em] whitespace-nowrap ${
                    item.isCurrent
                      ? "bg-foreground/10 text-foreground/85"
                      : "bg-foreground/5 text-foreground/65"
                  }`}
                >
                  {item.from && item.to
                    ? `${item.from} — ${item.to}`
                    : item.year}
                </span>
              </div>

              {showLinks && (item.gitUrl || item.deployUrl) ? (
                <div className="flex shrink-0 items-center gap-2">
                  {item.gitUrl && (
                    <a
                      href={item.gitUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1.5 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 transition-colors duration-300 hover:bg-foreground hover:text-background"
                      title="View GitHub"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {item.deployUrl && (
                    <a
                      href={item.deployUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1.5 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 transition-colors duration-300 hover:bg-foreground hover:text-background"
                      title="View Live Site"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>Live</span>
                    </a>
                  )}
                </div>
              ) : null}
            </div>

            <p className="mt-2 line-clamp-2 fluid-fs-copy-sm leading-relaxed text-foreground/60 transition-colors duration-300 group-hover:text-foreground/80 text-pretty">
              {item.description}
            </p>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

export default function Works() {
  const totalItems = companyExperience.length + freelanceSideHustles.length;

  return (
    <Screen heading="Works">
      <Container className="relative z-10 flex min-h-0 flex-1 flex-col px-1 pb-6">
        <div className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-foreground/5 px-4 py-1.5 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55">
            {companyExperience.length} Experience
          </span>
          <span className="rounded-full bg-foreground/5 px-4 py-1.5 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55">
            {freelanceSideHustles.length} Studio
          </span>
          <span className="rounded-full bg-foreground/5 px-4 py-1.5 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55">
            {totalItems} Total
          </span>
        </div>

        <div className="relative mt-6 grid min-h-0 flex-1 grid-cols-1 gap-8 md:grid-cols-2 md:grid-rows-1 lg:gap-12">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 border-l border-dotted border-foreground/15" />
          <WorkSection title="Experience" items={companyExperience} />
          <WorkSection title="Studio" items={freelanceSideHustles} showLinks />
        </div>
      </Container>
    </Screen>
  );
}
