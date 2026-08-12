const notificationService = require("../services/notification.service");

async function getAll(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const notification = await notificationService.markAsRead(id, userId);
    res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (err) {
    next(err);
  }
}

async function markAllAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await notificationService.markAllAsRead(userId);
    res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await notificationService.deleteNotification(id, userId);
    res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  markAsRead,
  markAllAsRead,
  remove,
};
