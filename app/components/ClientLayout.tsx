"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Preloader from "./preloader";
import PageReveal from "./PageReveal";
import { PreloaderProvider, usePreloader } from "../context/PreloaderContext";
import Navbar from "./Navbar";
import Controls from "./Controls";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { showPreloader, setShowPreloader } = usePreloader();
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    // If not on home, ensure preloader state is off immediately
    if (!isHome && showPreloader) {
      setShowPreloader(false);
    }
  }, [isHome, showPreloader, setShowPreloader]);

  useEffect(() => {
    // Only lock scroll if preloader is showing AND we are on home
    if (showPreloader && isHome) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showPreloader, isHome]);

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && isHome && (
          <Preloader onFinish={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>
      <Navbar />
      <Controls />
      <PageReveal>{children}</PageReveal>
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PreloaderProvider>
      <InnerLayout>{children}</InnerLayout>
    </PreloaderProvider>
  );
}
