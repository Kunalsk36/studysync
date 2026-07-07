# Project Structure

**Project:** StudySync  
**Version:** 1.0.0  
**Status:** Draft  
**Author:** Kunal Shrikant Kavathekar  
**Created:** 2026-07-06  
**Last Updated:** 2026-07-06

---

# 1. Purpose

This document defines the directory structure, file organization, and development conventions used throughout the StudySync project.

Its purpose is to ensure that every developer understands where code belongs, how modules are organized, and how the project should evolve as new features are added.

A consistent project structure improves maintainability, scalability, readability, and team collaboration.

---

# 2. Repository Structure

StudySync follows a **single repository (monorepo)** approach.

```
StudySync/
│
├── frontend/
├── backend/
├── docs/
├── .gitignore
├── README.md
└── LICENSE
```

## Folder Overview

| Folder    | Purpose               |
| --------- | --------------------- |
| frontend  | Next.js application   |
| backend   | Express.js REST API   |
| docs      | Project documentation |
| README.md | Project overview      |
| LICENSE   | License information   |

---

# 3. Frontend Structure

The frontend is built using **Next.js**.

```
frontend/
│
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── layouts/
│   ├── pages/ (if required)
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── lib/
│   ├── utils/
│   ├── constants/
│   ├── styles/
│   ├── assets/
│   └── types/ (Future)
│
├── package.json
└── next.config.js
```

### Folder Responsibilities

| Folder     | Purpose                    |
| ---------- | -------------------------- |
| app        | Next.js App Router pages   |
| components | Reusable UI components     |
| layouts    | Shared layouts             |
| hooks      | Custom React hooks         |
| services   | API communication          |
| context    | Global state               |
| lib        | Third-party configurations |
| utils      | Utility functions          |
| constants  | Application constants      |
| styles     | Global styles              |
| assets     | Images, icons, fonts       |

---

# 4. Backend Structure

The backend follows a layered architecture.

```
backend/
│
├── src/
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middleware/
│   ├── models/
│   ├── validations/
│   ├── utils/
│   ├── constants/
│   ├── database/
│   ├── jobs/
│   └── server.js
│
├── package.json
└── .env
```

### Folder Responsibilities

| Folder       | Purpose                     |
| ------------ | --------------------------- |
| config       | Application configuration   |
| routes       | API route definitions       |
| controllers  | Handle HTTP requests        |
| services     | Business logic              |
| repositories | Database operations         |
| middleware   | Authentication & middleware |
| models       | Database models / ORM       |
| validations  | Request validation          |
| utils        | Helper functions            |
| constants    | Shared constants            |
| database     | Database configuration      |
| jobs         | Scheduled background jobs   |

---

# 5. Documentation Structure

All project documentation is stored inside the `docs` folder.

```
docs/
│
├── 00-Vision.md
├── 01-PRD.md
├── 02-TechSpec.md
├── 03-AppFlow.md
├── 04-DatabaseSchema.md
├── 05-API.md
├── 06-DesignSystem.md
├── 07-ProjectStructure.md
├── 08-Rules.md
├── 09-ImplementationPlan.md
├── 10-Tracker.md
├── 11-ProductFeatures.md
├── 12-NonGoals.md
└── 13-Changelog.md
```

These documents should remain synchronized with the implementation throughout development.

---

# 6. Naming Conventions

To maintain consistency, the following naming conventions should be followed.

## Files

- Use **camelCase** for JavaScript files.
- Use **PascalCase** for React components.

Examples:

```
taskService.js
userController.js
DashboardCard.jsx
LoginForm.jsx
```

---

## Folders

Use **lowercase** names.

Examples:

```
components
services
middleware
utils
```

---

## Variables

Use **camelCase**.

Example:

```javascript
const currentUser = {};
const totalTasks = 10;
```

---

## Constants

Use **UPPER_SNAKE_CASE**.

Example:

```javascript
const MAX_TASK_LIMIT = 100;
```

---

# 7. Module Organization

Every major feature should remain self-contained.

Typical backend flow:

```
Route
   │
Controller
   │
Service
   │
Repository
   │
Database
```

Typical frontend flow:

```
Page
   │
Components
   │
Hooks
   │
Service
   │
API
```

This separation keeps the code modular and easier to maintain.

---

# 8. Shared Development Guidelines

The following practices should be followed across the project:

- Keep functions small and focused.
- Reuse components whenever possible.
- Avoid duplicated logic.
- Separate UI from business logic.
- Store configuration in environment variables.
- Organize imports consistently.
- Remove unused files and dependencies.

---

# 9. Future Expansion

The current structure is designed to support future additions such as:

- Mobile application
- Admin dashboard
- Team collaboration
- File uploads
- AI integrations
- Third-party integrations
- Automated testing
- CI/CD pipelines

These features can be added without requiring significant restructuring.

---

# 10. Related Documents

This document should be used together with:

- 00-Vision.md
- 01-PRD.md
- 02-TechSpec.md
- 03-AppFlow.md
- 04-DatabaseSchema.md
- 05-API.md
- 06-DesignSystem.md
- 08-Rules.md
- 09-ImplementationPlan.md

---

# 11. Project Structure Summary

StudySync follows a clean and modular architecture with a clear separation between frontend, backend, and documentation.

The project structure is designed to:

- Improve maintainability
- Support scalability
- Encourage code reuse
- Simplify onboarding
- Enable future expansion

Following this structure throughout development will help ensure a consistent and organized codebase.

---

# End of Project Structure Document
