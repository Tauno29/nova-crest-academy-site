import { integer, pgEnum, pgTable, primaryKey, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["user", "admin"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { withTimezone: true }).defaultNow().notNull(),
});

export const parentAccounts = pgTable("parent_accounts", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  accessCodeHash: varchar("accessCodeHash", { length: 128 }).notNull(),
  parentName: varchar("parentName", { length: 160 }).notNull(),
  parentEmail: varchar("parentEmail", { length: 320 }),
  active: integer("active").default(1).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const learners = pgTable("learners", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  surname: varchar("surname", { length: 120 }).notNull(),
  className: varchar("className", { length: 80 }).notNull(),
  classId: integer("classId").references(() => classes.id, { onDelete: "set null" }),
  parentAccountId: integer("parentAccountId").references(() => parentAccounts.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const parentAccountLearners = pgTable("parent_account_learners", {
  parentAccountId: integer("parentAccountId").notNull().references(() => parentAccounts.id, { onDelete: "cascade" }),
  learnerId: integer("learnerId").notNull().references(() => learners.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.parentAccountId, table.learnerId] }),
}));

export const performanceEntries = pgTable("performance_entries", {
  id: serial("id").primaryKey(),
  learnerId: integer("learnerId").notNull().references(() => learners.id, { onDelete: "cascade" }),
  activityName: varchar("activityName", { length: 160 }).notNull(),
  activityType: varchar("activityType", { length: 60 }).notNull(),
  marks: integer("marks").notNull(),
  totalMarks: integer("totalMarks").notNull(),
  performedAt: timestamp("performedAt", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  imageUrl: text("imageUrl"),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  storageKey: text("storageKey").notNull(),
  storageUrl: text("storageUrl").notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  uploadedBy: varchar("uploadedBy", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const urgentUpdates = pgTable("urgent_updates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  isPublished: integer("isPublished").default(0).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ParentAccount = typeof parentAccounts.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Learner = typeof learners.$inferSelect;
export type PerformanceEntry = typeof performanceEntries.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type UrgentUpdate = typeof urgentUpdates.$inferSelect;
