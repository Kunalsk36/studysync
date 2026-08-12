const assert = require("assert");

const BASE_URL = "http://localhost:5000/api";

async function loginUser() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "pomo_test_user@example.com", password: "Password123!" }),
  });
  
  if (!res.ok) {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Pomo Test", email: "pomo_test_user@example.com", password: "Password123!" }),
    });
    
    const retryLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "pomo_test_user@example.com", password: "Password123!" }),
    });
    return retryLogin.headers.get("set-cookie") || retryLogin.headers.getSetCookie?.()?.[0];
  }
  return res.headers.get("set-cookie") || res.headers.getSetCookie?.()?.[0];
}

async function loginOtherUser() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "pomo_test_user2@example.com", password: "Password123!" }),
  });
  
  if (!res.ok) {
    await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: "Pomo Test 2", email: "pomo_test_user2@example.com", password: "Password123!" }),
    });
    const retryLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "pomo_test_user2@example.com", password: "Password123!" }),
    });
    return retryLogin.headers.get("set-cookie") || retryLogin.headers.getSetCookie?.()?.[0];
  }
  return res.headers.get("set-cookie") || res.headers.getSetCookie?.()?.[0];
}

async function runTests() {
  console.log("Running Pomodoro E2E tests...");
  try {
    const cookie1 = await loginUser();
    const cookie2 = await loginOtherUser();
    
    // 1. Create a Goal for User 1
    let res = await fetch(`${BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ title: "Pomodoro Test Goal", targetHours: 10 }),
    });
    let data = await res.json();
    const goalId = data.data.id;
    
    // 2. Start Pomodoro with Goal
    res = await fetch(`${BASE_URL}/pomodoro/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ goalId, sessionType: "focus", plannedMinutes: 25, startedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 201, "Start with goal should be 201");
    data = await res.json();
    const sessionId = data.data.id;

    // 3. Complete Pomodoro
    res = await fetch(`${BASE_URL}/pomodoro/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ sessionId, actualMinutes: 25, status: "completed", endedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 200, "End Pomodoro should be 200");

    // 4. Verify Goal Progress updated
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie1 },
    });
    data = await res.json();
    assert.strictEqual(data.data.pomodoro_hours > 0, true, "Pomodoro hours should be updated");

    // 5. Test Ownership: User 2 tries to start session with User 1's goal
    res = await fetch(`${BASE_URL}/pomodoro/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie2 },
      body: JSON.stringify({ goalId, sessionType: "focus", plannedMinutes: 25, startedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 404, "Foreign goal should be 404");

    // 6. Test No-Goal Regression
    res = await fetch(`${BASE_URL}/pomodoro/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ sessionType: "focus", plannedMinutes: 25, startedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 201, "Start without goal should be 201");

    console.log("All Pomodoro E2E tests passed!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed!", err);
    process.exit(1);
  }
}

runTests();
