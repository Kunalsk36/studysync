const assert = require("assert");

const BASE_URL = "http://localhost:5000/api";

async function loginUser(email, name) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "Password123!" }),
  });
  
  if (!res.ok) {
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, email, password: "Password123!" }),
    });
    const retryLogin = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: "Password123!" }),
    });
    return retryLogin.headers.get("set-cookie") || retryLogin.headers.getSetCookie?.()?.[0];
  }
  return res.headers.get("set-cookie") || res.headers.getSetCookie?.()?.[0];
}

async function runTests() {
  console.log("Running Phase 8 QA Combined E2E Scenario...");
  try {
    const cookieA = await loginUser("qa_userA@example.com", "QA User A");
    const cookieB = await loginUser("qa_userB@example.com", "QA User B");
    
    // 2. Create Study Goal
    let res = await fetch(`${BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ title: "React Mastery", targetHours: 10 }),
    });
    let data = await res.json();
    assert.strictEqual(res.status, 201, "Failed to create goal");
    const goalId = data.data.id;
    
    // 3. Log 60 minutes manually
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ minutes: 60, entryDate: new Date().toISOString().split('T')[0] }),
    });
    assert.strictEqual(res.status, 201, "Failed to create manual entry");
    data = await res.json();
    const entryId1 = data.data.id;

    // 4. Verify goal shows: Manual = 1h, Total = 1h.
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieA } });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 1);
    assert.strictEqual(data.data.total_completed_hours, 1);
    assert.strictEqual(data.data.progress_percentage, 10);
    assert.strictEqual(data.data.pomodoro_hours, 0);

    // 5. Start Pomodoro linked to React Mastery
    res = await fetch(`${BASE_URL}/pomodoro/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ goalId, sessionType: "focus", plannedMinutes: 25, startedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 201);
    data = await res.json();
    const sessionId = data.data.id;

    // 6. Complete a session (120 minutes)
    res = await fetch(`${BASE_URL}/pomodoro/end`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ sessionId, actualMinutes: 120, status: "completed", endedAt: new Date().toISOString() }),
    });
    assert.strictEqual(res.status, 200);

    // 7. Verify Pomodoro time increases goal progress
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieA } });
    data = await res.json();
    assert.strictEqual(data.data.pomodoro_hours, 2);
    assert.strictEqual(data.data.manual_hours, 1);
    assert.strictEqual(data.data.total_completed_hours, 3);
    assert.strictEqual(data.data.progress_percentage, 30);

    // 8. Add another manual study entry
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ minutes: 30, entryDate: new Date().toISOString().split('T')[0] }),
    });
    data = await res.json();
    const entryId2 = data.data.id;

    // 9. Verify total progress combines both sources
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieA } });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 1.5);
    assert.strictEqual(data.data.total_completed_hours, 3.5);

    // 10. Edit the manual entry (from 30 to 90)
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries/${entryId2}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Cookie": cookieA },
      body: JSON.stringify({ minutes: 90, entryDate: new Date().toISOString().split('T')[0] }),
    });
    assert.strictEqual(res.status, 200);

    // 11. Verify progress recalculates (1h + 1.5h = 2.5h manual)
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieA } });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 2.5);
    assert.strictEqual(data.data.total_completed_hours, 4.5);

    // 12. Delete the manual entry
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries/${entryId1}`, {
      method: "DELETE",
      headers: { "Cookie": cookieA },
    });
    assert.strictEqual(res.status, 200);

    // 13. Verify progress decreases (1h manual entry deleted -> 1.5h manual left)
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieA } });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours, 1.5);
    assert.strictEqual(data.data.total_completed_hours, 3.5);

    // 20. Verify User B cannot see User A's goals or entries
    res = await fetch(`${BASE_URL}/goals/${goalId}`, { headers: { "Cookie": cookieB } });
    assert.strictEqual(res.status, 404, "User B should not see User A goal");

    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, { headers: { "Cookie": cookieB } });
    assert.strictEqual(res.status, 404, "User B should not access User A manual entries");

    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries/${entryId2}`, {
      method: "DELETE",
      headers: { "Cookie": cookieB }
    });
    assert.strictEqual(res.status, 404, "User B should not delete User A entry");

    console.log("Combined QA Scenario PASSED!");
    process.exit(0);
  } catch (err) {
    console.error("Combined QA Scenario FAILED!", err);
    process.exit(1);
  }
}

runTests();
