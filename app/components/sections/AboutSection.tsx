"use client";
import Container from "../Container";
import Screen from "../Screen";
import VariableProximity from "../VariableProximity";
import ProfileCard from "../ProfileCard";
import LogoLoop from "../LogoLoop";
import { useRef, useState } from "react";
import { useView } from "../../context/ViewContext";
import { playSound } from "../../utils/sound";
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiTailwindcss,
  SiStyledcomponents,
  SiFramer,
  SiGit,
  SiDocker,
  SiJenkins,
  SiAmazonwebservices,
  SiGooglecloud,
  SiTerraform,
  SiRedis,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiFirebase,
  SiVercel,
  SiLeaflet,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { VscTerminalBash, VscAzure } from "react-icons/vsc";

const techLogos = [
  // Languages
  {
    node: <SiJavascript />,
    title: "JavaScript",
    href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  {
    node: <SiTypescript />,
    title: "TypeScript",
    href: "https://www.typescriptlang.org",
  },
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiCplusplus />, title: "C++", href: "https://isocpp.org" },
  { node: <FaJava />, title: "Java", href: "https://www.java.com" },
  {
    node: <SiHtml5 />,
    title: "HTML",
    href: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },
  {
    node: <SiCss3 />,
    title: "CSS",
    href: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },
  {
    node: <VscTerminalBash />,
    title: "Shell/Bash",
    href: "https://www.gnu.org/software/bash",
  },
  // Frameworks
  { node: <SiReact />, title: "React.js", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress />, title: "Express.js", href: "https://expressjs.com" },
  {
    node: <SiTailwindcss />,
    title: "TailwindCSS",
    href: "https://tailwindcss.com",
  },
  {
    node: <SiStyledcomponents />,
    title: "Styled-Components",
    href: "https://styled-components.com",
  },
  {
    node: <SiFramer />,
    title: "Framer Motion",
    href: "https://www.framer.com/motion",
  },
  // Tools & Platforms
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiJenkins />, title: "Jenkins", href: "https://www.jenkins.io" },
  {
    node: <SiAmazonwebservices />,
    title: "AWS",
    href: "https://aws.amazon.com",
  },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  {
    node: <SiPostgresql />,
    title: "PostgreSQL",
    href: "https://www.postgresql.org",
  },
  { node: <SiPrisma />, title: "Prisma", href: "https://www.prisma.io" },
  {
    node: <SiFirebase />,
    title: "Firebase",
    href: "https://firebase.google.com",
  },
  { node: <SiVercel />, title: "Vercel", href: "https://vercel.com" },
  { node: <SiLeaflet />, title: "Leaflet.js", href: "https://leafletjs.com" },
  {
    node: <SiGooglecloud />,
    title: "Google Cloud",
    href: "https://cloud.google.com",
  },
  {
    node: <VscAzure />,
    title: "Azure",
    href: "https://azure.microsoft.com",
  },
  {
    node: <SiTerraform />,
    title: "Terraform",
    href: "https://www.terraform.io",
  },
  { node: <SiRedis />, title: "Redis", href: "https://redis.io" },
];

export default function About() {
  const containerRef = useRef(null);
  const [isGithubHovered, setIsGithubHovered] = useState(false);
  const [isResumeHovered, setIsResumeHovered] = useState(false);
  const { navigate } = useView();

  return (
    <Screen heading="About Me" contentClassName="justify-center">
      {/* Desktop: Diagonal single line LogoLoop across screen */}
      <div className="hidden md:block fixed inset-0 pointer-events-auto z-0 overflow-hidden">
        <div
          className="absolute text-foreground opacity-15 hover:opacity-30 transition-opacity duration-300"
          style={{
            width: "200vw",
            left: "-50%",
            top: "110%",
            transform: "rotate(-30deg) translateY(110%)",
            transformOrigin: "center center",
          }}
        >
          <LogoLoop
            logos={[
              ...techLogos,
              ...techLogos,
              ...techLogos,
              ...techLogos,
              ...techLogos,
            ]}
            speed={80}
            direction="left"
            logoHeight={32}
            gap={56}
            scaleOnHover
          />
        </div>
      </div>

      <Container className="fluid-shell relative z-10 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-(--fluid-page-gap-lg) items-center relative">
          {/* Divider Line (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 border-l border-dotted border-foreground/20 -translate-x-1/2" />

          <div className="flex justify-center md:justify-end">
            <ProfileCard
              name="Aashish Raj"
              title="Software Engineer"
              handle="aashishrajdev"
              status="Building ZeroAxiis"
              contactText="Contact Me"
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={true}
              onContactClick={() => {
                navigate("contact");
              }}
            />
          </div>

          {/* Mobile: Horizontal LogoLoop between card and text */}
          <div className="md:hidden w-[200vw] overflow-hidden py-(--fluid-page-gap-sm) text-foreground opacity-30 relative left-1/2 -translate-x-1/2">
            <LogoLoop
              logos={[...techLogos, ...techLogos, ...techLogos]}
              speed={100}
              direction="left"
              logoHeight={20}
              gap={32}
              fadeOut
            />
          </div>

          <div className="space-y-(--fluid-page-gap-lg) text-foreground/80 leading-relaxed fluid-fs-copy-base">
            <div
              className="mb-(--fluid-page-gap-lg) text-center md:text-left"
              ref={containerRef}
              style={{ position: "relative" }}
            >
              <VariableProximity
                label={`22yo CSE grad (Sep '20).`}
                className="font-serif text-foreground/90 tracking-tight text-center md:text-left block fluid-fs-copy-base leading-relaxed cursor-pointer"
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 900"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
              />
              <VariableProximity
                label={` I'm a Web Developer and DevOps engineer focused on building clean interfaces and reliable systems. I actively contribute to open-source projects and care deeply about how products look, feel, and—most importantly—how they work in real-world conditions. You can find more of my work on `}
                className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline fluid-fs-copy-base leading-relaxed cursor-pointer"
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
                onMouseEnter={() => {
                  setIsGithubHovered(true);
                  playSound();
                }}
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
                  label="[GitHub.]"
                  className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline fluid-fs-copy-base leading-relaxed cursor-pointer underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors"
                  fromFontVariationSettings="'wght' 400"
                  toFontVariationSettings="'wght' 900"
                  containerRef={containerRef}
                  radius={100}
                  falloff="linear"
                  inline
                />
              </a>
              <VariableProximity
                label=" or you can have my "
                className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline fluid-fs-copy-base leading-relaxed cursor-pointer"
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 900"
                containerRef={containerRef}
                radius={100}
                falloff="linear"
                inline
              />
              <a
                href="https://github.com/aashishrajdev/Resume"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-block relative z-50 align-baseline ${
                  isResumeHovered ? "" : ""
                }`}
                style={{ verticalAlign: "baseline" }}
                onMouseEnter={() => {
                  setIsResumeHovered(true);
                  playSound();
                }}
                onMouseLeave={() => setIsResumeHovered(false)}
              >
                {/* Hand-drawn Annotation */}
                <div className="hidden md:block absolute top-9 -right-14 z-50 pointer-events-none select-none w-32">
                  <svg
                    width="85"
                    height="50"
                    viewBox="0 0 85 50"
                    fill="none"
                    className="text-foreground/40 mb-0"
                    style={{ transform: "scaleX(-1)" }}
                  >
                    <path
                      d="M25 40 Q 45 40, 70 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      markerEnd="url(#arrowhead-resume)"
                    />
                    <defs>
                      <marker
                        id="arrowhead-resume"
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
                  <span className="font-serif italic text-sm text-foreground/60 rotate-3 block whitespace-nowrap text-center pl-10">
                    Download
                  </span>
                </div>

                <VariableProximity
                  label="[resume.]"
                  className="font-serif text-foreground/90 tracking-tight text-center md:text-left inline fluid-fs-copy-base leading-relaxed cursor-pointer underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors"
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
                isGithubHovered || isResumeHovered ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      </Container>
    </Screen>
  );
}
