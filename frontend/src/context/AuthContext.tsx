import { createContext, useEffect, useMemo, useState } from "react";
import { authApi } from "../api/authApi";
import { AuthPayload, AuthUser } from "../types";
import { storage } from "../utils/storage";

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (payload: AuthPayload) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const parseStoredUser = (): AuthUser | null => {
  const raw = storage.getUser();
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    storage.clearUser();
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(storage.getToken());
  const [user, setUser] = useState<AuthUser | null>(parseStoredUser);
  const [loading, setLoading] = useState(true);

  const login = (payload: AuthPayload): void => {
    setToken(payload.accessToken);
    setUser(payload.user);
    storage.setToken(payload.accessToken);
    storage.setUser(JSON.stringify(payload.user));
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    storage.clearToken();
    storage.clearUser();
  };

  const refreshProfile = async (): Promise<void> => {
    if (!storage.getToken()) {
      setLoading(false);
      return;
    }
    try {
      const profile = await authApi.me();
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role
      });
      storage.setUser(JSON.stringify(profile));
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshProfile();
  }, []);

  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", onUnauthorized);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      refreshProfile
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
