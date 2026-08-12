import { request } from './api';

export const goalService = {
  getGoals: () => request('/goals'),
  getGoalById: (id) => request(`/goals/${id}`),
  createGoal: (data) => request('/goals', { method: 'POST', body: JSON.stringify(data) }),
  updateGoal: (id, data) => request(`/goals/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGoal: (id) => request(`/goals/${id}`, { method: 'DELETE' }),

  getManualEntries: (goalId) => request(`/goals/${goalId}/manual-entries`),
  createManualEntry: (goalId, data) => request(`/goals/${goalId}/manual-entries`, { method: 'POST', body: JSON.stringify(data) }),
  updateManualEntry: (goalId, entryId, data) => request(`/goals/${goalId}/manual-entries/${entryId}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteManualEntry: (goalId, entryId) => request(`/goals/${goalId}/manual-entries/${entryId}`, { method: 'DELETE' }),
};
