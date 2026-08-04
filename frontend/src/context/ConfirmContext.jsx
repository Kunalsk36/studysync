"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) throw new Error("useConfirm must be used within ConfirmProvider");
  return context;
};

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: null,
    onCancel: null,
    isDestructive: false
  });

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title: options.title || "Confirm",
        message: options.message || "Are you sure?",
        confirmText: options.confirmText || "Confirm",
        cancelText: options.cancelText || "Cancel",
        isDestructive: options.isDestructive || false,
        onConfirm: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(true);
        },
        onCancel: () => {
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
          resolve(false);
        }
      });
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {confirmState.isOpen && (
        <Modal 
          open={confirmState.isOpen} 
          onClose={confirmState.onCancel} 
          title={confirmState.title}
        >
          <div className="pt-2 pb-6">
            <p className="text-sm text-[var(--fg)]">{confirmState.message}</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border)]">
            <Button type="button" variant="secondary" onClick={confirmState.onCancel}>
              {confirmState.cancelText}
            </Button>
            <Button 
              type="button" 
              variant={confirmState.isDestructive ? "destructive" : "primary"}
              onClick={confirmState.onConfirm}
              className={confirmState.isDestructive ? "bg-danger hover:bg-danger/90 text-white" : ""}
            >
              {confirmState.confirmText}
            </Button>
          </div>
        </Modal>
      )}
    </ConfirmContext.Provider>
  );
}
