import { describe, expect, it } from "vitest";
import { createParentSession, verifyParentSession } from "./parentAuth";

function percentage(marks: number, totalMarks: number) {
  if (!Number.isInteger(marks) || !Number.isInteger(totalMarks) || totalMarks <= 0 || marks < 0 || marks > totalMarks) throw new Error("Invalid marks");
  return Math.round((marks / totalMarks) * 100);
}

describe("portal safeguards", () => {
  it("calculates bounded whole-number percentages", () => {
    expect(percentage(17, 20)).toBe(85);
    expect(percentage(1, 3)).toBe(33);
    expect(() => percentage(21, 20)).toThrow("Invalid marks");
    expect(() => percentage(1, 0)).toThrow("Invalid marks");
  });

  it("accepts only signed parent sessions with an account id", async () => {
    const token = await createParentSession(42);
    await expect(verifyParentSession(token)).resolves.toEqual({ accountId: 42 });
    await expect(verifyParentSession(`${token}tampered`)).resolves.toBeNull();
  });
});
