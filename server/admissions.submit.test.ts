import { beforeEach, describe, expect, it, vi } from "vitest";

const { sendAdmissionsEmail } = vi.hoisted(() => ({
  sendAdmissionsEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./email", () => ({
  ADMISSIONS_RECIPIENT: "novacrestprivateschool@gmail.com",
  sendAdmissionsEmail,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context = {
  user: undefined,
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext;

describe("admissions.submit", () => {
  beforeEach(() => sendAdmissionsEmail.mockClear());

  it("sends the completed application to the school recipient", async () => {
    const caller = appRouter.createCaller(context);
    const application = {
      learnerFullName: "Test Learner",
      gradeApplyingFor: "Grade 1",
      guardianContactNumber: "081 800 8007",
    };

    const result = await caller.admissions.submit({ application });

    expect(result).toEqual({
      success: true,
      recipient: "novacrestprivateschool@gmail.com",
    });
    expect(sendAdmissionsEmail).toHaveBeenCalledWith(application);
  });

  it("rejects an empty application payload", async () => {
    const caller = appRouter.createCaller(context);

    await expect(caller.admissions.submit({ application: {} })).rejects.toThrow();
    expect(sendAdmissionsEmail).not.toHaveBeenCalled();
  });
});
