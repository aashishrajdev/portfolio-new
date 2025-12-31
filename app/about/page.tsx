"use client";
import Container from "../components/Container";
import VariableProximity from "../components/VariableProximity";
import ProfileCard from "../components/ProfileCard";
import { useRef, useState } from "react";

export default function About() {
  const containerRef = useRef(null);
  const [isGithubHovered, setIsGithubHovered] = useState(false);

  return (
    <section className="max-h-screen py-32 md:py-40">
      <Container className="max-w-6xl">
        <h1 className="font-serif text-4xl md:text-6xl mb-12 tracking-tight text-center">
          About Me
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          {/* Divider Line (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 border-l border-dotted border-foreground/20 -translate-x-1/2" />

          <div className="flex justify-center md:justify-end">
            <ProfileCard
              name="Aashish Raj"
              title="Software Engineer"
              handle="aashishrajdev"
              status="Online"
              contactText="Contact Me"
              avatarUrl="/self.png"
              showUserInfo={false}
              enableTilt={true}
              enableMobileTilt={true}
              onContactClick={() => console.log("Contact clicked")}
            />
          </div>

          <div className="space-y-12 text-foreground/80 leading-relaxed md:text-lg">
            <div
              className="mb-20 text-center md:text-left"
              ref={containerRef}
              style={{ position: "relative" }}
            >
              <VariableProximity
                label={`22yo CSE grad (Sep '20).`}
                className="font-serif text-foreground/90 tracking-tight text-center md:text-left block text-lg md:text-2xl leading-relaxed cursor-pointer"
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 900"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
              <VariableProximity
                label={` I'm a Web Developer and DevOps engineer focused on building clean interfaces and reliable systems. I actively contribute to open-source projects and care deeply about how products look, feel, and—most importantly—how they work in real-world conditions. You can find more of my work on `}
                className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline text-lg md:text-2xl leading-relaxed cursor-pointer"
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 900"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
                inline
              />
              <a
                href="https://github.com/aashishrajdev"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block relative z-50 align-baseline ${
                  isGithubHovered ? "" : ""
                }`}
                style={{ verticalAlign: "baseline" }}
                onMouseEnter={() => setIsGithubHovered(true)}
                onMouseLeave={() => setIsGithubHovered(false)}
              >
                {/* Hand-drawn Annotation */}
                <div className="hidden md:block absolute top-9 -left-14 z-50 pointer-events-none select-none w-32">
                  <svg
                    width="85"
                    height="50"
                    viewBox="0 0 85 50"
                    fill="none"
                    className="text-foreground/40 mb-0"
                  >
                    <path
                      d="M25 40 Q 45 40, 70 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      markerEnd="url(#arrowhead)"
                    />
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="currentColor"
                        />
                      </marker>
                    </defs>
                  </svg>
                  <span className="font-serif italic text-sm text-foreground/60 -rotate-3 block whitespace-nowrap text-center pr-10">
                    Hover here
                  </span>
                </div>

                <VariableProximity
                  label="GitHub."
                  className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline text-lg md:text-2xl leading-relaxed cursor-pointer underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors"
                  fromFontVariationSettings="'wght' 400"
                  toFontVariationSettings="'wght' 900"
                  containerRef={containerRef}
                  radius={100}
                  falloff="linear"
                  inline
                />
              </a>
            </div>
            <div
              className={`fixed inset-0 bg-white/80 dark:bg-black/80 z-40 transition-opacity duration-100 pointer-events-none ${
                isGithubHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
