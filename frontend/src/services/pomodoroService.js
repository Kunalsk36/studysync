import { request } from './api';

export const pomodoroService = {
  startSession: async (data) => {
    return request('/pomodoro/start', { method: 'POST', body: JSON.stringify(data) });
  },

  endSession: async (data) => {
    return request('/pomodoro/end', { method: 'POST', body: JSON.stringify(data) });
  },

  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/pomodoro/history${query ? `?${query}` : ''}`);
  },
};
