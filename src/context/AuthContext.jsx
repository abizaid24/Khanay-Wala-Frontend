import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfile, loginUser, registerUser } from "../lib/services/authService";
import { tokenStorage } from "../lib/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "loading" = still checking for an existing session on first load.
  const [status, setStatus] = useState("loading");

  const loadProfile = useCallback(async () => {
    try {
      const profile = await fetchProfile();
      setUser(profile);
      setStatus("authenticated");
    } catch {
      tokenStorage.clear();
      setUser(null);
      setStatus("guest");
    }
  }, []);

  useEffect(() => {
    if (tokenStorage.getAccessToken()) {
      loadProfile();
    } else {
      setStatus("guest");
    }
  }, [loadProfile]);

  // If a token refresh fails anywhere in the app, drop back to guest.
  useEffect(() => {
    const onExpire = () => {
      setUser(null);
      setStatus("guest");
    };
    window.addEventListener("khanaywala:session-expired", onExpire);
    return () => window.removeEventListener("khanaywala:session-expired", onExpire);
  }, []);

  const login = useCallback(async (credentials) => {
    const tokens = await loginUser(credentials);
    tokenStorage.setTokens(tokens);
    const profile = await fetchProfile();
    setUser(profile);
    setStatus("authenticated");
    return profile;
  }, []);

  const register = useCallback(async (payload) => {
    return registerUser(payload);
  }, []);

  const logout = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: status === "authenticated",
      isLoading: status === "loading",
      login,
      register,
      logout,
      refreshProfile: loadProfile,
    }),
    [user, status, login, register, logout, loadProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
