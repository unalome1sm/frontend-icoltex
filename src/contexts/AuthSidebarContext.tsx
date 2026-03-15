"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type AuthMode = "login" | "register";

type AuthSidebarContextValue = {
  isOpen: boolean;
  mode: AuthMode | null;
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
  setMode: (mode: AuthMode) => void;
};

const AuthSidebarContext = createContext<AuthSidebarContextValue | null>(null);

export function AuthSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setModeState] = useState<AuthMode | null>(null);

  const openAuth = useCallback((m: AuthMode) => {
    setModeState(m);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
    setModeState(null);
  }, []);

  const setMode = useCallback((m: AuthMode) => {
    setModeState(m);
  }, []);

  return (
    <AuthSidebarContext.Provider
      value={{ isOpen, mode, openAuth, closeAuth, setMode }}
    >
      {children}
    </AuthSidebarContext.Provider>
  );
}

export function useAuthSidebar() {
  const ctx = useContext(AuthSidebarContext);
  if (!ctx) {
    throw new Error("useAuthSidebar must be used within AuthSidebarProvider");
  }
  return ctx;
}
