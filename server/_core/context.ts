import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getAdminToken, verifyAdminSession } from "../adminAuth";
import { getParentToken, verifyParentSession } from "../parentAuth";
import { getLearnerToken, verifyLearnerSession } from "../learnerAuth";
import { sdk } from "./sdk";

function adminUser(email: string): User {
  const now = new Date();
  return {
    id: 0,
    openId: `admin:${email}`,
    name: "Nova Crest Administrator",
    email,
    loginMethod: "admin-password",
    role: "admin",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  parentAccountId: number | null;
  learnerId: number | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let parentAccountId: number | null = null;
  let learnerId: number | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch {
    // Authentication is optional for public procedures.
    user = null;
  }

  const learnerToken = getLearnerToken(opts.req);
  if (learnerToken) {
    const session = await verifyLearnerSession(learnerToken);
    if (session) learnerId = session.learnerId;
  }

  const parentToken = getParentToken(opts.req);
  if (parentToken) {
    const session = await verifyParentSession(parentToken);
    if (session) parentAccountId = session.accountId;
  }

  if (!user) {
    const token = getAdminToken(opts.req);
    if (token) {
      const session = await verifyAdminSession(token);
      if (session) user = adminUser(session.email);
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    parentAccountId,
    learnerId,
  };
}
