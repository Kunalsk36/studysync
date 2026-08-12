const http = require("http");
const { pool } = require("../src/database/connection");
const { signToken } = require("../src/utils/jwt");
const { createNotification } = require("../src/services/notification.service");

async function runTests() {
  const tokenA = signToken({ sub: 1 });
  const tokenB = signToken({ sub: 3 });

  const headersA = { Cookie: `studysync_token=${tokenA}`, "Content-Type": "application/json" };
  const headersB = { Cookie: `studysync_token=${tokenB}`, "Content-Type": "application/json" };

  const baseUrl = "http://localhost:5000/api/notifications";

  async function request(method, path, headers = {}, body = null) {
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(`${baseUrl}${path}`, opts);
    const data = await res.json().catch(() => null);
    return { status: res.status, data };
  }

  console.log("Setting up data...");
  await pool.query("DELETE FROM notifications");

  const notif1 = await createNotification({ userId: 1, title: "T1", message: "M1", dedupeKey: "test_1" });
  const notif2 = await createNotification({ userId: 1, title: "T2", message: "M2", dedupeKey: "test_2" });
  const notif3 = await createNotification({ userId: 3, title: "T3", message: "M3", dedupeKey: "test_3" });

  console.log("TEST 1: Unauthenticated GET");
  let res = await request("GET", "", {});
  if (res.status !== 401) throw new Error("Expected 401");
  console.log("Pass");

  console.log("TEST 2: Authenticated User A retrieves notifications");
  res = await request("GET", "", headersA);
  if (res.status !== 200 || res.data.data.length !== 2) throw new Error("Expected 2 notifications for User A");
  console.log("Pass");

  console.log("TEST 3: User B attempts to access User A's notification");
  // Well, we don't have a GET /:id, but we can try PATCH or DELETE
  // Let's just do PATCH as a stand-in for access, or just test DELETE in Test 5

  console.log("TEST 4: User B attempts to mark User A's notification as read");
  res = await request("PATCH", `/${notif1.id}/read`, headersB);
  if (res.status !== 404) throw new Error("Expected 404 for cross-user modification, got " + res.status);
  console.log("Pass");

  console.log("TEST 5: User B attempts to delete User A's notification");
  res = await request("DELETE", `/${notif1.id}`, headersB);
  if (res.status !== 404) throw new Error("Expected 404 for cross-user deletion, got " + res.status);
  console.log("Pass");

  console.log("TEST 6: User A marks one notification as read");
  res = await request("PATCH", `/${notif1.id}/read`, headersA);
  if (res.status !== 200 || res.data.data.is_read !== 1) throw new Error("Expected success and is_read true");
  console.log("Pass");

  console.log("TEST 7: User A marks all notifications as read");
  res = await request("PATCH", `/read-all`, headersA);
  if (res.status !== 200 || res.data.data.updatedCount !== 1) throw new Error("Expected 1 updated count");
  // Check User B not affected
  const [bRows] = await pool.query("SELECT is_read FROM notifications WHERE id = ?", [notif3.id]);
  if (bRows[0].is_read !== 0) throw new Error("User B notification should still be unread");
  console.log("Pass");

  console.log("TEST 8: User A deletes one notification");
  res = await request("DELETE", `/${notif2.id}`, headersA);
  if (res.status !== 200) throw new Error("Expected success deleting");
  res = await request("GET", "", headersA);
  if (res.data.data.length !== 1) throw new Error("Expected exactly 1 notification left");
  console.log("Pass");

  console.log("TEST 9: Mark-all-as-read called twice");
  res = await request("PATCH", `/read-all`, headersA);
  if (res.status !== 200) throw new Error("Expected success calling twice");
  console.log("Pass");

  console.log("TEST 14: Dedupe testing");
  await pool.query("DELETE FROM notifications");
  const d1 = await createNotification({ userId: 1, title: "D1", message: "D1", dedupeKey: "dedupe_1" });
  if (!d1) throw new Error("Failed to create first");
  const d2 = await createNotification({ userId: 1, title: "D1", message: "D1", dedupeKey: "dedupe_1" });
  if (d2 !== null) throw new Error("Expected duplicate to return null");
  const d3 = await createNotification({ userId: 1, title: "D1", message: "D1", dedupeKey: "dedupe_2" });
  if (!d3) throw new Error("Expected diff key to succeed");
  const d4 = await createNotification({ userId: 3, title: "D1", message: "D1", dedupeKey: "dedupe_1" });
  if (!d4) throw new Error("Expected diff user same key to succeed");
  console.log("Pass");

  console.log("All tests passed!");
  process.exit(0);
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
