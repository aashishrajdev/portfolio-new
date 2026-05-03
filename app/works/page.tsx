"use client";

import companyExperienceData from "../content/company-experience.json";
import freelanceSideHustlesData from "../content/freelance-side-hustles.json";
import Container from "../components/Container";
import { Github, Globe } from "lucide-react";
import { playSound } from "../utils/sound";

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
    <div className="h-full rounded-[2rem] border border-foreground/10 bg-background/80 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-sm p-4 md:p-6 flex flex-col">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between pb-4 border-b border-foreground/10">
        <div className="space-y-1">
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

      <div className="mt-4 space-y-4 flex-1">
        {items.map((item, idx) => (
          <div
            key={`${item.title}-${idx}`}
            className="group cursor-pointer rounded-[1.35rem] border border-transparent px-4 py-4 transition-colors duration-300 hover:border-foreground/10 hover:bg-foreground/3"
            onClick={() => playSound()}
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                <div className="min-w-0 space-y-2 md:max-w-[18rem]">
                  <h3 className="font-serif fluid-fs-compact text-foreground leading-tight text-balance wrap-break-word">
                    {item.title}
                  </h3>
                  <p className="fluid-fs-copy-xs uppercase tracking-[0.22em] text-foreground/45 text-pretty">
                    {item.entity}
                  </p>
                  <span
                    className={`inline-flex w-fit items-center rounded-full border px-3 py-1 fluid-fs-copy-xs uppercase tracking-[0.18em] whitespace-nowrap ${
                      item.isCurrent
                        ? "border-foreground/15 bg-foreground/5 text-foreground/85"
                        : "border-foreground/10 bg-background/60 text-foreground/65"
                    }`}
                  >
                    {item.from && item.to
                      ? `${item.from} — ${item.to}`
                      : item.year}
                  </span>
                </div>

                {showLinks && (item.gitUrl || item.deployUrl) ? (
                  <div className="flex items-center gap-2 md:justify-end md:pt-1">
                    {item.gitUrl && (
                      <a
                        href={item.gitUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-2 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 transition-colors duration-300 hover:bg-foreground hover:text-background"
                        title="View GitHub"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                        <span>Github</span>
                      </a>
                    )}
                    {item.deployUrl && (
                      <a
                        href={item.deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/3 px-3 py-2 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 transition-colors duration-300 hover:bg-foreground hover:text-background"
                        title="View Live Site"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                ) : null}
              </div>

              <p className="min-w-0 fluid-fs-copy-sm text-foreground/60 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed max-w-none text-pretty">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Works() {
  const totalItems = companyExperience.length + freelanceSideHustles.length;
  const currentItems = [...companyExperience, ...freelanceSideHustles].filter(
    (item) => item.isCurrent,
  ).length;
  const pastItems = totalItems - currentItems;

  return (
    <section className="min-h-screen pt-28 pb-(--fluid-page-padding-y) relative overflow-hidden">
      <Container className="fluid-shell relative z-10">
        <header className="mb-8 space-y-4 text-center">
          <h1 className="font-serif fluid-fs-title tracking-tight text-foreground leading-none">
            Works
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="rounded-full border border-foreground/10 bg-background/70 px-4 py-2 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 backdrop-blur-sm">
              {companyExperience.length} Experience entries
            </span>
            <span className="rounded-full border border-foreground/10 bg-background/70 px-4 py-2 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 backdrop-blur-sm">
              {freelanceSideHustles.length} Studio entries
            </span>
            <span className="rounded-full border border-foreground/10 bg-background/70 px-4 py-2 fluid-fs-copy-xs uppercase tracking-[0.18em] text-foreground/55 backdrop-blur-sm">
              {totalItems} Total
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          <WorkSection title="Experience" items={companyExperience} />
          <WorkSection title="Studio" items={freelanceSideHustles} showLinks />
        </div>

        {/* Footer Stats */}
        <div className="mt-8 pt-4 border-t border-foreground/10 flex flex-col gap-2 md:flex-row md:justify-between md:items-center fluid-fs-copy-sm text-foreground/50 font-light">
          <span>{currentItems} Current</span>
          <span>{pastItems} Past</span>
        </div>
      </Container>
    </section>
  );
}
