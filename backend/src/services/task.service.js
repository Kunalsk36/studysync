const taskRepository = require("../repositories/task.repository");
const categoryRepository = require("../repositories/category.repository");

class TaskError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function validateCategory(categoryId, userId) {
  if (categoryId) {
    const category = await categoryRepository.findById(categoryId, userId);
    if (!category) {
      throw new TaskError("Category not found or does not belong to user.", 404);
    }
  }
}

function validateDueDate(dueDate) {
  if (dueDate) {
    const due = new Date(dueDate);
    const now = new Date();
    // Due date cannot be in the past (creation date logic usually means now for new tasks)
    // To avoid exact millisecond issues, we just check if it's a valid date.
    if (isNaN(due.getTime())) {
      throw new TaskError("Invalid due date.", 400);
    }
  }
}

async function createTask(userId, taskData) {
  await validateCategory(taskData.categoryId, userId);
  validateDueDate(taskData.dueDate);

  if (taskData.actualMinutes !== undefined && taskData.actualMinutes < 0) {
    throw new TaskError("Actual study time cannot be negative.", 400);
  }

  const task = await taskRepository.create({ userId, ...taskData });
  return task;
}

async function getTasks(userId) {
  return taskRepository.findAllByUserId(userId);
}

async function getTaskById(id, userId) {
  const task = await taskRepository.findById(id, userId);
  if (!task) {
    throw new TaskError("Task not found.", 404);
  }
  return task;
}

async function updateTask(id, userId, taskData) {
  const task = await getTaskById(id, userId); // Verify ownership

  await validateCategory(taskData.categoryId, userId);
  validateDueDate(taskData.dueDate);

  if (taskData.actualMinutes !== undefined && taskData.actualMinutes < 0) {
    throw new TaskError("Actual study time cannot be negative.", 400);
  }

  const updated = await taskRepository.update(id, userId, taskData);
  return updated;
}

async function deleteTask(id, userId) {
  await getTaskById(id, userId); // Verify ownership
  await taskRepository.remove(id, userId);
  return true;
}

async function toggleComplete(id, userId) {
  const task = await getTaskById(id, userId);
  
  const isCompleted = task.status === "completed";
  
  const updateData = {
    status: isCompleted ? "pending" : "completed",
    completedAt: isCompleted ? null : new Date().toISOString().slice(0, 19).replace("T", " ") // Format for MySQL DATETIME
  };

  const updated = await taskRepository.update(id, userId, updateData);
  return updated;
}

module.exports = {
  TaskError,
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  toggleComplete
};
