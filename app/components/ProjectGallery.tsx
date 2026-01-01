"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/use-media-query";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Syncsy",
    year: "2024",
    description: "Real-time collaboration platform with WebSockets & Prisma.",
    image: "/project/1.png",
    link: "#",
  },
  {
    id: "2",
    title: "UrbanEyes",
    year: "2025",
    description: "Surveillance management system with live feeds & Clerk auth.",
    image: "/project/2.jpg",
    link: "#",
  },
  {
    id: "3",
    title: "Learnod V2",
    year: "2024",
    description: "Interactive learning platform with Monaco code editor.",
    image: "/project/3.jpg",
    link: "#",
  },
  {
    id: "4",
    title: "Spinach UI",
    year: "2025",
    description: "Enterprise component library & accessible design system.",
    image: "/project/4.jpg",
    link: "#",
  },
  {
    id: "5",
    title: "YMoney",
    year: "2024",
    description: "Micro-savings fintech mobile app with React Native.",
    image: "/project/5.jpg",
    link: "#",
  },
  {
    id: "6",
    title: "Police Hackathon",
    year: "2024",
    description: "Crime analytics dashboard (National Finalist).",
    image: "/project/6.jpg",
    link: "#",
  },
  {
    id: "7",
    title: "Web-Vibe",
    year: "2024",
    description: "Award-winning hackathon web solution.",
    image: "/project/7.jpg",
    link: "#",
  },
  {
    id: "8",
    title: "Portfolio V3",
    year: "2026",
    description: "Immersive portfolio with agentic AI integration.",
    image: "/project/10.jpg",
    link: "#",
  },
];

export default function ProjectGallery() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Set initial selected ID once mounted to avoid hydration mismatch
  useEffect(() => {
    setSelectedId(projects[0]?.id ?? null);
  }, []);

  const handleMouseEnter = useCallback(
    (id: string) => {
      if (isDesktop) {
        setHoveredId(id);
        setSelectedId(id);
      }
    },
    [isDesktop]
  );

  const handleMouseLeave = useCallback(() => {
    if (isDesktop) {
      setHoveredId(null);
    }
  }, [isDesktop]);

  const handleClick = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const panelVariants = {
    desktop: (isActive: boolean) => ({
      width: isActive ? "28rem" : "4rem",
      height: "100%",
    }),
    mobile: (isActive: boolean) => ({
      width: "100%",
      height: isActive ? "20rem" : "4rem",
    }),
  };

  return (
    <section className="h-auto lg:h-full w-full overflow-hidden bg-background rounded-3xl">
      <div className="h-auto lg:h-full w-full overflow-hidden">
        {/* Desktop Layout (Applied user structure) */}
        {isDesktop ? (
          <div className="flex h-full w-full flex-col lg:flex-row bg-background text-foreground">
            <div className="mx-auto flex w-full flex-col md:h-full md:flex-row lg:min-w-full overflow-hidden">
              {projects.map((project) => {
                const isActive = selectedId === project.id;

                return (
                  <motion.div
                    key={project.id}
                    className="relative h-full cursor-pointer lg:border-r border-border overflow-hidden"
                    animate={panelVariants.desktop(isActive)}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    onMouseEnter={() => handleMouseEnter(project.id)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(project.id)}
                  >
                    {/* Collapsed Label (Rotated) */}
                    <motion.div
                      className="absolute bottom-0 left-[2vw] flex w-[calc(100vh-2.6vw)] origin-[0_50%] transform justify-between pr-5 text-xl font-medium leading-[2.6vw] tracking-[-0.03em] -rotate-90 text-[2vw] whitespace-nowrap text-muted-foreground/30"
                      animate={{ opacity: isActive ? 0 : 1 }}
                    >
                      <p className="label w-full border-b py-2 md:w-auto md:border-0 md:py-0">
                        {project.title}
                      </p>
                    </motion.div>

                    {/* Expanded Content (Image + Info) */}
                    <motion.div
                      className="h-full w-full rounded-[0.6vw] object-cover pl-2 pr-[1.3vw] pt-[1.3vw] pb-[1.3vw] md:pl-[4vw] relative"
                      animate={{ opacity: isActive ? 1 : 0 }}
                    >
                      <div className="h-full w-full relative rounded-xl overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Gradient Overlay for Text Readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Project Info Overlay */}
                        <div className="absolute bottom-6 left-6 right-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg leading-tight">
                            {project.title}
                          </h2>
                          <div className="space-y-1">
                            <p className="text-white/90 text-sm md:text-base font-medium max-w-md">
                              {project.description}
                            </p>
                            <p className="text-white/70 text-xs md:text-sm font-mono opacity-80">
                              {project.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Mobile Layout (Preserved as requested) */
          <div className="h-auto w-full overflow-hidden">
            <div className="flex h-auto w-full flex-col">
              {projects.map((project, index) => {
                const isActive = selectedId === project.id;
                return (
                  <motion.div
                    key={project.id}
                    className="relative cursor-pointer border-b border-foreground/10 overflow-hidden flex-shrink-0"
                    initial={false}
                    animate={panelVariants.mobile(isActive)}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                    onClick={() => handleClick(project.id)}
                  >
                    <motion.div
                      className="absolute flex items-center gap-4 whitespace-nowrap text-foreground bottom-0 left-4 top-0 translate-y-0 rotate-0"
                      style={{ width: "auto" }}
                      animate={{ opacity: isActive ? 1 : 0.5 }}
                    >
                      <p className="text-lg font-medium tracking-tight">
                        {project.title}
                      </p>
                    </motion.div>

                    <motion.div
                      className="absolute inset-0 px-4 py-4 pb-14"
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                    >
                      <div className="h-full w-full rounded-2xl overflow-hidden relative bg-muted">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-6 left-6 right-6 z-10">
                          <h2 className="text-2xl font-bold text-white mb-2">
                            {project.title}
                          </h2>
                          <p className="text-white/90 text-sm">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
