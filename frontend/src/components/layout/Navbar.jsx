"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, Bell, ChevronDown, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { CURRENT_USER, NOTIFICATIONS } from "@/constants/mockData";
import { USER_MENU_ITEMS } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";

function initialsOf(name) {
  if (!name) return "SS";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar({ onMenuClick }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;
  const { user, logout } = useAuth();
  // Falls back to mock data only for fields the auth response doesn't carry
  // (e.g. avatar/email display) so the rest of the still-mock-data
  // dashboard isn't affected by this phase.
  const displayName = user?.fullName || CURRENT_USER.name;
  const displayEmail = user?.email || CURRENT_USER.email;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-sm p-2 text-[var(--fg-muted)] hover:bg-[var(--border)]/40 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden flex-1 max-w-sm sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--fg-muted)]" />
        <input
          placeholder="Search tasks, events..."
          className="h-10 w-full rounded-sm border border-[var(--border)] bg-[var(--background)] pl-9 pr-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-muted)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />

        <Link
          href="/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--border)] text-[var(--fg-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--fg)]"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
          )}
        </Link>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-sm border border-[var(--border)] py-1 pl-1 pr-2.5 hover:bg-[var(--border)]/40"
          >
            <Avatar initials={initialsOf(displayName)} size="sm" />
            <ChevronDown className="h-4 w-4 text-[var(--fg-muted)]" />
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 z-20 mt-2 w-56 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 shadow-lg"
                >
                  <div className="px-2.5 py-2">
                    <p className="text-sm font-medium text-[var(--fg)]">{displayName}</p>
                    <p className="text-xs text-[var(--fg-muted)]">{displayEmail}</p>
                  </div>
                  <div className="my-1 h-px bg-[var(--border)]" />
                  {USER_MENU_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-[var(--fg)] hover:bg-[var(--border)]/40"
                    >
                      <item.icon className="h-4 w-4 text-[var(--fg-muted)]" />
                      {item.label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-[var(--border)]" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-left text-sm text-danger hover:bg-danger/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
