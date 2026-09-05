"use client";

import { useState, type FormEvent } from "react";
import {
  FiArrowRight,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiMapPin,
} from "react-icons/fi";
import { FaXTwitter, FaMedium } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Panel } from "@/components/ui/panel";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Real content                                                              */
/* -------------------------------------------------------------------------- */

const CONTACT_EMAIL = "rajaashish.dev@gmail.com";

interface ContactDetail {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  external?: boolean;
}

const contactDetails: ContactDetail[] = [
  {
    label: "email",
    value: "rajaashish.dev@gmail.com",
    href: `mailto:${CONTACT_EMAIL}`,
    icon: FiMail,
  },
  {
    label: "location",
    value: "Pune, IN",
    href: "#",
    icon: FiMapPin,
  },
];

interface Social {
  label: string;
  value: string;
  href: string;
  icon: IconType;
}

const socials: Social[] = [
  {
    label: "github",
    value: "aashishrajdev",
    href: "https://github.com/aashishrajdev",
    icon: FiGithub,
  },
  {
    label: "linkedin",
    value: "aashishraj-dev",
    href: "https://www.linkedin.com/in/aashishraj-dev/",
    icon: FiLinkedin,
  },
  {
    label: "x",
    value: "@aashishrajdev",
    href: "#",
    icon: FaXTwitter,
  },
  {
    label: "medium",
    value: "@aashishrajdev",
    href: "https://medium.com/@aashishrajdev",
    icon: FaMedium,
  },
  {
    label: "résumé",
    value: "aashishrajdev/Resume",
    href: "https://github.com/aashishrajdev/Resume",
    icon: FiGlobe,
  },
];

/* -------------------------------------------------------------------------- */
/*  Field primitive (local)                                                   */
/* -------------------------------------------------------------------------- */

const fieldLabel =
  "font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground";

const fieldBase = cn(
  "w-full rounded-md border border-border bg-surface-2 px-3.5 py-2.5",
  "text-sm text-foreground caret-signal placeholder:text-muted-foreground/60",
  "transition-colors duration-200",
  // Focus reads from the brightened border + signal caret; the global
  // :focus-visible signal ring is suppressed here, like the Find input.
  "focus:outline-none focus:border-foreground/30 focus-visible:[box-shadow:none]",
);

/* -------------------------------------------------------------------------- */
/*  Section                                                                   */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const reduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent) return;

    const subject = `ping: ${name.trim() || "request"} via portfolio`;
    const body = `name: ${name}\nemail: ${email}\n\n${message}`;
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    if (typeof window !== "undefined") {
      window.location.href = mailto;
    }

    setSent(true);
    toast.success("200 OK, request composed", {
      description: "your mail client is opening the draft.",
    });
  }

  return (
    <Section id="contact">
      <SectionHeading
        index="05"
        eyebrow="ping"
        heading="open a connection"
        description="have a role, a system worth building, or a problem worth solving? send a request. i read every one and respond fast."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 lg:grid-cols-5">
        {/* Request form */}
        <Reveal className="lg:col-span-3">
          <Panel
            title="send a request"
            action={
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden>POST</span>
                <span className="text-foreground">/contact</span>
              </span>
            }
            bodyClassName="p-5 sm:p-6"
            className="h-full"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className={fieldLabel}>
                    name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="aashish raj"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={fieldBase}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className={fieldLabel}>
                    email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={fieldBase}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className={fieldLabel}>
                  message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={6}
                  placeholder="tell me what you're building…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={cn(fieldBase, "resize-none")}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <SubmitButton sent={sent} reduceMotion={reduceMotion} />

                <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <StatusDot size="sm" pulse={!sent} label="endpoint status" />
                  {sent ? "request sent" : "awaiting input"}
                </span>
              </div>
            </form>
          </Panel>
        </Reveal>

        {/* Endpoints / details */}
        <Reveal delay={0.1} className="lg:col-span-2">
          <Panel
            title="endpoints"
            status
            bodyClassName="p-5 sm:p-6"
            className="flex h-full flex-col"
          >
            <ul className="flex flex-col divide-y divide-border">
              {contactDetails.map((detail) => {
                const Icon = detail.icon;
                return (
                  <li key={detail.label}>
                    <a
                      href={detail.href}
                      className="group flex items-center gap-3.5 py-3 transition-colors duration-200"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 text-muted-foreground transition-colors duration-200 group-hover:border-foreground/20 group-hover:text-foreground">
                        <Icon aria-hidden className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col">
                        <span className={fieldLabel}>{detail.label}</span>
                        <span className="text-sm text-foreground">
                          {detail.value}
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <span className={fieldLabel}>elsewhere</span>
              <ul className="flex flex-col gap-1">
                {socials.map((social) => {
                  const Icon = social.icon;
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="group flex items-center justify-between gap-3 rounded-md px-2 py-2 transition-colors duration-200 hover:bg-surface-2"
                      >
                        <span className="flex items-center gap-3">
                          <Icon
                            aria-hidden
                            className="h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
                          />
                          <span className="font-mono text-xs text-muted-foreground transition-colors duration-200 group-hover:text-foreground">
                            {social.label}
                          </span>
                        </span>
                        <span className="font-mono text-xs text-muted-foreground tabular-nums">
                          {social.value}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Morphing submit button — draws an SVG checkmark on success                */
/* -------------------------------------------------------------------------- */

interface SubmitButtonProps {
  sent: boolean;
  reduceMotion: boolean | null;
}

function SubmitButton({ sent, reduceMotion }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={sent}
      variant={sent ? "signal" : "primary"}
      className="text-sm"
    >
      {sent ? (
        <>
          <CheckDraw reduceMotion={reduceMotion} />
          request sent
        </>
      ) : (
        <>
          Transmit Signal
          <FiArrowRight aria-hidden className="h-4 w-4" />
        </>
      )}
    </Button>
  );
}

function CheckDraw({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="var(--signal)"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.path
        d="M4 12.5 L10 18 L20 6"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }
        }
      />
    </svg>
  );
}
