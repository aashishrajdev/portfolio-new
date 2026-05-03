"use client";

import Container from "./components/Container";
import { playSound } from "./utils/sound";

export default function Home() {
  return (
    <section className="flex min-h-dvh flex-col items-center justify-center text-foreground selection:bg-white/20 selection:text-white fluid-page-pad-y">
      <Container className="flex flex-col items-center justify-center gap-(--fluid-page-gap-md)">
        <h1 className="font-serif fluid-fs-title leading-[1.05] tracking-tight text-center">
          YO, I&apos;M AASHISH
          <br />
          <span className="text-foreground/60">AND I DO FULL STACK </span>
        </h1>

        <p className="text-foreground/80 fluid-fs-copy-base tracking-wide text-center max-w-[32ch]">
          Software Engineer & Full Stack Developer
        </p>

        <div className="font-serif tracking-widest text-foreground/70 fluid-fs-copy-base flex flex-col items-center gap-(--fluid-page-gap-sm)">
          <a
            href="mailto:rajaashish.dev@gmail.com"
            className="hover:text-foreground transition-colors duration-300"
          >
            <span
              onMouseEnter={() => {
                playSound();
                document.querySelectorAll("h1, p").forEach((el) => {
                  (el as HTMLElement).style.opacity = "0.1";
                  (el as HTMLElement).style.filter = "blur(2px)";
                  (el as HTMLElement).style.transition = "all 0.2s ease";
                });
              }}
              onMouseLeave={() => {
                document.querySelectorAll("h1, p").forEach((el) => {
                  (el as HTMLElement).style.opacity = "1";
                  (el as HTMLElement).style.filter = "blur(0px)";
                  (el as HTMLElement).style.transition = "all 0.2s ease";
                });
              }}
            >
              [rajaashish.dev@gmail.com]
            </span>
          </a>

          <div className="flex flex-col sm:flex-row items-center gap-(--fluid-page-gap-sm) sm:gap-(--fluid-page-gap-md)">
            <a
              href="https://github.com/aashishrajdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span
                onMouseEnter={() => {
                  playSound();
                  document.querySelectorAll("h1, p").forEach((el) => {
                    (el as HTMLElement).style.opacity = "0.1";
                    (el as HTMLElement).style.filter = "blur(2px)";
                    (el as HTMLElement).style.transition = "all 0.2s ease";
                  });
                }}
                onMouseLeave={() => {
                  document.querySelectorAll("h1, p").forEach((el) => {
                    (el as HTMLElement).style.opacity = "1";
                    (el as HTMLElement).style.filter = "blur(0px)";
                    (el as HTMLElement).style.transition = "all 0.2s ease";
                  });
                }}
              >
                [aashishrajdev]
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/aashishraj-dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-300 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
              <span
                onMouseEnter={() => {
                  playSound();
                  document.querySelectorAll("h1, p").forEach((el) => {
                    (el as HTMLElement).style.opacity = "0.1";
                    (el as HTMLElement).style.filter = "blur(2px)";
                    (el as HTMLElement).style.transition = "all 0.2s ease";
                  });
                }}
                onMouseLeave={() => {
                  document.querySelectorAll("h1, p").forEach((el) => {
                    (el as HTMLElement).style.opacity = "1";
                    (el as HTMLElement).style.filter = "blur(0px)";
                    (el as HTMLElement).style.transition = "all 0.2s ease";
                  });
                }}
              >
                [aashishraj-dev]
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
