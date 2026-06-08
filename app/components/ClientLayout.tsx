"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Preloader from "./preloader";
import { PreloaderProvider, usePreloader } from "../context/PreloaderContext";
import { ViewProvider } from "../context/ViewContext";
import Navbar from "./Navbar";
import Controls from "./Controls";
import ClickSpark from "./ClickSpark";

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { showPreloader, setShowPreloader } = usePreloader();

  useEffect(() => {
    // Desktop fits one viewport (no scroll); phones/tablets stay scrollable.
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      document.body.style.overflow = mq.matches ? "hidden" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <ViewProvider>
      <ClickSpark sparkSize={10} sparkRadius={20} sparkCount={10} duration={500}>
        <AnimatePresence mode="wait">
          {showPreloader && (
            <Preloader onFinish={() => setShowPreloader(false)} />
          )}
        </AnimatePresence>
        <Navbar />
        <Controls />
        {children}
      </ClickSpark>
    </ViewProvider>
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
