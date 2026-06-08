"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useView, type View } from "./context/ViewContext";
import HomeSection from "./components/sections/HomeSection";
import AboutSection from "./components/sections/AboutSection";
import WorksSection from "./components/sections/WorksSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import ContactSection from "./components/sections/ContactSection";

const sections: Record<View, React.ComponentType> = {
  home: HomeSection,
  about: AboutSection,
  works: WorksSection,
  projects: ProjectsSection,
  contact: ContactSection,
};

export default function Page() {
  const { view } = useView();
  const Active = sections[view];

  return (
    <div className="relative">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full"
        >
          <Active />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
