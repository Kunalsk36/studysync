const Joi = require("joi");

const createGoalSchema = Joi.object({
  title: Joi.string().trim().max(150).required().messages({
    "string.empty": "Title is required.",
    "string.max": "Title must be at most 150 characters.",
    "any.required": "Title is required.",
  }),
  description: Joi.string().trim().allow(null, "").messages({
    "string.base": "Description must be a string.",
  }),
  targetHours: Joi.number().positive().precision(2).required().messages({
    "number.base": "Target hours must be a number.",
    "number.positive": "Target hours must be positive.",
    "any.required": "Target hours is required.",
  }),
  targetDate: Joi.date().iso().allow(null, "").messages({
    "date.format": "Target date must be a valid ISO date.",
  }),
  status: Joi.string().valid("active", "completed", "cancelled").allow(null, "").messages({
    "any.only": "Status must be active, completed, or cancelled.",
  }),
});

const updateGoalSchema = Joi.object({
  title: Joi.string().trim().max(150).messages({
    "string.empty": "Title cannot be empty.",
    "string.max": "Title must be at most 150 characters.",
  }),
  description: Joi.string().trim().allow(null, "").messages({
    "string.base": "Description must be a string.",
  }),
  targetHours: Joi.number().positive().precision(2).messages({
    "number.base": "Target hours must be a number.",
    "number.positive": "Target hours must be positive.",
  }),
  targetDate: Joi.date().iso().allow(null, "").messages({
    "date.format": "Target date must be a valid ISO date.",
  }),
  status: Joi.string().valid("active", "completed", "cancelled").messages({
    "any.only": "Status must be active, completed, or cancelled.",
  }),
});

module.exports = {
  createGoalSchema,
  updateGoalSchema,
};
