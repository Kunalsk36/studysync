"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";

/**
 * Shared authenticated-app layout (Sidebar + Navbar + content well).
 * Matches 03-AppFlow.md §9 Global Navigation Components.
 */
export function AppShell({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[var(--background)]">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
