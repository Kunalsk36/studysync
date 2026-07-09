"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";

const AuthContext = createContext(null);

/**
 * Global auth state, mirroring the existing ThemeContext pattern. The JWT
 * itself lives only in the httpOnly cookie (never read here) — on mount we
 * ask the backend "am I logged in?" via /api/auth/me.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    authService
      .me()
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = (data) => authService.register(data);

  const loginWithGoogle = async (idToken) => {
    const res = await authService.loginWithGoogle(idToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = async () => {
    await authService.logout().catch(() => {});
    setUser(null);
    router.push("/");
  };

  const forgotPassword = (email) => authService.forgotPassword(email);
  const resetPassword = (data) => authService.resetPassword(data);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
