import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@emailjs/browser", () => ({
  default: {
    send: vi.fn(),
  },
}));

import emailjs from "@emailjs/browser";
import {
  ADMISSIONS_RECIPIENT,
  admissionsTemplateParams,
  isEmailJsConfigured,
  sendAdmissionsApplication,
} from "../client/src/lib/emailjs";

describe("EmailJS Admissions integration", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("keeps the recipient and submitted application fields in the template payload", () => {
    const params = admissionsTemplateParams({
      learner_full_name: "Ama Mensah",
      grade_applying_for: "Grade 1",
    });

    expect(params).toMatchObject({
      learner_full_name: "Ama Mensah",
      grade_applying_for: "Grade 1",
      to_email: ADMISSIONS_RECIPIENT,
    });
    expect(params.submitted_at).toEqual(expect.any(String));
  });

  it("sends the completed application through EmailJS when configured", async () => {
    expect(isEmailJsConfigured()).toBe(true);
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: "OK" } as never);

    await sendAdmissionsApplication({
      learner_full_name: "Ama Mensah",
      declaration_agree: "Yes",
    });

    expect(emailjs.send).toHaveBeenCalledTimes(1);
    expect(emailjs.send.mock.calls[0]?.[2]).toMatchObject({
      learner_full_name: "Ama Mensah",
      declaration_agree: "Yes",
      to_email: ADMISSIONS_RECIPIENT,
    });
  });
});
