export const ADMISSIONS_RECIPIENT = "novacrestprivateschool@gmail.com";
const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Nova Crest Admissions <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildAdmissionsEmail(application: Record<string, string>) {
  const rows = Object.entries(application)
    .filter(([, value]) => value.trim().length > 0)
    .map(([key, value]) => `<tr><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#6b7280;font-weight:600">${escapeHtml(key)}</td><td style="padding:10px 14px;border-bottom:1px solid #eee;color:#17263a">${escapeHtml(value)}</td></tr>`)
    .join("");

  return `<div style="font-family:Arial,sans-serif;color:#17263a;max-width:680px;margin:0 auto"><div style="background:#005f53;color:#fff;padding:22px 24px;border-radius:16px 16px 0 0"><h1 style="margin:0;font-size:24px">New Nova Crest Academy Application</h1><p style="margin:8px 0 0;color:#d7f5ee">Submitted from the online Admissions form</p></div><div style="border:1px solid #e7e2dd;border-top:0;padding:18px 12px 24px;border-radius:0 0 16px 16px"><table style="border-collapse:collapse;width:100%;font-size:14px"><tbody>${rows}</tbody></table><p style="font-size:12px;color:#8a817a;margin:22px 4px 0">Please reply to the parent using the contact details included above.</p></div></div>`;
}

export async function sendAdmissionsEmail(application: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Admissions email delivery is not configured");
  }

  const learnerName = application.learnerFullName || "Prospective learner";
  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.ADMISSIONS_FROM_EMAIL || DEFAULT_FROM,
      to: [ADMISSIONS_RECIPIENT],
      subject: `New Nova Crest application — ${learnerName}`,
      html: buildAdmissionsEmail(application),
    }),
  });

  if (!response.ok) {
    throw new Error(`Admissions email delivery failed (${response.status})`);
  }
}
