// @vitest-environment jsdom
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { portalQuery, loginMutation, logoutMutation } = vi.hoisted(() => ({
  portalQuery: vi.fn(),
  loginMutation: vi.fn(),
  logoutMutation: vi.fn(),
}));

vi.mock("wouter", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/components/PublicMobileMenu", () => ({ PublicMobileMenu: () => <button type="button">Menu</button> }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ learner: { portal: { invalidate: vi.fn(), reset: vi.fn() } } }),
    learner: {
      portal: { useQuery: portalQuery },
      login: { useMutation: loginMutation },
      logout: { useMutation: logoutMutation },
    },
  },
}));

import LearnerPortalPage from "./LearnerPortalPage";

const learner = { id: 7, fullName: "Portal Test", surname: "Learner", studentId: "TEST-001", teacher: "Portal Test Teacher", subjects: "English, Mathematics", className: "Grade 7A", classId: 1, parentAccountId: null, createdAt: new Date(), updatedAt: new Date() };
const performanceRecords = [
  { id: 1, learnerId: 7, activityName: "Mathematics Test 1", activityType: "Test", marks: 8, totalMarks: 10, performedAt: new Date("2026-08-01"), createdAt: new Date("2026-08-01") },
  { id: 2, learnerId: 7, activityName: "Term 1 Examination", activityType: "Exam", marks: 72, totalMarks: 100, performedAt: new Date("2026-08-02"), createdAt: new Date("2026-08-02") },
];

function configurePortal(data: { learner: typeof learner; performance: typeof performanceRecords; attendance: never[] }) {
  portalQuery.mockReturnValue({ data, isLoading: false });
  loginMutation.mockImplementation((options: { onSuccess?: () => void }) => ({ mutate: () => options.onSuccess?.(), isPending: false }));
  logoutMutation.mockImplementation((options: { onSuccess?: () => void }) => ({ mutate: () => options.onSuccess?.(), isPending: false }));
}

async function signIn() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Student ID"), "TEST-001");
  await user.type(screen.getByLabelText("PIN"), "2468");
  await user.click(screen.getByRole("button", { name: "Continue" }));
}

afterEach(() => cleanup());

beforeEach(() => {
  vi.clearAllMocks();
  configurePortal({ learner, performance: performanceRecords, attendance: [] });
});

describe("Learner Portal dashboard sections", () => {
  it("renders learner details, performance, test marks, exam marks, behavior, and term reports", async () => {
    render(<LearnerPortalPage />);
    await signIn();

    expect(await screen.findByRole("heading", { name: "Portal Test Learner" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Performance" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Behavior" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Test marks" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Exam marks" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Exam reports by term" })).toBeTruthy();
    expect(screen.getAllByText("Mathematics Test 1")).toHaveLength(2);
    expect(screen.getAllByText("Term 1 Examination")).toHaveLength(2);
    expect(screen.getByText("Term 1")).toBeTruthy();
    expect(screen.getByText("Term 2")).toBeTruthy();
    expect(screen.getByText("Term 3")).toBeTruthy();
  });

  it("shows explicit empty states instead of inventing learner records", async () => {
    configurePortal({ learner, performance: [], attendance: [] });
    render(<LearnerPortalPage />);
    await signIn();

    expect(await screen.findByText("No performance records have been published yet.")).toBeTruthy();
    expect(screen.getByText("No behavior notes have been published yet.")).toBeTruthy();
    expect(screen.getByText("No test marks have been published yet.")).toBeTruthy();
    expect(screen.getByText("No exam marks have been published yet.")).toBeTruthy();
    expect(screen.getAllByText("No exam report published yet.")).toHaveLength(3);
  });
});
