import { beforeAll, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactSection from "@/components/ContactSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import SkipLink, { MAIN_CONTENT_ID } from "@/components/SkipLink";

describe("contact form accessibility", () => {
  it("labels every field and sets autocomplete", () => {
    render(<ContactSection />);

    expect(screen.getByLabelText("Name")).toHaveAttribute("autocomplete", "name");
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Subject")).toBeInTheDocument();
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("marks invalid fields, links their errors, and focuses the first one", async () => {
    const user = userEvent.setup();
    render(<ContactSection />);

    await user.click(screen.getByRole("button", { name: /send/i }));

    const name = screen.getByLabelText("Name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAttribute("aria-describedby", "contact-name-error");
    expect(document.getElementById("contact-name-error")).toHaveTextContent(/required/i);
    expect(name).toHaveFocus();
  });
});

describe("experience toggles", () => {
  it("keep focus and update aria-expanded after Show more", async () => {
    const user = userEvent.setup();
    render(<ExperienceSection />);

    const [toggle] = screen.getAllByRole("button", { name: /show more/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);

    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveFocus();
  });

  it("point every Show more toggle at its collapsible panel", () => {
    render(<ExperienceSection />);

    const toggles = screen.getAllByRole("button", { name: /show more/i });
    expect(toggles.length).toBeGreaterThan(0);
    toggles.forEach((button) => {
      const panelId = button.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(document.getElementById(panelId as string)).toBeInTheDocument();
    });
  });
});

describe("skip link", () => {
  beforeAll(() => {
    // jsdom does not implement scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("moves focus to the main landmark", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <main id={MAIN_CONTENT_ID} tabIndex={-1} />
      </>,
    );

    await user.tab();
    const link = screen.getByRole("link", { name: /skip to main content/i });
    expect(link).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(screen.getByRole("main")).toHaveFocus();
  });
});
