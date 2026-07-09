# Changelog

**Project:** StudySync
**Version:** 1.1.0
**Status:** Active Development
**Author:** Kunal Shrikant Kavathekar
**Created:** 2026-07-06
**Last Updated:** 2026-07-09

---

All notable changes to the StudySync project will be documented in this file.

This project follows a structured changelog to record major milestones, new features, improvements, bug fixes, and documentation updates throughout the development lifecycle.

---

## Version Format

StudySync follows Semantic Versioning (SemVer).

```
MAJOR.MINOR.PATCH

Example:

1.0.0
│ │ └── Bug Fixes
│ └──── New Features
└────── Major Release
```

### Version Definitions

- **MAJOR** – Significant changes or breaking updates.
- **MINOR** – New features and enhancements.
- **PATCH** – Bug fixes, documentation updates, and minor improvements.

---

# [1.1.0] - 2026-07-09

## Added

### Frontend

- Committed the high-fidelity frontend prototype: Next.js App Router, Tailwind CSS design tokens, Framer Motion, all 15 MVP pages (Landing, Login, Register, Dashboard, Tasks, Calendar, Pomodoro, Study Goals, Analytics, Notifications, Achievements, AI Assistant, Profile, Settings, 404) with realistic mock data.

### Tooling

- Configured Prettier at the repository root, integrated with the frontend's ESLint setup via `eslint-config-prettier`.

### Backend

- Initialized the Express backend with the full layered folder structure defined in `07-ProjectStructure.md` (`config/`, `routes/`, `controllers/`, `services/`, `repositories/`, `middleware/`, `models/`, `validations/`, `utils/`, `constants/`, `database/`, `jobs/`) and a `server.js` entry point.
- Configured Express with `dotenv`, JSON/URL-encoded body parsing, CORS, and centralized configuration loading.
- Installed and configured `mysql2` with a connection pool and startup connection verification (no tables or migrations — Phase 1 scope only).
- Installed `joi` and established the `validations/` folder structure (no schemas yet).
- Configured structured logging via `winston`, per the logging strategy decided in `02-TechSpec.md` §7.1.
- Added the `/health` endpoint (routed through controller → service) as the only API endpoint in this phase.

### Environment

- Populated `.env.example` with all documented placeholders: `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AI_PROVIDER`, `FRONTEND_URL`.

## Changed

- Phase 1 – Project Initialization marked complete in `10-Tracker.md`.

---

# [1.0.0] - 2026-07-06

## Added

### Project Planning

- Defined project vision and objectives.
- Created Product Requirements Document (PRD).
- Documented complete product feature inventory.
- Designed application flow.
- Designed database schema.
- Defined API structure.
- Created technical specification.
- Established design system.
- Defined project folder structure.
- Created development rules.
- Created implementation roadmap.
- Created project tracker.
- Defined MVP non-goals.

### Architecture

- Selected Next.js for frontend development.
- Selected Node.js and Express.js for backend development.
- Selected MySQL as the primary database.
- Adopted a layered backend architecture.
- Chose JWT and Google OAuth for authentication.

### Documentation

Created the following project documents:

- 00-Vision.md
- 01-PRD.md
- 02-TechSpec.md
- 03-AppFlow.md
- 04-DatabaseSchema.md
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

## Changed

- Initial project planning completed.
- Documentation structure finalized.
- Development roadmap established.

---

## Fixed

- No fixes in the initial release.

---

## Removed

- No removals in the initial release.

---

# [1.0.1] - 2026-07-07

## Added

- Full documentation review across all 14 documents (`docs/Review.md`).
- Root `.gitignore` and GitHub repository connection (`Kunalsk36/studysync`).
- Missing API endpoint groups: Dashboard, Analytics, Achievements, Search; password-change and account-deletion endpoints.
- Missing database fields: `users.user_type`, `user_preferences.weekly_goal_hours`, `tasks.tags`, `tasks.color`, `task_categories.is_default`.
- Key tooling decisions recorded in `02-TechSpec.md` (query layer, validation library, frontend state approach, logging, AI provider, timezone convention).

## Changed

- Confirmed AI Assistant and Gamification as basic-scope MVP modules (not Version 2) across Vision, PRD, Product Features, and Implementation Plan.
- Clarified profile picture handling in the MVP (URL/Google avatar only, no file upload).
- Clarified several business rules: cross-provider account linking, Forgot Password on Google-only accounts, task due-date validation on edit vs. creation, notification preference granularity.

## Fixed

- Corrected internal mismatch in `04-DatabaseSchema.md` between the early table overview and the final 13-table schema (removed a phantom "analytics" table, added missing tables to the overview).
- Removed stray, non-canonical content accidentally left in `04-DatabaseSchema.md`.
- Fixed a grammar typo in `01-PRD.md` (FR-AUTH-004).
- Consolidated duplicate Logout Flow diagrams in `03-AppFlow.md`.
- Resolved Next.js router ambiguity in `07-ProjectStructure.md` (App Router only).

---

# Future Releases

Future versions will be added below using the same format.

Example:

## [1.1.0]

### Added

- Authentication module
- Login page
- Registration page

### Changed

- Improved validation

### Fixed

- Login API validation issue

---

## Changelog Guidelines

When updating this document:

- Add the newest version at the top.
- Use Semantic Versioning.
- Record only meaningful project changes.
- Keep entries concise and descriptive.
- Group changes under:
  - Added
  - Changed
  - Fixed
  - Removed

---

# Related Documents

This changelog should be maintained alongside:

- 09-ImplementationPlan.md
- 10-Tracker.md
- 11-ProductFeatures.md

---

# End of Changelog
