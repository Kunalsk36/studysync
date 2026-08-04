const Joi = require('joi');

const EVENT_TYPES = ['study', 'exam', 'meeting', 'interview', 'deadline', 'personal'];

const createEventSchema = Joi.object({
  title: Joi.string().max(150).required(),
  description: Joi.string().allow('', null),
  eventType: Joi.string().valid(...EVENT_TYPES).default('study'),
  startDatetime: Joi.date().iso().required(),
  endDatetime: Joi.date().iso().min(Joi.ref('startDatetime')).required(),
  location: Joi.string().max(255).allow('', null),
  isAllDay: Joi.boolean().default(false)
});

const updateEventSchema = Joi.object({
  title: Joi.string().max(150),
  description: Joi.string().allow('', null),
  eventType: Joi.string().valid(...EVENT_TYPES),
  startDatetime: Joi.date().iso(),
  endDatetime: Joi.date().iso().min(Joi.ref('startDatetime')),
  location: Joi.string().max(255).allow('', null),
  isAllDay: Joi.boolean()
}).min(1);

const queryEventsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  eventType: Joi.string().valid(...EVENT_TYPES, 'all'),
  search: Joi.string().max(100)
});

module.exports = {
  createEventSchema,
  updateEventSchema,
  queryEventsSchema
};
