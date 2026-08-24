import { jwtVerify, SignJWT } from "jose";
import type { Request } from "express";
import { getSessionCookieOptions } from "./_core/cookies";
import { getJwtSecretKey } from "./authSecret";

export const PARENT_SESSION_COOKIE = "nova_parent_session";
export async function createParentSession(accountId: number) {
  return new SignJWT({ role: "parent", accountId }).setProtectedHeader({ alg: "HS256" }).setSubject(`parent:${accountId}`).setIssuedAt().setExpirationTime("12h").sign(getJwtSecretKey());
}

export async function verifyParentSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    if (payload.role !== "parent" || typeof payload.accountId !== "number") return null;
    return { accountId: payload.accountId };
  } catch { return null; }
}

export function getParentCookieOptions(req: Request) {
  return { ...getSessionCookieOptions(req), maxAge: 12 * 60 * 60 * 1000 } as const;
}

export function getParentToken(req: Request) {
  const header = req.headers.cookie ?? "";
  const token = header.split(";").map(item => item.trim()).find(item => item.startsWith(`${PARENT_SESSION_COOKIE}=`));
  return token ? decodeURIComponent(token.slice(PARENT_SESSION_COOKIE.length + 1)) : null;
}
