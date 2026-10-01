// Crop math for the admin image editor. The frame has a fixed aspect ratio;
// zoom and the center point choose which part of the source fills it.
// Pure, so tests cover it without a canvas.
import type { AdminStringKey } from "./adminStrings";

export interface AspectOption {
  label: AdminStringKey;
  // Width / height; null keeps the image's own ratio.
  ratio: number | null;
}

export const PROFILE_ASPECTS: AspectOption[] = [{ label: "crop.aspect.square", ratio: 1 }];

// Project cards crop to a fixed height, so wide is the default.
export const PROJECT_ASPECTS: AspectOption[] = [
  { label: "crop.aspect.wide", ratio: 16 / 9 },
  { label: "crop.aspect.classic", ratio: 4 / 3 },
  { label: "crop.aspect.square", ratio: 1 },
  { label: "crop.aspect.original", ratio: null },
];

export interface CropState {
  // 1 = the largest frame that fits the image; up to MAX_ZOOM.
  zoom: number;
  // Frame center in source pixels.
  cx: number;
  cy: number;
}

export interface CropRect {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

export interface CropChoice {
  rect: CropRect;
  aspect: AspectOption;
}

export const MAX_ZOOM = 4;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Frame size in source pixels for an aspect (width / height) and zoom.
const frameSize = (imageW: number, imageH: number, aspect: number, zoom: number) => {
  const baseW = Math.min(imageW, imageH * aspect);
  const sw = baseW / zoom;
  return { sw, sh: sw / aspect };
};

export const initialCrop = (imageW: number, imageH: number): CropState => ({
  zoom: 1,
  cx: imageW / 2,
  cy: imageH / 2,
});

// Keeps the zoom in range and the frame inside the image.
export const clampCrop = (state: CropState, imageW: number, imageH: number, aspect: number): CropState => {
  const zoom = clamp(state.zoom, 1, MAX_ZOOM);
  const { sw, sh } = frameSize(imageW, imageH, aspect, zoom);
  return {
    zoom,
    cx: clamp(state.cx, sw / 2, imageW - sw / 2),
    cy: clamp(state.cy, sh / 2, imageH - sh / 2),
  };
};

export const cropRect = (state: CropState, imageW: number, imageH: number, aspect: number): CropRect => {
  const { zoom, cx, cy } = clampCrop(state, imageW, imageH, aspect);
  const { sw, sh } = frameSize(imageW, imageH, aspect, zoom);
  return {
    sx: Math.round(cx - sw / 2),
    sy: Math.round(cy - sh / 2),
    sw: Math.round(sw),
    sh: Math.round(sh),
  };
};

// Moves the image by a drag of (dx, dy) preview pixels: dragging right shows
// more of the left side, like moving a photo under a frame.
export const panBy = (
  state: CropState,
  dx: number,
  dy: number,
  previewW: number,
  imageW: number,
  imageH: number,
  aspect: number,
): CropState => {
  const { sw } = frameSize(imageW, imageH, aspect, clamp(state.zoom, 1, MAX_ZOOM));
  const perPixel = sw / previewW;
  return clampCrop({ ...state, cx: state.cx - dx * perPixel, cy: state.cy - dy * perPixel }, imageW, imageH, aspect);
};

// Zooms around the current center.
export const zoomTo = (
  state: CropState,
  zoom: number,
  imageW: number,
  imageH: number,
  aspect: number,
): CropState => clampCrop({ ...state, zoom }, imageW, imageH, aspect);

// True when the crop keeps the whole image (nothing to re-encode for it).
export const isFullImage = (rect: CropRect, imageW: number, imageH: number) =>
  rect.sx === 0 && rect.sy === 0 && rect.sw === imageW && rect.sh === imageH;
