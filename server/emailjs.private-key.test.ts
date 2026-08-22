import { describe, expect, it } from "vitest";

describe("EmailJS private key configuration", () => {
  it("is accepted by EmailJS without sending an email", async () => {
    const privateKey = process.env.EMAILJS_PRIVATE_KEY ?? "";
    const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

    expect(privateKey).toBeTruthy();
    expect(publicKey).toBeTruthy();

    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // These IDs intentionally do not exist, so this request validates the
        // account credential path without sending a real application email.
        service_id: "__credential_validation__",
        template_id: "__credential_validation__",
        user_id: publicKey,
        accessToken: privateKey,
        template_params: {},
      }),
    });

    const responseText = await response.text();
    expect(`${response.status} ${responseText}`).not.toMatch(/invalid private key|unauthorized|access denied/i);
    expect([400, 404, 422]).toContain(response.status);
  }, 15_000);
});
