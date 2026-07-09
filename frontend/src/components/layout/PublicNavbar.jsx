"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-semibold text-[var(--fg)]">StudySync</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[var(--fg-muted)] transition-colors hover:text-[var(--fg)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button href="/login" variant="ghost" size="sm">
            Login
          </Button>
          <Button href="/register" size="sm">
            Get Started
          </Button>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="ml-auto rounded-sm p-2 text-[var(--fg)] md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--border)] md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-3 py-2.5 text-sm font-medium text-[var(--fg)] hover:bg-[var(--border)]/40"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <Button href="/login" variant="secondary" size="sm" className="flex-1">
                  Login
                </Button>
                <Button href="/register" size="sm" className="flex-1">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
