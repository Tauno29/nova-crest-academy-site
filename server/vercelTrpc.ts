import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import type { User } from "../drizzle/schema";
import { getAdminToken, verifyAdminSession } from "./adminAuth";
import { getParentToken, verifyParentSession } from "./parentAuth";
import { getLearnerToken, verifyLearnerSession } from "./learnerAuth";
import { sdk } from "./_core/sdk";
import type { TrpcContext } from "./_core/context";

function adminUser(email: string): User {
  const now = new Date();
  return { id: 0, openId: `admin:${email}`, name: "Nova Crest Administrator", email, loginMethod: "admin-password", role: "admin", createdAt: now, updatedAt: now, lastSignedIn: now };
}

function toRequestLike(request: Request) {
  const url = new URL(request.url);
  return {
    headers: Object.fromEntries(request.headers.entries()),
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    method: request.method,
    url: `${url.pathname}${url.search}`,
  } as unknown as TrpcContext["req"];
}

function appendCookie(headers: Headers, name: string, value: string, options: Record<string, unknown>) {
  const maxAge = typeof options.maxAge === "number" ? Math.max(0, Math.floor(options.maxAge / 1000)) : undefined;
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${typeof options.path === "string" ? options.path : "/"}`];
  if (options.httpOnly === true) parts.push("HttpOnly");
  if (options.secure === true) parts.push("Secure");
  if (options.sameSite === "none" || options.sameSite === "lax" || options.sameSite === "strict") parts.push(`SameSite=${String(options.sameSite).charAt(0).toUpperCase()}${String(options.sameSite).slice(1)}`);
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  headers.append("set-cookie", parts.join("; "));
}

function responseLike(headers: Headers) {
  return {
    cookie(name: string, value: string, options: Record<string, unknown>) { appendCookie(headers, name, value, options); },
    clearCookie(name: string, options: Record<string, unknown>) { appendCookie(headers, name, "", { ...options, maxAge: 0 }); },
  } as unknown as TrpcContext["res"];
}

export async function createVercelTrpcContext({ req, resHeaders }: FetchCreateContextFnOptions): Promise<TrpcContext> {
  const request = toRequestLike(req);
  let user: User | null = null;
  let parentAccountId: number | null = null;
  let learnerId: number | null = null;
  try { user = await sdk.authenticateRequest(request); } catch { user = null; }
  const learnerToken = getLearnerToken(request);
  if (learnerToken) { const session = await verifyLearnerSession(learnerToken); if (session) learnerId = session.learnerId; }
  const parentToken = getParentToken(request);
  if (parentToken) { const session = await verifyParentSession(parentToken); if (session) parentAccountId = session.accountId; }
  if (!user) { const token = getAdminToken(request); if (token) { const session = await verifyAdminSession(token); if (session) user = adminUser(session.email); } }
  return { req: request, res: responseLike(resHeaders), user, parentAccountId, learnerId };
}
