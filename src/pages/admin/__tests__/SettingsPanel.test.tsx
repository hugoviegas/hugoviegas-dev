import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAdmin } from "./adminTestUtils";

const api = vi.hoisted(() => ({
  loadSettings: vi.fn(),
  saveSettings: vi.fn(),
  listHistory: vi.fn(),
  restoreSettings: vi.fn(),
}));
vi.mock("../adminContent", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../adminContent")>()),
  ...api,
}));

import SettingsPanel from "../SettingsPanel";

const settings = {
  useRemote: true,
  version: 3,
  updatedAt: "2026-10-01T16:02:00.000Z",
  data: { useRemote: true, version: 3 },
  cv: null,
  profilePhoto: null,
  avatarMinifig: null,
  avatarFirst: "photo" as const,
};
const older = { entryId: "h1", version: 2, savedAt: "2026-09-30T08:15:00.000Z", data: { useRemote: false, version: 2 } };

beforeEach(() => {
  for (const fn of Object.values(api)) fn.mockReset();
  api.loadSettings.mockResolvedValue(settings);
  api.listHistory.mockResolvedValue([older]);
  api.saveSettings.mockResolvedValue(undefined);
  api.restoreSettings.mockResolvedValue(undefined);
});

describe("SettingsPanel", () => {
  it("asks before turning remote content off", async () => {
    const user = userEvent.setup();
    renderAdmin(<SettingsPanel />);
    const toggle = await screen.findByRole("switch", { name: /Load published content at runtime/ });
    expect(toggle).toHaveAttribute("aria-checked", "true");
    await user.click(toggle);

    const dialog = await screen.findByRole("alertdialog", { name: "Turn off remote content?" });
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(api.saveSettings).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole("button", { name: "Turn off" }));

    expect(api.saveSettings).toHaveBeenCalledWith(false, settings);
    expect(await screen.findByText("Remote content is off.")).toBeInTheDocument();
  });

  it("lists settings versions with what changed and restores one", async () => {
    const user = userEvent.setup();
    renderAdmin(<SettingsPanel />);
    expect(api.listHistory).toHaveBeenCalledWith("settings", "site");
    expect(await screen.findByText("Remote content: On")).toBeInTheDocument();
    expect(screen.getByText("Remote content: Off")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /version 2/i }));
    const dialog = await screen.findByRole("alertdialog", { name: "Restore settings version 2?" });
    await user.click(within(dialog).getByRole("button", { name: "Restore" }));

    expect(api.restoreSettings).toHaveBeenCalledWith(older.data, settings);
    expect(await screen.findByText("Settings version 2 restored.")).toBeInTheDocument();
  });
});
