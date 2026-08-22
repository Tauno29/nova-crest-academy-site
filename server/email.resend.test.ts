import { describe, expect, it } from "vitest";

const resendApiKey = process.env.RESEND_API_KEY;

describe("Resend email configuration", () => {
  it("accepts the configured API key", async () => {
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const response = await fetch("https://api.resend.com/domains", {
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
      },
    });

    expect(response.status).toBe(200);
  }, 15_000);
});
