const taskService = require("../services/task.service");

async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const task = await taskService.createTask(userId, req.body);
    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const userId = req.user.id;
    const tasks = await taskService.getTasks(userId);
    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully.",
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.getTaskById(id, userId);
    res.status(200).json({
      success: true,
      message: "Task retrieved successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.updateTask(id, userId, req.body);
    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await taskService.deleteTask(id, userId);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

async function toggleComplete(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await taskService.toggleComplete(id, userId);
    res.status(200).json({
      success: true,
      message: "Task completion toggled successfully.",
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  toggleComplete
};
