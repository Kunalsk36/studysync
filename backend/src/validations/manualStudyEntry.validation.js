const Joi = require("joi");

const createManualStudyEntrySchema = Joi.object({
  minutes: Joi.number().integer().positive().required().messages({
    "number.base": "Minutes must be a number.",
    "number.integer": "Minutes must be an integer.",
    "number.positive": "Minutes must be greater than 0.",
    "any.required": "Minutes are required.",
  }),
  entryDate: Joi.date().iso().required().messages({
    "date.format": "Entry date must be a valid ISO date.",
    "any.required": "Entry date is required.",
  }),
  notes: Joi.string().trim().max(1000).allow(null, "").messages({
    "string.base": "Notes must be a string.",
    "string.max": "Notes must be at most 1000 characters.",
  }),
});

const updateManualStudyEntrySchema = Joi.object({
  minutes: Joi.number().integer().positive().messages({
    "number.base": "Minutes must be a number.",
    "number.integer": "Minutes must be an integer.",
    "number.positive": "Minutes must be greater than 0.",
  }),
  entryDate: Joi.date().iso().messages({
    "date.format": "Entry date must be a valid ISO date.",
  }),
  notes: Joi.string().trim().max(1000).allow(null, "").messages({
    "string.base": "Notes must be a string.",
    "string.max": "Notes must be at most 1000 characters.",
  }),
});

module.exports = {
  createManualStudyEntrySchema,
  updateManualStudyEntrySchema,
};
