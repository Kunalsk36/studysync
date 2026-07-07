# Database Schema

**Project:** StudySync  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Kunal Shrikant Kavathekar  
**Created:** 2026-07-06  
**Last Updated:** 2026-07-06

---

# 1. Purpose

This document defines the complete relational database schema for StudySync.

It specifies every table, column, relationship, constraint, and database rule required to support the application's functionality.

This document acts as the primary reference for:

- Backend Development
- Database Design
- API Development
- ORM Model Creation
- Data Validation
- Future Database Migrations

The schema has been designed with scalability, maintainability, and performance in mind.

---

# 2. Database Overview

StudySync uses **MySQL** as its primary relational database.

The database is normalized to minimize redundancy while maintaining efficient query performance.

The design follows the Third Normal Form (3NF) wherever practical.

Primary objectives include:

- Maintain data integrity
- Ensure scalability
- Reduce duplicate data
- Support efficient queries
- Enable future expansion

---

# 3. Database Design Principles

The database follows the principles below.

## 3.1 Single Source of Truth

Every piece of information should exist in only one location.

---

## 3.2 Normalization

The schema follows normalization rules to reduce redundancy and improve consistency.

---

## 3.3 Referential Integrity

Relationships between tables are enforced using foreign key constraints.

---

## 3.4 Scalability

New modules should be added without requiring major schema changes.

---

## 3.5 Auditability

Important tables include timestamps to track creation and modification history.

---

# 4. Naming Conventions

The following naming conventions are used throughout the database.

## Tables

- Singular nouns are avoided.
- Table names use plural form.

Examples:

```
users
tasks
calendar_events
notifications
```

---

## Columns

Snake case is used.

Examples:

```
first_name

created_at

updated_at

user_id
```

---

## Primary Keys

Every table uses:

```
id
```

---

## Foreign Keys

Foreign keys follow:

```
user_id

task_id

category_id
```

---

## Timestamp Columns

Every table should contain:

```
created_at

updated_at
```

Soft delete support may include:

```
deleted_at
```

---

# 5. Entity Relationship Overview

The StudySync database is centered around the **Users** table.

A single user owns all productivity-related data.

```
Users
 │
 ├──────── User Preferences
 │
 ├──────── Tasks
 │            │
 │            └────── Subtasks
 │
 ├──────── Calendar Events
 │
 ├──────── Pomodoro Sessions
 │
 ├──────── Notifications
 │
 ├──────── Analytics
 │
 ├──────── Achievements
 │
 └──────── AI History
```

---

# 6. Core Tables Overview

The MVP includes the following primary tables.

| Table             | Purpose                  |
| ----------------- | ------------------------ |
| users             | User accounts            |
| user_preferences  | User settings            |
| tasks             | Task management          |
| task_categories   | Task categories          |
| subtasks          | Child tasks              |
| calendar_events   | Calendar module          |
| pomodoro_sessions | Study sessions           |
| analytics         | Productivity statistics  |
| notifications     | User reminders           |
| achievements      | Gamification             |
| ai_history        | AI generated suggestions |

---

---

# PART 2 – User & Authentication Tables

This section defines the core database tables responsible for user accounts, authentication, user preferences, study goals, and active sessions.

These tables form the foundation of the StudySync database.

---

# 7. users

## Purpose

The `users` table stores account information for every registered user.

It acts as the parent table for almost every other module in the application.

Each user owns their personal tasks, calendar events, study sessions, notifications, and preferences.

---

## Primary Key

`id`

---

## Columns

| Column        | Data Type              | Nullable | Default           | Description                                |
| ------------- | ---------------------- | -------- | ----------------- | ------------------------------------------ |
| id            | BIGINT UNSIGNED        | No       | AUTO_INCREMENT    | Unique user identifier                     |
| full_name     | VARCHAR(100)           | No       | -                 | User's full name                           |
| email         | VARCHAR(255)           | No       | UNIQUE            | User email address                         |
| password_hash | VARCHAR(255)           | Yes      | NULL              | Encrypted password (NULL for Google login) |
| auth_provider | ENUM('local','google') | No       | 'local'           | Authentication provider                    |
| profile_image | VARCHAR(500)           | Yes      | NULL              | Profile picture URL                        |
| is_verified   | BOOLEAN                | No       | FALSE             | Email verification status                  |
| last_login    | DATETIME               | Yes      | NULL              | Last successful login                      |
| created_at    | TIMESTAMP              | No       | CURRENT_TIMESTAMP | Record creation timestamp                  |
| updated_at    | TIMESTAMP              | No       | CURRENT_TIMESTAMP | Last update timestamp                      |

---

## Indexes

- PRIMARY KEY (`id`)
- UNIQUE (`email`)
- INDEX (`auth_provider`)

---

## Relationships

```
users (1)

│

├──── user_preferences

├──── study_goals

├──── tasks

├──── calendar_events

├──── pomodoro_sessions

├──── notifications

├──── user_sessions

├──── ai_history

└──── user_achievements
```

---

## Business Rules

- Every email address must be unique.
- Passwords must always be stored as hashes.
- Users cannot access another user's data.
- Google users do not require a password hash.
- Deleting a user deletes all associated records (Cascade Delete).

---

## Example Record

```json
{
  "id": 1,
  "full_name": "Kunal Kavathekar",
  "email": "kunal@example.com",
  "password_hash": "$2b$10$...",
  "auth_provider": "local",
  "profile_image": null,
  "is_verified": true,
  "last_login": "2026-07-08 09:15:42"
}
```

---

# 8. user_preferences

## Purpose

Stores user-specific application preferences.

Separating preferences from the users table keeps authentication data clean and allows future expansion without modifying the users table.

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column                | Data Type                                     | Nullable | Default           | Description             |
| --------------------- | --------------------------------------------- | -------- | ----------------- | ----------------------- |
| id                    | BIGINT UNSIGNED                               | No       | AUTO_INCREMENT    | Primary key             |
| user_id               | BIGINT UNSIGNED                               | No       | FK                | Owner of preferences    |
| theme                 | ENUM('light','dark')                          | No       | 'dark'            | Application theme       |
| daily_goal_hours      | DECIMAL(3,1)                                  | No       | 2.0               | Daily study goal        |
| preferred_study_time  | ENUM('morning','afternoon','evening','night') | Yes      | NULL              | Preferred study session |
| notifications_enabled | BOOLEAN                                       | No       | TRUE              | Notification preference |
| sound_enabled         | BOOLEAN                                       | No       | TRUE              | Sound effects           |
| created_at            | TIMESTAMP                                     | No       | CURRENT_TIMESTAMP | Created time            |
| updated_at            | TIMESTAMP                                     | No       | CURRENT_TIMESTAMP | Updated time            |

---

## Indexes

- PRIMARY KEY (`id`)
- UNIQUE (`user_id`)

---

## Relationships

```
users (1)

↓

user_preferences (1)
```

Each user has exactly one preferences record.

---

## Business Rules

- One preference record per user.
- Theme changes apply immediately.
- Notification preferences control reminder generation.

---

## Example Record

```json
{
  "user_id": 1,
  "theme": "dark",
  "daily_goal_hours": 4,
  "preferred_study_time": "evening",
  "notifications_enabled": true,
  "sound_enabled": true
}
```

---

# 9. study_goals

## Purpose

Stores user-defined study goals and productivity targets.

This table allows users to manage long-term learning objectives independently of daily tasks.

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column       | Data Type                              | Nullable | Default           | Description        |
| ------------ | -------------------------------------- | -------- | ----------------- | ------------------ |
| id           | BIGINT UNSIGNED                        | No       | AUTO_INCREMENT    | Primary key        |
| user_id      | BIGINT UNSIGNED                        | No       | FK                | Owner              |
| title        | VARCHAR(150)                           | No       | -                 | Goal title         |
| description  | TEXT                                   | Yes      | NULL              | Goal description   |
| target_hours | DECIMAL(5,2)                           | No       | -                 | Target study hours |
| target_date  | DATE                                   | Yes      | NULL              | Goal deadline      |
| status       | ENUM('active','completed','cancelled') | No       | 'active'          | Goal status        |
| created_at   | TIMESTAMP                              | No       | CURRENT_TIMESTAMP | Created time       |
| updated_at   | TIMESTAMP                              | No       | CURRENT_TIMESTAMP | Updated time       |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`status`)

---

## Relationships

```
users (1)

↓

study_goals (Many)
```

---

## Business Rules

- Users may have multiple goals.
- Completed goals become read-only.
- Cancelled goals remain for historical tracking.

---

## Example Record

```json
{
  "id": 3,
  "user_id": 1,
  "title": "Complete Java Full Stack",
  "description": "Finish all modules and projects.",
  "target_hours": 120,
  "target_date": "2026-10-01",
  "status": "active"
}
```

---

# 10. user_sessions

## Purpose

Tracks active login sessions for authenticated users.

Although JWT is stateless, maintaining session records enables features such as logout from all devices, login history, and enhanced security.

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column        | Data Type       | Nullable | Default           | Description                |
| ------------- | --------------- | -------- | ----------------- | -------------------------- |
| id            | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary key                |
| user_id       | BIGINT UNSIGNED | No       | FK                | Session owner              |
| session_token | VARCHAR(255)    | No       | UNIQUE            | Unique session identifier  |
| ip_address    | VARCHAR(45)     | Yes      | NULL              | User IP address            |
| user_agent    | TEXT            | Yes      | NULL              | Browser/device information |
| login_time    | DATETIME        | No       | CURRENT_TIMESTAMP | Login timestamp            |
| expires_at    | DATETIME        | No       | -                 | Session expiry             |
| is_active     | BOOLEAN         | No       | TRUE              | Session status             |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- UNIQUE (`session_token`)

---

## Relationships

```
users (1)

↓

user_sessions (Many)
```

---

## Business Rules

- Users may have multiple active sessions.
- Expired sessions should be invalidated automatically.
- Logout deactivates the current session.
- Future versions may support "Logout from all devices."

---

## Example Record

```json
{
  "user_id": 1,
  "session_token": "eyJhbGciOiJIUzI1NiIs...",
  "ip_address": "192.168.1.15",
  "login_time": "2026-07-08 09:00:00",
  "expires_at": "2026-07-09 09:00:00",
  "is_active": true
}
```

---

# Part 2 Summary

This section defines the user management foundation of StudySync.

| Table            | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| users            | Stores user accounts and authentication details |
| user_preferences | Stores user settings and preferences            |
| study_goals      | Stores long-term productivity goals             |
| user_sessions    | Tracks active login sessions                    |

These tables act as the parent entities for all productivity modules described in the following sections.

---

# End of Part 2

---

# PART 3 – Productivity Module Tables

This section defines the database tables that support the core productivity features of StudySync.

These tables manage user tasks, task categorization, subtasks, and calendar events.

---

# 11. tasks

## Purpose

The `tasks` table is the primary productivity table of StudySync.

It stores all user-created tasks along with their status, priority, deadlines, estimated study time, and additional notes.

Every task belongs to exactly one user and may contain multiple subtasks.

---

## Primary Key

`id`

---

## Foreign Keys

- `user_id → users.id`
- `category_id → task_categories.id`

---

## Columns

| Column            | Data Type                                 | Nullable | Default           | Description               |
| ----------------- | ----------------------------------------- | -------- | ----------------- | ------------------------- |
| id                | BIGINT UNSIGNED                           | No       | AUTO_INCREMENT    | Primary Key               |
| user_id           | BIGINT UNSIGNED                           | No       | FK                | Task owner                |
| category_id       | BIGINT UNSIGNED                           | Yes      | NULL              | Task category             |
| title             | VARCHAR(150)                              | No       | -                 | Task title                |
| description       | TEXT                                      | Yes      | NULL              | Detailed description      |
| priority          | ENUM('low','medium','high')               | No       | 'medium'          | Task priority             |
| status            | ENUM('pending','in_progress','completed') | No       | 'pending'         | Current task status       |
| estimated_minutes | INT                                       | Yes      | NULL              | Estimated completion time |
| actual_minutes    | INT                                       | Yes      | NULL              | Actual completion time    |
| due_date          | DATETIME                                  | Yes      | NULL              | Due date & time           |
| completed_at      | DATETIME                                  | Yes      | NULL              | Completion timestamp      |
| notes             | TEXT                                      | Yes      | NULL              | Additional notes          |
| created_at        | TIMESTAMP                                 | No       | CURRENT_TIMESTAMP | Creation time             |
| updated_at        | TIMESTAMP                                 | No       | CURRENT_TIMESTAMP | Last update               |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`category_id`)
- INDEX (`status`)
- INDEX (`priority`)
- INDEX (`due_date`)

---

## Relationships

```
users (1)
    │
    └──────── tasks (Many)
                   │
                   └──────── subtasks (Many)
```

---

## Cascade Rules

- Deleting a user deletes all associated tasks.
- Deleting a category sets `category_id` to NULL.
- Deleting a task deletes all associated subtasks.

---

## Business Rules

- Every task belongs to one user.
- Task title is mandatory.
- Due date cannot be earlier than the creation date.
- Completed tasks receive a completion timestamp.
- Actual study time cannot be negative.

---

## Example Record

```json
{
  "id": 25,
  "user_id": 1,
  "category_id": 3,
  "title": "Complete React Authentication",
  "description": "Implement JWT login module",
  "priority": "high",
  "status": "in_progress",
  "estimated_minutes": 180,
  "actual_minutes": 120,
  "due_date": "2026-07-15 18:00:00",
  "completed_at": null
}
```

---

# 12. task_categories

## Purpose

Stores reusable categories that help users organize tasks.

Examples include:

- Java
- React
- Interview Preparation
- DSA
- Personal

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column     | Data Type       | Nullable | Default           | Description     |
| ---------- | --------------- | -------- | ----------------- | --------------- |
| id         | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary Key     |
| user_id    | BIGINT UNSIGNED | No       | FK                | Category owner  |
| name       | VARCHAR(100)    | No       | -                 | Category name   |
| color      | VARCHAR(20)     | Yes      | NULL              | UI color        |
| icon       | VARCHAR(50)     | Yes      | NULL              | Icon identifier |
| created_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | Creation time   |
| updated_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | Last update     |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- UNIQUE (`user_id`,`name`)

---

## Relationships

```
users (1)

↓

task_categories (Many)

↓

tasks (Many)
```

---

## Business Rules

- Category names must be unique per user.
- Default categories cannot be deleted.
- Color is optional.

---

## Example Record

```json
{
  "id": 3,
  "user_id": 1,
  "name": "React",
  "color": "#3B82F6",
  "icon": "code"
}
```

---

# 13. subtasks

## Purpose

Stores smaller actionable items belonging to a parent task.

---

## Primary Key

`id`

---

## Foreign Keys

`task_id → tasks.id`

---

## Columns

| Column       | Data Type       | Nullable | Default           | Description       |
| ------------ | --------------- | -------- | ----------------- | ----------------- |
| id           | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary Key       |
| task_id      | BIGINT UNSIGNED | No       | FK                | Parent task       |
| title        | VARCHAR(150)    | No       | -                 | Subtask title     |
| is_completed | BOOLEAN         | No       | FALSE             | Completion status |
| completed_at | DATETIME        | Yes      | NULL              | Completion time   |
| created_at   | TIMESTAMP       | No       | CURRENT_TIMESTAMP | Creation time     |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`task_id`)

---

## Relationships

```
tasks (1)

↓

subtasks (Many)
```

---

## Business Rules

- Every subtask belongs to exactly one task.
- A completed subtask records its completion timestamp.
- Deleting a task deletes all subtasks.

---

## Example Record

```json
{
  "id": 12,
  "task_id": 25,
  "title": "Create Login API",
  "is_completed": true,
  "completed_at": "2026-07-09 16:30:00"
}
```

---

# 14. calendar_events

## Purpose

Stores all scheduled events for users.

The calendar supports:

- Study Sessions
- Exams
- Meetings
- Interviews
- Personal Events
- Deadlines

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column         | Data Type                                                        | Nullable | Default           | Description       |
| -------------- | ---------------------------------------------------------------- | -------- | ----------------- | ----------------- |
| id             | BIGINT UNSIGNED                                                  | No       | AUTO_INCREMENT    | Primary Key       |
| user_id        | BIGINT UNSIGNED                                                  | No       | FK                | Event owner       |
| title          | VARCHAR(150)                                                     | No       | -                 | Event title       |
| description    | TEXT                                                             | Yes      | NULL              | Event description |
| event_type     | ENUM('study','exam','meeting','interview','deadline','personal') | No       | 'study'           | Event type        |
| start_datetime | DATETIME                                                         | No       | -                 | Event start       |
| end_datetime   | DATETIME                                                         | No       | -                 | Event end         |
| location       | VARCHAR(255)                                                     | Yes      | NULL              | Event location    |
| is_all_day     | BOOLEAN                                                          | No       | FALSE             | All-day event     |
| created_at     | TIMESTAMP                                                        | No       | CURRENT_TIMESTAMP | Creation time     |
| updated_at     | TIMESTAMP                                                        | No       | CURRENT_TIMESTAMP | Last update       |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`start_datetime`)
- INDEX (`event_type`)

---

## Relationships

```
users (1)

↓

calendar_events (Many)
```

---

## Cascade Rules

- Deleting a user deletes all calendar events.

---

## Business Rules

- Start date must be before end date.
- Event title is mandatory.
- Events cannot overlap only if marked as "exclusive" (Future Version).
- All-day events ignore time values in the UI.

---

## Example Record

```json
{
  "id": 18,
  "user_id": 1,
  "title": "Java Interview",
  "event_type": "interview",
  "start_datetime": "2026-07-20 10:00:00",
  "end_datetime": "2026-07-20 11:00:00",
  "location": "Pune"
}
```

---

# Part 3 Summary

This section defines the core productivity data model of StudySync.

| Table           | Purpose                               |
| --------------- | ------------------------------------- |
| tasks           | Stores all user tasks                 |
| task_categories | Organizes tasks into categories       |
| subtasks        | Breaks tasks into smaller actions     |
| calendar_events | Stores scheduled events and deadlines |

These tables work together to power the Dashboard, Task Management, Calendar, Analytics, Notifications, and AI planning modules.

---

# End of Part 3

---

# PART 4 – Productivity Support Tables

This section defines the remaining database tables that support productivity tracking, notifications, gamification, AI interactions, and future scalability.

These tables complete the MVP database schema.

---

# 15. pomodoro_sessions

## Purpose

The `pomodoro_sessions` table stores every completed or interrupted Pomodoro study session.

It is used to calculate:

- Daily study hours
- Weekly study hours
- Monthly study hours
- Productivity analytics
- User streaks
- AI recommendations

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

`task_id → tasks.id (Optional)`

---

## Columns

| Column          | Data Type                                   | Nullable | Default           | Description        |
| --------------- | ------------------------------------------- | -------- | ----------------- | ------------------ |
| id              | BIGINT UNSIGNED                             | No       | AUTO_INCREMENT    | Primary Key        |
| user_id         | BIGINT UNSIGNED                             | No       | FK                | Session owner      |
| task_id         | BIGINT UNSIGNED                             | Yes      | NULL              | Related task       |
| session_type    | ENUM('focus','short_break','long_break')    | No       | 'focus'           | Session type       |
| planned_minutes | INT                                         | No       | 25                | Planned duration   |
| actual_minutes  | INT                                         | No       | 0                 | Actual duration    |
| status          | ENUM('completed','interrupted','cancelled') | No       | 'completed'       | Session status     |
| started_at      | DATETIME                                    | No       | -                 | Start time         |
| ended_at        | DATETIME                                    | Yes      | NULL              | End time           |
| created_at      | TIMESTAMP                                   | No       | CURRENT_TIMESTAMP | Creation timestamp |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`task_id`)
- INDEX (`started_at`)

---

## Relationships

```
users (1)

↓

pomodoro_sessions (Many)

↓

tasks (Optional)
```

---

## Business Rules

- Every session belongs to one user.
- Linking a session to a task is optional.
- Completed sessions contribute to productivity statistics.
- Interrupted sessions are stored but excluded from streak calculations.

---

## Example Record

```json
{
  "id": 7,
  "user_id": 1,
  "task_id": 12,
  "session_type": "focus",
  "planned_minutes": 25,
  "actual_minutes": 25,
  "status": "completed"
}
```

---

# 16. notifications

## Purpose

Stores reminders and application notifications for users.

Notifications include:

- Task reminders
- Goal reminders
- Calendar reminders
- Achievement notifications
- System notifications

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column            | Data Type                                             | Nullable | Default           | Description           |
| ----------------- | ----------------------------------------------------- | -------- | ----------------- | --------------------- |
| id                | BIGINT UNSIGNED                                       | No       | AUTO_INCREMENT    | Primary Key           |
| user_id           | BIGINT UNSIGNED                                       | No       | FK                | Notification owner    |
| title             | VARCHAR(150)                                          | No       | -                 | Notification title    |
| message           | TEXT                                                  | No       | -                 | Notification message  |
| notification_type | ENUM('task','goal','calendar','achievement','system') | No       | 'system'          | Notification category |
| is_read           | BOOLEAN                                               | No       | FALSE             | Read status           |
| scheduled_at      | DATETIME                                              | Yes      | NULL              | Reminder time         |
| created_at        | TIMESTAMP                                             | No       | CURRENT_TIMESTAMP | Creation timestamp    |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`is_read`)
- INDEX (`scheduled_at`)

---

## Relationships

```
users (1)

↓

notifications (Many)
```

---

## Business Rules

- Notifications belong to one user.
- Read notifications remain stored.
- Scheduled notifications are delivered only once.

---

## Example Record

```json
{
  "id": 15,
  "user_id": 1,
  "title": "Task Reminder",
  "message": "Complete React Project",
  "notification_type": "task",
  "is_read": false
}
```

---

# 17. achievements

## Purpose

Stores all available achievements within StudySync.

These are predefined by the system.

Examples:

- First Task Completed
- 7-Day Streak
- 100 Study Hours
- 50 Completed Tasks

---

## Primary Key

`id`

---

## Columns

| Column      | Data Type       | Nullable | Default           | Description             |
| ----------- | --------------- | -------- | ----------------- | ----------------------- |
| id          | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary Key             |
| title       | VARCHAR(100)    | No       | -                 | Achievement title       |
| description | TEXT            | No       | -                 | Achievement description |
| badge_icon  | VARCHAR(100)    | Yes      | NULL              | Badge icon              |
| badge_color | VARCHAR(30)     | Yes      | NULL              | Badge color             |
| requirement | VARCHAR(255)    | No       | -                 | Unlock condition        |
| created_at  | TIMESTAMP       | No       | CURRENT_TIMESTAMP | Creation timestamp      |

---

## Indexes

- PRIMARY KEY (`id`)

---

## Business Rules

- Achievement definitions are managed by the application.
- Users cannot modify achievements.

---

## Example Record

```json
{
  "id": 4,
  "title": "7-Day Streak",
  "description": "Maintain a study streak for seven consecutive days.",
  "badge_icon": "fire",
  "badge_color": "orange"
}
```

---

# 18. user_achievements

## Purpose

Maps achievements earned by individual users.

This creates a many-to-many relationship between users and achievements.

---

## Primary Key

`id`

---

## Foreign Keys

- `user_id → users.id`
- `achievement_id → achievements.id`

---

## Columns

| Column         | Data Type       | Nullable | Default           | Description |
| -------------- | --------------- | -------- | ----------------- | ----------- |
| id             | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary Key |
| user_id        | BIGINT UNSIGNED | No       | FK                | User        |
| achievement_id | BIGINT UNSIGNED | No       | FK                | Achievement |
| earned_at      | DATETIME        | No       | CURRENT_TIMESTAMP | Unlock time |

---

## Indexes

- PRIMARY KEY (`id`)
- UNIQUE (`user_id`,`achievement_id`)

---

## Relationships

```
users (Many)

↓

user_achievements

↑

achievements (Many)
```

---

## Business Rules

- A user can unlock an achievement only once.
- Duplicate achievement records are not allowed.

---

## Example Record

```json
{
  "user_id": 1,
  "achievement_id": 3,
  "earned_at": "2026-07-18 20:15:00"
}
```

---

# 19. ai_history

## Purpose

Stores AI interactions generated for users.

This enables users to revisit previous AI-generated schedules and recommendations.

---

## Primary Key

`id`

---

## Foreign Keys

`user_id → users.id`

---

## Columns

| Column     | Data Type       | Nullable | Default           | Description        |
| ---------- | --------------- | -------- | ----------------- | ------------------ |
| id         | BIGINT UNSIGNED | No       | AUTO_INCREMENT    | Primary Key        |
| user_id    | BIGINT UNSIGNED | No       | FK                | User               |
| prompt     | TEXT            | No       | -                 | User request       |
| response   | LONGTEXT        | No       | -                 | AI response        |
| model_name | VARCHAR(100)    | Yes      | NULL              | AI model used      |
| created_at | TIMESTAMP       | No       | CURRENT_TIMESTAMP | Creation timestamp |

---

## Indexes

- PRIMARY KEY (`id`)
- INDEX (`user_id`)
- INDEX (`created_at`)

---

## Relationships

```
users (1)

↓

ai_history (Many)
```

---

## Business Rules

- AI conversations belong to one user.
- Users can view only their own AI history.
- AI history may be cleared by the user from Settings.

---

## Example Record

```json
{
  "id": 12,
  "user_id": 1,
  "prompt": "Create a study schedule for Java and React.",
  "response": "Monday: Java Core\nTuesday: React Components\n...",
  "model_name": "Grok-4"
}
```

---

# Part 4 Summary

This section completes the remaining support tables of StudySync.

| Table             | Purpose                                   |
| ----------------- | ----------------------------------------- |
| pomodoro_sessions | Stores study session history              |
| notifications     | Stores reminders and system notifications |
| achievements      | Stores predefined achievement definitions |
| user_achievements | Maps achievements earned by users         |
| ai_history        | Stores AI prompts and responses           |

Together with the tables defined in Parts 2 and 3, these tables provide the complete MVP data model for StudySync.

---

# End of Part 4

🔍 Database Review (Very Important)

Now that we've designed almost the entire schema, I noticed three improvements that I strongly recommend before we write Part 5.

1. Add Soft Deletes

Instead of permanently deleting important records, add:

deleted_at TIMESTAMP NULL

to tables like:

tasks
calendar_events
study_goals

This allows recovery of accidentally deleted data and is a common production practice.

2. Add UUID Support

Keep id as the primary key, but also add:

uuid CHAR(36) UNIQUE

for public-facing identifiers.

That way, URLs become:

/task/550e8400-e29b-41d4-a716-446655440000

instead of:

/task/15

This improves security and makes IDs harder to guess.

3. Add Audit Fields

For important tables such as tasks and calendar_events, consider adding:

created_by
updated_by

In the MVP, these will usually be the same as user_id, but they become useful if you ever add collaboration or admin features.

---

# PART 5 – Database Relationships, Constraints & Future Strategy

This section defines the relationships between database tables, indexing strategy, integrity constraints, migration guidelines, and future expansion plans.

---

# 20. Entity Relationships

The StudySync database follows a relational model where the **users** table acts as the parent entity for nearly all other modules.

---

## Relationship Summary

| Parent Table    | Child Table       | Relationship           |
| --------------- | ----------------- | ---------------------- |
| users           | user_preferences  | One-to-One             |
| users           | study_goals       | One-to-Many            |
| users           | user_sessions     | One-to-Many            |
| users           | tasks             | One-to-Many            |
| users           | task_categories   | One-to-Many            |
| users           | calendar_events   | One-to-Many            |
| users           | pomodoro_sessions | One-to-Many            |
| users           | notifications     | One-to-Many            |
| users           | ai_history        | One-to-Many            |
| users           | user_achievements | One-to-Many            |
| task_categories | tasks             | One-to-Many            |
| tasks           | subtasks          | One-to-Many            |
| tasks           | pomodoro_sessions | One-to-Many (Optional) |
| achievements    | user_achievements | One-to-Many            |

---

## High-Level Relationship Diagram

```text
users
│
├────────── user_preferences
│
├────────── study_goals
│
├────────── user_sessions
│
├────────── task_categories
│                │
│                ▼
│              tasks
│                │
│                ▼
│            subtasks
│                │
│                ▼
│        pomodoro_sessions
│
├────────── calendar_events
│
├────────── notifications
│
├────────── ai_history
│
└────────── user_achievements
                  ▲
                  │
           achievements
```

---

# 21. Foreign Key Constraints

The following foreign key relationships should be enforced to maintain referential integrity.

| Child Table       | Foreign Key    | References         |
| ----------------- | -------------- | ------------------ |
| user_preferences  | user_id        | users.id           |
| study_goals       | user_id        | users.id           |
| user_sessions     | user_id        | users.id           |
| tasks             | user_id        | users.id           |
| tasks             | category_id    | task_categories.id |
| task_categories   | user_id        | users.id           |
| subtasks          | task_id        | tasks.id           |
| calendar_events   | user_id        | users.id           |
| pomodoro_sessions | user_id        | users.id           |
| pomodoro_sessions | task_id        | tasks.id           |
| notifications     | user_id        | users.id           |
| user_achievements | user_id        | users.id           |
| user_achievements | achievement_id | achievements.id    |
| ai_history        | user_id        | users.id           |

---

# 22. Cascade Rules

The following cascade actions should be applied.

| Parent          | Child             | Action             |
| --------------- | ----------------- | ------------------ |
| users           | tasks             | ON DELETE CASCADE  |
| users           | calendar_events   | ON DELETE CASCADE  |
| users           | study_goals       | ON DELETE CASCADE  |
| users           | user_preferences  | ON DELETE CASCADE  |
| users           | notifications     | ON DELETE CASCADE  |
| users           | pomodoro_sessions | ON DELETE CASCADE  |
| users           | ai_history        | ON DELETE CASCADE  |
| users           | user_sessions     | ON DELETE CASCADE  |
| users           | user_achievements | ON DELETE CASCADE  |
| tasks           | subtasks          | ON DELETE CASCADE  |
| task_categories | tasks             | ON DELETE SET NULL |
| achievements    | user_achievements | ON DELETE CASCADE  |

These rules ensure orphaned records are not left in the database.

---

# 23. Index Strategy

Proper indexing is essential for maintaining application performance as data grows.

---

## Primary Indexes

Every table uses:

- PRIMARY KEY (`id`)

---

## Unique Indexes

The following fields require unique indexes:

- users.email
- user_sessions.session_token
- user_preferences.user_id
- user_achievements (user_id, achievement_id)
- task_categories (user_id, name)

---

## Search Indexes

Indexes should be created for frequently searched columns.

Examples:

- tasks.status
- tasks.priority
- tasks.due_date
- calendar_events.start_datetime
- notifications.is_read
- pomodoro_sessions.started_at

---

## Composite Indexes

Composite indexes should be added where filtering commonly occurs.

Examples:

```text
(user_id, status)

(user_id, due_date)

(user_id, created_at)

(user_id, notification_type)
```

---

# 24. Data Integrity Rules

The database must enforce the following integrity rules.

---

## Entity Integrity

- Every table must have a primary key.
- Primary keys cannot be NULL.

---

## Referential Integrity

- Foreign keys must reference valid parent records.
- Invalid references are not permitted.

---

## Domain Integrity

Examples:

- Email must be unique.
- Password hash cannot be empty for local accounts.
- Study duration must be positive.
- Priority values must match ENUM values.
- Status values must match ENUM values.

---

## Business Integrity

Examples:

- Users cannot access another user's records.
- Tasks always belong to one user.
- Subtasks always belong to one task.
- One achievement can only be awarded once per user.

---

# 25. Database Normalization

The StudySync database follows Third Normal Form (3NF).

Normalization goals include:

- Eliminate duplicate data.
- Reduce update anomalies.
- Improve consistency.
- Simplify maintenance.

Some analytical values may be calculated dynamically rather than stored to avoid redundant data.

---

# 26. Migration Strategy

Database changes should be managed using version-controlled migrations.

Recommended approach:

- Create migration files for every schema change.
- Never modify production tables manually.
- Review migrations before deployment.
- Test migrations in development before production.

Example migration sequence:

```text
001_create_users

002_create_user_preferences

003_create_tasks

004_create_task_categories

005_create_subtasks

006_create_calendar_events

007_create_pomodoro_sessions

008_create_notifications

009_create_achievements

010_create_user_achievements

011_create_ai_history
```

---

# 27. Backup & Recovery Strategy

To protect user data, the following practices are recommended.

- Perform regular database backups.
- Verify backup integrity.
- Maintain backup retention policy.
- Test restoration periodically.
- Store backups securely.

Future versions may support automated cloud backups.

---

# 28. Future Database Enhancements

Potential tables for future releases include:

| Table             | Purpose                           |
| ----------------- | --------------------------------- |
| reminders         | Multiple reminders per task/event |
| recurring_tasks   | Recurring task support            |
| recurring_events  | Recurring calendar events         |
| attachments       | Task and event attachments        |
| file_uploads      | File management                   |
| tags              | Reusable tagging system           |
| activity_logs     | User activity history             |
| refresh_tokens    | Secure authentication             |
| integrations      | External service integrations     |
| shared_workspaces | Team collaboration                |
| comments          | Collaboration comments            |
| audit_logs        | Administrative auditing           |

---

# 29. Database Performance Recommendations

To ensure long-term scalability:

- Use indexed columns for filtering and sorting.
- Avoid unnecessary joins.
- Select only required columns in queries.
- Paginate large datasets.
- Archive historical data if required.
- Optimize slow queries using EXPLAIN.
- Cache expensive calculations where appropriate.
- Calculate analytics dynamically unless performance requires caching.

---

# 30. Database Security Recommendations

The database should follow security best practices.

- Store passwords using bcrypt or Argon2.
- Never store plain-text passwords.
- Use prepared statements or ORM queries.
- Validate all user input.
- Restrict database user permissions.
- Store secrets in environment variables.
- Enable HTTPS for all production traffic.
- Regularly update database software and dependencies.

---

# 31. Database Summary

The StudySync MVP database consists of the following tables:

| Table             | Module           |
| ----------------- | ---------------- |
| users             | Authentication   |
| user_preferences  | User Preferences |
| study_goals       | Goal Management  |
| user_sessions     | Authentication   |
| task_categories   | Task Management  |
| tasks             | Task Management  |
| subtasks          | Task Management  |
| calendar_events   | Calendar         |
| pomodoro_sessions | Pomodoro         |
| notifications     | Notifications    |
| achievements      | Gamification     |
| user_achievements | Gamification     |
| ai_history        | AI Assistant     |

Total MVP Tables: **13**

The schema has been designed to be:

- Normalized (3NF)
- Scalable
- Maintainable
- Secure
- Extensible
- Optimized for modern web applications

This database structure provides a solid foundation for implementing the backend services, REST APIs, authentication system, and productivity features defined throughout the project documentation.

---

# 32. Document References

This document should be read alongside:

- 00-Vision.md
- 01-PRD.md
- 02-TechSpec.md
- 03-AppFlow.md
- 05-API.md
- 06-DesignSystem.md
- 07-ProjectStructure.md
- 08-Rules.md
- 09-ImplementationPlan.md
- 10-Tracker.md
- 11-ProductFeatures.md
- 12-NonGoals.md
- 13-Changelog.md

---

# 33. Revision History

| Version | Date       | Description                     |
| ------- | ---------- | ------------------------------- |
| 1.0.0   | 2026-07-06 | Initial database schema created |

---

# End of Database Schema Document
