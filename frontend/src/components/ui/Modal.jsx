"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, className = "max-w-lg" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${className} rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl`}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--fg)]">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-sm p-1.5 text-[var(--fg-muted)] hover:bg-[var(--border)]/40 hover:text-[var(--fg)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
