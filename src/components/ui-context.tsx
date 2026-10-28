"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type UiState = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

const UiContext = createContext<UiState | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const value = useMemo(() => ({ menuOpen, setMenuOpen }), [menuOpen]);
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const value = useContext(UiContext);
  if (!value) throw new Error("useUi must be used within UiProvider");
  return value;
}
