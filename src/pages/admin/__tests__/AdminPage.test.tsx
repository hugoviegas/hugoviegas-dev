import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

import AdminPage from "../AdminPage";

const owner: AdminUser = { uid: "owner-uid", email: "owner@example.com" };
const emit = (user: AdminUser | null) => act(() => auth.listener?.(user));

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
    render(<AdminPage />);
    emit(null);
    await user.click(screen.getByRole("button", { name: "Sign in with Google" }));
    expect(auth.signInWithGoogle).toHaveBeenCalledOnce();
  });

  it("signs out a rejected account immediately and shows no admin content", async () => {
    auth.access = "denied";
    render(<AdminPage />);
    emit({ uid: "stranger", email: "stranger@example.com" });

    await waitFor(() => expect(auth.signOutAdmin).toHaveBeenCalledOnce());
    expect(screen.getByRole("alert")).toHaveTextContent(adminStrings.denied.EN);
    expect(screen.queryByText("stranger@example.com")).not.toBeInTheDocument();
    expect(screen.queryByText(adminStrings.granted.EN)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in with Google" })).toBeInTheDocument();
  });

  it("shows the shell only after the rules grant access", async () => {
    render(<AdminPage />);
    emit(owner);

    expect(await screen.findByText(owner.email!)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(adminStrings.granted.EN);
    expect(auth.signOutAdmin).not.toHaveBeenCalled();
  });

  it("does not grant access when the check fails for another reason", async () => {
    auth.access = "error";
    render(<AdminPage />);
    emit(owner);

    expect(await screen.findByRole("alert")).toHaveTextContent(adminStrings.error.EN);
    expect(screen.queryByText(adminStrings.granted.EN)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
  });

  it("reports missing Firebase config without calling Firebase", () => {
    auth.configured = false;
    render(<AdminPage />);
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
