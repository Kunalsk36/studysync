"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/layouts/AppShell";
import { useAuth } from "@/context/AuthContext";

export default function AppGroupLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // middleware.js already redirects on missing cookie; this covers the
    // case where a cookie exists but /api/auth/me rejects it (expired/
    // invalid) — belt-and-suspenders per 03-AppFlow.md §25.
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-primary" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
