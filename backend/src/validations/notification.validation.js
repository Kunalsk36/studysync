const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().max(150).required().messages({
    "string.empty": "Title cannot be empty",
    "string.max": "Title must be at most 150 characters long",
    "any.required": "Title is required",
  }),
  message: Joi.string().required().messages({
    "string.empty": "Message cannot be empty",
    "any.required": "Message is required",
  }),
  notificationType: Joi.string().valid("task", "goal", "calendar", "achievement", "system").optional(),
  scheduledAt: Joi.date().iso().allow(null).optional(),
  dedupeKey: Joi.string().max(255).allow(null, "").optional(),
});

const paramIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

module.exports = {
  createSchema,
  paramIdSchema,
};
