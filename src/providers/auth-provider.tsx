"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { User, Session } from "@/types/user";
import { getSessionAction } from "@/actions/auth.actions";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  refresh: async () => {},
});

export function useAuth(): AuthContextType {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [sessionData, setSessionData] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await getSessionAction();
      setSessionData(session);
    } catch {
      setSessionData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getSessionAction()
      .then((session) => { if (!cancelled) setSessionData(session); })
      .catch(() => { if (!cancelled) setSessionData(null); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({
    user: sessionData?.user ?? null,
    session: sessionData,
    isLoading,
    isAuthenticated: !!sessionData?.user,
    refresh,
  }), [sessionData, isLoading, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
