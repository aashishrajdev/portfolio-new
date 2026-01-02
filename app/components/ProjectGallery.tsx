"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "../hooks/use-media-query";
import Image from "next/image";
import { Github, Globe } from "lucide-react";

interface Project {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;

  gitUrl?: string;
  deployUrl?: string;
}

const projects: Project[] = [
  {
    id: "1",
    title: "Syncsy",
    year: "2024",
    description: "Real-time collaboration platform with WebSockets & Prisma.",
    image: "/project/1.png",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "2",
    title: "UrbanEyes",
    year: "2025",
    description: "Surveillance management system with live feeds & Clerk auth.",
    image: "/project/2.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "3",
    title: "Learnod V2",
    year: "2024",
    description: "Interactive learning platform with Monaco code editor.",
    image: "/project/3.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "4",
    title: "Spinach UI",
    year: "2025",
    description: "Enterprise component library & accessible design system.",
    image: "/project/4.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "5",
    title: "YMoney",
    year: "2024",
    description: "Micro-savings fintech mobile app with React Native.",
    image: "/project/5.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "6",
    title: "Police Hackathon",
    year: "2024",
    description: "Crime analytics dashboard (National Finalist).",
    image: "/project/6.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "7",
    title: "Web-Vibe",
    year: "2024",
    description: "Award-winning hackathon web solution.",
    image: "/project/7.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
  },
  {
    id: "8",
    title: "Portfolio V3",
    year: "2026",
    description: "Immersive portfolio with agentic AI integration.",
    image: "/project/10.jpg",
    gitUrl: "https://github.com/aashishrajdev/syncsy/",
    deployUrl: "https://syncsy.aashish.live",
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
      width: isActive ? "52.5vh" : "6rem",
      height: "100%",
    }),
    mobile: (isActive: boolean) => ({
      width: "100%",
      height: isActive ? "30rem" : "4rem",
    }),
  };

  return (
    <section className="h-auto lg:h-[70vh] w-full overflow-hidden bg-background rounded-3xl">
      <div className="h-auto lg:h-full w-full overflow-hidden">
        {/* Desktop Layout (Applied user structure) */}
        {isDesktop ? (
          <div className="flex h-full w-full flex-col lg:flex-row bg-background text-foreground overflow-x-auto no-scrollbar">
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
                      className={`absolute bottom-0 left-[2vw] flex w-[68vh] origin-[0_50%] transform justify-between pr-5 text-xl font-medium leading-[2.6vw] tracking-[-0.03em] -rotate-90 text-[2vw] whitespace-nowrap ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground/30"
                      }`}
                      animate={{ opacity: 1 }}
                    >
                      <p className="label w-full border-b py-2 md:w-auto md:border-0 md:py-0">
                        {project.title}
                      </p>
                      {isActive && <p>{project.year}</p>}
                    </motion.div>

                    {/* Expanded Content (Image + Info) */}
                    <motion.div
                      className="h-full w-full rounded-[0.6vw] object-cover p-4 md:pl-16 relative"
                      animate={{ opacity: isActive ? 1 : 0 }}
                    >
                      <div className="h-full w-full relative rounded-xl overflow-hidden group">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {/* Clean Image - No Text Overlay */}

                        {/* Hover Overlay: Description */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-8 pb-24 pointer-events-none">
                          <div className="text-white overflow-hidden">
                            {isActive && (
                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.4 }} //transition delay is added to make the description appear after the image
                                className="text-gray-200 text-lg mb-2 font-medium leading-relaxed max-w-md"
                              >
                                {project.description}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons - Bottom Right */}
                        <div className="absolute bottom-6 right-6 flex gap-3 z-30 pointer-events-auto">
                          {project.gitUrl && (
                            <a
                              href={project.gitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110"
                              title="View Code"
                              onClick={(e) => e.stopPropagation()} // Prevent clicking the card
                            >
                              <Github className="w-5 h-5" />
                            </a>
                          )}
                          {project.deployUrl && (
                            <a
                              href={project.deployUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-110"
                              title="View Live Project"
                              onClick={(e) => e.stopPropagation()} // Prevent clicking the card
                            >
                              <Globe className="w-5 h-5" />
                            </a>
                          )}
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
                    className="relative cursor-pointer border-b border-border overflow-hidden flex-shrink-0"
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
                      className="absolute flex items-center gap-4 whitespace-nowrap text-foreground bottom-0 left-4 top-0 translate-y-0 rotate-0 z-20"
                      style={{ width: "auto" }}
                      animate={{ opacity: isActive ? 0 : 1 }}
                    >
                      <p className="text-lg font-medium tracking-tight">
                        {project.title}
                      </p>
                    </motion.div>

                    <motion.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{ opacity: isActive ? 1 : 0 }}
                    >
                      <div className="h-full w-full relative overflow-hidden bg-background">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="100vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Description Overlay */}
                        <div className="absolute inset-0 flex items-end p-6 pb-20 pointer-events-none">
                          <div className="text-white overflow-hidden">
                            <h3 className="text-2xl font-bold mb-2">
                              {project.title}{" "}
                              <span className="text-lg font-normal opacity-70 ml-2">
                                {project.year}
                              </span>
                            </h3>
                            {isActive && (
                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-gray-200 text-sm font-medium leading-relaxed"
                              >
                                {project.description}
                              </motion.p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex gap-3 z-30 pointer-events-auto">
                          {project.gitUrl && (
                            <a
                              href={project.gitUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Github className="w-4 h-4" />
                            </a>
                          )}
                          {project.deployUrl && (
                            <a
                              href={project.deployUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white hover:text-black transition-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
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
