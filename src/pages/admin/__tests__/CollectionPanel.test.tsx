import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fixtureDocs } from "@/test/contentFixtures";
import { storedFields } from "../storedDoc";
import { adminStrings } from "../adminStrings";

// Firestore boundary mocked; the rules are checked live and in the Playground.
const api = vi.hoisted(() => ({
  loadCollection: vi.fn(),
  loadSettings: vi.fn(),
  listDeletedIds: vi.fn(),
  saveContentDoc: vi.fn(),
  saveContentDocs: vi.fn(),
  deleteContentDoc: vi.fn(),
}));
vi.mock("../adminContent", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../adminContent")>()),
  ...api,
}));

import CollectionPanel from "../CollectionPanel";
import { ADMIN_PATH } from "@/config/admin";
import { renderAdmin } from "./adminTestUtils";

const stored = Object.fromEntries(
  fixtureDocs("experience").map((doc) => [doc.id, { version: 1, data: { ...storedFields(doc), version: 1 } }]),
);
const settings = { useRemote: true, version: 3, updatedAt: null, data: {} };

beforeEach(() => {
  for (const fn of Object.values(api)) fn.mockReset();
  api.loadCollection.mockResolvedValue(stored);
  api.loadSettings.mockResolvedValue(settings);
  api.listDeletedIds.mockResolvedValue(["old-role"]);
  api.saveContentDoc.mockResolvedValue(undefined);
  api.saveContentDocs.mockResolvedValue(undefined);
  api.deleteContentDoc.mockResolvedValue(undefined);
});

const rowOf = async (text: RegExp) => (await screen.findByText(text)).closest("li")!;

describe("CollectionPanel", () => {
  it("lists docs in order with their status, and deleted ids to restore", async () => {
    renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);
    const rows = await screen.findAllByRole("listitem");
    expect(rows[0]).toHaveTextContent(/Erin College/);
    expect(rows[0]).toHaveTextContent(adminStrings.statusPublished.EN);
    expect(screen.getByRole("button", { name: "History: old-role" })).toBeInTheDocument();
  });

  it("unpublishes with a versioned save that bumps settings", async () => {
    const user = userEvent.setup();
    renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);
    const row = await rowOf(/DabliuMusic/);
    await user.click(within(row).getByRole("button", { name: /^Unpublish:/ }));

    expect(api.saveContentDoc).toHaveBeenCalledOnce();
    const [collection, value, current, passedSettings] = api.saveContentDoc.mock.calls[0];
    expect(collection).toBe("experience");
    expect(value).toMatchObject({ id: "dabliumusic", published: false });
    expect(current).toBe(stored.dabliumusic);
    expect(passedSettings).toBe(settings);
    expect(await screen.findByText(adminStrings.saved.EN)).toBeInTheDocument();
  });

  it("moves a doc down by swapping orders with its neighbour", async () => {
    const user = userEvent.setup();
    renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);
    const row = await rowOf(/Erin College/);
    await user.click(within(row).getByRole("button", { name: /^Move down:/ }));

    const [, changes] = api.saveContentDocs.mock.calls[0];
    expect(changes.map((c: { value: { id: string; order: number } }) => [c.value.id, c.value.order])).toEqual([
      ["freelance-web-developer", 0],
      ["erin-college", 10],
    ]);
  });

  it("deletes only after confirmation", async () => {
    const user = userEvent.setup();
    renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);
    const row = await rowOf(/ETAL/);
    await user.click(within(row).getByRole("button", { name: /^Delete:/ }));
    expect(api.deleteContentDoc).not.toHaveBeenCalled();

    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: adminStrings.delete.EN }));
    expect(api.deleteContentDoc).toHaveBeenCalledWith("experience", "etal", stored.etal, settings);
  });

  it("reports a stale version instead of a raw rules error", async () => {
    const { FirebaseError } = await import("firebase/app");
    api.saveContentDoc.mockRejectedValue(new FirebaseError("permission-denied", "denied"));
    const user = userEvent.setup();
    renderAdmin(<CollectionPanel collection="experience" route={{ view: "list" }} />, `${ADMIN_PATH}/experience`);
    const row = await rowOf(/DabliuMusic/);
    await user.click(within(row).getByRole("button", { name: /^Unpublish:/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent(adminStrings.staleError.EN);
  });
});
