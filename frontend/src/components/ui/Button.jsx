"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

const VARIANTS = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20",
  secondary:
    "bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--border)]/40",
  ghost: "text-[var(--fg)] hover:bg-[var(--border)]/40",
  danger: "bg-danger text-white hover:bg-danger/90",
  outline: "border border-primary text-primary hover:bg-primary/10 bg-transparent",
};

const SIZES = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10 p-0",
};

/**
 * Renders a <Link> when `href` is provided, otherwise a <button>.
 * Covers every CTA style needed across the prototype (06-DesignSystem.md §12).
 */
export function Button({
  href,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    VARIANTS[variant],
    SIZES[size],
    className
  );

  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </>
  );

  if (href) {
    return (
      <motion.span whileTap={{ scale: 0.97 }} className="inline-block">
        <Link href={href} className={classes} {...props}>
          {content}
        </Link>
      </motion.span>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {content}
    </motion.button>
  );
}
