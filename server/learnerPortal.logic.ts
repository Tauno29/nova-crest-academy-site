import { hashParentAccessCode } from "./adminAuth";

type LearnerCredentialRecord = {
  studentId: string | null;
  parentPinHash: string | null;
};

export function hasValidLearnerCredentials(record: LearnerCredentialRecord | undefined, studentId: string, pin: string) {
  return Boolean(
    record &&
    record.studentId === studentId.trim() &&
    record.parentPinHash &&
    /^\d{4}$/.test(pin) &&
    hashParentAccessCode(pin) === record.parentPinHash,
  );
}

export function scopeLearnerRecords<T extends { learnerId: number }>(records: T[], learnerId: number) {
  return records.filter(record => record.learnerId === learnerId);
}
