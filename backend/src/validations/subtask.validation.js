const Joi = require("joi");

const createSchema = Joi.object({
  title: Joi.string().max(150).required().messages({
    "string.empty": "Subtask title cannot be empty",
    "string.max": "Subtask title must be at most 150 characters long",
    "any.required": "Subtask title is required",
  }),
  isCompleted: Joi.boolean().optional(),
  completedAt: Joi.date().iso().allow(null).optional(),
});

const updateSchema = Joi.object({
  title: Joi.string().max(150).optional().messages({
    "string.empty": "Subtask title cannot be empty",
    "string.max": "Subtask title must be at most 150 characters long",
  }),
  isCompleted: Joi.boolean().optional(),
  completedAt: Joi.date().iso().allow(null).optional(),
}).min(1);

module.exports = {
  createSchema,
  updateSchema,
};
