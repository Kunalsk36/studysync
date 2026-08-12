const notificationRepository = require("../repositories/notification.repository");

class NotificationError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function getNotifications(userId) {
  const notifications = await notificationRepository.findAllByUserId(userId);
  return notifications;
}

async function markAsRead(id, userId) {
  const notification = await notificationRepository.findById(id, userId);
  if (!notification) {
    throw new NotificationError("Notification not found.", 404);
  }

  const updated = await notificationRepository.markAsRead(id, userId);
  return updated;
}

async function markAllAsRead(userId) {
  const count = await notificationRepository.markAllAsRead(userId);
  return { updatedCount: count };
}

async function deleteNotification(id, userId) {
  const notification = await notificationRepository.findById(id, userId);
  if (!notification) {
    throw new NotificationError("Notification not found.", 404);
  }

  await notificationRepository.remove(id, userId);
  return true;
}

async function createNotification(notificationData) {
  try {
    const notification = await notificationRepository.create(notificationData);
    return notification;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      // Safe idempotency handling: ignore the duplicate insertion.
      return null;
    }
    throw err;
  }
}

module.exports = {
  NotificationError,
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
};
