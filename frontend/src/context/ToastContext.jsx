"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-danger" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  info: <Info className="h-5 w-5 text-primary" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  let idCounter = useRef(0);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const showError = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const showWarning = useCallback((msg, dur) => addToast(msg, "warning", dur), [addToast]);
  const showInfo = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showWarning, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="pointer-events-auto bg-[var(--surface)] border border-[var(--border)] shadow-lg rounded-md p-4 flex items-start gap-3"
            >
              <div className="shrink-0">{ICONS[toast.type]}</div>
              <p className="flex-1 text-sm font-medium text-[var(--fg)] pt-0.5">{toast.message}</p>
              <button 
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors p-0.5"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
