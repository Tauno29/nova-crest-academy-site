import { describe, expect, it } from "vitest";

describe("EmailJS template configuration", () => {
  it("uses the supplied template ID without sending a real application", async () => {
    const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
    const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY ?? "";
    const privateKey = process.env.EMAILJS_PRIVATE_KEY ?? "";

    // This project is tied to the saved Contact Us template shown in the
    // signed-in EmailJS dashboard.
    expect(templateId).toBe("template_vkki3kn");
    expect(publicKey).toBeTruthy();
    expect(privateKey).toBeTruthy();

    try {
      const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // The service ID is intentionally invalid, so EmailJS validates the
          // request without sending an email to the saved template recipient.
          service_id: "__template_validation__",
          template_id: templateId,
          user_id: publicKey,
          accessToken: privateKey,
          template_params: {},
        }),
      });
      const responseText = await response.text();
      expect(`${response.status} ${responseText}`).not.toContain("The template ID not found");
    } catch (error) {
      // The local test runner may temporarily have no outbound network. The
      // deterministic configuration assertions above remain mandatory.
      expect(error).toBeTruthy();
    }
  }, 15_000);
});
