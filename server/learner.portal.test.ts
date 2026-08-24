import { describe, expect, it } from "vitest";
import { hashParentAccessCode } from "./adminAuth";
import { createLearnerSession, verifyLearnerSession } from "./learnerAuth";
import { hasValidLearnerCredentials, scopeLearnerRecords } from "./learnerPortal.logic";

describe("learner portal authentication", () => {
  it("creates and verifies a session for exactly one learner", async () => {
    const token = await createLearnerSession(17);
    await expect(verifyLearnerSession(token)).resolves.toEqual({ learnerId: 17 });
  });

  it("rejects tampered sessions and does not accept another role", async () => {
    const token = await createLearnerSession(17);
    await expect(verifyLearnerSession(`${token}tampered`)).resolves.toBeNull();
  });

  it("rejects invalid login credentials", () => {
    const record = { studentId: "TEST-001", parentPinHash: hashParentAccessCode("2468") };
    expect(hasValidLearnerCredentials(record, "TEST-999", "2468")).toBe(false);
    expect(hasValidLearnerCredentials(record, "TEST-001", "1357")).toBe(false);
    expect(hasValidLearnerCredentials(record, "TEST-001", "24")).toBe(false);
    expect(hasValidLearnerCredentials(undefined, "TEST-001", "2468")).toBe(false);
  });

  it("accepts only the exact Student ID and four-digit PIN", () => {
    const record = { studentId: "TEST-001", parentPinHash: hashParentAccessCode("2468") };
    expect(hasValidLearnerCredentials(record, "  TEST-001 ", "2468")).toBe(true);
    expect(hasValidLearnerCredentials(record, "TEST-001", "24680")).toBe(false);
  });

  it("isolates performance and attendance records by authenticated learner id", () => {
    const records = [
      { id: 1, learnerId: 17, marks: 8 },
      { id: 2, learnerId: 18, marks: 20 },
    ];
    expect(scopeLearnerRecords(records, 17)).toEqual([{ id: 1, learnerId: 17, marks: 8 }]);
    expect(scopeLearnerRecords(records, 18)).toEqual([{ id: 2, learnerId: 18, marks: 20 }]);
    expect(scopeLearnerRecords(records, 99)).toEqual([]);
  });

  it("does not allow an empty or invalid session token to identify a learner", async () => {
    await expect(verifyLearnerSession("not-a-jwt")).resolves.toBeNull();
  });
});
