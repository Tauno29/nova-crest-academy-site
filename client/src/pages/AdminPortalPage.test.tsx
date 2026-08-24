// @vitest-environment jsdom
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createMutate, meQuery } = vi.hoisted(() => ({
  createMutate: vi.fn(),
  meQuery: vi.fn(),
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
        list: { useQuery: () => ({ data: [], isLoading: false }) },
        create: { useMutation: () => ({ mutate: createMutate, isPending: false }) },
      },
      classes: {
        list: { useQuery: () => ({ data: [], isLoading: false }) },
        create: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
      },
    },
  },
}));

import AdminPortalPage from "./AdminPortalPage";

beforeEach(() => {
  vi.clearAllMocks();
  meQuery.mockReturnValue({ isLoading: false, data: { role: "admin", email: "admin@example.com", name: "Test Admin" } });
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
});
