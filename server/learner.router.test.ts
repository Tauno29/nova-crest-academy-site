import { describe, expect, it, vi } from "vitest";
import { hashParentAccessCode } from "./adminAuth";
import { appRouter } from "./routers";

const { getDbMock } = vi.hoisted(() => ({ getDbMock: vi.fn() }));
vi.mock("./db", () => ({ getDb: getDbMock }));

const learnerRecord = {
  id: 17,
  fullName: "Portal Test Learner",
  surname: "Learner",
  studentId: "TEST-001",
  parentPinHash: hashParentAccessCode("2468"),
  teacher: "Portal Test Teacher",
  subjects: "English, Mathematics",
  className: "Grade 7A",
  classId: null,
  parentAccountId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

function controlledDb(rows: { learners?: unknown[]; performance?: unknown[]; portalRecords?: unknown[] }) {
  const queryRows = [rows.learners ?? [], rows.performance ?? [], rows.portalRecords ?? []];
  let queryIndex = 0;
  const select = () => ({
    from(_table: unknown) {
      const values = queryRows[Math.min(queryIndex++, queryRows.length - 1)] ?? [];
      const query = {
        where: () => query,
        limit: () => query,
        orderBy: () => query,
        then: (resolve: (value: unknown[]) => unknown, reject?: (reason: unknown) => unknown) => Promise.resolve(values).then(resolve, reject),
      };
      return query;
    },
  });
  return { select };
}

const callerContext = () => ({
  req: { headers: {} } as any,
  res: { cookie: vi.fn(), clearCookie: vi.fn() } as any,
  user: null,
  parentAccountId: null,
  learnerId: 17,
});

describe("learner router procedures", () => {
  it("rejects a wrong Student ID through learner.login", async () => {
    getDbMock.mockResolvedValueOnce(controlledDb({ learners: [] }));
    const caller = appRouter.createCaller(callerContext());
    await expect(caller.learner.login({ studentId: "WRONG-ID", pin: "2468" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects a wrong PIN through learner.login", async () => {
    getDbMock.mockResolvedValueOnce(controlledDb({ learners: [learnerRecord] }));
    const caller = appRouter.createCaller(callerContext());
    await expect(caller.learner.login({ studentId: "TEST-001", pin: "1357" })).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("returns portal records only for the learner in the authenticated context", async () => {
    getDbMock.mockResolvedValueOnce(controlledDb({
      learners: [learnerRecord],
      performance: [{ id: 1, learnerId: 17, activityName: "Math Test", activityType: "Test", marks: 8, totalMarks: 10 }, { id: 2, learnerId: 18, activityName: "Other learner record", activityType: "Test", marks: 10, totalMarks: 10 }],
      portalRecords: [{ learnerId: 17, behaviorNotes: "Respectful and focused.", term1Report: "Term 1 report", term2Report: "Term 2 report", term3Report: "Term 3 report", updatedAt: new Date() }],
    }));
    const caller = appRouter.createCaller(callerContext());
    const result = await caller.learner.portal();
    expect(result.performance.map(entry => entry.learnerId)).toEqual([17]);
    expect("attendance" in result).toBe(false);
    expect(result.portalRecord).toMatchObject({ learnerId: 17, behaviorNotes: "Respectful and focused.", term1Report: "Term 1 report", term2Report: "Term 2 report", term3Report: "Term 3 report" });
  });
});
