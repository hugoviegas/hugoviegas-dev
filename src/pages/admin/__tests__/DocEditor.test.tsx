import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fixtureDocs } from "@/test/contentFixtures";
import type { ExperienceDoc } from "@/content/types";
import DocEditor from "../DocEditor";
import { adminStrings } from "../adminStrings";

const erin = fixtureDocs("experience").find((doc) => doc.id === "erin-college") as ExperienceDoc;

const renderEditor = (initial: ExperienceDoc, isNew = false, onSave = vi.fn()) => {
  render(
    <DocEditor
      collection="experience"
      initial={initial}
      isNew={isNew}
      existingIds={new Set(["erin-college", "etal"])}
      onSave={onSave}
      onCancel={vi.fn()}
    />,
  );
  return onSave;
};

describe("DocEditor", () => {
  it("shows EN and PT-BR fields, labelled with their language", () => {
    renderEditor(erin);
    expect(screen.getByRole("textbox", { name: "Title (English)" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Title (Portuguese (Brazil))" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Português/ })).toBeInTheDocument();
  });

  it("blocks publishing when a language is empty and names the field", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({ ...erin, ptBR: { ...erin.ptBR, title: "" } });
    await user.type(document.getElementById("field-en-location")!, "!");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).not.toHaveBeenCalled();
    const summary = screen.getByRole("alert");
    expect(summary).toHaveTextContent("Can’t publish yet: 1 required field is empty");
    expect(within(summary).getByRole("link", { name: "Title · PT-BR" })).toBeInTheDocument();
    const ptTitle = document.getElementById("field-ptBR-title")!;
    expect(ptTitle).toHaveAttribute("aria-invalid", "true");
    expect(ptTitle).toHaveAccessibleDescription("Required in Portuguese before publishing.");
  });

  it("keeps Published off and shows the summary when text is missing", async () => {
    const user = userEvent.setup();
    renderEditor({ ...erin, published: false, ptBR: { ...erin.ptBR, title: "", period: "" } });
    const status = screen.getByRole("switch");
    await user.click(status);
    expect(status).toHaveAttribute("aria-checked", "false");
    expect(screen.getByRole("alert")).toHaveTextContent("2 required fields are empty");
    await user.click(screen.getByRole("link", { name: "Period · PT-BR" }));
    await waitFor(() => expect(document.getElementById("field-ptBR-period")).toHaveFocus());
  });

  it("saves a draft with an empty language, dropping blank bullet lines", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({
      ...erin,
      published: false,
      ptBR: { ...erin.ptBR, title: "" },
      en: { ...erin.en, bullets: ["One", "", "Two"] },
    });
    await user.type(document.getElementById("field-en-location")!, "!");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0][0].en.bullets).toEqual(["One", "Two"]);
  });

  it("disables Save until something changes", () => {
    renderEditor(erin);
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("rejects an id that already exists", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({ ...erin, published: false }, true);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(await screen.findByText(adminStrings["err.idTaken"].EN)).toBeInTheDocument();
  });
});
