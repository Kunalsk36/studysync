const Joi = require("joi");

const createSchema = Joi.object({
  categoryId: Joi.number().integer().positive().allow(null).optional(),
  title: Joi.string().max(150).required().messages({
    "string.empty": "Task title cannot be empty",
    "string.max": "Task title must be at most 150 characters long",
    "any.required": "Task title is required",
  }),
  description: Joi.string().allow(null, "").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  estimatedMinutes: Joi.number().integer().min(0).allow(null).optional(),
  actualMinutes: Joi.number().integer().min(0).allow(null).optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  completedAt: Joi.date().iso().allow(null).optional(),
  notes: Joi.string().allow(null, "").optional(),
  tags: Joi.string().max(255).allow(null, "").optional(),
  color: Joi.string().max(20).allow(null, "").optional(),
});

const updateSchema = Joi.object({
  categoryId: Joi.number().integer().positive().allow(null).optional(),
  title: Joi.string().max(150).optional().messages({
    "string.empty": "Task title cannot be empty",
    "string.max": "Task title must be at most 150 characters long",
  }),
  description: Joi.string().allow(null, "").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  estimatedMinutes: Joi.number().integer().min(0).allow(null).optional(),
  actualMinutes: Joi.number().integer().min(0).allow(null).optional(),
  dueDate: Joi.date().iso().allow(null).optional(),
  completedAt: Joi.date().iso().allow(null).optional(),
  notes: Joi.string().allow(null, "").optional(),
  tags: Joi.string().max(255).allow(null, "").optional(),
  color: Joi.string().max(20).allow(null, "").optional(),
}).min(1);

const querySchema = Joi.object({
  search: Joi.string().allow("").optional(),
  status: Joi.string().valid("pending", "in_progress", "completed").optional(),
  priority: Joi.string().valid("low", "medium", "high").optional(),
  categoryId: Joi.number().integer().positive().optional(),
  dueDate: Joi.date().iso().optional(),
  sortBy: Joi.string().valid("created_at", "updated_at", "due_date", "priority", "title").optional(),
  order: Joi.string().valid("asc", "desc").optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
});

module.exports = {
  createSchema,
  updateSchema,
  querySchema,
};
