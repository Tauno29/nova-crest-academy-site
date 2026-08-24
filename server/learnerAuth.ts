import { jwtVerify, SignJWT } from "jose";
import type { Request } from "express";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";

export const LEARNER_SESSION_COOKIE = "nova_learner_session";
const key = () => new TextEncoder().encode(ENV.cookieSecret);

export async function createLearnerSession(learnerId: number) {
  return new SignJWT({ role: "learner", learnerId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(`learner:${learnerId}`)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(key());
}

export async function verifyLearnerSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key());
    if (payload.role !== "learner" || typeof payload.learnerId !== "number") return null;
    return { learnerId: payload.learnerId };
  } catch {
    return null;
  }
}

export function getLearnerCookieOptions(req: Request) {
  return { ...getSessionCookieOptions(req), maxAge: 12 * 60 * 60 * 1000 } as const;
}

export function getLearnerToken(req: Request) {
  const header = req.headers.cookie ?? "";
  const token = header.split(";").map(item => item.trim()).find(item => item.startsWith(`${LEARNER_SESSION_COOKIE}=`));
  return token ? decodeURIComponent(token.slice(LEARNER_SESSION_COOKIE.length + 1)) : null;
}
