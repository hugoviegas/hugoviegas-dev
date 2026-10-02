import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { ADMIN_PATH } from "@/config/admin";
import { AdminLink, AdminNavProvider, useAdminNav } from "../AdminNavigation";

const Probe = () => {
  const { location, setDirty } = useAdminNav();
  const router = useLocation();
  const navigate = useNavigate();
  return (
    <div>
      <p data-testid="shown">{location.section}</p>
      <p data-testid="url">{router.pathname}</p>
      <button type="button" onClick={() => setDirty(true, "Big Bang Duel")}>
        make dirty
      </button>
      <button type="button" onClick={() => navigate(-1)}>
        browser back
      </button>
      <AdminLink to={{ section: "files" }}>Files</AdminLink>
    </div>
  );
};

const renderAt = (path: string, entries = [path]) =>
  render(
    <MemoryRouter initialEntries={entries} initialIndex={entries.length - 1}>
      <AdminNavProvider>
        <Probe />
      </AdminNavProvider>
    </MemoryRouter>,
  );

describe("AdminNavProvider", () => {
  it("follows links when nothing is unsaved", async () => {
    const user = userEvent.setup();
    renderAt(ADMIN_PATH);
    await user.click(screen.getByRole("link", { name: "Files" }));
    expect(screen.getByTestId("shown")).toHaveTextContent("files");
    expect(screen.getByTestId("url")).toHaveTextContent(`${ADMIN_PATH}/files`);
  });

  it("holds the view and asks before leaving unsaved changes", async () => {
    const user = userEvent.setup();
    renderAt(`${ADMIN_PATH}/projects/big-bang-duel`);
    await user.click(screen.getByRole("button", { name: "make dirty" }));
    await user.click(screen.getByRole("link", { name: "Files" }));

    const dialog = screen.getByRole("alertdialog", { name: "Leave without saving?" });
    expect(dialog).toHaveTextContent("Big Bang Duel");
    expect(screen.getByTestId("shown")).toHaveTextContent("projects");

    await user.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(screen.getByTestId("shown")).toHaveTextContent("projects");

    await user.click(screen.getByRole("link", { name: "Files" }));
    await user.click(screen.getByRole("button", { name: "Discard changes" }));
    expect(screen.getByTestId("shown")).toHaveTextContent("files");
  });

  it("guards the browser back button and restores the address on Keep editing", async () => {
    const user = userEvent.setup();
    renderAt(`${ADMIN_PATH}/projects/big-bang-duel`, [`${ADMIN_PATH}/projects`, `${ADMIN_PATH}/projects/big-bang-duel`]);
    await user.click(screen.getByRole("button", { name: "make dirty" }));
    await act(async () => screen.getByRole("button", { name: "browser back" }).click());

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByTestId("shown")).toHaveTextContent("projects");
    await user.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(screen.getByTestId("url")).toHaveTextContent(`${ADMIN_PATH}/projects/big-bang-duel`);
  });
});
