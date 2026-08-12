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
  console.log("Running Manual Entry E2E tests...");
  try {
    const cookie1 = await loginUser("manual_user1@example.com", "Manual User 1");
    const cookie2 = await loginUser("manual_user2@example.com", "Manual User 2");
    
    // 1. Create a Goal for User 1
    let res = await fetch(`${BASE_URL}/goals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ title: "Manual Test Goal 1", targetHours: 10 }),
    });
    let data = await res.json();
    const goalId = data.data.id;
    
    // 2. Create Manual Entry
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": cookie1 },
      body: JSON.stringify({ minutes: 120, entryDate: new Date().toISOString().split('T')[0] }),
    });
    assert.strictEqual(res.status, 201, "Create manual entry should be 201");
    data = await res.json();
    const entryId = data.data.id;

    // 3. Verify Goal Progress updated
    res = await fetch(`${BASE_URL}/goals/${goalId}`, {
      headers: { "Cookie": cookie1 },
    });
    data = await res.json();
    assert.strictEqual(data.data.manual_hours > 0, true, "Manual hours should be updated");
    
    // 4. Test Ownership: User 2 tries to edit User 1's entry
    res = await fetch(`${BASE_URL}/goals/${goalId}/manual-entries/${entryId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Cookie": cookie2 },
      body: JSON.stringify({ minutes: 60, entryDate: new Date().toISOString().split('T')[0] }),
    });
    assert.strictEqual(res.status, 404, "Foreign manual entry edit should be 404");

    console.log("All Manual Entry E2E tests passed!");
    process.exit(0);
  } catch (err) {
    console.error("Test failed!", err);
    process.exit(1);
  }
}

runTests();
