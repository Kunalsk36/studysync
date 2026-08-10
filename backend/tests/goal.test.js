const assert = require("assert");
const mysql = require("mysql2/promise");
require("dotenv").config();

const BASE_URL = "http://localhost:5000/api";

async function loginUser() {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "goaltest1@example.com", password: "Password123!" }),
    });
    
    if (!res.ok) {
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Goal Test 1", email: "goaltest1@example.com", password: "Password123!" }),
    });
    const retryLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "goaltest1@example.com", password: "Password123!" }),
    });
    return retryLogin.headers.get("set-cookie") || retryLogin.headers.getSetCookie?.()?.[0];
  }
  return res.headers.get("set-cookie") || res.headers.getSetCookie?.()?.[0];
}

async function loginOtherUser() {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "goaltest2@example.com", password: "Password123!" }),
    });
    
    if (!res.ok) {
      const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Goal Test 2", email: "goaltest2@example.com", password: "Password123!" }),
    });
    const retryLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "goaltest2@example.com", password: "Password123!" }),
    });
    return retryLogin.headers.get("set-cookie") || retryLogin.headers.getSetCookie?.()?.[0];
  }
  return res.headers.get("set-cookie") || res.headers.getSetCookie?.()?.[0];
}

async function runTests() {
  console.log("Running E2E tests for Study Goals module...");
  try {
    const cookie1 = await loginUser();
    const cookie2 = await loginOtherUser();
    console.log("Cookie1:", cookie1);
    
    // Auth tests
    const unauthRes = await fetch(`${BASE_URL}/goals`);
    assert.strictEqual(unauthRes.status, 401, "Unauthenticated GET /goals should be 401");
    
    // Goal CRUD
    // 1. Create Goal
    let res = await fetch(`${BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ title: "Test Goal", targetHours: 20 }),
    });
    let data = await res.json();
    assert.strictEqual(res.status, 201, "Create goal should return 201");
    const goalId = data.data.id;
    
    // 2. Get Single Goal
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie1 },
    });
    data = await res.json();
    assert.strictEqual(data.data.title, "Test Goal");
    assert.strictEqual(data.data.progress_percentage, 0, "Initial progress should be 0");
    
    // 3. Invalid goal data
    res = await fetch(`${BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ title: "Test Goal", targetHours: -5 }),
    });
    assert.strictEqual(res.status, 422, "Invalid targetHours should be 422");
    
    // OWNERSHIP tests
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie2 },
    });
    assert.strictEqual(res.status, 404, "User B should not see User A goal");
    
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Cookie": cookie2 },
      body: JSON.stringify({ title: "Hacked" }),
    });
    assert.strictEqual(res.status, 404, "User B should not update User A goal");

    // MANUAL STUDY ENTRIES
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ minutes: 120, entryDate: "2026-08-10" }), // 2 hours
    });
    data = await res.json();
    assert.strictEqual(res.status, 201, "Create manual entry should return 201");
    const entryId = data.data.id;
    
    // check negative minutes
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ minutes: -10, entryDate: "2026-08-10" }),
    });
    assert.strictEqual(res.status, 422, "Negative minutes should be 422");

    // PROGRESS CALCULATION
    // Check goal progress after manual entry
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie1 },
    });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 2, "Manual hours should be 2");
    assert.strictEqual(data.data.total_completed_hours, 2, "Total hours should be 2");
    assert.strictEqual(data.data.progress_percentage, 10, "Progress should be 10%");

    // POMODORO INTEGRATION
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    const [[{id: userId1}]] = await conn.query("SELECT id FROM users WHERE email = 'goaltest1@example.com'");

    // Add completed Pomodoro (1.5 hours = 90 mins)
    await conn.query(`
      INSERT INTO pomodoro_sessions (user_id, goal_id, session_type, planned_minutes, actual_minutes, status, started_at)
      VALUES (?, ?, 'focus', 90, 90, 'completed', NOW())
    `, [userId1, goalId]);

    // Add interrupted Pomodoro (should not count)
    await conn.query(`
      INSERT INTO pomodoro_sessions (user_id, goal_id, session_type, planned_minutes, actual_minutes, status, started_at)
      VALUES (?, ?, 'focus', 90, 45, 'interrupted', NOW())
    `, [userId1, goalId]);
    
    // Add cancelled Pomodoro (should not count)
    await conn.query(`
      INSERT INTO pomodoro_sessions (user_id, goal_id, session_type, planned_minutes, actual_minutes, status, started_at)
      VALUES (?, ?, 'focus', 90, 0, 'cancelled', NOW())
    `, [userId1, goalId]);

    // Re-check progress
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie1 },
    });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 2, "Manual hours should be 2");
    assert.strictEqual(data.data.pomodoro_hours, 1.5, "Pomodoro hours should be 1.5");
    assert.strictEqual(data.data.total_completed_hours, 3.5, "Total hours should be 3.5");
    assert.strictEqual(data.data.progress_percentage, 17.5, "Progress should be 17.5%");

    await conn.end();

    console.log("All backend tests passed!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed!", err);
    process.exit(1);
  }
}

runTests();
