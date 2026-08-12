import { request } from './api';

export const notificationService = {
  /**
   * Retrieves all notifications for the authenticated user.
   */
  async getNotifications() {
    const res = await request('/notifications');
    return res.data;
  },

  /**
   * Marks a single notification as read.
   */
  async markAsRead(id) {
    const res = await request(`/notifications/${id}/read`, { method: 'PATCH' });
    return res.data;
  },

  /**
   * Marks all notifications as read.
   */
  async markAllAsRead() {
    const res = await request('/notifications/read-all', { method: 'PATCH' });
    return res.data;
  },

  /**
   * Deletes a notification.
   */
  async deleteNotification(id) {
    const res = await request(`/notifications/${id}`, { method: 'DELETE' });
    return res.data;
  }
};
