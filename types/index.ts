import type { IconType } from "react-icons";

/**
 * A portfolio project / case study.
 */
export interface Project {
  title: string;
  description: string;
  /** Short tagline shown under the title. */
  tagline?: string;
  /** Tech tags rendered as badges. */
  tech: string[];
  /** Optional links. Use "#" placeholders for now. */
  liveUrl?: string;
  repoUrl?: string;
  /** Optional year / period label. */
  year?: string;
  /** Mark a project as featured (larger treatment). */
  featured?: boolean;
}

/**
 * A role in the experience timeline.
 */
export interface ExperienceItem {
  role: string;
  company: string;
  /** e.g. "2023 — Present". */
  period: string;
  location?: string;
  description: string;
  /** Bullet highlights / achievements. */
  highlights?: string[];
  /** Tech used in this role. */
  tech?: string[];
}

/**
 * An education entry.
 */
export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  description?: string;
}

/**
 * A single skill, optionally with an icon.
 */
export interface Skill {
  name: string;
  /** react-icons component (e.g. SiReact). */
  icon?: IconType;
}

/**
 * A named group of skills (e.g. "Backend", "Frontend").
 */
export interface SkillGroup {
  title: string;
  skills: Skill[];
}

/**
 * A professional certification.
 */
export interface Certification {
  title: string;
  issuer: string;
  /** e.g. "2025". */
  date: string;
  credentialUrl?: string;
}

/**
 * A notable achievement / award.
 */
export interface Achievement {
  title: string;
  description?: string;
  date?: string;
}

/**
 * A testimonial / recommendation.
 */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

/**
 * A blog post / writing entry.
 */
export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  /** Estimated read time, e.g. "5 min read". */
  readTime?: string;
  url?: string;
  tags?: string[];
}

/**
 * An area of expertise (icon + title + blurb).
 */
export interface ExpertiseItem {
  title: string;
  description: string;
  icon?: IconType;
}

/**
 * A social / contact link.
 */
export interface SocialLink {
  label: string;
  href: string;
  icon: IconType;
}

/**
 * An open-source repository / contribution card.
 */
export interface RepoCard {
  /** Repo name, e.g. "aashishrajdev/syncsy". */
  name: string;
  description: string;
  url: string;
  /** Primary language label (rendered mono, monochrome). */
  language?: string;
  stars?: number;
  forks?: number;
  /** PR / contribution status glyph, e.g. "merged" | "open" | "draft". */
  prStatus?: "merged" | "open" | "draft" | "closed";
}
