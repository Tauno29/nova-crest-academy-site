import { describe, expect, it, vi } from "vitest";

const { getDbMock, valuesMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  valuesMock: vi.fn(),
}));
vi.mock("./db", () => ({ getDb: getDbMock }));

const { appRouter } = await import("./routers");

const adminContext = {
  req: {} as never,
  res: {} as never,
  user: { id: 0, openId: "admin:test", name: "Test Admin", email: "admin@example.com", loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } as never,
  parentAccountId: null,
  learnerId: null,
};

describe("Admin Learners creation", () => {
  it("successfully accepts and stores a one-character surname", async () => {
    valuesMock.mockResolvedValueOnce([]);
    getDbMock.mockResolvedValueOnce({ insert: () => ({ values: valuesMock }) });
    const caller = appRouter.createCaller(adminContext);

    await expect(caller.admin.learners.create({
      fullName: "Portal Test",
      surname: " X ",
      studentId: "TEST-003",
      parentPin: "2468",
      className: "Grade 7A",
    })).resolves.toEqual({ success: true });

    expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Portal Test", surname: "X", studentId: "TEST-003" }));
  });
});
