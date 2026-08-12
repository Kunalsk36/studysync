const assert = require("assert");
const mysql = require("mysql2/promise");
require("dotenv").config();
const { runNotificationJob } = require("../src/jobs/notification.job");
const { pool } = require("../src/database/connection");

async function runTests() {
  console.log("Running scheduled notification job tests...");

  try {
    // Setup test users and data
    await pool.query("DELETE FROM notifications");
    await pool.query("DELETE FROM user_preferences WHERE user_id IN (1, 3)");
    await pool.query("DELETE FROM tasks WHERE title LIKE 'TEST_TASK_%'");
    await pool.query("DELETE FROM calendar_events WHERE title LIKE 'TEST_EXAM_%'");
    await pool.query("DELETE FROM study_goals WHERE title LIKE 'TEST_GOAL_%'");
    
    // User 1 has notifications enabled, User 3 has them disabled
    await pool.query("INSERT INTO user_preferences (user_id, notifications_enabled) VALUES (1, 1)");
    await pool.query("INSERT INTO user_preferences (user_id, notifications_enabled) VALUES (3, 0)");

    // Add tasks
    let [res] = await pool.query("INSERT INTO tasks (user_id, title, status, due_date) VALUES (1, 'TEST_TASK_1', 'pending', NOW() + INTERVAL 24 HOUR)");
    const taskId1 = res.insertId;
    [res] = await pool.query("INSERT INTO tasks (user_id, title, status, due_date) VALUES (1, 'TEST_TASK_2', 'pending', NOW() + INTERVAL 1 HOUR)");
    const taskId2 = res.insertId;
    [res] = await pool.query("INSERT INTO tasks (user_id, title, status, due_date) VALUES (3, 'TEST_TASK_3', 'pending', NOW() + INTERVAL 24 HOUR)");
    const taskId3 = res.insertId;
    [res] = await pool.query("INSERT INTO tasks (user_id, title, status, due_date) VALUES (1, 'TEST_TASK_4', 'completed', NOW() + INTERVAL 24 HOUR)");
    const taskId4 = res.insertId;

    // Add exams
    [res] = await pool.query("INSERT INTO calendar_events (user_id, title, event_type, start_datetime, end_datetime) VALUES (1, 'TEST_EXAM_1', 'exam', NOW() + INTERVAL 24 HOUR, NOW() + INTERVAL 25 HOUR)");
    const examId1 = res.insertId;
    [res] = await pool.query("INSERT INTO calendar_events (user_id, title, event_type, start_datetime, end_datetime) VALUES (1, 'TEST_EXAM_2', 'exam', NOW() + INTERVAL 1 HOUR, NOW() + INTERVAL 2 HOUR)");
    const examId2 = res.insertId;
    [res] = await pool.query("INSERT INTO calendar_events (user_id, title, event_type, start_datetime, end_datetime) VALUES (1, 'TEST_EXAM_3', 'meeting', NOW() + INTERVAL 24 HOUR, NOW() + INTERVAL 25 HOUR)");
    const examId3 = res.insertId;

    // Add study goals
    [res] = await pool.query("INSERT INTO study_goals (user_id, title, status, target_hours, target_date) VALUES (1, 'TEST_GOAL_1', 'active', 10, NOW() + INTERVAL 5 DAY)");
    const goalId1 = res.insertId;

    console.log("Running job (Run 1)...");
    
    const originalGetHours = Date.prototype.getHours;
    Date.prototype.getHours = () => 9;
    
    await runNotificationJob();

    let [notifications] = await pool.query("SELECT * FROM notifications");
    
    const hasTask1 = notifications.find(n => n.dedupe_key === `task_${taskId1}_due_24h`);
    assert.ok(hasTask1, "Missing task 1 (24h)");
    const hasTask2 = notifications.find(n => n.dedupe_key === `task_${taskId2}_due_1h`);
    assert.ok(hasTask2, "Missing task 2 (1h)");
    
    const hasExam1 = notifications.find(n => n.dedupe_key === `calendar_${examId1}_exam_24h`);
    assert.ok(hasExam1, "Missing exam 1 (24h)");
    const hasExam2 = notifications.find(n => n.dedupe_key === `calendar_${examId2}_exam_1h`);
    assert.ok(hasExam2, "Missing exam 2 (1h)");
    
    const todayDate = new Date().toISOString().split('T')[0];
    const hasGoal1 = notifications.find(n => n.dedupe_key === `goal_${goalId1}_daily_${todayDate}`);
    assert.ok(hasGoal1, "Missing goal 1 (daily)");

    const hasTask3 = notifications.find(n => n.dedupe_key === `task_${taskId3}_due_24h`);
    assert.ok(!hasTask3, "User 3 should not get task reminder (disabled notifications)");

    const hasExam3 = notifications.find(n => n.dedupe_key === `calendar_${examId3}_exam_24h`);
    assert.ok(!hasExam3, "Ordinary meeting should not get exam reminder");

    const hasTask4 = notifications.find(n => n.dedupe_key === `task_${taskId4}_due_24h`);
    assert.ok(!hasTask4, "Completed task should not get reminder");

    console.log("Run 1 successful (TEST 1, 3, 5, 6, 7, 8, 9, 12, 13 passed).");

    console.log("Running job (Run 2 - Idempotency)...");
    const countBefore = notifications.length;
    await runNotificationJob();
    [notifications] = await pool.query("SELECT * FROM notifications");
    assert.strictEqual(notifications.length, countBefore, "Expected no new notifications due to dedupe_key");
    
    console.log("Run 2 successful (TEST 2, 4, 10, 15 passed).");

    console.log("Running job with mocked next day...");
    const originalToISOString = Date.prototype.toISOString;
    Date.prototype.toISOString = function() {
      const d = new Date(this.getTime() + 86400000);
      return originalToISOString.call(d);
    };
    
    await runNotificationJob();
    [notifications] = await pool.query("SELECT * FROM notifications");
    assert.ok(notifications.length > countBefore, "Expected new notifications for the next day");
    const tomorrowDate = originalToISOString.call(new Date(Date.now() + 86400000)).split('T')[0];
    const hasGoal2 = notifications.find(n => n.dedupe_key === `goal_${goalId1}_daily_${tomorrowDate}`);
    assert.ok(hasGoal2, "Missing tomorrow's goal reminder");
    
    console.log("Run 3 successful (TEST 11 passed).");
    
    Date.prototype.getHours = originalGetHours;
    Date.prototype.toISOString = originalToISOString;
    
    console.log("All notification scheduler tests passed!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed!", err);
    process.exit(1);
  }
}

runTests();
