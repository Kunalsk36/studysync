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

---

# 7. User APIs

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| GET    | /users/profile     | Get profile        |
| PUT    | /users/profile     | Update profile     |
| GET    | /users/preferences | Get preferences    |
| PUT    | /users/preferences | Update preferences |

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

# 14. AI APIs

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | /ai/schedule      | Generate study schedule  |
| POST   | /ai/time-estimate | Estimate task duration   |
| POST   | /ai/suggestions   | Productivity suggestions |
| GET    | /ai/history       | AI history               |

---

# 15. Future APIs

Future releases may include:

- Team Collaboration APIs
- Notes APIs
- File Upload APIs
- Reminder APIs
- Analytics APIs
- Public API

---

# 16. HTTP Status Codes

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

# 17. API Design Principles

The StudySync API follows these principles:

- RESTful architecture
- JSON request and response bodies
- Stateless communication
- JWT-based authentication
- Consistent endpoint naming
- Proper HTTP status codes
- Secure input validation

---

# 18. API Summary

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
