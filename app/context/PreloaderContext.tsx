"use client";

import React, { createContext, useContext, useState } from "react";

interface PreloaderContextType {
  showPreloader: boolean;
  setShowPreloader: (value: boolean) => void;
  navbarLoaded: boolean;
  setNavbarLoaded: (value: boolean) => void;
}

const PreloaderContext = createContext<PreloaderContextType>({
  showPreloader: true,
  setShowPreloader: () => {},
  navbarLoaded: false,
  setNavbarLoaded: () => {},
});

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [navbarLoaded, setNavbarLoaded] = useState(false);

  return (
    <PreloaderContext.Provider
      value={{
        showPreloader,
        setShowPreloader,
        navbarLoaded,
        setNavbarLoaded,
      }}
    >
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  return useContext(PreloaderContext);
}
