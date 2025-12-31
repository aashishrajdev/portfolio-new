"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { playSound } from "../utils/sound";
import { usePreloader } from "../context/PreloaderContext";

const navItems = [
  { name: "Home", path: "/", key: "H", code: "KeyH" },
  { name: "About", path: "/about", key: "A", code: "KeyA" },
  { name: "Works", path: "/works", key: "W", code: "KeyW" },
  { name: "Projects", path: "/projects", key: "P", code: "KeyP" },
  { name: "Contact", path: "/contact", key: "C", code: "KeyC" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { navbarLoaded, setNavbarLoaded } = usePreloader();

  useEffect(() => {
    // If not loaded yet, mark as loaded after animation
    if (!navbarLoaded) {
      const timer = setTimeout(() => {
        setNavbarLoaded(true);
      }, 1500); // 0.5s delay + 0.8s duration + buffer
      return () => clearTimeout(timer);
    }
  }, [navbarLoaded, setNavbarLoaded]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inputs are focused
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      const item = navItems.find((nav) => nav.code === e.code);

      if (item) {
        playSound();
        router.push(item.path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <motion.nav
      initial={navbarLoaded ? false : { opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none"
    >
      <div className="flex items-center gap-6 md:gap-8 pointer-events-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`group flex items-baseline gap-1 relative text-sm md:text-base font-light transition-colors duration-300 ${
                isActive
                  ? "text-foreground"
                  : "text-foreground/50 hover:text-foreground"
              }`}
              onMouseEnter={() => playSound()}
            >
              <span className="font-serif tracking-wide">{item.name}</span>
              <span className="text-[10px] font-mono opacity-50 border border-foreground/20 rounded px-1 group-hover:border-foreground/50 transition-colors">
                {item.key}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
