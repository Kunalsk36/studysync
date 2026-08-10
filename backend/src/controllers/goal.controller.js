const goalService = require("../services/goal.service");

async function createGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const goalData = req.body;
    const goal = await goalService.createGoal(userId, goalData);

    return res.status(201).json({
      status: "success",
      message: "Study Goal created successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

async function getGoals(req, res, next) {
  try {
    const userId = req.user.id;
    const goals = await goalService.getGoals(userId);

    return res.status(200).json({
      status: "success",
      message: "Study Goals retrieved successfully",
      data: goals,
    });
  } catch (error) {
    next(error);
  }
}

async function getGoalById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const goal = await goalService.getGoalById(id, userId);

    return res.status(200).json({
      status: "success",
      message: "Study Goal retrieved successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

async function updateGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const goalData = req.body;
    const goal = await goalService.updateGoal(id, userId, goalData);

    return res.status(200).json({
      status: "success",
      message: "Study Goal updated successfully",
      data: goal,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteGoal(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await goalService.deleteGoal(id, userId);

    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
