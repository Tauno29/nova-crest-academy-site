import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import type { Request } from "express";
import { ENV } from "./_core/env";
import { getSessionCookieOptions } from "./_core/cookies";
import { getJwtSecretKey } from "./authSecret";

export const ADMIN_SESSION_COOKIE = "nova_admin_session";

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(email: string, password: string) {
  return Boolean(ENV.adminEmail && ENV.adminPassword)
    && safeEqual(email.trim().toLowerCase(), ENV.adminEmail.trim().toLowerCase())
    && safeEqual(password, ENV.adminPassword);
}

export async function createAdminSession(email: string) {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(`admin:${email}`)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecretKey());
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretKey());
    if (payload.role !== "admin" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export function getAdminCookieOptions(req: Request) {
  return { ...getSessionCookieOptions(req), maxAge: 8 * 60 * 60 * 1000 } as const;
}

export function generateParentUsername() {
  return `parent-${randomBytes(6).toString("hex")}`;
}

export function generateParentAccessCode() {
  return randomBytes(5).toString("hex").toUpperCase();
}

export function hashParentAccessCode(code: string) {
  return createHash("sha256").update(code.trim()).digest("hex");
}

export function getAdminToken(req: Request) {
  const cookieHeader = req.headers.cookie ?? "";
  const token = cookieHeader.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return token ? decodeURIComponent(token.slice(ADMIN_SESSION_COOKIE.length + 1)) : null;
}
