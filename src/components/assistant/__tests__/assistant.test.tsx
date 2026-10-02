import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ChatBot from "@/components/ChatBot";
import { ProjectAssistant } from "@/components/project/ProjectParts";

const reply = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });

const setDesktop = (matches: boolean) => {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
};

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => reply({ reply: "Hugo builds an internal ERP platform at Erin College.", sources: ["experience"] }));
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  setDesktop(false);
  document.documentElement.classList.remove("overflow-hidden");
});

describe("portfolio assistant launcher", () => {
  it("opens a labelled assistant panel and closes with Escape, returning focus", async () => {
    setDesktop(true);
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });

    const launcher = screen.getByRole("button", { name: "Open portfolio assistant" });
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(launcher);
    const dialog = screen.getByRole("dialog", { name: "Portfolio assistant" });
    expect(dialog).toBeVisible();
    expect(launcher).toHaveAttribute("aria-expanded", "true");
    expect(launcher).toHaveAccessibleName("Close portfolio assistant");
    expect(dialog).toHaveTextContent(/not Hugo/i);
    await waitFor(() => expect(screen.getByLabelText("Ask a question about Hugo's work")).toHaveFocus());

    await user.keyboard("{Escape}");
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(launcher).toHaveFocus();
  });

  it("sends a suggested question to /api/chat and shows the answer with sources", async () => {
    setDesktop(true);
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole("button", { name: "Open portfolio assistant" }));
    await user.click(screen.getByRole("button", { name: "What does Hugo do at Erin College?" }));

    expect(await screen.findByText(/internal ERP platform/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/#experience");
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("/api/chat");
    expect(JSON.parse(String(init.body))).toMatchObject({ message: "What does Hugo do at Erin College?", language: "EN" });
  });

  it("keeps the conversation after closing and reopening", async () => {
    setDesktop(true);
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });
    const launcher = screen.getByRole("button", { name: "Open portfolio assistant" });

    await user.click(launcher);
    await user.click(screen.getByRole("button", { name: "How can I contact Hugo?" }));
    await screen.findByText(/internal ERP platform/);
    await user.click(launcher);
    await user.click(launcher);
    expect(screen.getByText(/internal ERP platform/)).toBeVisible();
  });

  it("shows a retry action when the assistant is unavailable", async () => {
    setDesktop(true);
    fetchMock.mockImplementationOnce(async () => reply({ error: "unavailable" }, 502));
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole("button", { name: "Open portfolio assistant" }));
    await user.type(screen.getByLabelText("Ask a question about Hugo's work"), "Which projects can I try?{Enter}");

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByText(/internal ERP platform/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("pauses input when the rate limit is reached", async () => {
    setDesktop(true);
    fetchMock.mockImplementationOnce(async () => reply({ error: "rate_limited", retryAfter: 60 }, 429, { "retry-after": "60" }));
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole("button", { name: "Open portfolio assistant" }));
    await user.click(screen.getByRole("button", { name: "Which projects can I try?" }));

    expect(await screen.findByRole("status")).toBeInTheDocument();
    expect(screen.getByLabelText("Ask a question about Hugo's work")).toBeDisabled();
  });

  it("opens a modal sheet on phones, locks scrolling and traps focus", async () => {
    setDesktop(false);
    const user = userEvent.setup();
    render(<ChatBot />, { wrapper: MemoryRouter });

    await user.click(screen.getByRole("button", { name: "Open portfolio assistant" }));
    const dialog = screen.getByRole("dialog", { name: "Portfolio assistant" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(document.documentElement).toHaveClass("overflow-hidden");

    // Tab from the last control wraps to the first one inside the sheet.
    const send = screen.getByRole("button", { name: "Send question" });
    const input = screen.getByLabelText("Ask a question about Hugo's work");
    await user.type(input, "Hi");
    send.focus();
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab({ shift: true });
    expect(send).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Open portfolio assistant" })).toHaveFocus();
    expect(document.documentElement).not.toHaveClass("overflow-hidden");
  });
});

describe("project assistant embed", () => {
  const props = {
    projectId: "darcy" as const,
    titleKey: "darcyAskTitle",
    descriptionKey: "darcyChatDescription",
    suggestionsKey: "darcySuggestedQuestions",
    safetyKey: "darcySafetyNote",
    questionKeys: ["darcyQuestionProblem"],
  };

  it("loads the panel only after an explicit action and can hide it again", async () => {
    const user = userEvent.setup();
    render(<ProjectAssistant {...props} />, { wrapper: MemoryRouter });

    expect(screen.queryByRole("region", { name: "Project assistant" })).not.toBeInTheDocument();
    const start = screen.getByRole("button", { name: "Start a conversation" });
    expect(start).toHaveAttribute("aria-expanded", "false");
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(start);
    expect(screen.getByRole("region", { name: "Project assistant" })).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Hide assistant" }));
    expect(screen.queryByRole("region", { name: "Project assistant" })).not.toBeInTheDocument();
  });

  it("asks a suggested question with the project context", async () => {
    const user = userEvent.setup();
    render(<ProjectAssistant {...props} />, { wrapper: MemoryRouter });
    const [question] = screen.getAllByRole("listitem");

    await user.click(question.querySelector("button")!);
    await screen.findByText(/internal ERP platform/);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(init.body))).toMatchObject({ projectId: "darcy" });
  });
});
