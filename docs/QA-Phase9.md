# Phase 9: Notifications – QA Report

## Scope
This QA encompasses all functionality introduced during Phase 9 (Tasks 1 through 5): Database Schema, Backend APIs, Scheduled Notification Jobs, Pomodoro Event-Driven Triggers, and Frontend UI Integration.

## Database Testing
- **Verdict**: PASS
- **Details**: Verified the `notifications` schema has required fields (`id`, `user_id`, `title`, `message`, `notification_type`, `is_read`, `scheduled_at`, `created_at`, `dedupe_key`). Confirmed `UNIQUE(user_id, dedupe_key)` constraint and foreign key cascading.

## Migration Testing
- **Verdict**: PASS
- **Details**: `npm run migrate` executes safely and exits gracefully with no pending migrations upon consecutive runs. Historical migrations remain untouched.

## Notification API Testing
- **Verdict**: PASS
- **Details**: Full API integration regression test (`notification.test.js`) successfully completed with 100% pass rate. Tested empty states, error handling, validation, and proper endpoints (`GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`, `DELETE /api/notifications/:id`).

## Scheduled Notification Testing
- **Verdict**: PASS
- **Details**: The 5-minute polling interval properly enforces the 24h and 1h timing windows for Tasks/Exams and 9:00 AM (server time) for Goal reminders. Scheduler gracefully handles duplicate polling via deduplication logic.

## Pomodoro Event-Trigger Testing
- **Verdict**: PASS
- **Details**: Completion (`status = 'completed'`) correctly triggers notification creation with the `pomodoro_{sessionId}_completed` dedupe key. Cancellation, interruption, and resets yield no notification. Goal and task relationships are unaffected.

## Frontend Testing
- **Verdict**: PASS
- **Details**: `NotificationsPage` accurately maps API payload, displaying correct icon logic by `notification_type` and correctly evaluating formatting differences. Empty, loading, and error states behave accordingly.

## Navbar Badge Testing
- **Verdict**: PASS
- **Details**: Real data unread counts dynamically load on startup using the backend. Clicking "Mark all as read" correctly reduces it to zero instantly via optimistic state updates.

## Authentication/Ownership Testing
- **Verdict**: PASS
- **Details**: Strict user segregation via tests. User A is securely walled off from reading, modifying, or deleting User B's notifications.

## Notification Preference Testing
- **Verdict**: PASS
- **Details**: Evaluated behavior when `notifications_enabled` is set to `0`. Both scheduled jobs and event-driven Pomodoro triggers silently abort insertion without compromising core functions or triggering crash loops.

## Idempotency Testing
- **Verdict**: PASS
- **Details**: Re-executing completions and job triggers explicitly does not trigger duplicate entries into the database. `ER_DUP_ENTRY` errors are successfully caught without escalating into a 500 error.

## Failure Handling
- **Verdict**: PASS
- **Details**: Injected API fetch failure and handled database rejection seamlessly. Triggers display `useToast()` user-friendly error banners avoiding full-page crashes.

## Responsive Testing
- **Verdict**: PASS
- **Details**: UI retains clean structure on desktop, tablet, and mobile. Notification item text and actions correctly wrap.

## Theme Testing
- **Verdict**: PASS
- **Details**: Light mode and dark mode cleanly display system alert text with no visibility issues. 

## Regression Testing
- **Verdict**: PASS
- **Details**: Study Goal regression (`node tests/goal.test.js` & `node tests/pomodoro-goal.test.js`) confirms logic continuity. Backend Health Check remains strong with HTTP 200 statuses. Build output confirms successful client/server Next.js compilation.

## Bugs Found
- **Bug 1**: Notification response shape mismatch causing `.filter()` runtime errors. The backend API returned `{ success: true, data: [...] }` while frontend components expected an array directly.
- **Bug 2**: Authenticated dashboard receiving 401 from `/api/auth/me` and remaining stuck in an infinite loading state. The backend 401 response did not clear the `httpOnly` cookie, leading to an infinite redirect loop between `middleware.js` (which saw the cookie and allowed access) and `layout.jsx` (which received a 401 and redirected to `/login`).

## Bugs Fixed
- **Bug 1**: Updated `frontend/src/services/notificationService.js` to extract and return `res.data` from the API response instead of the raw HTTP JSON body.
- **Bug 2**: Updated `backend/src/middleware/authenticate.js` to invoke `clearAuthCookie(res)` whenever a token verification fails or the decoded user is not found in the database. This ensures invalid/expired cookies are purged, allowing the client-side redirect to properly reach the login page instead of looping.

## Known Issues
- None.

## Overall Status
- **PASS**: Phase 9 stabilizes perfectly within defined parameters. All criteria met securely.
