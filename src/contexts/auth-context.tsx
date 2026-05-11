"use client";

/**
 * Auth state for the client tree.
 *
 * - On mount: calls /me. If 200, populate `user`. If 401, redirect to /login
 *   (unless we're already there).
 * - `setUser` is exposed so the login form can populate the state directly
 *   after a successful login response, avoiding a second /me round-trip.
 * - `logout` calls the API then redirects to /login.
 *
 * Routing is dual-gated:
 *   1. middleware.ts redirects unauthenticated users at the edge based on
 *      cookie presence — fast, no API call.
 *   2. This provider validates the session is actually live by hitting /me;
 *      handles the case where the cookie exists but is revoked/expired.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import { logout as apiLogout, me, type User } from "@/lib/api/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    me()
      .then((u) => {
        if (!cancelled) setUser(u);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 401) {
          if (pathname !== "/login") {
            router.replace("/login");
          }
        }
        // For non-401 errors (server unreachable, etc.) we leave user as null
        // and let the rest of the app's loading states handle it.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Intentionally only run once per mount — pathname changes shouldn't re-fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // Even if the server-side logout fails, we still clear local state and
      // redirect — better to be over-cautious than leave a stale UI session.
    } finally {
      setUser(null);
      router.replace("/login");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
