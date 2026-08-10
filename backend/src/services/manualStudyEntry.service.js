const manualStudyEntryRepository = require("../repositories/manualStudyEntry.repository");
const goalRepository = require("../repositories/goal.repository");
class ManualStudyEntryError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function verifyGoalOwnership(goalId, userId) {
  const goal = await goalRepository.findById(goalId, userId);
  if (!goal) {
    throw new ManualStudyEntryError("Study Goal not found or unauthorized.", 404);
  }
  return goal;
}

async function createEntry(userId, goalId, entryData) {
  await verifyGoalOwnership(goalId, userId);
  return await manualStudyEntryRepository.create({ userId, goalId, ...entryData });
}

async function getEntriesForGoal(userId, goalId) {
  await verifyGoalOwnership(goalId, userId);
  return await manualStudyEntryRepository.findAllByGoalId(goalId, userId);
}

async function getEntryById(userId, goalId, entryId) {
  await verifyGoalOwnership(goalId, userId);
  
  const entry = await manualStudyEntryRepository.findById(entryId, userId);
  if (!entry || entry.goal_id !== Number(goalId)) {
    throw new ManualStudyEntryError("Manual study entry not found for this goal.", 404);
  }
  return entry;
}

async function updateEntry(userId, goalId, entryId, entryData) {
  await verifyGoalOwnership(goalId, userId);
  
  const entry = await manualStudyEntryRepository.findById(entryId, userId);
  if (!entry || entry.goal_id !== Number(goalId)) {
    throw new ManualStudyEntryError("Manual study entry not found for this goal.", 404);
  }

  return await manualStudyEntryRepository.update(entryId, userId, entryData);
}

async function deleteEntry(userId, goalId, entryId) {
  await verifyGoalOwnership(goalId, userId);
  
  const entry = await manualStudyEntryRepository.findById(entryId, userId);
  if (!entry || entry.goal_id !== Number(goalId)) {
    throw new ManualStudyEntryError("Manual study entry not found for this goal.", 404);
  }

  await manualStudyEntryRepository.remove(entryId, userId);
  return { success: true, message: "Manual study entry deleted successfully." };
}

module.exports = {
  createEntry,
  getEntriesForGoal,
  getEntryById,
  updateEntry,
  deleteEntry,
};
