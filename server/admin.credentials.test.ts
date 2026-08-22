import { describe, expect, it } from "vitest";
import { createAdminSession, validateAdminCredentials, verifyAdminSession } from "./adminAuth";

const configuredEmail = process.env.NOVA_ADMIN_EMAIL ?? "";
const configuredPassword = process.env.NOVA_ADMIN_PASSWORD ?? "";

describe("admin credential configuration", () => {
  it("accepts the securely supplied admin email and password without exposing the password", () => {
    expect(configuredEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    expect(configuredPassword.length).toBeGreaterThanOrEqual(12);
    expect(validateAdminCredentials(configuredEmail, configuredPassword)).toBe(true);
    expect(JSON.stringify({ configured: Boolean(configuredEmail && configuredPassword) })).not.toContain(configuredPassword);
  });

  it("rejects an invalid password", () => {
    expect(validateAdminCredentials(configuredEmail, `${configuredPassword}-wrong`)).toBe(false);
  });

  it("creates a signed admin session that verifies to the configured email", async () => {
    const token = await createAdminSession(configuredEmail);
    await expect(verifyAdminSession(token)).resolves.toEqual({ email: configuredEmail });
    await expect(verifyAdminSession(`${token}tampered`)).resolves.toBeNull();
  });
});
