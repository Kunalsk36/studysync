import { request } from './api';

export const notificationService = {
  /**
   * Retrieves all notifications for the authenticated user.
   */
  async getNotifications() {
    return request('/notifications');
  },

  /**
   * Marks a single notification as read.
   */
  async markAsRead(id) {
    return request(`/notifications/${id}/read`, { method: 'PATCH' });
  },

  /**
   * Marks all notifications as read.
   */
  async markAllAsRead() {
    return request('/notifications/read-all', { method: 'PATCH' });
  },

  /**
   * Deletes a notification.
   */
  async deleteNotification(id) {
    return request(`/notifications/${id}`, { method: 'DELETE' });
  }
};
