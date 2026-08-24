import { ENV } from "./_core/env";

export const JWT_CONFIGURATION_ERROR =
  "Administrator authentication is not configured. Set a non-empty JWT_SECRET in Netlify environment variables, then redeploy.";

export function hasJwtSecret() {
  return ENV.cookieSecret.trim().length > 0;
}

export function getJwtSecretKey() {
  const secret = ENV.cookieSecret.trim();
  if (!secret) throw new Error(JWT_CONFIGURATION_ERROR);
  return new TextEncoder().encode(secret);
}
