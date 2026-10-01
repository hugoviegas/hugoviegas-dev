import { describe, expect, it } from "vitest";
import { clampCrop, cropRect, initialCrop, isFullImage, MAX_ZOOM, panBy, zoomTo } from "../cropModel";

describe("crop model", () => {
  it("starts with the largest centered frame for the aspect", () => {
    const start = initialCrop(4000, 3000);
    expect(cropRect(start, 4000, 3000, 1)).toEqual({ sx: 500, sy: 0, sw: 3000, sh: 3000 });
    expect(cropRect(start, 4000, 3000, 16 / 9)).toEqual({ sx: 0, sy: 375, sw: 4000, sh: 2250 });
    expect(isFullImage(cropRect(start, 4000, 3000, 4000 / 3000), 4000, 3000)).toBe(true);
  });

  it("zooms around the center and keeps zoom in range", () => {
    const zoomed = zoomTo(initialCrop(4000, 3000), 2, 4000, 3000, 1);
    expect(cropRect(zoomed, 4000, 3000, 1)).toEqual({ sx: 1250, sy: 750, sw: 1500, sh: 1500 });
    expect(zoomTo(zoomed, 99, 4000, 3000, 1).zoom).toBe(MAX_ZOOM);
    expect(zoomTo(zoomed, 0.2, 4000, 3000, 1).zoom).toBe(1);
  });

  it("pans like moving a photo under the frame, never past the edges", () => {
    const zoomed = zoomTo(initialCrop(4000, 3000), 2, 4000, 3000, 1);
    // Preview 300 px wide shows 1500 source px: 1 preview px = 5 source px.
    const moved = panBy(zoomed, 100, 0, 300, 4000, 3000, 1);
    expect(cropRect(moved, 4000, 3000, 1).sx).toBe(750);
    const far = panBy(zoomed, 10_000, -10_000, 300, 4000, 3000, 1);
    expect(cropRect(far, 4000, 3000, 1)).toEqual({ sx: 0, sy: 1500, sw: 1500, sh: 1500 });
  });

  it("re-clamps when the aspect changes", () => {
    const state = clampCrop({ zoom: 1, cx: 0, cy: 0 }, 4000, 3000, 1);
    expect(cropRect(state, 4000, 3000, 1)).toEqual({ sx: 0, sy: 0, sw: 3000, sh: 3000 });
  });
});
