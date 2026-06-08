"use client";

import { useState } from "react";
import Container from "../Container";
import Screen from "../Screen";
import CrowdCanvas from "../CrowdCanvas";
import { playSound } from "../../utils/sound";

const EMAIL = "rajaashish.dev@gmail.com";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSound();
    const subject = encodeURIComponent(`Portfolio enquiry — ${name || "Hello"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const field =
    "w-full bg-transparent border-b border-foreground/20 py-2 fluid-fs-copy-base text-foreground placeholder:text-foreground/35 outline-none transition-colors focus:border-foreground/60";

  return (
    <Screen heading="Let's Work Together" contentClassName="items-center">
      <Container className="relative z-10 flex w-full flex-1 flex-col items-center justify-center pb-[42vh] md:pb-[44vh]">
        {sent ? (
          <div className="w-full max-w-md text-center font-serif">
            <p className="fluid-fs-copy-lg text-foreground">
              Thanks, {name || "friend"}.
            </p>
            <p className="mt-2 fluid-fs-copy-base text-foreground/55">
              Your mail app should be opening — if not, write to{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="underline decoration-foreground/30 underline-offset-4 hover:text-foreground"
              >
                {EMAIL}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-4 fluid-fs-copy-sm text-foreground/50 underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Send another
            </button>
          </div>
        ) : (
          <>
            <p className="max-w-[40ch] text-center font-serif italic fluid-fs-copy-base text-foreground/55">
              Have a project, a role, or just want to say hi? Drop a line.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-(--fluid-page-gap-md) w-full max-w-md space-y-(--fluid-page-gap-sm) text-left"
            >
              <div className="grid gap-(--fluid-page-gap-sm) sm:grid-cols-2">
                <div>
                  <label className="font-serif fluid-fs-copy-sm text-foreground/50">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className={field}
                  />
                </div>
                <div>
                  <label className="font-serif fluid-fs-copy-sm text-foreground/50">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className={field}
                  />
                </div>
              </div>
              <div>
                <label className="font-serif fluid-fs-copy-sm text-foreground/50">
                  Message
                </label>
                <textarea
                  required
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  className={`${field} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="group inline-flex items-center gap-3 pt-1 font-serif tracking-wide fluid-fs-copy-base text-foreground/80 transition-colors hover:text-foreground"
              >
                <span className="h-px w-8 bg-foreground/40 transition-all duration-300 group-hover:w-12" />
                Send message
              </button>
            </form>
          </>
        )}
      </Container>

      {/* Crowd animation */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-0 h-[42vh] w-full md:h-[44vh]">
        <div className="relative h-full w-full overflow-hidden bg-background transition-colors duration-500">
          <CrowdCanvas className="absolute -bottom-12.5 w-full h-full" />
        </div>
      </div>
    </Screen>
  );
}
