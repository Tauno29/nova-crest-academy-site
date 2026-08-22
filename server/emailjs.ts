export const ADMISSIONS_RECIPIENT = "novacrestprivateschool@gmail.com";
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

type AdmissionsApplication = Record<string, string>;

function emailJsConfig() {
  return {
    serviceId: process.env.VITE_EMAILJS_SERVICE_ID ?? "",
    templateId: process.env.VITE_EMAILJS_TEMPLATE_ID ?? "",
    publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY ?? "",
  };
}

function templateParams(application: AdmissionsApplication) {
  const guardianEmail = application.guardian_email?.trim() ?? "";

  return {
    ...application,
    email: guardianEmail,
    guardian_email: guardianEmail,
    reply_to: guardianEmail,
    from_name: "Nova Crest Academy Admissions",
    to_email: ADMISSIONS_RECIPIENT,
    submitted_at: new Date().toLocaleString(),
  };
}

export async function sendAdmissionsEmail(application: AdmissionsApplication) {
  const { serviceId, templateId, publicKey } = emailJsConfig();
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured");
  }

  const response = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams(application),
    }),
  });

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 240);
    throw new Error(`EmailJS rejected the application (${response.status})${detail ? `: ${detail}` : ""}`);
  }

  return { recipient: ADMISSIONS_RECIPIENT } as const;
}
