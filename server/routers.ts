import { TRPCError } from "@trpc/server";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { ADMISSIONS_RECIPIENT, sendAdmissionsEmail } from "./emailjs";
import { ADMIN_SESSION_COOKIE, createAdminSession, generateParentAccessCode, getAdminCookieOptions, hashParentAccessCode, validateAdminCredentials } from "./adminAuth";
import { getDb } from "./db";
import { documents, learners, parentAccounts, siteContent, urgentUpdates } from "../drizzle/schema";

function randomUsernameSuffix() {
  return Math.random().toString(36).slice(2, 8);
}

const contentInput = z.object({
  contentKey: z.string().min(1).max(100),
  title: z.string().min(1).max(180),
  body: z.string().min(1),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...getAdminCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  admissions: router({
    submit: publicProcedure
      .input(z.object({ application: z.record(z.string(), z.string()).refine(value => Object.keys(value).length > 0) }))
      .mutation(async ({ input }) => {
        await sendAdmissionsEmail(input.application);
        return { success: true, recipient: ADMISSIONS_RECIPIENT } as const;
      }),
  }),
  admin: router({
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        if (!validateAdminCredentials(input.email, input.password)) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "The administrator email or password is incorrect." });
        }
        const token = await createAdminSession(input.email);
        ctx.res.cookie(ADMIN_SESSION_COOKIE, token, getAdminCookieOptions(ctx.req));
        return { success: true, email: input.email } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { ...getAdminCookieOptions(ctx.req), maxAge: -1 });
      return { success: true } as const;
    }),
    me: adminProcedure.query(({ ctx }) => ({ email: ctx.user.email, name: ctx.user.name })),
    dashboard: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
      const [learnerRows, parentRows, contentRows, updateRows, documentRows] = await Promise.all([
        db.select({ id: learners.id }).from(learners),
        db.select({ id: parentAccounts.id }).from(parentAccounts),
        db.select({ id: siteContent.id }).from(siteContent),
        db.select({ id: urgentUpdates.id }).from(urgentUpdates),
        db.select({ id: documents.id }).from(documents),
      ]);
      return { learners: learnerRows.length, parentAccounts: parentRows.length, contentSections: contentRows.length, urgentUpdates: updateRows.length, documents: documentRows.length };
    }),
    learners: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(learners).orderBy(learners.className, learners.surname, learners.fullName);
      }),
      create: adminProcedure.input(z.object({ fullName: z.string().min(2).max(160), surname: z.string().min(2).max(120), className: z.string().min(1).max(80) })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(learners).values(input);
        return { success: true } as const;
      }),
    }),
    parents: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select({ id: parentAccounts.id, username: parentAccounts.username, parentName: parentAccounts.parentName, parentEmail: parentAccounts.parentEmail, active: parentAccounts.active, createdAt: parentAccounts.createdAt }).from(parentAccounts).orderBy(desc(parentAccounts.createdAt));
      }),
      create: adminProcedure.input(z.object({ parentName: z.string().min(2).max(160), parentEmail: z.string().email().optional() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const accessCode = generateParentAccessCode();
        const username = `parent-${randomUsernameSuffix()}`;
        await db.insert(parentAccounts).values({ username, accessCodeHash: hashParentAccessCode(accessCode), parentName: input.parentName, parentEmail: input.parentEmail ?? null });
        return { success: true, username, accessCode } as const;
      }),
    }),
    content: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(siteContent).orderBy(desc(siteContent.updatedAt));
      }),
      save: adminProcedure.input(contentInput).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(siteContent).values({ ...input, imageUrl: input.imageUrl || null }).onDuplicateKeyUpdate({ set: { title: input.title, body: input.body, imageUrl: input.imageUrl || null } });
        return { success: true } as const;
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
