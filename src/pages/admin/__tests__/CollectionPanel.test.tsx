import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fixtureDocs } from "@/test/contentFixtures";
import { ADMIN_PATH } from "@/config/admin";
import { storedFields } from "../storedDoc";
import { adminStrings } from "../adminStrings";

// Firestore boundary mocked; the rules are checked live and in the Playground.
const api = vi.hoisted(() => ({
  loadCollection: vi.fn(),
  loadSettings: vi.fn(),
  listDeleted: vi.fn(),
  saveContentDoc: vi.fn(),
  saveContentDocs: vi.fn(),
  deleteContentDoc: vi.fn(),
}));
vi.mock("../adminContent", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../adminContent")>()),
  ...api,
}));

import CollectionPanel from "../CollectionPanel";
import { renderAdmin } from "./adminTestUtils";

const stored: Record<string, { version: number; data: Record<string, unknown> }> = Object.fromEntries(
  fixtureDocs("experience").map((doc) => [doc.id, { version: 1, data: { ...storedFields(doc), version: 1 } }]),
);
const settings = { useRemote: true, version: 3, updatedAt: null, data: {} };
const deletedRole = {
  id: "old-role",
  deletedAt: "2026-09-28T18:40:00.000Z",
  data: { ...stored.etal.data, en: { ...(stored.etal.data.en as object), title: "Old role" } },
};

beforeEach(() => {
  for (const fn of Object.values(api)) fn.mockReset();
  api.loadCollection.mockResolvedValue(stored);
  api.loadSettings.mockResolvedValue(settings);
  api.listDeleted.mockResolvedValue([deletedRole]);
  api.saveContentDoc.mockResolvedValue(undefined);
  api.saveContentDocs.mockResolvedValue(undefined);
  api.deleteContentDoc.mockResolvedValue(undefined);
});

const renderList = () =>
  renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);

const rowOf = async (text: RegExp) => (await screen.findByText(text, { selector: "b" })).closest("li")!;

describe("CollectionPanel list", () => {
  it("lists docs in order with their status and the row actions", async () => {
    renderList();
    expect(await screen.findByRole("heading", { level: 1, name: adminStrings["col.experience"].EN })).toBeInTheDocument();
    const row = await rowOf(/Erin College/);
    expect(row).toHaveTextContent(adminStrings.statusPublished.EN);
    expect(within(row).getByRole("button", { name: /^Move .*Erin College.* up$/ })).toBeDisabled();
    expect(within(row).getByRole("button", { name: /^Edit / })).toBeInTheDocument();
  });

  it("filters by search text and status", async () => {
    const user = userEvent.setup();
    renderList();
    await rowOf(/Erin College/);
    await user.type(screen.getByLabelText("Search experience"), "dabliu");
    expect(screen.queryByText(/Erin College/, { selector: "b" })).not.toBeInTheDocument();
    expect(screen.getByText(/DabliuMusic/, { selector: "b" })).toBeInTheDocument();
    await user.clear(screen.getByLabelText("Search experience"));
    await user.click(screen.getByRole("button", { name: /^Drafts/ }));
    expect(screen.getByText(/No matches/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText(/Erin College/, { selector: "b" })).toBeInTheDocument();
  });

  it("unpublishes after a calm confirmation, with a versioned save", async () => {
    const user = userEvent.setup();
    renderList();
    const row = await rowOf(/DabliuMusic/);
    await user.click(within(row).getByRole("button", { name: /^Unpublish / }));
    expect(api.saveContentDoc).not.toHaveBeenCalled();
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: adminStrings.unpublish.EN }));

    expect(api.saveContentDoc).toHaveBeenCalledOnce();
    const [collection, value, current, passedSettings] = api.saveContentDoc.mock.calls[0];
    expect(collection).toBe("experience");
    expect(value).toMatchObject({ id: "dabliumusic", published: false });
    expect(current).toBe(stored.dabliumusic);
    expect(passedSettings).toBe(settings);
    expect(await screen.findByText(/is now a draft/)).toBeInTheDocument();
  });

  it("blocks publishing a doc with missing text and names each field and language", async () => {
    api.loadCollection.mockResolvedValue({
      ...stored,
      dabliumusic: {
        version: 1,
        data: { ...stored.dabliumusic.data, published: false, ptBR: { ...(stored.dabliumusic.data.ptBR as object), title: "" } },
      },
    });
    const user = userEvent.setup();
    renderList();
    const row = await rowOf(/DabliuMusic/);
    await user.click(within(row).getByRole("button", { name: /^Publish / }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Title · PT-BR");
    expect(api.saveContentDoc).not.toHaveBeenCalled();
  });

  it("moves a doc down by swapping orders with its neighbour", async () => {
    const user = userEvent.setup();
    renderList();
    const row = await rowOf(/Erin College/);
    await user.click(within(row).getByRole("button", { name: /^Move .* down$/ }));

    const [, changes] = api.saveContentDocs.mock.calls[0];
    expect(changes.map((c: { value: { id: string; order: number } }) => [c.value.id, c.value.order])).toEqual([
      ["freelance-web-developer", 0],
      ["erin-college", 10],
    ]);
    expect(await screen.findByText(adminStrings["toast.order"].EN)).toBeInTheDocument();
  });

  it("reorders by drag and drop from the handle", async () => {
    renderList();
    const first = await rowOf(/Erin College/);
    const last = await rowOf(/DabliuMusic/);
    fireEvent.pointerDown(first.querySelector('[title="Drag to reorder"]')!);
    const dataTransfer = { effectAllowed: "", setData: vi.fn() };
    fireEvent.dragStart(first, { dataTransfer });
    fireEvent.dragOver(last, { dataTransfer });
    fireEvent.drop(last, { dataTransfer });

    const [, changes] = api.saveContentDocs.mock.calls[0];
    expect(changes.find((c: { value: { id: string } }) => c.value.id === "erin-college").value.order).toBe(30);
  });

  it("deletes only after a destructive confirmation", async () => {
    const user = userEvent.setup();
    renderList();
    const row = await rowOf(/ETAL/);
    await user.click(within(row).getByRole("button", { name: /^Delete / }));
    expect(api.deleteContentDoc).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByRole("button", { name: adminStrings.cancel.EN })).toHaveFocus();
    await user.click(within(dialog).getByRole("button", { name: adminStrings.delete.EN }));
    expect(api.deleteContentDoc).toHaveBeenCalledWith("experience", "etal", stored.etal, settings);
  });

  it("shows deleted docs with a title and restores them as drafts", async () => {
    const user = userEvent.setup();
    renderList();
    await rowOf(/Erin College/);
    await user.click(screen.getByRole("button", { name: /Recently deleted/ }));
    expect(screen.getByText(/^Old role/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /^Restore Old role/ }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: adminStrings.restore.EN }));

    const [, value, current] = api.saveContentDoc.mock.calls[0];
    expect(value).toMatchObject({ id: "old-role", published: false });
    expect(current).toBeNull();
  });

  it("reports a stale version instead of a raw rules error", async () => {
    const { FirebaseError } = await import("firebase/app");
    api.saveContentDoc.mockRejectedValue(new FirebaseError("permission-denied", "denied"));
    const user = userEvent.setup();
    renderList();
    const row = await rowOf(/DabliuMusic/);
    await user.click(within(row).getByRole("button", { name: /^Unpublish / }));
    await user.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: adminStrings.unpublish.EN }));
    expect(await screen.findByRole("alert")).toHaveTextContent(adminStrings.staleError.EN);
    expect(screen.getByRole("button", { name: adminStrings.reload.EN })).toBeInTheDocument();
  });

  it("shows an error with Reload when the list cannot load", async () => {
    api.loadCollection.mockRejectedValue(new Error("offline"));
    renderList();
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn’t load experience");
    expect(screen.getByRole("button", { name: /Reload/ })).toBeInTheDocument();
  });
});
