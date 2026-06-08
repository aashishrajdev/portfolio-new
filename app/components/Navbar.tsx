"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { usePreloader } from "../context/PreloaderContext";
import { useView, type View } from "../context/ViewContext";

const navItems: { name: string; view: View; key: string; code: string }[] = [
  { name: "Home", view: "home", key: "H", code: "KeyH" },
  { name: "About", view: "about", key: "A", code: "KeyA" },
  { name: "Works", view: "works", key: "W", code: "KeyW" },
  { name: "Projects", view: "projects", key: "P", code: "KeyP" },
  { name: "Contact", view: "contact", key: "C", code: "KeyC" },
];

export default function Navbar() {
  const { navbarLoaded, setNavbarLoaded } = usePreloader();
  const { view, navigate } = useView();

  useEffect(() => {
    if (!navbarLoaded) {
      const timer = setTimeout(() => {
        setNavbarLoaded(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [navbarLoaded, setNavbarLoaded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      const item = navItems.find((nav) => nav.code === e.code);
      if (item) {
        navigate(item.view);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  return (
    <motion.nav
      initial={navbarLoaded ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="fixed top-[clamp(1rem,2vw,2rem)] left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      <div className="flex items-center gap-[clamp(1rem,1.5vw,2rem)] pointer-events-auto">
        {navItems.map((item) => {
          const isActive = view === item.view;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => navigate(item.view)}
              className={`group flex items-baseline gap-1 relative fluid-fs-copy-sm font-light transition-colors duration-300 ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground"
              }`}
            >
              <span className="font-serif tracking-wide fluid-fs-copy-sm">
                {item.name}
              </span>
              <span className="fluid-fs-copy-xs font-mono opacity-50 border border-foreground/20 rounded px-1 group-hover:border-foreground/50 transition-colors">
                {item.key}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}
