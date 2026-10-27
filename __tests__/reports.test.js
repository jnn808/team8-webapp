// __tests__/reports.test.js
//
// Runs against your REAL app object (no real port opened) and your REAL
// database. Each describe block arranges its own data with a fresh POST
// rather than relying on the seeded sample rows — that way tests don't
// depend on run order or on what npm run db:seed happens to contain.
import "dotenv/config"; // Added so the test suite can read your keys
import request from "supertest";
import app from "../server/app.js";
import { pool } from "../server/database.js";

// Grab the first valid key from the environment to use in tests
const VALID_KEY = (process.env.API_KEYS || '').split(',')[0];

// Small helper: creates a real report and returns its caseCode, so tests
// that need an EXISTING report don't repeat this every time.
async function createTestReport(overrides = {}) {
  const res = await request(app)
    .post("/reports")
    .set("X-API-Key", VALID_KEY)
    .send({
      category: "maintenance",
      description: "Test report created by the automated suite.",
      ...overrides,
    });
  return res.body.caseCode;
}

// Close the database connection pool once all tests finish, or Jest will
// hang waiting for an open handle that never closes on its own.
afterAll(async () => {
  await pool.end();
});

// =========================================================================
// API KEY SECURITY TESTS
// =========================================================================
describe("Authentication & Security", () => {
  it("returns 401 Unauthorized when no API key is provided", async () => {
    // Attempting to hit the reports route with NO key
    const res = await request(app).post("/reports").send({
      category: "incident",
      description: "Testing security wall."
    });
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Missing or invalid API key");
  });

  it("returns 200 OK (or 201) when a valid API key is provided", async () => {
    // Attempting to hit the reports route WITH the valid key
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        category: "incident",
        description: "Testing valid key success."
      });
      
    expect(res.status).toBe(201); // 201 Created is the success response for POST
    expect(res.body).toHaveProperty("caseCode");
  });
});

// =========================================================================
// POST /reports
// =========================================================================
describe("POST /reports", () => {
  it("happy path: creates a report and returns 201 with the full shape", async () => {
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        category: "incident",
        description: "Someone left broken glass near the pool.",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("caseCode");
    expect(typeof res.body.caseCode).toBe("string");
    expect(res.body.category).toBe("incident");
    expect(res.body.description).toBe("Someone left broken glass near the pool.");
    expect(res.body.status).toBe("Pending");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("validation rejection: missing category returns 400", async () => {
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        description: "No category attached to this one.",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("validation rejection: missing description returns 400", async () => {
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        category: "safety",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("validation rejection: category outside the enum returns 400", async () => {
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        category: "not-a-real-category",
        description: "This category doesn't exist in the contract.",
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("edge case: empty-string description is rejected, not silently accepted", async () => {
    const res = await request(app)
      .post("/reports")
      .set("X-API-Key", VALID_KEY)
      .send({
        category: "maintenance",
        description: "",
      });

    expect(res.status).toBe(400);
  });
});

// =========================================================================
// GET /reports/:caseCode
// =========================================================================
describe("GET /reports/:caseCode", () => {
  it("happy path: returns the report with correct shape and types", async () => {
    const caseCode = await createTestReport({ description: "Treadmill belt is slipping." });

    const res = await request(app)
      .get(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);

    expect(res.status).toBe(200);
    expect(res.body.caseCode).toBe(caseCode);
    expect(res.body.description).toBe("Treadmill belt is slipping.");
    expect(res.body).toHaveProperty("notes");
    expect(Array.isArray(res.body.notes)).toBe(true);
  });

  it("not-found: a caseCode that doesn't exist returns 404", async () => {
    const res = await request(app)
      .get("/reports/SB-00000")
      .set("X-API-Key", VALID_KEY);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("edge case: a brand-new report has an empty notes array", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .get(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);

    expect(res.body.notes).toEqual([]);
  });
});

// =========================================================================
// PATCH /reports/:caseCode
// =========================================================================
describe("PATCH /reports/:caseCode", () => {
  it("happy path: marks a report Resolved and returns 200", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .patch(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY)
      .send({ status: "Resolved" });

    expect(res.status).toBe(200);
    expect(res.body.caseCode).toBe(caseCode);
    expect(res.body.status).toBe("Resolved");
    expect(res.body).toHaveProperty("updatedAt");
  });

  it("validation rejection: missing status returns 400", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .patch(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("validation rejection: status outside the enum returns 400", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .patch(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY)
      .send({ status: "Closed" });

    expect(res.status).toBe(400);
  });

  it("not-found: patching a caseCode that doesn't exist returns 404", async () => {
    const res = await request(app)
      .patch("/reports/SB-00000")
      .set("X-API-Key", VALID_KEY)
      .send({ status: "Resolved" });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("edge case: patching the same report Resolved twice is idempotent", async () => {
    const caseCode = await createTestReport();

    const first = await request(app)
      .patch(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY)
      .send({ status: "Resolved" });
    const second = await request(app)
      .patch(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY)
      .send({ status: "Resolved" });

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(first.body.status).toBe(second.body.status); // same end state both times
  });
});

// =========================================================================
// DELETE /reports/:caseCode
// =========================================================================
describe("DELETE /reports/:caseCode", () => {
  it("happy path: deletes an existing report and returns 204 with no body", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .delete(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);

    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  it("not-found: deleting a caseCode that doesn't exist returns 404", async () => {
    const res = await request(app)
      .delete("/reports/SB-00000")
      .set("X-API-Key", VALID_KEY);

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("edge case: the report is actually gone afterward, not just reported as deleted", async () => {
    const caseCode = await createTestReport();

    await request(app)
      .delete(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);
      
    const followUp = await request(app)
      .get(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);

    expect(followUp.status).toBe(404); // this is what catches a fake "success" DELETE
  });
});

// =========================================================================
// POST /reports/:caseCode/notes
// =========================================================================
describe("POST /reports/:caseCode/notes", () => {
  it("happy path: adds a note and returns 201 with correct shape", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .post(`/reports/${caseCode}/notes`)
      .set("X-API-Key", VALID_KEY)
      .send({ message: "Staff has cordoned off the area." });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("noteId");
    expect(typeof res.body.noteId).toBe("string");
    expect(res.body.caseCode).toBe(caseCode);
    expect(res.body.message).toBe("Staff has cordoned off the area.");
    expect(res.body).toHaveProperty("createdAt");
  });

  it("validation rejection: missing message returns 400", async () => {
    const caseCode = await createTestReport();

    const res = await request(app)
      .post(`/reports/${caseCode}/notes`)
      .set("X-API-Key", VALID_KEY)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("not-found: adding a note to a caseCode that doesn't exist returns 404", async () => {
    const res = await request(app)
      .post("/reports/SB-00000/notes")
      .set("X-API-Key", VALID_KEY)
      .send({ message: "This report doesn't exist." });

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("edge case: the new note actually shows up on a follow-up GET", async () => {
    const caseCode = await createTestReport();

    await request(app)
      .post(`/reports/${caseCode}/notes`)
      .set("X-API-Key", VALID_KEY)
      .send({ message: "Follow-up detail." });
      
    const followUp = await request(app)
      .get(`/reports/${caseCode}`)
      .set("X-API-Key", VALID_KEY);

    expect(followUp.body.notes).toHaveLength(1);
    expect(followUp.body.notes[0].message).toBe("Follow-up detail.");
  });
});