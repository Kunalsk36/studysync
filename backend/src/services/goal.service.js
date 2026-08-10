const goalRepository = require("../repositories/goal.repository");
class GoalError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function createGoal(userId, goalData) {
  return await goalRepository.create({ userId, ...goalData });
}

async function getGoals(userId) {
  return await goalRepository.findAllByUserId(userId);
}

async function getGoalById(id, userId) {
  const goal = await goalRepository.findById(id, userId);
  if (!goal) {
    throw new GoalError("Study Goal not found.", 404);
  }
  return goal;
}

async function updateGoal(id, userId, goalData) {
  const goal = await goalRepository.findById(id, userId);
  if (!goal) {
    throw new GoalError("Study Goal not found.", 404);
  }

  return await goalRepository.update(id, userId, goalData);
}

async function deleteGoal(id, userId) {
  const goal = await goalRepository.findById(id, userId);
  if (!goal) {
    throw new GoalError("Study Goal not found.", 404);
  }

  await goalRepository.remove(id, userId);
  return { success: true, message: "Study Goal deleted successfully." };
}

module.exports = {
  createGoal,
  getGoals,
  getGoalById,
  updateGoal,
  deleteGoal,
};
