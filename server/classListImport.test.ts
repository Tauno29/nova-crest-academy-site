import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { extractClassListRows } from "./classListImport";

describe("class-list import parser", () => {
  it("extracts learner and mark columns from CSV text", async () => {
    const buffer = Buffer.from("Full Name,Surname,Class,Activity,Type,Marks,Total\nAmina,Shilongo,Grade 1,Reading,Test,18,20\n");
    await expect(extractClassListRows(buffer, "text/csv", "class-list.csv")).resolves.toEqual([{ fullName: "Amina", surname: "Shilongo", className: "Grade 1", activityName: "Reading", activityType: "Test", marks: 18, totalMarks: 20 }]);
  });

  it("ignores malformed rows", async () => {
    const buffer = Buffer.from("not enough columns\nAmina,Shilongo,Grade 1,Reading,Test,invalid,20\n");
    await expect(extractClassListRows(buffer, "text/csv", "class-list.csv")).resolves.toEqual([]);
  });

  it("keeps browser-sensitive parsers out of module startup", () => {
    const source = readFileSync(resolve(import.meta.dirname, "classListImport.ts"), "utf8");
    expect(source).not.toContain('import { PDFParse } from "pdf-parse"');
    expect(source).not.toContain('import mammoth from "mammoth"');
    expect(source).toContain('await import("pdf-parse")');
    expect(source).toContain('await import("mammoth")');
  });
});
