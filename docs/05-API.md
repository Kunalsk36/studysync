# API Documentation

**Project:** StudySync  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Kunal Shrikant Kavathekar  
**Created:** 2026-07-06  
**Last Updated:** 2026-07-06

---

# 1. Purpose

This document provides an overview of the REST APIs used by StudySync.

It defines the available endpoints, request methods, authentication requirements, request payloads, and expected responses.

Detailed business logic and database implementation are documented separately in the PRD and Database Schema documents.

---

# 2. API Overview

StudySync exposes RESTful APIs that allow the frontend to communicate with the backend.

The APIs are grouped into the following modules:

- Authentication
- Users
- Tasks
- Categories
- Calendar
- Study Goals
- Pomodoro
- Notifications
- Dashboard
- Analytics
- Achievements
- Search
- AI Assistant

All APIs exchange data using JSON.

---

# 3. Base URL

Development

```text
http://localhost:5000/api
```

Production

```text
https://your-backend-domain.com/api
```

---

# 4. Authentication

Protected APIs require a JWT access token.

Example Header

```http
Authorization: Bearer <jwt_token>
```

Unauthenticated requests to protected endpoints should return:

```http
401 Unauthorized
```

---

# 5. Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {}
}
```

---

### Error

```json
{
  "success": false,
  "message": "Invalid request.",
  "errors": []
}
```

---

# 6. Authentication APIs

| Method | Endpoint              | Description            |
| ------ | --------------------- | ---------------------- |
| POST   | /auth/register        | Register a new user    |
| POST   | /auth/login           | User login             |
| POST   | /auth/google          | Google authentication  |
| POST   | /auth/logout          | Logout user            |
| POST   | /auth/forgot-password | Request password reset |
| POST   | /auth/reset-password  | Reset password         |

MVP authentication uses a single JWT access token with no refresh token — expired tokens require a full re-login (see 03-AppFlow.md §26). Refresh-token support is a Version 2 enhancement.

---

# 7. User APIs

| Method | Endpoint           | Description             |
| ------ | ------------------ | ------------------------ |
| GET    | /users/profile     | Get profile             |
| PUT    | /users/profile     | Update profile          |
| GET    | /users/preferences | Get preferences         |
| PUT    | /users/preferences | Update preferences      |
| PUT    | /users/password     | Change account password |
| DELETE | /users/account      | Permanently delete account and all associated data (cascades per 04-DatabaseSchema.md §22) |

---

# 8. Task APIs

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| GET    | /tasks              | Get all tasks      |
| GET    | /tasks/:id          | Get task by ID     |
| POST   | /tasks              | Create task        |
| PUT    | /tasks/:id          | Update task        |
| DELETE | /tasks/:id          | Delete task        |
| PATCH  | /tasks/:id/complete | Mark task complete |

---

# 9. Category APIs

| Method | Endpoint        | Description     |
| ------ | --------------- | --------------- |
| GET    | /categories     | Get categories  |
| POST   | /categories     | Create category |
| PUT    | /categories/:id | Update category |
| DELETE | /categories/:id | Delete category |

---

# 10. Calendar APIs

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | /calendar     | Get events   |
| GET    | /calendar/:id | Get event    |
| POST   | /calendar     | Create event |
| PUT    | /calendar/:id | Update event |
| DELETE | /calendar/:id | Delete event |

---

# 11. Study Goal APIs

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| GET    | /goals     | Get goals   |
| POST   | /goals     | Create goal |
| PUT    | /goals/:id | Update goal |
| DELETE | /goals/:id | Delete goal |

---

# 12. Pomodoro APIs

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| POST   | /pomodoro/start   | Start session   |
| POST   | /pomodoro/end     | End session     |
| GET    | /pomodoro/history | Session history |

---

# 13. Notification APIs

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | /notifications          | Get notifications   |
| PATCH  | /notifications/:id/read | Mark as read        |
| DELETE | /notifications/:id      | Delete notification |

---

# 14. Dashboard APIs

| Method | Endpoint                  | Description                                          |
| ------ | ------------------------- | ----------------------------------------------------- |
| GET    | /dashboard/summary        | Today's tasks, daily/weekly goal progress, study hours |
| GET    | /dashboard/recent-activity | Recently completed tasks and sessions                 |

Example response for `GET /dashboard/summary`:

```json
{
  "success": true,
  "message": "Dashboard summary retrieved.",
  "data": {
    "todaysTasks": [],
    "dailyGoalHours": 4,
    "weeklyGoalHours": 28,
    "studyHoursToday": 1.5,
    "upcomingEvents": []
  }
}
```

---

# 15. Analytics APIs

| Method | Endpoint                | Description                              |
| ------ | ----------------------- | ----------------------------------------- |
| GET    | /analytics/daily        | Daily productivity (tasks, study hours)   |
| GET    | /analytics/weekly       | Weekly productivity summary               |
| GET    | /analytics/monthly      | Monthly productivity summary              |
| GET    | /analytics/streak       | Current and longest study streak          |

Analytics values are calculated dynamically from `tasks` and `pomodoro_sessions` (see 04-DatabaseSchema.md §25, §29) rather than read from a dedicated table.

---

# 16. Achievement APIs

| Method | Endpoint              | Description                          |
| ------ | --------------------- | -------------------------------------- |
| GET    | /achievements         | List all achievement definitions       |
| GET    | /achievements/earned  | List achievements earned by the user   |

Achievements are unlocked automatically by the backend when milestone conditions are met (per 01-PRD.md BR-004-adjacent gamification rules) — there is no endpoint to manually award an achievement.

---

# 17. Search API

| Method | Endpoint  | Description                                          |
| ------ | --------- | ------------------------------------------------------ |
| GET    | /search   | Search tasks and calendar events by keyword (`?q=`)     |

Search is scoped to the authenticated user's own data only (per 01-PRD.md FR-SEARCH rules).

---

# 18. AI APIs

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | /ai/schedule      | Generate study schedule  |
| POST   | /ai/time-estimate | Estimate task duration   |
| POST   | /ai/suggestions   | Productivity suggestions |
| GET    | /ai/history       | AI history               |

The AI provider is configurable rather than hard-coded (see 02-TechSpec.md §7.1) — these endpoints call whichever provider is configured via environment variables.

---

# 19. Future APIs

Future releases may include:

- Team Collaboration APIs
- Notes APIs
- File Upload APIs
- Reminder APIs
- Public API

---

# 20. HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Resource Created      |
| 204  | No Content            |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# 21. API Design Principles

The StudySync API follows these principles:

- RESTful architecture
- JSON request and response bodies
- Stateless communication
- JWT-based authentication
- Consistent endpoint naming
- Proper HTTP status codes
- Secure input validation

---

# 22. API Summary

The StudySync backend provides REST APIs for all major application modules.

The APIs are designed to be:

- Secure
- Consistent
- Scalable
- Easy to maintain
- Easy to integrate with the Next.js frontend

Additional endpoint details and request validation rules will be implemented during development.

---

# End of API Documentation
