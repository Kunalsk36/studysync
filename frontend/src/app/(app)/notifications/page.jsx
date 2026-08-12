"use client";

import { useState, useEffect, useCallback } from "react";
import { BellOff, CheckCheck, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { notificationService } from "@/services/notificationService";
import { useToast } from "@/context/ToastContext";
import { useConfirm } from "@/context/ConfirmContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const toast = useToast();
  const { confirm } = useConfirm();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      setError(err.message || "Failed to load notifications.");
      toast.showError("Unable to connect to the server.");
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      toast.showError(err.message || "Failed to mark notification as read.");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: 1 }))
      );
      toast.showSuccess("All notifications marked as read.");
    } catch (err) {
      toast.showError(err.message || "Failed to mark all as read.");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification?",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      toast.showSuccess("Notification deleted.");
    } catch (err) {
      toast.showError(err.message || "Notification could not be deleted.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-danger/10 p-3 text-danger">
          <AlertCircle className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--fg)]">Failed to load</h2>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{error}</p>
        </div>
        <Button onClick={fetchNotifications}>Retry</Button>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread notifications.`
            : "You're all caught up."
        }
        action={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem 
              key={n.id} 
              notification={n} 
              onMarkRead={handleMarkRead} 
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon={BellOff} title="No notifications yet." />
      )}
    </div>
  );
}
