import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ADMIN_PATH } from "@/config/admin";
import type { AccessResult, AdminUser } from "../adminAuth";
import { adminStrings } from "../adminStrings";

// The Firebase boundary is mocked; the rules themselves are checked in the
// Firebase Rules Playground (see the PR description).
const auth = vi.hoisted(() => ({
  configured: true,
  listener: null as ((user: AdminUser | null) => void) | null,
  access: "granted" as AccessResult,
  checkOwnerAccess: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOutAdmin: vi.fn(),
}));

vi.mock("../adminAuth", () => ({
  get isFirebaseConfigured() {
    return auth.configured;
  },
  watchAuth: (callback: (user: AdminUser | null) => void) => {
    auth.listener = callback;
    return () => {
      auth.listener = null;
    };
  },
  checkOwnerAccess: auth.checkOwnerAccess,
  signInWithGoogle: auth.signInWithGoogle,
  signOutAdmin: auth.signOutAdmin,
  isDismissedPopup: () => false,
}));

// The dashboard has its own tests; here only access control matters.
vi.mock("../AdminDashboard", () => ({ default: () => <p>Admin dashboard</p> }));
vi.mock("../adminContent", () => ({
  loadExistingContent: vi.fn(async () => ({ docs: {}, settings: null })),
}));

import AdminPage from "../AdminPage";

const owner: AdminUser = { uid: "owner-uid", email: "owner@example.com" };
const emit = (user: AdminUser | null) => act(() => auth.listener?.(user));
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={[ADMIN_PATH]}>
      <AdminPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  auth.configured = true;
  auth.listener = null;
  auth.access = "granted";
  auth.checkOwnerAccess.mockReset().mockImplementation(async () => auth.access);
  auth.signInWithGoogle.mockReset().mockResolvedValue(undefined);
  // Mirrors Firebase: signing out notifies the auth listener with null.
  auth.signOutAdmin.mockReset().mockImplementation(async () => {
    auth.listener?.(null);
  });
});

describe("AdminPage", () => {
  it("offers Google sign-in when signed out", async () => {
    const user = userEvent.setup();
    renderPage();
    emit(null);
    await user.click(screen.getByRole("button", { name: "Sign in with Google" }));
    expect(auth.signInWithGoogle).toHaveBeenCalledOnce();
  });

  it("signs out a rejected account immediately and shows no admin content", async () => {
    auth.access = "denied";
    renderPage();
    emit({ uid: "stranger", email: "stranger@example.com" });

    await waitFor(() => expect(auth.signOutAdmin).toHaveBeenCalledOnce());
    expect(screen.getByRole("alert")).toHaveTextContent(adminStrings.denied.EN);
    expect(screen.queryByText("stranger@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText(adminStrings.granted.EN)).not.toBeInTheDocument();
    expect(screen.queryByText("Admin dashboard")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in with another account" })).toBeInTheDocument();
  });

  it("shows a busy, disabled button while the Google window is open", async () => {
    let finish = () => undefined as void;
    auth.signInWithGoogle.mockImplementation(() => new Promise<void>((resolve) => (finish = resolve)));
    const user = userEvent.setup();
    renderPage();
    emit(null);
    await user.click(screen.getByRole("button", { name: "Sign in with Google" }));
    expect(screen.getByRole("button", { name: /Waiting for Google/ })).toBeDisabled();
    await act(async () => finish());
    expect(screen.getByRole("button", { name: "Sign in with Google" })).toBeEnabled();
  });

  it("shows the shell only after the rules grant access", async () => {
    renderPage();
    emit(owner);

    await waitFor(() => expect(screen.getByText(new RegExp(owner.email!))).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /Back to site/ })).toHaveAttribute("href", "/");
    expect(screen.getByText(adminStrings.granted.EN)).toBeInTheDocument();
    expect(screen.getByText("Admin dashboard")).toBeInTheDocument();
    expect(auth.signOutAdmin).not.toHaveBeenCalled();
  });

  it("does not grant access when the check fails for another reason", async () => {
    auth.access = "error";
    renderPage();
    emit(owner);

    expect(await screen.findByRole("alert")).toHaveTextContent(adminStrings.error.EN);
    expect(screen.queryByText(adminStrings.granted.EN)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("reports missing Firebase config without calling Firebase", () => {
    auth.configured = false;
    renderPage();
    expect(screen.getByRole("alert")).toHaveTextContent(adminStrings.unconfigured.EN);
    expect(auth.listener).toBeNull();
  });

  it("has EN and PT-BR text for every admin string", () => {
    for (const value of Object.values(adminStrings)) {
      expect(value.EN).toBeTruthy();
      expect(value.PT).toBeTruthy();
    }
  });
});
