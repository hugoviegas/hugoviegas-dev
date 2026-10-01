import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
  it("shows EN and PT-BR side by side with labelled fields", () => {
    renderEditor(erin);
    expect(screen.getByRole("group", { name: "English" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Portuguese (Brazil)" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Title")).toHaveLength(2);
  });

  it("blocks publishing when a language is empty", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({ ...erin, ptBR: { ...erin.ptBR, title: "" } });
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).not.toHaveBeenCalled();
    const ptTitle = document.getElementById("field-ptBR-title")!;
    expect(ptTitle).toHaveAttribute("aria-invalid", "true");
    expect(ptTitle).toHaveAccessibleDescription(adminStrings["err.publishBoth"].EN);
    expect(screen.getByRole("alert")).toHaveTextContent(adminStrings.formHasErrors.EN);
  });

  it("saves a draft with an empty language, dropping blank bullet lines", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({
      ...erin,
      published: false,
      ptBR: { ...erin.ptBR, title: "" },
      en: { ...erin.en, bullets: ["One", "", "Two"] },
    });
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledOnce();
    expect(onSave.mock.calls[0][0].en.bullets).toEqual(["One", "Two"]);
  });

  it("rejects an id that already exists", async () => {
    const user = userEvent.setup();
    const onSave = renderEditor({ ...erin, published: false }, true);
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).not.toHaveBeenCalled();
    expect(await screen.findByText(adminStrings["err.idTaken"].EN)).toBeInTheDocument();
  });
});
