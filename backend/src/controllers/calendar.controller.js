const calendarService = require('../services/calendar.service');

async function createEvent(req, res, next) {
  try {
    const event = await calendarService.createEvent(req.user.id, req.body);
    res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
}

async function getEvents(req, res, next) {
  try {
    const events = await calendarService.getEvents(req.user.id, req.query);
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await calendarService.getEventById(req.user.id, req.params.id);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
}

async function updateEvent(req, res, next) {
  try {
    const event = await calendarService.updateEvent(req.user.id, req.params.id, req.body);
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
}

async function deleteEvent(req, res, next) {
  try {
    await calendarService.deleteEvent(req.user.id, req.params.id);
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
