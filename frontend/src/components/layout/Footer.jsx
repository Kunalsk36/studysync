import Link from "next/link";
import { GraduationCap, Github } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-semibold text-[var(--fg)]">StudySync</span>
            </div>
            <p className="mt-3 text-sm text-[var(--fg-muted)]">
              Your learning, organized in one focused workspace.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-[var(--fg)]">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row">
          <p className="text-xs text-[var(--fg-muted)]">
            © 2026 StudySync. Built by Kunal Shrikant Kavathekar.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--fg-muted)]">
            <span>v1.0.0</span>
            <a
              href="https://github.com/Kunalsk36/studysync"
              className="flex items-center gap-1.5 hover:text-[var(--fg)]"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
