"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getApiUrl, getAuthHeaders } from "@/lib/api";
import {
  AUTH_CHANGE_EVENT,
  AUTH_TOKEN_KEY,
  logoutSession,
  type SessionUser,
} from "@/lib/auth/session";

type AuthContextValue = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/auth/me"), {
        credentials: "include",
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setUser(null);
        return;
      }

      const data = await res.json();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutSession();
    setUser(null);
  }, []);

  useEffect(() => {
    void refreshSession();

    const handleAuthChange = () => {
      void refreshSession();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, [refreshSession]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      logout,
      refreshSession,
    }),
    [user, loading, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
