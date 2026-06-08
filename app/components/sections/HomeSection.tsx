"use client";

import { useRef } from "react";
import Container from "../Container";
import Screen from "../Screen";
import VariableProximity from "../VariableProximity";
import { playSound } from "../../utils/sound";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <Screen contentClassName="items-center justify-center">
      <Container className="flex flex-col items-center justify-center gap-(--fluid-page-gap-md) py-10 text-center">
        {/* greeting */}
        <span className="flex items-center gap-3 font-serif italic fluid-fs-copy-base text-foreground/55">
          <span className="h-px w-6 bg-foreground/25" />
          नमस्ते
          <span className="h-px w-6 bg-foreground/25" />
        </span>

        {/* name */}
        <div ref={heroRef} className="relative">
          <h1 className="font-serif leading-[0.95] tracking-tight">
            <VariableProximity
              label="AASHISH RAJ"
              className="home-name block cursor-default"
              fromFontVariationSettings="'wght' 400"
              toFontVariationSettings="'wght' 800"
              containerRef={heroRef}
              radius={120}
              falloff="gaussian"
            />
          </h1>
        </div>

        {/* role */}
        <p className="font-serif italic fluid-fs-copy-lg text-foreground/55">
          Software Engineer &amp; Full-Stack Developer
        </p>

        <span className="h-px w-10 bg-foreground/20" />

        {/* email */}
        <a
          href="mailto:rajaashish.dev@gmail.com"
          onMouseEnter={() => playSound()}
          className="font-serif tracking-wide fluid-fs-copy-base text-foreground/75 underline decoration-foreground/20 underline-offset-[6px] transition-colors duration-300 hover:text-foreground hover:decoration-foreground/50"
        >
          rajaashish.dev@gmail.com
        </a>

        {/* socials */}
        <div className="flex items-center gap-4 font-serif fluid-fs-copy-base text-foreground/55">
          <a
            href="https://github.com/aashishrajdev/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound()}
            className="transition-colors duration-300 hover:text-foreground"
          >
            GitHub
          </a>
          <span className="text-foreground/25">/</span>
          <a
            href="https://www.linkedin.com/in/aashishraj-dev/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playSound()}
            className="transition-colors duration-300 hover:text-foreground"
          >
            LinkedIn
          </a>
        </div>
      </Container>
    </Screen>
  );
}
