const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { createEventSchema, updateEventSchema, queryEventsSchema } = require('../validations/calendar.validation');

router.use(authenticate);

router.post('/', validate(createEventSchema), calendarController.createEvent);
router.get('/', validate(queryEventsSchema, 'query'), calendarController.getEvents);
router.get('/:id', calendarController.getEventById);
router.put('/:id', validate(updateEventSchema), calendarController.updateEvent);
router.delete('/:id', calendarController.deleteEvent);

module.exports = router;
