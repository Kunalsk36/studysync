const pomodoroRepository = require('../repositories/pomodoro.repository');
const goalRepository = require('../repositories/goal.repository');

class PomodoroError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function startSession(userId, sessionData) {
  if (sessionData.goalId) {
    const goal = await goalRepository.findById(sessionData.goalId, userId);
    if (!goal) {
      throw new PomodoroError('Study Goal not found or unauthorized', 404);
    }
  }
  return await pomodoroRepository.create({ ...sessionData, userId });
}

async function endSession(userId, sessionData) {
  const { sessionId, actualMinutes, status, endedAt } = sessionData;
  const session = await pomodoroRepository.findById(sessionId, userId);
  
  if (!session) {
    throw new PomodoroError('Session not found', 404);
  }

  // Update session
  return await pomodoroRepository.update(sessionId, userId, {
    actualMinutes,
    status,
    endedAt
  });
}

async function getHistory(userId, queryParams) {
  return await pomodoroRepository.getHistory(userId, queryParams);
}

async function deleteSession(userId, sessionId) {
  const success = await pomodoroRepository.deleteSession(sessionId, userId);
  if (!success) {
    throw new PomodoroError('Session not found', 404);
  }
  return true;
}

async function clearHistory(userId) {
  return await pomodoroRepository.clearHistory(userId);
}

module.exports = {
  startSession,
  endSession,
  getHistory,
  deleteSession,
  clearHistory
};
