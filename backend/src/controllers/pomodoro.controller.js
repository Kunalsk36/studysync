const pomodoroService = require('../services/pomodoro.service');

async function startSession(req, res, next) {
  try {
    const session = await pomodoroService.startSession(req.user.id, req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

async function endSession(req, res, next) {
  try {
    const session = await pomodoroService.endSession(req.user.id, req.body);
    res.status(200).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await pomodoroService.getHistory(req.user.id, req.query);
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
}

async function deleteSession(req, res, next) {
  try {
    await pomodoroService.deleteSession(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
}

async function clearHistory(req, res, next) {
  try {
    await pomodoroService.clearHistory(req.user.id);
    res.status(200).json({ success: true, message: 'History cleared' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  startSession,
  endSession,
  getHistory,
  deleteSession,
  clearHistory
};
