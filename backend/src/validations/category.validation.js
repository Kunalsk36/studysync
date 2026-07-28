const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Category name cannot be empty",
    "string.max": "Category name must be at most 100 characters long",
    "any.required": "Category name is required",
  }),
  color: Joi.string().max(20).allow(null, "").optional(),
  icon: Joi.string().max(50).allow(null, "").optional(),
});

const updateSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.empty": "Category name cannot be empty",
    "string.max": "Category name must be at most 100 characters long",
    "any.required": "Category name is required",
  }),
  color: Joi.string().max(20).allow(null, "").optional(),
  icon: Joi.string().max(50).allow(null, "").optional(),
});

module.exports = {
  createSchema,
  updateSchema,
};
