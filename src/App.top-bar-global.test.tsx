import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.stubEnv("VITE_SUPABASE_URL", "https://example.supabase.co");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-key");

let App: typeof import("@/App").default;

beforeAll(async () => {
  ({ default: App } = await import("@/App"));
}, 30000);

describe("global application header", () => {
  const routes = [
    "/",
    "/projects/darcy-mcgees",
    "/projects/big-bang-duel",
    "/projects/big-bang-duel/story",
  ];

  it.each(routes)("renders the shared Navbar and TopControls once on %s", (route) => {
    window.history.pushState({}, "", route);

    const { unmount } = render(<App />);

    expect(screen.getAllByRole("button", { name: /switch to/i })).toHaveLength(1);
    expect(screen.getAllByLabelText(/^Projects$/i)).toHaveLength(1);

    unmount();
  });

  it("opens the global Projects submenu with the expected entries and excludes the story route as a standalone project", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/projects/big-bang-duel/story");

    render(<App />);

    await user.click(screen.getByLabelText(/^Projects$/i));

    expect(screen.getByRole("link", { name: /D'Arcy McGee's/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Big Bang Duel$/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /story/i })).not.toBeInTheDocument();
  });

  it("switches the shared navigation labels between English and Portuguese", async () => {
    const user = userEvent.setup();
    localStorage.setItem("language", "EN");
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByLabelText(/^Projects$/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /switch to portuguese/i }));

    expect(await screen.findByLabelText(/^Projetos$/i)).toBeInTheDocument();
  });
});
