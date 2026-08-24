export type ClassListRow = {
  fullName: string;
  surname: string;
  className: string;
  activityName?: string;
  activityType?: string;
  marks?: number;
  totalMarks?: number;
};

function parseRows(text: string): ClassListRow[] {
  const rows: Array<ClassListRow | null> = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean).map(line => {
    const parts = line.split(/\t|\||,/).map(part => part.trim());
    if (parts.length < 3) return null;
    const [fullName, surname, className, activityName, activityType, marksText, totalMarksText] = parts;
    if (!fullName || !surname || !className || /^full\s*name$/i.test(fullName)) return null;
    const marks = marksText ? Number(marksText) : undefined;
    const totalMarks = totalMarksText ? Number(totalMarksText) : undefined;
    if ((marksText && !Number.isFinite(marks)) || (totalMarksText && !Number.isFinite(totalMarks))) return null;
    return { fullName, surname, className, activityName: activityName || undefined, activityType: activityType || undefined, marks, totalMarks } as ClassListRow;
  });
  return rows.filter((row): row is ClassListRow => Boolean(row));
}

export async function extractClassListRows(buffer: Buffer, mimeType: string, filename: string) {
  const lowerName = filename.toLowerCase();
  let text = buffer.toString("utf8");
  if (mimeType === "application/pdf" || lowerName.endsWith(".pdf")) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    text = result.text;
    await parser.destroy();
  } else if (mimeType.includes("wordprocessingml") || lowerName.endsWith(".docx")) {
    const { default: mammoth } = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  }
  return parseRows(text);
}
