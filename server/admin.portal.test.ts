import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";

const context = { req: {} as never, res: {} as never, user: null, parentAccountId: null };
const adminContext = { req: {} as never, res: {} as never, user: { id: 0, openId: "admin:test", name: "Test Admin", email: "admin@example.com", loginMethod: "test", role: "admin", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() } as never, parentAccountId: null };

describe("Admin Portal procedures", () => {
  it.each([
    ["gallery", () => appRouter.createCaller(context).admin.gallery.list()],
    ["alert", () => appRouter.createCaller(context).admin.alert.get()],
    ["learner registry", () => appRouter.createCaller(context).admin.learners.list()],
    ["fee structures", () => appRouter.createCaller(context).admin.fees.get()],
    ["school info", () => appRouter.createCaller(context).admin.schoolInfo.get()],
  ])("protects %s reads from unauthenticated callers", async (_name, call) => {
    await expect(call()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("exposes safe public managed-content reads without requiring admin authentication", async () => {
    const caller = appRouter.createCaller(context);
    await expect(caller.publicSite.gallery()).resolves.toBeInstanceOf(Array);
    await expect(caller.publicSite.alert()).resolves.toBeDefined();
    await expect(caller.publicSite.fees()).resolves.toBeDefined();
    await expect(caller.publicSite.contact()).resolves.toBeDefined();
  });
});

describe("Admin Portal mutation validation", () => {
  const caller = appRouter.createCaller(adminContext);

  it("rejects invalid gallery upload payloads before storage access", async () => {
    await expect(caller.admin.gallery.upload({ title: "x", category: "Campus", filename: "x.svg", mimeType: "image/png", dataUrl: "not-data" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects malformed alert and learner mutation payloads", async () => {
    await expect(caller.admin.alert.save({ enabled: true, message: "", buttonLabel: "Apply", destination: "/admissions" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.learners.create({ fullName: "Portal Test", surname: "Learner", studentId: "TEST-001", parentPin: "12", className: "Grade 7A" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("allows deletion inputs only for positive database record IDs", async () => {
    await expect(caller.admin.gallery.remove({ id: 0 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.gallery.remove({ id: -1 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("rejects invalid fee and school-contact mutation payloads", async () => {
    await expect(caller.admin.fees.save({ academicYear: "", kindergarten: "x", prePrimary: "x", grade1to3: "x", developmentFund: "x", hostelBoarding: "x", registrationFee: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    await expect(caller.admin.schoolInfo.save({ phone: "x", whatsapp: "x", email: "invalid", location: "x", postalBox: "x", registrationNumber: "x", nextTermDate: "x" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
