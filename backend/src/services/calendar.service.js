const calendarRepository = require('../repositories/calendar.repository');

class CalendarError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function createEvent(userId, eventData) {
  if (new Date(eventData.endDatetime) < new Date(eventData.startDatetime)) {
    throw new CalendarError('End datetime cannot be before start datetime', 400);
  }
  return await calendarRepository.create({ ...eventData, userId });
}

async function getEvents(userId, queryParams) {
  return await calendarRepository.findAll(userId, queryParams);
}

async function getEventById(userId, eventId) {
  const event = await calendarRepository.findById(eventId, userId);
  if (!event) {
    throw new CalendarError('Event not found', 404);
  }
  return event;
}

async function updateEvent(userId, eventId, updateData) {
  const event = await calendarRepository.findById(eventId, userId);
  if (!event) {
    throw new CalendarError('Event not found', 404);
  }

  if (updateData.startDatetime || updateData.endDatetime) {
    const start = updateData.startDatetime ? new Date(updateData.startDatetime) : new Date(event.start_datetime);
    const end = updateData.endDatetime ? new Date(updateData.endDatetime) : new Date(event.end_datetime);
    if (end < start) {
      throw new CalendarError('End datetime cannot be before start datetime', 400);
    }
  }

  return await calendarRepository.update(eventId, userId, updateData);
}

async function deleteEvent(userId, eventId) {
  const deleted = await calendarRepository.remove(eventId, userId);
  if (!deleted) {
    throw new CalendarError('Event not found', 404);
  }
  return true;
}

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
};
