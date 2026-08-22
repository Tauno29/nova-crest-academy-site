import { afterEach, describe, expect, it, vi } from "vitest";
import { ADMISSIONS_RECIPIENT, sendAdmissionsEmail } from "./emailjs";

describe("EmailJS Admissions delivery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("posts the completed application to EmailJS with the school recipient", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => "OK",
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendAdmissionsEmail({
      learner_full_name: "Ama Mensah",
      guardian_email: "parent@example.com",
      declaration_agree: "Yes",
    });

    expect(result).toEqual({ recipient: ADMISSIONS_RECIPIENT });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, request] = fetchMock.mock.calls[0] ?? [];
    const body = JSON.parse(String((request as RequestInit).body));
    expect(body).toMatchObject({
      service_id: expect.any(String),
      template_id: expect.any(String),
      user_id: expect.any(String),
      template_params: {
        learner_full_name: "Ama Mensah",
        guardian_email: "parent@example.com",
        email: "parent@example.com",
        reply_to: "parent@example.com",
        from_name: "Nova Crest Academy Admissions",
        to_email: ADMISSIONS_RECIPIENT,
      },
    });
  });

  it("surfaces an EmailJS rejection without hiding the delivery failure", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => "The template is invalid",
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendAdmissionsEmail({ learner_full_name: "Ama Mensah" })).rejects.toThrow(
      "EmailJS rejected the application (400): The template is invalid",
    );
  });
});
