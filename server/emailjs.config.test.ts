import { describe, expect, it } from "vitest";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

describe("EmailJS configuration", () => {
  it("has the required public configuration and reaches the EmailJS API safely", async () => {
    const serviceId = process.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = process.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.VITE_EMAILJS_PUBLIC_KEY;

    expect(serviceId).toBeTruthy();
    expect(templateId).toBeTruthy();
    expect(publicKey).toBeTruthy();

    // Use OPTIONS so the credentialed endpoint is reached without sending a real
    // application email or putting learner data into the request.
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "X-EmailJS-Public-Key": publicKey!,
        "X-EmailJS-Service-Id": serviceId!,
        "X-EmailJS-Template-Id": templateId!,
      },
    });

    expect(response.status).not.toBe(401);
    expect(response.status).not.toBe(403);
    expect(response.status).toBeLessThan(500);
  }, 15_000);
});
