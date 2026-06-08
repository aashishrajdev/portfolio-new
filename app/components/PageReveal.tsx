"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Keyed on the route → remounts on every navigation, so the enter
  // animation plays each time. Reliable in the App Router (exit anims
  // are flaky there and add a blank gap with mode="wait").
  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
}
