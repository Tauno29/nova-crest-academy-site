// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { detailQuery, saveRecord, addMark, updateMark, removeMark, navigate } = vi.hoisted(() => ({
  detailQuery: vi.fn(),
  saveRecord: vi.fn(),
  addMark: vi.fn(),
  updateMark: vi.fn(),
  removeMark: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("wouter", () => ({ useLocation: () => ["/admin/learners/7", navigate], Link: ({ children }: { children: React.ReactNode }) => <>{children}</> }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ admin: { learners: { detail: { invalidate: vi.fn() } } }, learner: { portal: { invalidate: vi.fn() } } }),
    admin: {
      learners: {
        detail: { useQuery: detailQuery },
        portalRecord: { save: { useMutation: (options: { onSuccess?: () => void }) => ({ mutate: (input: unknown) => { saveRecord(input); options.onSuccess?.(); }, isPending: false }) } },
      },
      performance: {
        create: { useMutation: (options: { onSuccess?: () => void }) => ({ mutate: (input: unknown) => { addMark(input); options.onSuccess?.(); }, isPending: false }) },
        update: { useMutation: (options: { onSuccess?: () => void }) => ({ mutate: (input: unknown) => { updateMark(input); options.onSuccess?.(); }, isPending: false }) },
        remove: { useMutation: (options: { onSuccess?: () => void }) => ({ mutate: (input: unknown) => { removeMark(input); options.onSuccess?.(); }, isPending: false }) },
      },
    },
  },
}));

import AdminLearnerDetail from "./AdminLearnerDetail";

const detailData = {
  learner: { id: 7, fullName: "Portal Test", surname: "Learner", studentId: "TEST-001", teacher: "Portal Test Teacher", subjects: "English", className: "Grade 7A", classId: 1, parentAccountId: null, createdAt: new Date(), updatedAt: new Date() },
  performance: [{ id: 11, activityName: "Mathematics Test 1", activityType: "Test", marks: 8, totalMarks: 10 }],
  attendance: [],
  portalRecord: { learnerId: 7, behaviorNotes: "", term1Report: "", term2Report: "", term3Report: "", updatedAt: new Date() },
};

afterEach(() => cleanup());

beforeEach(() => {
  vi.clearAllMocks();
  detailQuery.mockReturnValue({ data: detailData, isLoading: false });
});

describe("Admin Learner detail editor", () => {
  it("saves behavior and per-term report content for the learner portal", async () => {
    const user = userEvent.setup();
    render(<AdminLearnerDetail learnerId={7} />);

    await user.type(screen.getByLabelText("Behavior"), "Shows strong teamwork.");
    await user.type(screen.getByLabelText("Term 1 exam report"), "Good progress this term.");
    await user.click(screen.getByRole("button", { name: "Save portal information" }));

    expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ learnerId: 7, behaviorNotes: "Shows strong teamwork.", term1Report: "Good progress this term." }));
  });

  it("edits and deletes an existing test mark for the selected learner", async () => {
    const user = userEvent.setup();
    render(<AdminLearnerDetail learnerId={7} />);

    await user.click(screen.getAllByRole("button", { name: "Edit Mathematics Test 1" })[0]);
    expect(screen.getByRole("button", { name: "Update mark" })).toBeTruthy();
    await user.clear(screen.getByLabelText("Marks achieved"));
    await user.type(screen.getByLabelText("Marks achieved"), "9");
    await user.click(screen.getByRole("button", { name: "Update mark" }));
    expect(updateMark).toHaveBeenCalledWith({ id: 11, learnerId: 7, activityName: "Mathematics Test 1", activityType: "Test", marks: 9, totalMarks: 10 });

    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getAllByRole("button", { name: "Delete Mathematics Test 1" })[0]);
    expect(removeMark).toHaveBeenCalledWith({ id: 11, learnerId: 7 });
  });

  it("adds a test or exam mark for the selected learner", async () => {
    const user = userEvent.setup();
    render(<AdminLearnerDetail learnerId={7} />);

    await user.type(screen.getByLabelText("Activity name"), "Mathematics Test 1");
    await user.selectOptions(screen.getByLabelText("Record type"), "Test");
    await user.type(screen.getByLabelText("Marks achieved"), "8");
    await user.type(screen.getByLabelText("Total marks"), "10");
    await user.click(screen.getByRole("button", { name: "Add mark" }));

    expect(addMark).toHaveBeenCalledWith({ learnerId: 7, activityName: "Mathematics Test 1", activityType: "Test", marks: 8, totalMarks: 10 });
  });
});
