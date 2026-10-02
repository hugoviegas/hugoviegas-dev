import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BLOB_STORE_HOST } from "@/content/uploadPolicy";
import { adminStrings } from "../adminStrings";
import { renderAdmin } from "./adminTestUtils";

const api = vi.hoisted(() => ({ loadSettings: vi.fn(), saveSiteFiles: vi.fn() }));
vi.mock("../adminContent", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../adminContent")>()),
  ...api,
}));
const blob = vi.hoisted(() => ({ uploadFile: vi.fn() }));
vi.mock("../blobUpload", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../blobUpload")>()),
  ...blob,
}));
const fit = vi.hoisted(() => ({ fitImage: vi.fn() }));
vi.mock("../imageFit", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../imageFit")>()),
  ...fit,
}));

// The crop editor has its own test; here Apply is a stub button.
const crop = vi.hoisted(() => ({ rect: { sx: 0, sy: 0, sw: 900, sh: 900 } }));
vi.mock("../CropDialog", () => ({
  default: ({ onApply }: { onApply: (choice: unknown) => void }) => (
    <button type="button" onClick={() => onApply({ rect: crop.rect, aspect: { label: "crop.aspect.square", ratio: 1 } })}>
      stub-crop
    </button>
  ),
}));

import FilesPanel from "../FilesPanel";

const cvUrl = `https://${BLOB_STORE_HOST}/cv/hugo-viegas-cv-Ab12.pdf`;
const photoUrl = `https://${BLOB_STORE_HOST}/profile/hugo-viegas-Ab12.webp`;
const minifigUrl = `https://${BLOB_STORE_HOST}/profile/hugo-minifig-Ab12.webp`;
const baseSettings = {
  useRemote: true,
  version: 4,
  updatedAt: null,
  data: {},
  cv: null,
  profilePhoto: null,
  avatarMinifig: null,
  avatarFirst: "photo" as const,
};
const s = adminStrings;
const MB = 1024 * 1024;

const slot = (name: string) => screen.getByRole("group", { name });

beforeEach(() => {
  for (const fn of [...Object.values(api), ...Object.values(blob), ...Object.values(fit)]) fn.mockReset();
  api.loadSettings.mockResolvedValue(baseSettings);
  api.saveSiteFiles.mockResolvedValue(undefined);
});

describe("FilesPanel", () => {
  it("uploads a CV and points settings/site at it", async () => {
    const user = userEvent.setup();
    blob.uploadFile.mockResolvedValue(cvUrl);
    renderAdmin(<FilesPanel />);
    expect(await screen.findByText(s["files.cvDefault"].EN)).toBeInTheDocument();

    const file = new File(["%PDF"], "Hugo Viegas - Software Developer CV.pdf", { type: "application/pdf" });
    await user.upload(screen.getByTestId("cv-file"), file);

    expect(blob.uploadFile).toHaveBeenCalledWith("cv", file, "hugo-viegas-cv", undefined, expect.any(Function));
    expect(api.saveSiteFiles).toHaveBeenCalledWith({ cv: { url: cvUrl, version: 1 } }, baseSettings);
    expect(await screen.findByText(s["files.doneTitle"].EN)).toBeInTheDocument();
  });

  it("explains a rejected file without saving", async () => {
    const user = userEvent.setup();
    const { UploadError } = await vi.importActual<typeof import("../blobUpload")>("../blobUpload");
    blob.uploadFile.mockRejectedValue(new UploadError("size"));
    renderAdmin(<FilesPanel />);
    await screen.findByText(s["files.cvDefault"].EN);
    await user.upload(screen.getByTestId("cv-file"), new File(["x"], "cv.pdf", { type: "application/pdf" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(s["upload.size"].EN);
    expect(api.saveSiteFiles).not.toHaveBeenCalled();
  });

  it("resets the CV to the bundled file after a confirmation", async () => {
    const user = userEvent.setup();
    const settings = { ...baseSettings, cv: { url: cvUrl, version: 2 } };
    api.loadSettings.mockResolvedValue(settings);
    renderAdmin(<FilesPanel />);
    await screen.findByText("Version 2 · PDF");
    await user.click(screen.getByRole("button", { name: s["files.resetDefault"].EN }));
    const dialog = await screen.findByRole("alertdialog", { name: "Reset “CV” to the default?" });
    await user.click(within(dialog).getByRole("button", { name: s["files.resetDefault"].EN }));

    expect(api.saveSiteFiles).toHaveBeenCalledWith({ cv: null }, settings);
  });

  it("crops, compresses and uploads a photo with its alt text in both languages", async () => {
    const user = userEvent.setup();
    blob.uploadFile.mockResolvedValue(photoUrl);
    const file = new File(["img"], "me.jpg", { type: "image/jpeg" });
    const compressed = new File(["small"], "me.webp", { type: "image/webp" });
    fit.fitImage.mockResolvedValue({ file: compressed, width: 800, height: 800, originalBytes: 7 * MB });
    renderAdmin(<FilesPanel />);
    await screen.findByText(s["files.cvDefault"].EN);
    await user.upload(screen.getByTestId("profilePhoto-file"), file);
    await user.click(screen.getByRole("button", { name: "stub-crop" }));

    expect(fit.fitImage).toHaveBeenCalledWith(file, 2 * MB, { crop: crop.rect });
    expect(blob.uploadFile).toHaveBeenCalledWith("profile", compressed, "hugo-viegas", undefined, expect.any(Function));
    expect(api.saveSiteFiles).toHaveBeenCalledWith(
      {
        profilePhoto: {
          url: photoUrl,
          width: 800,
          height: 800,
          alt: { en: "Hugo Viegas, Software Developer", ptBR: "Hugo Viegas, Desenvolvedor de Software" },
          version: 1,
        },
      },
      baseSettings,
    );
    expect(await within(slot("Photo")).findByText(/\(from 7\.0 MB\)/)).toBeInTheDocument();
  });

  it("uploads the minifigure to its own slot", async () => {
    const user = userEvent.setup();
    blob.uploadFile.mockResolvedValue(minifigUrl);
    const file = new File(["img"], "minifig.png", { type: "image/png" });
    fit.fitImage.mockResolvedValue({ file, width: 600, height: 600 });
    renderAdmin(<FilesPanel />);
    await screen.findByText(s["files.cvDefault"].EN);
    await user.upload(screen.getByTestId("avatarMinifig-file"), file);
    await user.click(screen.getByRole("button", { name: "stub-crop" }));

    expect(blob.uploadFile).toHaveBeenCalledWith("profile", file, "hugo-minifig", undefined, expect.any(Function));
    expect(api.saveSiteFiles).toHaveBeenCalledWith(
      {
        avatarMinifig: {
          url: minifigUrl,
          width: 600,
          height: 600,
          alt: { en: "Hugo as a LEGO minifigure", ptBR: "Hugo como uma minifigura LEGO" },
          version: 1,
        },
      },
      baseSettings,
    );
  });

  it("asks for alt text in both languages before choosing a file", async () => {
    const user = userEvent.setup();
    renderAdmin(<FilesPanel />);
    await screen.findByText(s["files.cvDefault"].EN);
    const photo = slot("Photo");
    const ptAlt = within(photo).getByRole("textbox", { name: s["image.altPt"].EN });
    await user.clear(ptAlt);
    await user.click(within(photo).getByRole("button", { name: s["files.replace"].EN }));

    expect(ptAlt).toHaveAttribute("aria-invalid", "true");
    expect(ptAlt).toHaveFocus();
    expect(ptAlt).toHaveAccessibleDescription(expect.stringContaining(s["files.altRequired"].EN));
    expect(blob.uploadFile).not.toHaveBeenCalled();
  });

  it("saves only the alt text of the current photo", async () => {
    const user = userEvent.setup();
    const photo = { url: photoUrl, width: 640, height: 640, alt: { en: "Hugo", ptBR: "Hugo" }, version: 2 };
    const settings = { ...baseSettings, profilePhoto: photo };
    api.loadSettings.mockResolvedValue(settings);
    renderAdmin(<FilesPanel />);
    await screen.findByText("Uploaded · v2");
    const group = slot("Photo");
    const save = within(group).getByRole("button", { name: s["files.altSave"].EN });
    expect(save).toBeDisabled();
    const enAlt = within(group).getByRole("textbox", { name: s["image.altEn"].EN });
    await user.clear(enAlt);
    await user.type(enAlt, "Hugo Viegas smiling");
    await user.click(save);

    expect(blob.uploadFile).not.toHaveBeenCalled();
    expect(api.saveSiteFiles).toHaveBeenCalledWith(
      { profilePhoto: { ...photo, alt: { en: "Hugo Viegas smiling", ptBR: "Hugo" }, version: 3 } },
      settings,
    );
  });

  it("saves which face is shown first", async () => {
    const user = userEvent.setup();
    renderAdmin(<FilesPanel />);
    const first = await screen.findByRole("group", { name: s["files.shownFirst"].EN });
    expect(within(first).getByRole("radio", { name: "Photo" })).toBeChecked();
    await user.click(within(first).getByRole("radio", { name: "Minifigure" }));

    expect(api.saveSiteFiles).toHaveBeenCalledWith({ avatarFirst: "minifig" }, baseSettings);
    expect(await screen.findByText("Minifigure is now shown first.")).toBeInTheDocument();
  });
});
