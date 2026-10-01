import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BLOB_STORE_HOST } from "@/content/uploadPolicy";
import { adminStrings } from "../adminStrings";

const api = vi.hoisted(() => ({ loadSettings: vi.fn(), saveSiteFiles: vi.fn() }));
vi.mock("../adminContent", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../adminContent")>()),
  ...api,
}));
const blob = vi.hoisted(() => ({ uploadFile: vi.fn(), imageSize: vi.fn() }));
vi.mock("../blobUpload", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../blobUpload")>()),
  ...blob,
}));

import FilesPanel from "../FilesPanel";

const cvUrl = `https://${BLOB_STORE_HOST}/cv/hugo-viegas-cv-Ab12.pdf`;
const photoUrl = `https://${BLOB_STORE_HOST}/profile/hugo-viegas-Ab12.webp`;
const baseSettings = { useRemote: true, version: 4, updatedAt: null, data: {}, cv: null, profilePhoto: null };
const s = adminStrings;

beforeEach(() => {
  for (const fn of [...Object.values(api), ...Object.values(blob)]) fn.mockReset();
  api.loadSettings.mockResolvedValue(baseSettings);
  api.saveSiteFiles.mockResolvedValue(undefined);
});

describe("FilesPanel", () => {
  it("uploads a CV and points settings/site at it", async () => {
    const user = userEvent.setup();
    blob.uploadFile.mockResolvedValue(cvUrl);
    render(<FilesPanel />);
    expect(await screen.findByText(s["files.cvFallback"].EN)).toBeInTheDocument();

    const file = new File(["%PDF"], "Hugo Viegas - Software Developer CV.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(s["files.cvFile"].EN), file);
    await user.click(screen.getByRole("button", { name: s["files.uploadSave"].EN }));

    expect(blob.uploadFile).toHaveBeenCalledWith("cv", file, "hugo-viegas-cv");
    expect(api.saveSiteFiles).toHaveBeenCalledWith({ cv: { url: cvUrl, version: 1 } }, baseSettings);
    expect(await screen.findByText(s["upload.saved"].EN)).toHaveAttribute("role", "status");
  });

  it("explains a rejected file without saving", async () => {
    const user = userEvent.setup();
    const { UploadError } = await vi.importActual<typeof import("../blobUpload")>("../blobUpload");
    blob.uploadFile.mockRejectedValue(new UploadError("size"));
    render(<FilesPanel />);
    await user.upload(
      await screen.findByLabelText(s["files.cvFile"].EN),
      new File(["x"], "cv.pdf", { type: "application/pdf" }),
    );
    await user.click(screen.getByRole("button", { name: s["files.uploadSave"].EN }));
    expect(await screen.findByRole("alert")).toHaveTextContent(s["upload.size"].EN);
    expect(api.saveSiteFiles).not.toHaveBeenCalled();
  });

  it("uploads a photo with its size and alt text in both languages", async () => {
    const user = userEvent.setup();
    blob.uploadFile.mockResolvedValue(photoUrl);
    blob.imageSize.mockResolvedValue({ width: 800, height: 800 });
    render(<FilesPanel />);
    const file = new File(["img"], "me.webp", { type: "image/webp" });
    await user.upload(await screen.findByLabelText(s["files.photoFile"].EN), file);
    await user.click(screen.getByRole("button", { name: s["files.savePhoto"].EN }));

    expect(blob.uploadFile).toHaveBeenCalledWith("profile", file, "hugo-viegas");
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
  });

  it("blocks a photo save with an empty alt text and focuses it", async () => {
    const user = userEvent.setup();
    render(<FilesPanel />);
    const altInputs = await screen.findAllByLabelText(new RegExp(s["field.imageAlt"].EN));
    await user.clear(altInputs[1]);
    await user.click(screen.getByRole("button", { name: s["files.savePhoto"].EN }));

    expect(altInputs[1]).toHaveAttribute("aria-invalid", "true");
    expect(altInputs[1]).toHaveFocus();
    expect(screen.getByText(s["files.altRequired"].EN)).toBeInTheDocument();
    expect(blob.uploadFile).not.toHaveBeenCalled();
    expect(api.saveSiteFiles).not.toHaveBeenCalled();
  });

  it("edits only the alt text of the current photo without uploading", async () => {
    const user = userEvent.setup();
    const photo = { url: photoUrl, width: 640, height: 640, alt: { en: "Hugo", ptBR: "Hugo" }, version: 2 };
    const settings = { ...baseSettings, profilePhoto: photo };
    api.loadSettings.mockResolvedValue(settings);
    render(<FilesPanel />);
    const altInputs = await screen.findAllByLabelText(new RegExp(s["field.imageAlt"].EN));
    await user.clear(altInputs[0]);
    await user.type(altInputs[0], "Hugo Viegas smiling");
    await user.click(screen.getByRole("button", { name: s["files.savePhoto"].EN }));

    expect(blob.uploadFile).not.toHaveBeenCalled();
    expect(api.saveSiteFiles).toHaveBeenCalledWith(
      { profilePhoto: { ...photo, alt: { en: "Hugo Viegas smiling", ptBR: "Hugo" }, version: 3 } },
      settings,
    );
  });
});
