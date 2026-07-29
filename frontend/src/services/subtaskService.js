import { request } from "./api";

export const subtaskService = {
  getSubtasks: (taskId) => request(`/tasks/${taskId}/subtasks`),
  getSubtaskById: (taskId, id) => request(`/tasks/${taskId}/subtasks/${id}`),
  createSubtask: (taskId, data) => request(`/tasks/${taskId}/subtasks`, { method: "POST", body: JSON.stringify(data) }),
  updateSubtask: (taskId, id, data) => request(`/tasks/${taskId}/subtasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSubtask: (taskId, id) => request(`/tasks/${taskId}/subtasks/${id}`, { method: "DELETE" }),
  toggleComplete: (taskId, id) => request(`/tasks/${taskId}/subtasks/${id}/toggle-complete`, { method: "PATCH" }),
};
