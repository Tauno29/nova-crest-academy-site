import { int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const parentAccounts = mysqlTable("parent_accounts", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  accessCodeHash: varchar("accessCodeHash", { length: 128 }).notNull(),
  parentName: varchar("parentName", { length: 160 }).notNull(),
  parentEmail: varchar("parentEmail", { length: 320 }),
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const classes = mysqlTable("classes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const learners = mysqlTable("learners", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 160 }).notNull(),
  surname: varchar("surname", { length: 120 }).notNull(),
  className: varchar("className", { length: 80 }).notNull(),
  classId: int("classId").references(() => classes.id, { onDelete: "set null" }),
  parentAccountId: int("parentAccountId").references(() => parentAccounts.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const parentAccountLearners = mysqlTable("parent_account_learners", {
  parentAccountId: int("parentAccountId").notNull().references(() => parentAccounts.id, { onDelete: "cascade" }),
  learnerId: int("learnerId").notNull().references(() => learners.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.parentAccountId, table.learnerId] }),
}));

export const performanceEntries = mysqlTable("performance_entries", {
  id: int("id").autoincrement().primaryKey(),
  learnerId: int("learnerId").notNull().references(() => learners.id, { onDelete: "cascade" }),
  activityName: varchar("activityName", { length: 160 }).notNull(),
  activityType: varchar("activityType", { length: 60 }).notNull(),
  marks: int("marks").notNull(),
  totalMarks: int("totalMarks").notNull(),
  performedAt: timestamp("performedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  contentKey: varchar("contentKey", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  imageUrl: text("imageUrl"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  storageKey: text("storageKey").notNull(),
  storageUrl: text("storageUrl").notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  uploadedBy: varchar("uploadedBy", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const urgentUpdates = mysqlTable("urgent_updates", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  isPublished: int("isPublished").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
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
