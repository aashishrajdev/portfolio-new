"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toggleMute, getMuteState } from "../utils/sound";
import { useTheme } from "next-themes";

export default function Controls() {
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    setIsMuted(getMuteState());
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleMute();
    setIsMuted(newState);
  };

  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    // @ts-ignore
    if (!document.startViewTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }

    let x, y;

    // Use pointer coordinates if available (click/touch), otherwise fallback to button center (keyboard)
    if (e.clientX === 0 && e.clientY === 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const isToDark = resolvedTheme !== "dark"; // Current is not dark, so we are going TO dark

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setTheme(isToDark ? "dark" : "light");
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isToDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.645, 0.045, 0.355, 1)",
          pseudoElement: isToDark
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
          fill: "forwards",
        }
      );
    });
  };

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
      {/* Sound Toggle */}
      <motion.button
        onClick={handleSoundToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/80 hover:bg-white/10 transition-colors"
        title={isMuted ? "Unmute Sound" : "Mute Sound"}
      >
        <motion.div
          key={isMuted ? "muted" : "unmuted"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isMuted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-70"
            >
              <path d="M11 5L6 9H2V15H6L11 19V5Z" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      <div className="w-px h-4 bg-white/20" />

      {/* Theme Toggle */}
      <motion.button
        onClick={handleThemeToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/80 hover:bg-white/10 transition-colors"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {isDark ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
