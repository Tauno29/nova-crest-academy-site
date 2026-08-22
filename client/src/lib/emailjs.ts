import emailjs from "@emailjs/browser";

export const ADMISSIONS_RECIPIENT = "novacrestprivateschool@gmail.com";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export type AdmissionsApplication = Record<string, string>;

export function isEmailJsConfigured() {
  return Boolean(serviceId && templateId && publicKey);
}

export function admissionsTemplateParams(application: AdmissionsApplication) {
  return {
    ...application,
    to_email: ADMISSIONS_RECIPIENT,
    submitted_at: new Date().toLocaleString(),
  };
}

export async function sendAdmissionsApplication(application: AdmissionsApplication) {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured");
  }

  return emailjs.send(
    serviceId,
    templateId,
    admissionsTemplateParams(application),
    { publicKey },
  );
}
