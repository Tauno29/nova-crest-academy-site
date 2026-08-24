import { describe, expect, it, vi } from "vitest";

const { getDbMock, valuesMock, updateSetMock, updateWhereMock, deleteWhereMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  valuesMock: vi.fn(),
  updateSetMock: vi.fn(),
  updateWhereMock: vi.fn(),
  deleteWhereMock: vi.fn(),
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

const caller = appRouter.createCaller(adminContext);

describe("Admin Learners creation", () => {
  it("successfully accepts and stores a one-character surname", async () => {
    valuesMock.mockResolvedValueOnce([]);
    getDbMock.mockResolvedValueOnce({ insert: () => ({ values: valuesMock }) });
    await expect(caller.admin.learners.create({
      fullName: "Portal Test",
      surname: " X ",
      studentId: "TEST-003",
      parentPin: "2468",
      className: "Grade 7A",
    })).resolves.toEqual({ success: true });

    expect(valuesMock).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Portal Test", surname: "X", studentId: "TEST-003" }));
  });

  it("updates learner details without replacing the existing PIN when omitted", async () => {
    updateSetMock.mockReturnValueOnce({ where: updateWhereMock });
    updateWhereMock.mockResolvedValueOnce(undefined);
    getDbMock.mockResolvedValueOnce({ update: () => ({ set: updateSetMock }) });

    await expect(caller.admin.learners.update({ id: 7, fullName: "Portal Updated", surname: "Y", studentId: "TEST-EDIT-001", className: "Grade 1", teacher: "Updated Teacher", subjects: "English" })).resolves.toEqual({ success: true });
    expect(updateSetMock).toHaveBeenCalledWith(expect.objectContaining({ fullName: "Portal Updated", surname: "Y", studentId: "TEST-EDIT-001", className: "Grade 1", updatedAt: expect.any(Date) }));
    expect(updateSetMock.mock.calls[0][0]).not.toHaveProperty("parentPinHash");
  });

  it("deletes a learner through the protected positive-ID mutation", async () => {
    deleteWhereMock.mockResolvedValueOnce(undefined);
    getDbMock.mockResolvedValueOnce({ delete: () => ({ where: deleteWhereMock }) });

    await expect(caller.admin.learners.remove({ id: 7 })).resolves.toEqual({ success: true });
    expect(deleteWhereMock).toHaveBeenCalledTimes(1);
  });
});
