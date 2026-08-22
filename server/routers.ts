import { TRPCError } from "@trpc/server";
import { and, desc, eq, gt, inArray, isNull, or } from "drizzle-orm";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, parentProcedure, publicProcedure, router } from "./_core/trpc";
import { ADMISSIONS_RECIPIENT, sendAdmissionsEmail } from "./emailjs";
import { ADMIN_SESSION_COOKIE, createAdminSession, generateParentAccessCode, generateParentUsername, getAdminCookieOptions, hashParentAccessCode, validateAdminCredentials } from "./adminAuth";
import { PARENT_SESSION_COOKIE, createParentSession, getParentCookieOptions } from "./parentAuth";
import { getDb } from "./db";
import { extractClassListRows } from "./classListImport";
import { storagePut } from "./storage";
import { attendanceRecords, classes, documents, learners, parentAccountLearners, parentAccounts, performanceEntries, siteContent, urgentUpdateReads, urgentUpdates } from "../drizzle/schema";

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
  parent: router({
    login: publicProcedure.input(z.object({ username: z.string().min(1), accessCode: z.string().min(1) })).mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
      const accounts = await db.select().from(parentAccounts).where(eq(parentAccounts.username, input.username.trim())).limit(1);
      const account = accounts[0];
      if (!account || !account.active || hashParentAccessCode(input.accessCode) !== account.accessCodeHash) throw new TRPCError({ code: "UNAUTHORIZED", message: "The username or access code is incorrect." });
      ctx.res.cookie(PARENT_SESSION_COOKIE, await createParentSession(account.id), getParentCookieOptions(ctx.req));
      return { success: true, parentName: account.parentName } as const;
    }),
    logout: publicProcedure.mutation(({ ctx }) => { ctx.res.clearCookie(PARENT_SESSION_COOKIE, { ...getParentCookieOptions(ctx.req), maxAge: -1 }); return { success: true } as const; }),
    portal: parentProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
      const links = await db.select({ learnerId: parentAccountLearners.learnerId }).from(parentAccountLearners).where(eq(parentAccountLearners.parentAccountId, ctx.parentAccountId));
      const ids = links.map(link => link.learnerId);
      if (!ids.length) {
        const [updates, reads] = await Promise.all([
          db.select().from(urgentUpdates).where(and(eq(urgentUpdates.isPublished, 1), or(isNull(urgentUpdates.expiresAt), gt(urgentUpdates.expiresAt, new Date())))).orderBy(desc(urgentUpdates.createdAt)),
          db.select().from(urgentUpdateReads).where(eq(urgentUpdateReads.parentAccountId, ctx.parentAccountId)),
        ]);
        return { children: [], performance: [], attendance: [], updates, readIds: reads.map(read => read.updateId) };
      }
      const [children, performance, attendance, updates, reads] = await Promise.all([
        db.select().from(learners).where(inArray(learners.id, ids)),
        db.select().from(performanceEntries).where(inArray(performanceEntries.learnerId, ids)).orderBy(desc(performanceEntries.performedAt)),
        db.select().from(attendanceRecords).where(inArray(attendanceRecords.learnerId, ids)).orderBy(desc(attendanceRecords.attendanceDate)),
        db.select().from(urgentUpdates).where(and(eq(urgentUpdates.isPublished, 1), or(isNull(urgentUpdates.expiresAt), gt(urgentUpdates.expiresAt, new Date())))).orderBy(desc(urgentUpdates.createdAt)),
        db.select().from(urgentUpdateReads).where(eq(urgentUpdateReads.parentAccountId, ctx.parentAccountId)),
      ]);
      return { children, performance, attendance, updates, readIds: reads.map(read => read.updateId) };
    }),
    markUpdateRead: parentProcedure.input(z.object({ updateId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
      await db.insert(urgentUpdateReads).values({ parentAccountId: ctx.parentAccountId, updateId: input.updateId }).onConflictDoUpdate({ target: [urgentUpdateReads.parentAccountId, urgentUpdateReads.updateId], set: { readAt: new Date() } });
      return { success: true } as const;
    }),
  }),
  content: router({
    get: publicProcedure.input(z.object({ contentKey: z.string().min(1).max(100) })).query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
      const rows = await db.select().from(siteContent).where(eq(siteContent.contentKey, input.contentKey)).limit(1);
      return rows[0] ?? null;
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
    classes: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(classes).orderBy(classes.name);
      }),
      create: adminProcedure.input(z.object({ name: z.string().min(1).max(80) })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(classes).values(input);
        return { success: true } as const;
      }),
    }),
    learners: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(learners).orderBy(learners.className, learners.surname, learners.fullName);
      }),
      create: adminProcedure.input(z.object({ fullName: z.string().min(2).max(160), surname: z.string().min(2).max(120), className: z.string().min(1).max(80), classId: z.number().int().positive().optional() })).mutation(async ({ input }) => {
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
      resetCode: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const accessCode = generateParentAccessCode();
        await db.update(parentAccounts).set({ accessCodeHash: hashParentAccessCode(accessCode), updatedAt: new Date(), active: 1 }).where(eq(parentAccounts.id, input.id));
        return { success: true, accessCode } as const;
      }),
      setActive: adminProcedure.input(z.object({ id: z.number().int().positive(), active: z.boolean() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.update(parentAccounts).set({ active: input.active ? 1 : 0, updatedAt: new Date() }).where(eq(parentAccounts.id, input.id));
        return { success: true } as const;
      }),
      create: adminProcedure.input(z.object({ parentName: z.string().min(2).max(160), parentEmail: z.string().email().optional(), learnerIds: z.array(z.number().int().positive()).default([]) })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const accessCode = generateParentAccessCode();
        let username = generateParentUsername();
        for (let attempt = 0; attempt < 3; attempt += 1) {
          try {
            await db.transaction(async tx => {
              const inserted = await tx.insert(parentAccounts).values({ username, accessCodeHash: hashParentAccessCode(accessCode), parentName: input.parentName, parentEmail: input.parentEmail ?? null }).returning({ id: parentAccounts.id });
              const parentId = inserted[0]?.id;
              if (!parentId) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to create the parent account." });
              if (input.learnerIds.length) await tx.insert(parentAccountLearners).values(input.learnerIds.map(learnerId => ({ parentAccountId: parentId, learnerId })));
            });
            return { success: true, username, accessCode } as const;
          } catch (error) {
            const isDuplicateUsername = Boolean(error && typeof error === "object" && "code" in error && error.code === "23505");
            if (!isDuplicateUsername || attempt === 2) throw error;
            username = generateParentUsername();
          }
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to create a unique parent account." });
      }),
    }),
    documents: router({
      upload: adminProcedure.input(z.object({ filename: z.string().min(1).max(255), mimeType: z.string().min(1).max(120), dataBase64: z.string().min(1) })).mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const buffer = Buffer.from(input.dataBase64, "base64");
        if (buffer.length > 15 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Class-list files must be 15 MB or smaller." });
        const stored = await storagePut(`class-lists/${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`, buffer, input.mimeType);
        await db.insert(documents).values({ filename: input.filename, mimeType: input.mimeType, storageKey: stored.key, storageUrl: stored.url, uploadedBy: ctx.user.email ?? "administrator" });
        return { success: true, url: stored.url } as const;
      }),
      import: adminProcedure.input(z.object({ filename: z.string().min(1).max(255), mimeType: z.string().min(1).max(120), dataBase64: z.string().min(1) })).mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const buffer = Buffer.from(input.dataBase64, "base64");
        if (buffer.length > 15 * 1024 * 1024) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE", message: "Class-list files must be 15 MB or smaller." });
        const rows = await extractClassListRows(buffer, input.mimeType, input.filename);
        if (!rows.length) throw new TRPCError({ code: "BAD_REQUEST", message: "No valid class-list rows were found. Use columns: full name, surname, class, activity, type, marks, total marks." });
        await db.transaction(async tx => {
          const stored = await storagePut(`class-lists/${Date.now()}-${input.filename.replace(/[^a-zA-Z0-9._-]/g, "-")}`, buffer, input.mimeType);
          const insertedDocument = await tx.insert(documents).values({ filename: input.filename, mimeType: input.mimeType, storageKey: stored.key, storageUrl: stored.url, uploadedBy: ctx.user.email ?? "administrator", importStatus: "importing", importedRows: 0 }).returning({ id: documents.id });
          for (const row of rows) {
            await tx.insert(classes).values({ name: row.className }).onConflictDoNothing();
            const classRows = await tx.select().from(classes).where(eq(classes.name, row.className)).limit(1);
            const existingLearner = await tx.select({ id: learners.id }).from(learners).where(and(eq(learners.fullName, row.fullName), eq(learners.surname, row.surname), eq(learners.className, row.className))).limit(1);
            const learnerId = existingLearner[0]?.id ?? (await tx.insert(learners).values({ fullName: row.fullName, surname: row.surname, className: row.className, classId: classRows[0]?.id }).returning({ id: learners.id }))[0]?.id;
            if (learnerId && row.activityName && row.marks !== undefined && row.totalMarks !== undefined) await tx.insert(performanceEntries).values({ learnerId, activityName: row.activityName, activityType: row.activityType || "Imported", marks: row.marks, totalMarks: row.totalMarks });
          }
          if (insertedDocument[0]?.id) await tx.update(documents).set({ importStatus: "imported", importedRows: rows.length }).where(eq(documents.id, insertedDocument[0].id));
        });
        return { success: true, importedRows: rows.length } as const;
      }),
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(documents).orderBy(desc(documents.createdAt));
      }),
    }),
    attendance: router({
      list: adminProcedure.input(z.object({ learnerId: z.number().int().positive().optional() }).default({})).query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return input.learnerId ? db.select().from(attendanceRecords).where(eq(attendanceRecords.learnerId, input.learnerId)).orderBy(desc(attendanceRecords.attendanceDate)) : db.select().from(attendanceRecords).orderBy(desc(attendanceRecords.attendanceDate));
      }),
      create: adminProcedure.input(z.object({ learnerId: z.number().int().positive(), attendanceDate: z.coerce.date(), status: z.enum(["present", "absent", "late", "excused"]), note: z.string().max(500).optional() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(attendanceRecords).values(input);
        return { success: true } as const;
      }),
    }),
    updates: router({
      list: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return db.select().from(urgentUpdates).orderBy(desc(urgentUpdates.createdAt));
      }),
      create: adminProcedure.input(z.object({ title: z.string().min(1).max(180), body: z.string().min(1), isPublished: z.boolean().default(false), expiresAt: z.coerce.date().optional() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(urgentUpdates).values({ title: input.title, body: input.body, isPublished: input.isPublished ? 1 : 0, expiresAt: input.expiresAt ?? null });
        return { success: true } as const;
      }),
      update: adminProcedure.input(z.object({ id: z.number().int().positive(), title: z.string().min(1).max(180), body: z.string().min(1), isPublished: z.boolean(), expiresAt: z.coerce.date().optional() })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.update(urgentUpdates).set({ title: input.title, body: input.body, isPublished: input.isPublished ? 1 : 0, expiresAt: input.expiresAt ?? null }).where(eq(urgentUpdates.id, input.id));
        return { success: true } as const;
      }),
    }),
    performance: router({
      summary: adminProcedure.query(async () => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        const [learnerRows, markRows] = await Promise.all([db.select().from(learners), db.select().from(performanceEntries)]);
        return learnerRows.map(learner => { const rows = markRows.filter(row => row.learnerId === learner.id); const achieved = rows.reduce((sum, row) => sum + row.marks, 0); const possible = rows.reduce((sum, row) => sum + row.totalMarks, 0); return { learnerId: learner.id, learnerName: `${learner.fullName} ${learner.surname}`, className: learner.className, entries: rows.length, percentage: possible ? Math.round((achieved / possible) * 100) : null }; });
      }),
      list: adminProcedure.input(z.object({ learnerId: z.number().int().positive().optional() }).default({})).query(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        return input.learnerId ? db.select().from(performanceEntries).where(eq(performanceEntries.learnerId, input.learnerId)).orderBy(desc(performanceEntries.performedAt)) : db.select().from(performanceEntries).orderBy(desc(performanceEntries.performedAt));
      }),
      create: adminProcedure.input(z.object({ learnerId: z.number().int().positive(), activityName: z.string().min(1).max(160), activityType: z.string().min(1).max(60), marks: z.number().int().min(0), totalMarks: z.number().int().positive() }).refine(value => value.marks <= value.totalMarks, { message: "Marks cannot exceed the total marks." })).mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database is not available." });
        await db.insert(performanceEntries).values(input);
        return { success: true, percentage: Math.round((input.marks / input.totalMarks) * 100) } as const;
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
        await db.insert(siteContent).values({ ...input, imageUrl: input.imageUrl || null }).onConflictDoUpdate({ target: siteContent.contentKey, set: { title: input.title, body: input.body, imageUrl: input.imageUrl || null, updatedAt: new Date() } });
        return { success: true } as const;
      }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
