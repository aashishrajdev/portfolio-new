"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { playSound } from "../utils/sound";

export type View = "home" | "about" | "works" | "projects" | "contact";

interface ViewContextValue {
  view: View;
  navigate: (target: View) => void;
}

const ViewContext = createContext<ViewContextValue>({
  view: "home",
  navigate: () => {},
});

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<View>("home");

  const navigate = useCallback((target: View) => {
    setView((prev) => {
      if (prev === target) return prev;
      playSound();
      return target;
    });
  }, []);

  return (
    <ViewContext.Provider value={{ view, navigate }}>
      {children}
    </ViewContext.Provider>
  );
}

export const useView = () => useContext(ViewContext);
