"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, X } from "lucide-react";
import { NAV_ITEMS } from "@/constants/navigation";
import { cn } from "@/utils/cn";

function SidebarContent({ pathname, onNavigate }) {
  return (
    <>
      <Link href="/dashboard" className="flex items-center gap-2 px-6 py-6" onClick={onNavigate}>
        <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white">
          <GraduationCap className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold text-[var(--fg)]">StudySync</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-sm px-3.5 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "text-primary-foreground"
                  : "text-[var(--fg-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--fg)]"
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-sm bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="relative z-10 h-[18px] w-[18px]" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-4 rounded-md bg-primary/10 p-4 text-sm">
        <p className="font-medium text-[var(--fg)]">Daily Goal</p>
        <p className="mt-1 text-[var(--fg-muted)]">2.5h of 4h studied today</p>
      </div>
    </>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
      <SidebarContent pathname={pathname} />
    </aside>
  );
}

export function MobileSidebar({ open, onClose }) {
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[var(--surface)] lg:hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-6 rounded-sm p-1.5 text-[var(--fg-muted)] hover:bg-[var(--border)]/40"
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent pathname={pathname} onNavigate={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
