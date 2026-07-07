# Project Review

**Project:** StudySync
**Reviewed Documents:** 00-Vision.md → 13-Changelog.md (14 documents)
**Review Type:** Pre-Development Documentation Audit
**Reviewer Role:** Senior Software Architect / Senior Engineer / Product Manager / UI-UX Reviewer / Documentation Reviewer
**Date:** 2026-07-07

---

## Executive Summary

StudySync's documentation set is unusually thorough for a pre-development stage. The Vision, PRD, Database Schema, Design System, and Implementation Plan documents are detailed, well-structured, and demonstrate genuine product thinking rather than boilerplate. The Database Schema in particular is production-grade in its treatment of normalization, indexing, and cascade rules.

However, the review surfaced a real scope contradiction (whether AI Assistant and Gamification belong to the MVP or Version 2 — different documents disagree), a materially thin API specification that omits endpoints for several features documented elsewhere as MVP-critical (Dashboard, Analytics, Achievements, Search), a handful of database fields referenced by the PRD that don't exist in the schema (weekly goal, onboarding user type, task tags, task color labels, "default category" flag), and several unresolved technical decisions (ORM/query layer, validation library, state-management/data-fetching strategy, email service, AI provider, logging/monitoring) that a document calling itself a "Technical Specification" would normally pin down.

None of these are signs of poor engineering judgment — they are the expected seams in a fast-moving, single-author documentation pass. Most are fixable with edits to existing documents rather than redesign. The project is close to development-ready, but a short, focused fix pass (roughly a day of documentation work) will save real rework once backend/API code is written against these docs.

**Overall documentation quality:** High — clear writing, consistent formatting, strong domain understanding.
**Overall project quality:** Solid, well-scoped productivity SaaS concept with realistic MVP boundaries (see 12-NonGoals.md, which is genuinely good scope discipline).
**Overall architecture quality:** Reasonable and conventional (layered Express backend, Next.js frontend) but under-specified in places that matter (data layer, state management, observability).
**Overall readiness for development:** Ready to start Phases 1–3 (init, auth, layout) now. Phases 4 and onward (Dashboard, Analytics, Gamification, AI) should wait for the scope and API gaps below to be resolved first.

---

## Project Score

| Area | Score |
|---|---|
| Vision | 9/10 |
| PRD | 7/10 |
| Architecture | 6/10 |
| Database | 7/10 |
| API | 5/10 |
| Design System | 8/10 |
| Documentation (cross-document quality) | 6/10 |
| Implementation Plan | 7/10 |
| **Overall** | **7/10** |

---

## Strengths

- **Vision document** is genuinely well-written: clear problem statement, honest "What StudySync Is Not" section (00-Vision.md §14), and a philosophy ("productivity should feel effortless") that actually shows up consistently in later documents rather than being forgotten.
- **12-NonGoals.md** is one of the strongest documents in the set — it shows real scope discipline (no collaboration, no LMS, no payments, no public API) and gives a clear decision framework (§5) for future feature requests. Many student projects skip this entirely.
- **Database Schema** is excellent for a planning-stage document: consistent naming conventions, explicit cascade rules, a dedicated indexing strategy section, and normalization rationale. Foreign keys and relationships are enumerated in three different ways (per-table, relationship summary table, ERD diagram) which makes it easy to cross-check.
- **Implementation Plan** phase ordering is logically sound: Init → Auth → Layout → Dashboard → Task Management → Calendar → Pomodoro → Goals → Notifications, matching real dependency order (you need auth before a dashboard, a layout before feature pages, tasks before pomodoro-task linking, etc.).
- **Design System** color, spacing, and typography choices are specific and usable immediately (exact hex codes, 8-point spacing scale, named breakpoints) rather than vague guidance.
- **AI feature framing is disciplined**: BR-004 ("AI must never modify user data automatically") and the AI Assistant's explicit "optional, user must accept" model (01-PRD.md §26.5) is a mature product decision that avoids a common pitfall of over-trusting AI output.
- Documents consistently cross-reference each other via "Related Documents" / "Document References" sections, showing intent to keep the doc set navigable.

---

## Issues

### 🔴 Critical

**1. AI Assistant and Gamification: MVP or Version 2? Documents disagree.**
Affected: 00-Vision.md, 01-PRD.md, 11-ProductFeatures.md, 09-ImplementationPlan.md
- 00-Vision.md §11 lists the MVP scope (Authentication, Dashboard, Task Management, Pomodoro, Calendar, Progress Analytics, User Profile) — **no AI Assistant, no Gamification.** Vision's own "Version 2" list explicitly includes "AI Study Planner," "AI Schedule Optimization," and "Achievement Dashboard."
- 01-PRD.md §39 "MVP Scope" (the document's own authoritative summary) also excludes AI Assistant and Gamification entirely, while §40 "Version 2 Scope" lists "AI Planner" there instead.
- Yet 01-PRD.md §23 (Gamification) and §26 (AI Assistant) are written as full, numbered functional-requirement sections indistinguishable in treatment from indisputably-MVP sections like Task Management or Calendar — with no "Version 2" label attached.
- 11-ProductFeatures.md explicitly lists MVP features for both: Gamification MVP includes "Daily Streak, Achievement Badges, Rewards System, User Avatar, Milestone Celebrations"; AI Assistant MVP includes "AI Schedule Optimization, AI Study Time Estimation."
- 09-ImplementationPlan.md schedules Phase 10 (Gamification) and Phase 11 (AI Assistant) sequentially inside the main roadmap, before Phase 14 (Testing) and Phase 15 (Deployment) — implying they must ship before v1 goes live.

**Why it matters:** This isn't a cosmetic inconsistency — it changes the MVP timeline, the AI provider/cost decision, and the database work required (achievements tables, ai_history table) before "done" can be declared. A developer following the Implementation Plan will build AI + Gamification into v1; a developer following Vision/PRD §39 will cut them. Left unresolved, this becomes a scope argument mid-project.

**Recommended solution:** Pick one interpretation and make every document say the same thing. Given the schema, API groups, and Implementation Plan phases already assume these features exist pre-launch, the pragmatic fix is likely to promote a *minimal* AI Assistant and Gamification into MVP (as 11-ProductFeatures.md already scopes narrowly: 2 AI features, 5 gamification features) and update 00-Vision.md §11 and 01-PRD.md §39 to include them explicitly — rather than tearing them out of the Implementation Plan and database schema.

---

**2. API documentation is missing endpoints for features other documents mark as MVP-critical.**
Affected: 05-API.md, 01-PRD.md, 09-ImplementationPlan.md, 04-DatabaseSchema.md
- **Dashboard:** 01-PRD.md §17 and 09-ImplementationPlan.md Phase 4 both require a "Dashboard summary API, Statistics API, Recent activity API." 05-API.md has zero `/dashboard` endpoints.
- **Analytics:** 01-PRD.md §21 (FR-ANL-001 through 008) and 11-ProductFeatures.md (Priority: High, 8 MVP features) both treat Analytics as core MVP. 05-API.md not only omits analytics endpoints — it explicitly lists **"Analytics APIs" under §15 "Future APIs,"** directly contradicting the PRD's MVP designation.
- **Gamification/Achievements:** `achievements` and `user_achievements` tables exist in 04-DatabaseSchema.md, and 09-ImplementationPlan.md Phase 10 requires "Achievement APIs." 05-API.md has no achievement endpoints at all.
- **Global Search:** 01-PRD.md §27 (FR-SEARCH-001 through 004) and 11-ProductFeatures.md both spec this as MVP. 05-API.md has no `/search` endpoint.
- **Settings actions:** 09-ImplementationPlan.md Phase 13 requires "Update password API" and "Delete account API" (also required by 01-PRD.md FR-SET-005). 05-API.md's User APIs section has only profile/preferences GET/PUT — no password-change or account-deletion endpoint.

**Why it matters:** 05-API.md is the document backend implementation will be built directly against. As written, a developer following it would ship a product missing Dashboard data, Analytics, Achievements, Search, and account deletion — features the PRD explicitly requires and the Implementation Plan explicitly schedules. This is the single largest gap between what the product is supposed to do and what the API spec says it does.

**Recommended solution:** Add endpoint groups for Dashboard, Analytics, Achievements, and Search to 05-API.md, and move "Analytics APIs" out of the Future APIs list. Add `PUT /users/password` and `DELETE /users/account` (or equivalent) to the User APIs section.

---

**3. Profile picture upload contradicts the Non-Goals exclusion of file storage.**
Affected: 01-PRD.md (FR-PROF-001), 04-DatabaseSchema.md (`users.profile_image`), 12-NonGoals.md (§3.11)
FR-PROF-001 ("Users shall be able to update their profile picture," Priority: High) implies an upload capability. 12-NonGoals.md §3.11 explicitly excludes "Cloud File Storage" from the MVP, including "Images." The `users.profile_image` column is a VARCHAR(500) URL field, suggesting the actual intended behavior is "paste an image URL" rather than "upload a file" — but no document says this explicitly.

**Why it matters:** Without clarification, this reads as a genuine contradiction and will likely surface as a "wait, are we integrating Cloudinary or not?" question mid-Phase-12. (11-ProductFeatures.md §19 does list "Cloudinary Integration" under Version 2, which supports the "URL-only in MVP" interpretation — but this needs to be stated in the PRD itself, not inferred.)

**Recommended solution:** Add one sentence to 01-PRD.md §24 (User Profile) clarifying that MVP profile pictures are set via URL/Google-provided avatar only, with file upload deferred to the Version 2 Cloudinary integration already planned.

---

**4. Database schema is missing fields for features the PRD documents as MVP.**
Affected: 04-DatabaseSchema.md, 01-PRD.md, 03-AppFlow.md
- **Onboarding "User Type" selection** (03-AppFlow.md §12, 01-PRD.md §16.4: "Select User Type (Student/Professional/Other)") has no column anywhere — not in `users`, not in `user_preferences`. There is currently nowhere to persist this answer.
- **Weekly Goal**: the Dashboard (01-PRD.md §17.4, 11-ProductFeatures.md) displays a "Weekly Goal" widget, and 01-PRD.md §33 has an explicit validation rule ("Weekly goal must be greater than or equal to the daily goal"), but no `weekly_goal_hours` (or equivalent) field exists anywhere in the schema — `user_preferences` only has `daily_goal_hours`, and `study_goals` is a generic long-term goal table, not a weekly-cadence one.
- **Task Tags and Color Labels**: 01-PRD.md (FR-TASK-008, FR-TASK-009) and 11-ProductFeatures.md list "Tags" and "Color Labels" as MVP Task Management features, but the `tasks` table has no `tags` or `color` column, and a `tags` table is explicitly listed under 04-DatabaseSchema.md §28 "Future Database Enhancements" — meaning the schema currently defers to Version 2 a feature the PRD marks as MVP.
- **"Default categories" business rule with no supporting field**: 04-DatabaseSchema.md §12 states "Default categories cannot be deleted," but there is no `is_default` (or similar) column on `task_categories`, and no document defines what the default categories actually are or how they get seeded.

**Why it matters:** These aren't hypothetical future needs — they're fields required by features the PRD calls MVP. If backend work starts from the schema as currently written, these will be discovered as bugs during Task Management (Phase 5) or Onboarding (Phase 2/3) implementation rather than caught now.

**Recommended solution:** Either add the missing columns (`users.user_type`, `user_preferences.weekly_goal_hours`, `tasks.tags`/`tasks.color`, `task_categories.is_default`) or explicitly downgrade Tags/Color Labels/Weekly Goal to Version 2 in the PRD and ProductFeatures documents — but make the schema and the feature list agree.

---

### 🟠 Major

**5. No account-linking rule for matching emails across auth providers.**
Affected: 01-PRD.md §15, 03-AppFlow.md §11.2, 04-DatabaseSchema.md §7
If a user registers with `alex@example.com` via email/password, then later clicks "Continue with Google" using the same Google account email, no document specifies whether this links to the existing account, errors out, or silently creates a second account (which the unique-email constraint would actually reject, producing an unhandled edge case). This is one of the most common real-world auth bugs and should have an explicit business rule.
**Recommendation:** Add a business rule to 01-PRD.md §15.5 stating the expected behavior (e.g., "matching email on Google Sign-In links to the existing local account" or "results in a clear conflict error directing the user to sign in with their original method").

**6. "Forgot Password" flow doesn't account for Google-only accounts.**
Affected: 01-PRD.md §15, 03-AppFlow.md §11.2, 04-DatabaseSchema.md §7
Google-authenticated users have `password_hash = NULL`. If such a user goes to "Forgot Password" and enters their email, no document defines the expected behavior. This should short-circuit to a message like "This account uses Google Sign-In" rather than attempting a password reset on a null hash.
**Recommendation:** Add this as an explicit edge case in 01-PRD.md §15.8 (Error State).

**7. No ORM/query-layer, validation library, or state-management decision recorded.**
Affected: 02-TechSpec.md, 07-ProjectStructure.md
02-TechSpec.md is the thinnest document in the set (224 lines vs. 1,800+ for the Database Schema) and doesn't specify: which MySQL client/ORM will be used (Prisma, Sequelize, TypeORM, raw `mysql2`), which validation library backs the `validations/` folder (Joi, Zod, express-validator), or what handles client-side data fetching/caching for a dashboard that needs to stay in sync across Tasks/Calendar/Analytics/Notifications (React Query/SWR vs. plain Context+fetch). Given how detailed the Database Schema and Design System are, this is a real gap for a document literally named "Technical Specification."
**Recommendation:** Add a short "Key Library Decisions" section to 02-TechSpec.md naming the ORM, validator, and client data-fetching approach — even a one-line decision per item is enough at this stage.

**8. No logging/monitoring/observability strategy anywhere in the doc set.**
Affected: 02-TechSpec.md, 07-ProjectStructure.md, 08-Rules.md
07-ProjectStructure.md mentions "Configure logging" (Phase 1) but no document names a logging library (Winston/Pino) or any error-monitoring service (Sentry or similar). For a project whose stated goal is demonstrating "professional software engineering practices" (00-Vision.md §12), silent production failures with no visibility is a notable gap.
**Recommendation:** Add a brief Observability subsection to 02-TechSpec.md — even "structured console logging in MVP, Sentry integration deferred to V2" is sufficient to close the gap.

**9. No timezone storage strategy despite an explicit timezone requirement.**
Affected: 04-DatabaseSchema.md, 01-PRD.md §19.5
01-PRD.md §19.5 states "Dates follow the user's local timezone," but every date/time column in 04-DatabaseSchema.md is a plain `DATETIME` with no documented convention for storing UTC and converting on display (vs. storing local time directly). This is one of the most common sources of scheduling-app bugs (calendar events off by hours after a DST change or a user traveling).
**Recommendation:** Add one line to 04-DatabaseSchema.md §3 (Design Principles) committing to "store all datetimes in UTC; convert to user-local time at the presentation layer."

**10. Testing strategy is entirely manual, with no automated testing plan for MVP.**
Affected: 08-Rules.md §16, 09-ImplementationPlan.md Phase 14
Both documents describe testing purely as manual verification ("Verify functionality manually," "Future versions may include automated testing"). Given the Vision document's explicit goal of demonstrating engineering rigor for a portfolio (00-Vision.md §12: "Software Engineering Quality"), shipping an entire MVP with zero automated tests undercuts that stated goal and creates real regression risk as 16 phases accumulate.
**Recommendation:** Consider at minimum a lightweight automated test layer (e.g., API integration tests with Jest/Supertest) for Phase 14, even if full unit-test coverage is deferred.

**11. Database Schema's own "Core Tables Overview" table doesn't match its final table list — and includes a table that doesn't exist.**
Affected: 04-DatabaseSchema.md §6 vs. §31
§6 ("Core Tables Overview," early in the document) lists 11 tables including `analytics` — but no `analytics` table is ever defined anywhere in the document; §25 and §29 explicitly state analytics values "may be calculated dynamically rather than stored." §6 also omits `study_goals`, `user_sessions`, and `user_achievements`, all of which are fully defined later and included in the correct final count in §31 ("Total MVP Tables: 13"). The Entity Relationship Overview diagram in §5 repeats the same error, showing "Analytics" as a child table of Users.
**Why it matters:** This is an internal contradiction within a single document, not just cross-document — it will confuse anyone using §5/§6 as a quick-reference instead of reading the full 1,800-line document.
**Recommendation:** Fix §5 and §6 to match the accurate table list already present in §31.

**12. Stray non-document content embedded inside 04-DatabaseSchema.md.**
Affected: 04-DatabaseSchema.md, between "End of Part 4" and "PART 5" (around the current line ~1408)
A section titled "🔍 Database Review (Very Important)" appears mid-document, written in first person ("Now that we've designed almost the entire schema, I noticed three improvements... before we write Part 5"), recommending soft deletes, UUIDs, and audit fields. This reads as leftover AI/author conversational scratch content that was never cleaned out of the final document — it isn't formatted like any other section, has no heading number, and its recommendations were never actually adopted in the schema that follows (no `deleted_at`, no `uuid` column, no `created_by`/`updated_by` appear in any table definition). Note: this content does not instruct any harmful action and was treated purely as a documentation defect, not a security concern.
**Recommendation:** Remove this section, or if the recommendations are worth considering, convert them into a proper numbered subsection or a tracked follow-up item instead of leaving it as an unlabeled aside.

**13. 10-Tracker.md is already stale relative to the actual state of the documentation set.**
Affected: 10-Tracker.md §3, §7, §8
The Tracker lists `12-NonGoals.md` and `13-Changelog.md` as "⬜ Pending" and includes "Complete NonGoals.md" / "Complete Changelog.md" under Pending Tasks — but both documents exist and are complete (this review read their full final content). Since the Tracker's stated purpose (§1) is to be the authoritative record of "what has already been completed," it is currently inaccurate on the one thing it's supposed to track most reliably.
**Recommendation:** Update 10-Tracker.md now, before development begins, so it starts Phase 1 as an accurate source of truth rather than already out of date.

---

### 🟡 Minor

**14. Grammar/typo:** 01-PRD.md FR-AUTH-004: "Users shall be be able to reset forgotten passwords" (duplicated "be be").

**15. Duplicate Logout Flow diagrams:** 03-AppFlow.md documents an essentially identical Logout Flow twice — §15 (Part 2) and §32 (Part 4) — with the same diagram and nearly the same rules text. Consider keeping the detailed version once and cross-referencing it from the other location.

**16. Frontend router ambiguity:** 07-ProjectStructure.md lists both `app/` (App Router) and `pages/ (if required)` in the frontend structure without clarifying whether Pages Router will ever actually be used. For a Next.js project, mixing both router paradigms is usually intentional-or-nothing; the "(if required)" hedge should be resolved one way or the other.

**17. Backend "models" vs. "repositories" overlap unclear:** 07-ProjectStructure.md lists both a `models/` folder ("Database models / ORM") and a `repositories/` folder ("Database operations") without clarifying the division of responsibility between them — this ties back to Major Issue #7 (no ORM decision recorded).

**18. Notification preferences are all-or-nothing at the schema level:** `user_preferences.notifications_enabled` is a single boolean, but 01-PRD.md FR-SET-002 ("Configure notification preferences") and the variety of notification types in 04-DatabaseSchema.md (`task`, `goal`, `calendar`, `achievement`, `system`) implies users might expect per-category control. Not necessarily wrong for MVP, but worth an explicit "all-or-nothing in MVP, per-category in V2" note to avoid ambiguity later.

**19. Changelog header format differs from every other document:** 13-Changelog.md lacks the Project/Version/Status/Author/Created/Last Updated metadata block that all 13 other documents open with. Minor, but noticeable given how consistent the rest of the set is.

**20. "Related Documents" lists are inconsistently populated across documents** — some documents' cross-reference lists omit 10-Tracker.md or 13-Changelog.md while others include them, with no apparent logic to the omissions. Not a functional problem, just a polish item.

**21. Task due-date edit ambiguity:** 01-PRD.md §18.5 states due dates "cannot be in the past during creation," but doesn't clarify whether this validation also applies when *editing* an already-overdue task (a common real scenario: user updates notes on a task they missed).

---

### 🔵 Suggestion

**22. Consider API versioning** (e.g., `/api/v1/...`) in 05-API.md's Base URL section — currently absent, and cheap to add now versus retrofitting later.

**23. Consider documenting request/response JSON payloads per endpoint** in 05-API.md rather than only endpoint tables. Right now only the generic success/error envelope is shown; given how detailed 04-DatabaseSchema.md's field-level documentation is, the API doc reads as noticeably less rigorous by comparison.

**24. Consider a documented refresh-token strategy for V2** — currently JWT expiration forces a full re-login with no graceful renewal (03-AppFlow.md §26 already flags this as a future item, which is a reasonable MVP simplification, just worth keeping visible in the API doc too).

**25. Consider explicitly naming the AI provider** in 02-TechSpec.md. The database schema's example record in 04-DatabaseSchema.md §19 (`ai_history`) uses `"model_name": "Grok-4"` as sample data, which reads as if a specific vendor decision has already been made — but no other document confirms which AI API will actually be integrated, or budgets for its cost/rate limits.

---

## Cross-Document Consistency

| Check | Result |
|---|---|
| Tech stack matches across Vision/PRD/TechSpec/ProjectStructure | ✅ Consistent (Next.js, Express, MySQL, JWT + Google OAuth, Vercel/Railway everywhere) |
| Document filenames referenced consistently (no stale `04-DatabaseDesign.md` / `11-Features.md` references) | ✅ Clean — verified via search, no leftover references to renamed files |
| MVP scope: AI Assistant & Gamification | ❌ Contradicts across Vision §11, PRD §39/§40, ProductFeatures, ImplementationPlan (see Critical #1) |
| API endpoints vs. PRD-defined MVP features | ❌ Dashboard, Analytics, Achievements, Search, password/account endpoints missing from 05-API.md (see Critical #2) |
| Database fields vs. PRD-required MVP features | ❌ Missing `user_type`, weekly goal field, task tags/color, default-category flag (see Critical #4) |
| Non-Goals vs. PRD feature list | ❌ Profile picture upload (PRD) vs. no file storage (NonGoals §3.11) (see Critical #3) |
| Database Schema internal consistency (§6 overview vs. §31 final list) | ❌ Internally inconsistent — phantom `analytics` table, missing `study_goals`/`user_sessions`/`user_achievements` from §6 (see Major #11) |
| Tracker vs. actual documentation state | ❌ Stale — marks completed docs as pending (see Major #13) |
| Design System color/theme defaults vs. Database defaults | ✅ Consistent (`user_preferences.theme` defaults to `'dark'`, matching Design System's stated dark-mode-default) |
| Implementation Plan phase order vs. logical dependencies | ✅ Sound (Auth → Layout → Dashboard → Tasks → Calendar → Pomodoro → Goals → Notifications → Gamification → AI → Profile → Settings → Testing → Deployment) |
| Business rules (BR-001 through BR-006 in PRD) vs. Database cascade rules | ✅ Consistent (cascade-delete-on-user-removal matches BR-003's "permanently removed" stance) |

---

## Missing Items

- API endpoint groups for **Dashboard**, **Analytics**, **Achievements/Gamification**, and **Global Search** (05-API.md).
- Database fields for **onboarding user type**, **weekly study goal**, **task tags**, **task color labels**, and a **default-category flag** (04-DatabaseSchema.md).
- A named **ORM/query layer**, **validation library**, and **frontend data-fetching/state-management** approach (02-TechSpec.md).
- A named **logging and error-monitoring** approach (02-TechSpec.md).
- An explicit **timezone storage convention** (UTC vs. local) (04-DatabaseSchema.md).
- A business rule for **duplicate-email account linking across auth providers** (01-PRD.md).
- A business rule for **"Forgot Password" on a Google-only account** (01-PRD.md).
- Clarification of **profile picture upload mechanism** given the file-storage Non-Goal (01-PRD.md / 12-NonGoals.md).
- An explicit, single answer to **"is AI Assistant / Gamification in the MVP?"** applied consistently across all four affected documents.
- A minimal **automated testing plan** for MVP (08-Rules.md / 09-ImplementationPlan.md Phase 14), even if lightweight.
- Named **AI provider** decision (currently only implied by an example value in sample JSON).

---

## Final Recommendation

**⚠ Ready after minor fixes**

The documentation set reflects real product and engineering thought — this is not a case of thin or contradictory planning overall. Phases 1–3 of the Implementation Plan (Project Initialization, Authentication, Application Layout) can begin immediately; nothing found here blocks that work.

Before starting Phase 4 (Dashboard) and beyond, resolve the four 🔴 Critical items — they are all documentation edits, not redesigns:
1. Decide, once, whether AI Assistant and Gamification are MVP or V2, and make Vision/PRD/ProductFeatures/ImplementationPlan agree.
2. Add the missing Dashboard, Analytics, Achievements, and Search endpoint groups to 05-API.md (and remove Analytics from the "Future APIs" list).
3. Clarify the profile-picture-upload mechanism against the file-storage Non-Goal.
4. Add the missing database columns (or formally defer the features that need them) so Task Management, Onboarding, and Dashboard implementation don't stall on undiscovered schema gaps.

The 🟠 Major items (auth edge cases, missing tech-stack decisions, the Database Schema's internal §6/§31 mismatch, the stray embedded text, the stale Tracker) are worth an hour or two of cleanup but don't need to block Phase 1 from starting today. The 🟡 Minor and 🔵 Suggestion items can reasonably be handled during development itself, per this project's own Documentation Rules (08-Rules.md §11: "keep documentation synchronized with the implementation").
