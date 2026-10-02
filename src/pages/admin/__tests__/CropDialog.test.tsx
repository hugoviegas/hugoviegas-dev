import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { adminStrings } from "../adminStrings";
import CropDialog from "../CropDialog";
import { PROJECT_ASPECTS, type CropChoice } from "../cropModel";

const s = adminStrings;
const onApply = vi.fn();
const onCancel = vi.fn();

// jsdom has no image decoding; the editor only needs the size.
beforeEach(() => {
  onApply.mockReset();
  onCancel.mockReset();
  vi.stubGlobal("createImageBitmap", vi.fn(async () => ({ width: 4000, height: 3000, close: vi.fn() })));
});
afterEach(() => vi.unstubAllGlobals());

const Harness = ({ file }: { file: File }) => (
  <CropDialog file={file} aspects={PROJECT_ASPECTS} initial={null} onApply={onApply} onCancel={onCancel} />
);

const file = new File(["x"], "cover.jpg", { type: "image/jpeg" });

describe("crop editor", () => {
  it("opens for a new file, starting with the largest centered 16:9 frame", async () => {
    render(<Harness file={file} />);
    expect(await screen.findByRole("dialog", { name: s["crop.title"].EN })).toBeInTheDocument();
    expect(await screen.findByText(/4000 × 2250 px/)).toBeInTheDocument();
  });

  it("zooms with the slider, moves with arrow keys, and applies the crop", async () => {
    const user = userEvent.setup();
    render(<Harness file={file} />);
    await screen.findByText(/4000 × 2250 px/);

    fireEvent.change(screen.getByLabelText(s["crop.zoom"].EN), { target: { value: "2" } });
    expect(screen.getByText(/2000 × 1125 px/)).toBeInTheDocument();

    const preview = screen.getByRole("img", { name: s["crop.previewLabel"].EN });
    preview.focus();
    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    await user.click(screen.getByRole("button", { name: s["crop.apply"].EN }));

    const choice = onApply.mock.calls.at(-1)[0] as CropChoice;
    expect(choice.aspect.label).toBe("crop.aspect.wide");
    expect(choice.rect.sw).toBe(2000);
    // Centered would be sx 1000; ArrowLeft shows more of the left side.
    expect(choice.rect.sx).toBeLessThan(1000);
  });

  it("changes the shape and cancels with Escape", async () => {
    const user = userEvent.setup();
    render(<Harness file={file} />);
    await screen.findByText(/4000 × 2250 px/);
    await user.selectOptions(screen.getByLabelText(s["crop.aspect"].EN), s["crop.aspect.square"].EN);
    expect(screen.getByText(/3000 × 3000 px/)).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(onCancel).toHaveBeenCalled();
    expect(onApply).not.toHaveBeenCalled();
  });
});
