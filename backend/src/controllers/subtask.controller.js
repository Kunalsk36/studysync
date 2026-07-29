const subtaskService = require("../services/subtask.service");

async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const subtask = await subtaskService.createSubtask(userId, taskId, req.body);
    res.status(201).json({
      success: true,
      message: "Subtask created successfully.",
      data: subtask,
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const subtasks = await subtaskService.getSubtasks(userId, taskId);
    res.status(200).json({
      success: true,
      message: "Subtasks retrieved successfully.",
      data: subtasks,
    });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId, id } = req.params;
    const subtask = await subtaskService.getSubtaskById(userId, taskId, id);
    res.status(200).json({
      success: true,
      message: "Subtask retrieved successfully.",
      data: subtask,
    });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId, id } = req.params;
    const subtask = await subtaskService.updateSubtask(userId, taskId, id, req.body);
    res.status(200).json({
      success: true,
      message: "Subtask updated successfully.",
      data: subtask,
    });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId, id } = req.params;
    await subtaskService.deleteSubtask(userId, taskId, id);
    res.status(200).json({
      success: true,
      message: "Subtask deleted successfully.",
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

async function toggleComplete(req, res, next) {
  try {
    const userId = req.user.id;
    const { taskId, id } = req.params;
    const subtask = await subtaskService.toggleComplete(userId, taskId, id);
    res.status(200).json({
      success: true,
      message: "Subtask completion toggled successfully.",
      data: subtask,
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
