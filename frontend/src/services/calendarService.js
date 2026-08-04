import { request } from "./api";

export const calendarService = {
  getEvents: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/calendar${query ? `?${query}` : ""}`);
  },
  getEventById: (id) => request(`/calendar/${id}`),
  createEvent: (data) => request("/calendar", { method: "POST", body: JSON.stringify(data) }),
  updateEvent: (id, data) => request(`/calendar/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEvent: (id) => request(`/calendar/${id}`, { method: "DELETE" })
};
