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
  studentId: varchar("studentId", { length: 80 }),
  parentPinHash: varchar("parentPinHash", { length: 128 }),
  teacher: varchar("teacher", { length: 160 }),
  subjects: text("subjects"),
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

export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  learnerId: integer("learnerId").notNull().references(() => learners.id, { onDelete: "cascade" }),
  attendanceDate: timestamp("attendanceDate", { withTimezone: true }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  note: text("note"),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});


export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  contentKey: varchar("contentKey", { length: 120 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  body: text("body").notNull(),
  published: integer("published").default(1).notNull(),
  updatedBy: integer("updatedBy"),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  storageKey: text("storageKey").notNull(),
  storageUrl: text("storageUrl").notNull(),
  mimeType: varchar("mimeType", { length: 120 }).notNull(),
  uploadedBy: varchar("uploadedBy", { length: 320 }).notNull(),
  importStatus: varchar("importStatus", { length: 30 }).default("uploaded").notNull(),
  importedRows: integer("importedRows").default(0).notNull(),
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

export const urgentUpdateReads = pgTable("urgent_update_reads", {
  parentAccountId: integer("parentAccountId").notNull().references(() => parentAccounts.id, { onDelete: "cascade" }),
  updateId: integer("updateId").notNull().references(() => urgentUpdates.id, { onDelete: "cascade" }),
  readAt: timestamp("readAt", { withTimezone: true }).defaultNow().notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.parentAccountId, table.updateId] }),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ParentAccount = typeof parentAccounts.$inferSelect;
export type Class = typeof classes.$inferSelect;
export type Learner = typeof learners.$inferSelect;
export type PerformanceEntry = typeof performanceEntries.$inferSelect;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type SiteContent = typeof siteContent.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type UrgentUpdate = typeof urgentUpdates.$inferSelect;

export const galleryMedia = pgTable("gallery_media", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 180 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).defaultNow().notNull(),
});

export const siteAlertConfig = pgTable("site_alert_config", {
  id: serial("id").primaryKey(),
  enabled: integer("enabled").default(1).notNull(),
  message: text("message").notNull(),
  buttonLabel: varchar("buttonLabel", { length: 80 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const feeStructures = pgTable("fee_structures", {
  id: serial("id").primaryKey(),
  academicYear: varchar("academicYear", { length: 20 }).notNull().unique(),
  kindergarten: varchar("kindergarten", { length: 80 }).notNull(),
  prePrimary: varchar("prePrimary", { length: 80 }).notNull(),
  grade1to3: varchar("grade1to3", { length: 80 }).notNull(),
  developmentFund: varchar("developmentFund", { length: 80 }).notNull(),
  hostelBoarding: varchar("hostelBoarding", { length: 80 }).notNull(),
  registrationFee: varchar("registrationFee", { length: 80 }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export const schoolContactInfo = pgTable("school_contact_info", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 80 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 80 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  location: varchar("location", { length: 180 }).notNull(),
  postalBox: varchar("postalBox", { length: 180 }).notNull(),
  registrationNumber: varchar("registrationNumber", { length: 80 }).notNull(),
  nextTermDate: varchar("nextTermDate", { length: 80 }).notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).defaultNow().notNull(),
});

export type GalleryMedia = typeof galleryMedia.$inferSelect;
export type SiteAlertConfig = typeof siteAlertConfig.$inferSelect;
export type FeeStructure = typeof feeStructures.$inferSelect;
export type SchoolContactInfo = typeof schoolContactInfo.$inferSelect;
