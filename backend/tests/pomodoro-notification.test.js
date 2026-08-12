const assert = require("assert");
const mysql = require("mysql2/promise");
require("dotenv").config();
const { endSession } = require("../src/services/pomodoro.service");
const { pool } = require("../src/database/connection");

async function runTests() {
  console.log("Running Pomodoro Notification Tests...");

  try {
    // Setup test users and data
    await pool.query("DELETE FROM notifications");
    await pool.query("DELETE FROM pomodoro_sessions WHERE user_id IN (1, 3)");
    await pool.query("DELETE FROM user_preferences WHERE user_id IN (1, 3)");
    
    // User 1 has notifications enabled, User 3 has them disabled (using User 3 since it exists in DB)
    await pool.query("INSERT INTO user_preferences (user_id, notifications_enabled) VALUES (1, 1)");
    await pool.query("INSERT INTO user_preferences (user_id, notifications_enabled) VALUES (3, 0)");

    const { startSession, endSession } = require("../src/services/pomodoro.service");

    // Test 1: Start and complete naturally -> Notification created
    let res = await startSession(1, { sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId1 = res.id;
    await endSession(1, { sessionId: sessionId1, actualMinutes: 25, status: 'completed' });
    let [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId1}_completed`]);
    assert.strictEqual(notifications.length, 1, "Expected exactly 1 notification for completed session");

    // Test 2: Complete same session again -> No duplicate
    await endSession(1, { sessionId: sessionId1, actualMinutes: 25, status: 'completed' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId1}_completed`]);
    assert.strictEqual(notifications.length, 1, "Expected no duplicate notification");

    // Test 3: Cancel/reset Pomodoro -> No notification
    res = await startSession(1, { sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId2 = res.id;
    await endSession(1, { sessionId: sessionId2, actualMinutes: 5, status: 'cancelled' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId2}_completed`]);
    assert.strictEqual(notifications.length, 0, "Expected no notification for cancelled session");

    // Test 4: Interrupt Pomodoro -> No notification
    res = await startSession(1, { sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId3 = res.id;
    await endSession(1, { sessionId: sessionId3, actualMinutes: 10, status: 'interrupted' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId3}_completed`]);
    assert.strictEqual(notifications.length, 0, "Expected no notification for interrupted session");

    // Test 5: Notifications disabled -> Complete -> No notification
    res = await startSession(3, { sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId4 = res.id;
    await endSession(3, { sessionId: sessionId4, actualMinutes: 25, status: 'completed' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId4}_completed`]);
    assert.strictEqual(notifications.length, 0, "Expected no notification because user disabled them");

    // Test 7: Linked to Study Goal -> Notification created, progress updates
    let [goalRes] = await pool.query("INSERT INTO study_goals (user_id, title, status, target_hours, target_date) VALUES (1, 'POMO_TEST_GOAL', 'active', 10, NOW() + INTERVAL 5 DAY)");
    const goalId = goalRes.insertId;
    res = await startSession(1, { goalId, sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId5 = res.id;
    await endSession(1, { sessionId: sessionId5, actualMinutes: 25, status: 'completed' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId5}_completed`]);
    assert.strictEqual(notifications.length, 1, "Expected notification for goal-linked pomodoro");

    // Test 8: Linked to Task -> Notification created, task unchanged
    let [taskRes] = await pool.query("INSERT INTO tasks (user_id, title, status) VALUES (1, 'POMO_TEST_TASK', 'pending')");
    const taskId = taskRes.insertId;
    res = await startSession(1, { taskId, sessionType: 'focus', plannedMinutes: 25, startedAt: new Date() });
    const sessionId6 = res.id;
    await endSession(1, { sessionId: sessionId6, actualMinutes: 25, status: 'completed' });
    [notifications] = await pool.query("SELECT * FROM notifications WHERE dedupe_key = ?", [`pomodoro_${sessionId6}_completed`]);
    assert.strictEqual(notifications.length, 1, "Expected notification for task-linked pomodoro");
    const [[task]] = await pool.query("SELECT status FROM tasks WHERE id = ?", [taskId]);
    assert.strictEqual(task.status, 'pending', "Task status should remain unchanged");

    // Cleanup
    await pool.query("DELETE FROM study_goals WHERE id = ?", [goalId]);
    await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);

    console.log("All Pomodoro Notification Tests Passed!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed!", err);
    process.exit(1);
  }
}

runTests();
