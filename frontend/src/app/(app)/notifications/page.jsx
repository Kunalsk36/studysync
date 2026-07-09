"use client";

import { useState } from "react";
import { BellOff, CheckCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { NOTIFICATIONS } from "@/constants/mockData";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread notifications.` : "You're all caught up."}
        action={
          unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onMarkRead={markRead} />
          ))}
        </div>
      ) : (
        <EmptyState icon={BellOff} title="No notifications." />
      )}
    </div>
  );
}
