const subtaskRepository = require("../repositories/subtask.repository");
const taskService = require("./task.service");

class SubtaskError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function validateParentTask(taskId, userId) {
  // We reuse taskService which already ensures the task exists and belongs to the user
  try {
    await taskService.getTaskById(taskId, userId);
  } catch (err) {
    if (err.statusCode === 404) {
      throw new SubtaskError("Parent task not found or does not belong to user.", 404);
    }
    throw err;
  }
}

async function createSubtask(userId, taskId, subtaskData) {
  await validateParentTask(taskId, userId);
  
  if (subtaskData.isCompleted) {
    subtaskData.completedAt = subtaskData.completedAt || new Date().toISOString().slice(0, 19).replace("T", " ");
  }

  const subtask = await subtaskRepository.create({ taskId, ...subtaskData });
  return subtask;
}

async function getSubtasks(userId, taskId) {
  await validateParentTask(taskId, userId);
  return subtaskRepository.findAllByTaskId(taskId);
}

async function getSubtaskById(userId, taskId, id) {
  await validateParentTask(taskId, userId);
  const subtask = await subtaskRepository.findById(id, taskId);
  if (!subtask) {
    throw new SubtaskError("Subtask not found.", 404);
  }
  return subtask;
}

async function updateSubtask(userId, taskId, id, subtaskData) {
  await getSubtaskById(userId, taskId, id); // Validates parent task and subtask existence

  if (subtaskData.isCompleted === true && !subtaskData.completedAt) {
    subtaskData.completedAt = new Date().toISOString().slice(0, 19).replace("T", " ");
  } else if (subtaskData.isCompleted === false) {
    subtaskData.completedAt = null;
  }

  const updated = await subtaskRepository.update(id, taskId, subtaskData);
  return updated;
}

async function deleteSubtask(userId, taskId, id) {
  await getSubtaskById(userId, taskId, id); // Validates parent task and subtask existence
  await subtaskRepository.remove(id, taskId);
  return true;
}

async function toggleComplete(userId, taskId, id) {
  const subtask = await getSubtaskById(userId, taskId, id);
  
  const isCompleted = !subtask.is_completed;
  const updateData = {
    isCompleted,
    completedAt: isCompleted ? new Date().toISOString().slice(0, 19).replace("T", " ") : null
  };

  const updated = await subtaskRepository.update(id, taskId, updateData);
  return updated;
}

module.exports = {
  SubtaskError,
  createSubtask,
  getSubtasks,
  getSubtaskById,
  updateSubtask,
  deleteSubtask,
  toggleComplete
};
