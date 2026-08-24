// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createMutate, updateMutate, removeMutate, meQuery, learnersQuery } = vi.hoisted(() => ({
  createMutate: vi.fn(),
  updateMutate: vi.fn(),
  removeMutate: vi.fn(),
  meQuery: vi.fn(),
  learnersQuery: vi.fn(),
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/admin/learners", vi.fn()],
  Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useUtils: () => ({ admin: { learners: { list: { invalidate: vi.fn() } }, classes: { list: { invalidate: vi.fn() } } }, auth: { me: { setData: vi.fn(), invalidate: vi.fn() } } }),
    auth: { me: { useQuery: meQuery } },
    admin: {
      logout: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      learners: {
        list: { useQuery: learnersQuery },
        create: { useMutation: () => ({ mutate: createMutate, isPending: false }) },
        update: { useMutation: () => ({ mutate: updateMutate, isPending: false }) },
        remove: { useMutation: () => ({ mutate: removeMutate, isPending: false }) },
      },
      classes: {
        list: { useQuery: () => ({ data: [], isLoading: false }) },
        create: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      },
    },
  },
}));

import AdminPortalPage from "./AdminPortalPage";

const learnerFixture = { id: 7, fullName: "Portal Test", surname: "X", studentId: "TEST-EDIT-001", teacher: "Teacher", subjects: "English", className: "Grade 1", classId: 1 };

afterEach(() => cleanup());

beforeEach(() => {
  vi.clearAllMocks();
  meQuery.mockReturnValue({ isLoading: false, data: { role: "admin", email: "admin@example.com", name: "Test Admin" } });
  learnersQuery.mockReturnValue({ data: [learnerFixture], isLoading: false });
});

describe("Admin Learners rendered form", () => {
  it("submits a one-character surname from the visible surname field", async () => {
    const user = userEvent.setup();
    render(<AdminPortalPage />);

    await user.type(screen.getByLabelText("Surname *"), "X");
    await user.type(screen.getByLabelText("Child full name *"), "Portal Test");
    await user.type(screen.getByLabelText("Student ID / admission no *"), "TEST-004");
    await user.type(screen.getByLabelText("Parent 4-digit access PIN *"), "2468");
    fireEvent.submit(screen.getByRole("button", { name: "Save to Registry" }).closest("form")!);

    expect(createMutate).toHaveBeenCalledWith(expect.objectContaining({ surname: "X", studentId: "TEST-004" }));
  });

  it("loads a learner into the form and submits an edit without requiring a new PIN", async () => {
    const user = userEvent.setup();
    render(<AdminPortalPage />);

    await user.click(screen.getByRole("button", { name: "EDIT" }));
    expect(screen.getByRole("button", { name: "Update Learner" })).toBeTruthy();
    await user.clear(screen.getByLabelText("Surname *"));
    await user.type(screen.getByLabelText("Surname *"), "Y");
    fireEvent.submit(screen.getByRole("button", { name: "Update Learner" }).closest("form")!);

    expect(updateMutate).toHaveBeenCalledWith(expect.objectContaining({ id: 7, surname: "Y", parentPin: undefined }));
  });

  it("confirms and submits deletion for the selected learner", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<AdminPortalPage />);

    await user.click(screen.getByRole("button", { name: "DELETE" }));

    expect(removeMutate).toHaveBeenCalledWith({ id: 7 });
  });
});
