const express = require('express');
const router = express.Router();
const pomodoroController = require('../controllers/pomodoro.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { startSessionSchema, endSessionSchema, queryHistorySchema } = require('../validations/pomodoro.validation');

router.use(authenticate);

router.post('/start', validate(startSessionSchema), pomodoroController.startSession);
router.post('/end', validate(endSessionSchema), pomodoroController.endSession);
router.get('/history', validate(queryHistorySchema, 'query'), pomodoroController.getHistory);
router.delete('/history/:id', pomodoroController.deleteSession);
router.delete('/history', pomodoroController.clearHistory);

module.exports = router;
