const Joi = require('joi');

const startSessionSchema = Joi.object({
  taskId: Joi.number().integer().positive().optional(),
  sessionType: Joi.string().valid('focus', 'short_break', 'long_break').required(),
  plannedMinutes: Joi.number().integer().min(1).required(),
  startedAt: Joi.date().iso().required()
});

const endSessionSchema = Joi.object({
  sessionId: Joi.number().integer().positive().required(),
  actualMinutes: Joi.number().integer().min(0).required(),
  status: Joi.string().valid('completed', 'interrupted', 'cancelled').required(),
  endedAt: Joi.date().iso().required()
});

const queryHistorySchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional()
});

module.exports = {
  startSessionSchema,
  endSessionSchema,
  queryHistorySchema
};
